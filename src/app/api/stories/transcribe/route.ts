import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { evenCaptionSlots, resolveAudioContentType, roundTenth, suggestedCaptionCount } from "@/lib/storyAudio";

// A transcrição por IA pode levar de 20 s a alguns minutos (áudio de até 10 min). Sem isto a hospedagem
// usa o limite padrão (10 s a 60 s), derruba a conexão e o navegador mostra "Failed to fetch".
export const maxDuration = 300;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Orçamento total para a IA: sobra tempo para devolver a resposta antes do limite da função. */
const AI_BUDGET_MS = 240_000;
/** Teto de cada tentativa (envio do áudio + resposta). */
const AI_ATTEMPT_MS = 110_000;

interface TranscribedCaption {
  start: number;
  end: number;
  kreyol: string;
  portuguese: string;
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("audio") as File | null;
    const language = (formData.get("language") as string) || "kreyol";
    const durationParam = parseFloat((formData.get("duration") as string) || "0");

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo de áudio foi enviado." }, { status: 400 });
    }

    const duration = Number.isFinite(durationParam) && durationParam > 0 ? durationParam : 20;
    const isFrench = language === "francais";
    const targetLangName = isFrench ? "Francês" : "Kreyòl Ayisyen (Crioulo Haitiano)";

    const apiKey = process.env.GEMINI_API_KEY;
    let aiIssue = "";
    if (apiKey) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString("base64");
        // Sem parâmetros de codec ("audio/webm;codecs=opus" é recusado pela API) e com o tipo deduzido da extensão.
        const mimeType = resolveAudioContentType({ name: file.name, type: file.type }) ?? "audio/mpeg";

        const prompt = `Você é um especialista em transcrição e tradução bilíngue para uma plataforma de ensino de línguas.
O arquivo de áudio anexo tem duração de aproximadamente ${duration.toFixed(1)} segundos e está falado em ${targetLangName}.

SUA TAREFA:
1. Transcreva a narração exatamente como falada em ${targetLangName}.
2. Forneça a tradução precisa, natural e fluida para o Português (Brasil).
3. Divida o texto em trechos cronometrados (subtitles/captions) que cubram o tempo de 0 até ${duration.toFixed(1)} segundos.
4. Cada trecho deve ter:
   - "start": segundo de início (ex: 0.0)
   - "end": segundo de término (ex: 4.5)
   - "kreyol": texto falado no idioma da aula (${isFrench ? "em Francês" : "em Kreyòl"})
   - "portuguese": tradução do trecho para Português

ATENÇÃO:
- "start" do primeiro trecho deve ser 0.
- "end" do último trecho deve ser próximo a ${duration.toFixed(1)}.
- Cada "start" deve ser igual ou ligeiramente maior que o "end" anterior.
- Responda ESTRITAMENTE em formato JSON puro, sem markdown, sem blocos de código com crases:
{
  "captions": [
    { "start": 0.0, "end": 4.5, "kreyol": "...", "portuguese": "..." }
  ]
}`;

        // Modelos a tentar (sem repetir). O primeiro é o configurado em GEMINI_TEXT_MODEL.
        const modelsToTry = Array.from(
          new Set([process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"])
        );

        let geminiJson: { captions?: TranscribedCaption[] } | null = null;
        const startedAt = Date.now();

        for (const modelName of modelsToTry) {
          const remaining = AI_BUDGET_MS - (Date.now() - startedAt);
          if (remaining < 15_000) break;
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
            const apiRes = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        inline_data: {
                          mime_type: mimeType,
                          data: base64Audio,
                        },
                      },
                      { text: prompt },
                    ],
                  },
                ],
                generationConfig: {
                  response_mime_type: "application/json",
                  temperature: 0.2,
                },
              }),
              signal: AbortSignal.timeout(Math.min(AI_ATTEMPT_MS, remaining)),
            });

            if (apiRes.ok) {
              const resData = await apiRes.json();
              const textOutput = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textOutput) {
                const clean = textOutput.replace(/```(?:json)?/gi, "").trim();
                geminiJson = JSON.parse(clean);
                if (Array.isArray(geminiJson?.captions) && geminiJson.captions.length > 0) {
                  break;
                }
              }
            } else {
              aiIssue = `Gemini (${modelName}) respondeu ${apiRes.status}.`;
              console.warn("Transcrição: resposta de erro do Gemini", modelName, apiRes.status);
              // Chave inválida ou sem permissão: os outros modelos falhariam do mesmo jeito.
              if (apiRes.status === 401 || apiRes.status === 403) break;
            }
          } catch (modelError) {
            aiIssue = `Falha ao falar com o Gemini (${modelName}): ${modelError instanceof Error ? modelError.message : "erro de rede"}.`;
            console.warn("Transcrição: tentativa falhou", modelName, modelError);
          }
        }

        if (geminiJson?.captions && geminiJson.captions.length > 0) {
          // Normaliza e valida os trechos gerados
          const sanitized: TranscribedCaption[] = geminiJson.captions.map((c, idx) => ({
            start: roundTenth(Math.max(0, Number(c.start) || 0)),
            end: roundTenth(Math.min(duration, Math.max((Number(c.start) || 0) + 1, Number(c.end) || duration))),
            kreyol: String(c.kreyol || "").trim(),
            portuguese: String(c.portuguese || "").trim(),
          }));

          return NextResponse.json({ captions: sanitized });
        }
      } catch (geminiError) {
        console.warn("Transcrição por IA falhou, usando divisão inteligente padrão:", geminiError);
      }
    }

    // Fallback inteligente caso a IA não esteja configurada ou o áudio não tenha retornado texto
    const count = suggestedCaptionCount(duration);
    const slots = evenCaptionSlots(count, duration);
    const fallbackCaptions: TranscribedCaption[] = slots.map((slot) => ({
      start: slot.start,
      end: slot.end,
      kreyol: "",
      portuguese: "",
    }));

    return NextResponse.json({
      captions: fallbackCaptions,
      fallback: true,
      message: apiKey
        ? `Não foi possível transcrever automaticamente o áudio${aiIssue ? ` (${aiIssue})` : ""}. Os trechos de tempo foram organizados para você digitar.`
        : "Chave Gemini não configurada. Os trechos de tempo foram organizados para digitação manual.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao processar áudio." },
      { status: 500 }
    );
  }
}
