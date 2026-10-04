"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { ImageBankPicker } from "@/components/ImageBankPicker";
import { StoryAudioRecorder } from "@/components/StoryAudioRecorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { convertToMp3, readAudioDuration, readMediaMetadataDuration, type Mp3Stage } from "@/lib/audioToMp3";
import { getBankImage } from "@/lib/imageBank";
import {
  MP4_CONVERTER_MAX_BYTES,
  STORY_AUDIO_MAX_BYTES,
  STORY_AUDIO_MAX_SECONDS,
  STORY_AUDIO_MIN_SECONDS,
  STORY_TIME_TOLERANCE,
  describeStoryDuration,
  evenCaptionSlots,
  formatStoryTime,
  isMp4Video,
  resolveAudioContentType,
  roundTenth,
  suggestedCaptionCount,
} from "@/lib/storyAudio";
import { defaultElementStarts } from "@/lib/storyTimeline";
import { BookOpen, Calendar, Download, Film, Image as ImageIcon, Loader2, Mic, Plus, RefreshCw, Trash2, Upload } from "lucide-react";

type Caption = { start: number; end: number; kreyol: string; portuguese: string };
type ElementCueValue = { kreyol: string; start: number };
type InitialStory = {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  publishAt: string | null;
  story: { imageSrc: string; theme: string; audioUrl: string; audioDuration?: number; captions: Caption[]; elementCues?: ElementCueValue[] };
};
type NarrationMode = "upload" | "record" | "convert";

const emptyCaption = (): Caption => ({ start: 0, end: 0, kreyol: "", portuguese: "" });
const megabytes = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;

export function StoryForm({ initial }: { initial?: InitialStory }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageSrc, setImageSrc] = useState(initial?.story.imageSrc ?? "");
  const [theme, setTheme] = useState(initial?.story.theme ?? "");
  const audioUrl = initial?.story.audioUrl ?? "";
  const [mode, setMode] = useState<NarrationMode>("upload");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioOrigin, setAudioOrigin] = useState<NarrationMode | null>(null);
  const [audioDuration, setAudioDuration] = useState(initial?.story.audioDuration ?? 0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [conversion, setConversion] = useState<{ fileName: string; stage: Mp3Stage; fraction: number } | null>(null);
  const [recorderBusy, setRecorderBusy] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>(initial?.story.captions ?? [emptyCaption()]);
  // Enquanto o roteiro estiver intocado, os tempos são ajustados sozinhos à duração da narração.
  const [captionsEdited, setCaptionsEdited] = useState(Boolean(initial));
  // Momentos escolhidos à mão para os elementos da cena (os demais seguem a divisão automática).
  const [cueOverrides, setCueOverrides] = useState<Record<string, number>>(
    () => Object.fromEntries((initial?.story.elementCues ?? []).map((cue) => [cue.kreyol, cue.start]))
  );
  const [publishMode, setPublishMode] = useState<"immediate" | "scheduled" | "draft">(
    !initial?.isPublished ? "draft" : initial.publishAt && new Date(initial.publishAt) > new Date() ? "scheduled" : "immediate"
  );
  const [scheduledDate, setScheduledDate] = useState(initial?.publishAt?.slice(0, 10) ?? "");
  const [scheduledTime, setScheduledTime] = useState("18:00");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioPreviewUrl = useMemo(() => (audioFile ? URL.createObjectURL(audioFile) : ""), [audioFile]);
  useEffect(() => () => {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
  }, [audioPreviewUrl]);

  const sceneElements = useMemo(() => getBankImage(imageSrc)?.elements ?? [], [imageSrc]);
  const autoStarts = useMemo(() => defaultElementStarts(sceneElements.length, audioDuration), [sceneElements.length, audioDuration]);
  const elementStarts = sceneElements.map((element, index) => cueOverrides[element.kreyol] ?? autoStarts[index] ?? 0);
  const hasNarration = Boolean(audioFile || audioUrl);
  const busy = Boolean(conversion) || recorderBusy;

  function changeCaption(index: number, key: keyof Caption, value: string) {
    setCaptionsEdited(true);
    setCaptions((items) => items.map((item, itemIndex) => itemIndex === index
      ? { ...item, [key]: key === "kreyol" || key === "portuguese" ? value : Number(value) }
      : item));
  }

  function spreadCaptions(duration: number) {
    setCaptions((items) => {
      const slots = evenCaptionSlots(items.length, duration);
      return items.map((item, index) => ({ ...item, ...slots[index] }));
    });
  }

  /** Valida e adota um arquivo como narração (envio, gravação ou conversão). */
  async function adoptNarration(file: File, origin: NarrationMode, knownDuration?: number) {
    setAudioError(null);
    if (!resolveAudioContentType(file)) {
      setAudioError("Formato não suportado. Use MP3, WAV, M4A, OGG ou WebM — ou converta um MP4 para MP3.");
      return;
    }
    if (file.size > STORY_AUDIO_MAX_BYTES) {
      setAudioError(`O arquivo tem ${megabytes(file.size)} e o limite é ${megabytes(STORY_AUDIO_MAX_BYTES)}. Converta para MP3 ou use uma narração mais curta.`);
      return;
    }
    let duration = knownDuration;
    try {
      duration = duration ?? (await readAudioDuration(file));
    } catch (readError) {
      setAudioError(readError instanceof Error ? readError.message : "Não foi possível medir a duração do áudio.");
      return;
    }
    if (duration < STORY_AUDIO_MIN_SECONDS - STORY_TIME_TOLERANCE || duration > STORY_AUDIO_MAX_SECONDS + STORY_TIME_TOLERANCE) {
      setAudioError(`A narração tem ${describeStoryDuration(duration)}; ela precisa ter entre ${describeStoryDuration(STORY_AUDIO_MIN_SECONDS)} e ${describeStoryDuration(STORY_AUDIO_MAX_SECONDS)}.`);
      return;
    }
    setAudioFile(file);
    setAudioOrigin(origin);
    setAudioDuration(duration);
    // Os momentos dos elementos pertenciam à narração anterior: voltam à divisão automática.
    setCueOverrides({});
    if (!captionsEdited && captions.every((caption) => !caption.kreyol.trim() && !caption.portuguese.trim())) {
      setCaptions(evenCaptionSlots(suggestedCaptionCount(duration), duration).map((slot) => ({ ...slot, kreyol: "", portuguese: "" })));
    }
  }

  async function convertVideoToMp3(file: File) {
    setAudioError(null);
    if (file.size > MP4_CONVERTER_MAX_BYTES) {
      setAudioError(`O arquivo tem ${megabytes(file.size)}; o conversor aceita até ${megabytes(MP4_CONVERTER_MAX_BYTES)}. Corte o vídeo antes de converter.`);
      return;
    }
    setConversion({ fileName: file.name, stage: "decoding", fraction: 0 });
    try {
      // Antes de decodificar (o que consome memória), confere pelos metadados se o vídeo cabe no limite.
      const metadataDuration = await readMediaMetadataDuration(file);
      if (Number.isFinite(metadataDuration) && metadataDuration > STORY_AUDIO_MAX_SECONDS + STORY_TIME_TOLERANCE) {
        throw new Error(`O vídeo tem ${describeStoryDuration(metadataDuration)}; a narração pode ter no máximo ${describeStoryDuration(STORY_AUDIO_MAX_SECONDS)}. Corte o vídeo antes de converter.`);
      }
      const result = await convertToMp3(file, {
        onProgress: (stage, fraction) => setConversion({ fileName: file.name, stage, fraction }),
      });
      const baseName = file.name.replace(/\.[^.]+$/, "") || "narracao";
      await adoptNarration(new File([result.blob], `${baseName}.mp3`, { type: "audio/mpeg" }), "convert", result.duration);
    } catch (conversionError) {
      setAudioError(conversionError instanceof Error ? conversionError.message : "Não foi possível converter o arquivo.");
    } finally {
      setConversion(null);
    }
  }

  async function handleNarrationInput(file: File | undefined) {
    if (!file) return;
    // Um MP4 escolhido no envio comum também é convertido para MP3.
    if (isMp4Video(file)) await convertVideoToMp3(file);
    else await adoptNarration(file, "upload");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (busy) return setError("Aguarde o fim da gravação ou da conversão da narração.");
    if (!imageSrc) return setError("Escolha uma imagem para a história.");
    if (!hasNarration) return setError("Grave, envie ou converta a narração em Kreyòl.");
    if (!(audioDuration > 0)) return setError("Não foi possível medir a duração da narração. Envie o áudio novamente.");
    if (audioDuration < STORY_AUDIO_MIN_SECONDS - STORY_TIME_TOLERANCE || audioDuration > STORY_AUDIO_MAX_SECONDS + STORY_TIME_TOLERANCE) {
      return setError(`A narração precisa ter entre ${describeStoryDuration(STORY_AUDIO_MIN_SECONDS)} e ${describeStoryDuration(STORY_AUDIO_MAX_SECONDS)}.`);
    }
    if (captions.some((caption) => !caption.kreyol.trim() || !caption.portuguese.trim())) {
      return setError("Preencha os textos em Kreyòl e português de todos os trechos.");
    }
    let previousEnd = 0;
    for (const [index, caption] of captions.entries()) {
      const label = `trecho ${index + 1}`;
      if (!(caption.end > caption.start)) return setError(`O ${label} precisa terminar depois de começar.`);
      if (caption.start < previousEnd) return setError(`O ${label} começa antes do fim do trecho anterior.`);
      if (caption.end > audioDuration + STORY_TIME_TOLERANCE) {
        return setError(`O ${label} termina em ${caption.end} s, depois do fim da narração (${describeStoryDuration(audioDuration)}). Ajuste os tempos ou use “Redistribuir tempos”.`);
      }
      previousEnd = caption.end;
    }
    const elementCues: ElementCueValue[] = sceneElements.map((element, index) => ({ kreyol: element.kreyol, start: roundTenth(Math.max(0, elementStarts[index])) }));
    if (elementCues.some((cue) => cue.start > audioDuration + STORY_TIME_TOLERANCE)) {
      return setError("Há elementos da cena marcados depois do fim da narração. Ajuste os momentos ou use “Distribuir automaticamente”.");
    }

    setSaving(true);
    try {
      let finalAudioUrl = audioUrl;
      if (audioFile) {
        const blob = await upload(audioFile.name, audioFile, {
          access: "public",
          handleUploadUrl: "/api/stories/upload",
          contentType: resolveAudioContentType(audioFile) ?? "audio/mpeg",
        });
        finalAudioUrl = blob.url;
      }

      let publishAt: string | null = null;
      if (publishMode === "scheduled") {
        if (!scheduledDate) throw new Error("Selecione a data de publicação.");
        publishAt = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
      }
      const response = await fetch(initial ? `/api/stories/${initial._id}` : "/api/stories", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          isPublished: publishMode !== "draft",
          publishAt,
          story: { imageSrc, theme, audioUrl: finalAudioUrl, audioDuration: Math.round(audioDuration * 100) / 100, captions, elementCues },
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Não foi possível salvar a história.");
      }
      router.push("/admin/stories");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro ao salvar história.");
    } finally {
      setSaving(false);
    }
  }

  const lastEnd = captions.at(-1)?.end ?? 0;
  const modes: [NarrationMode, string, typeof Mic][] = [
    ["upload", "Enviar arquivo", Upload],
    ["record", "Gravar agora", Mic],
    ["convert", "Converter MP4 → MP3", Film],
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="grid gap-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[var(--text)]">Título da história
            <Input className="mt-1.5" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} placeholder="Ex.: O tambor que chamou a chuva" />
          </label>
          <label className="block text-sm font-semibold text-[var(--text)]">Apresentação
            <Textarea className="mt-1.5" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="Uma breve introdução à aventura..." />
          </label>
          <div className="flex items-center gap-2 rounded-lg bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-secondary)]">
            <BookOpen className="h-4 w-4 shrink-0 text-[var(--accent)]" /> História com cenas animadas e narração em Kreyòl; a duração do vídeo é a da narração.
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-[#1d3028] text-white">
          {imageSrc ? <Image src={imageSrc} alt="Cena escolhida" width={900} height={600} unoptimized className="aspect-[3/2] w-full object-cover" /> : <div className="flex aspect-[3/2] flex-col items-center justify-center gap-2 text-white/70"><ImageIcon className="h-8 w-8" /><span className="text-xs">Escolha uma cena temática</span></div>}
          <div className="flex items-center justify-between px-3 py-2 text-xs"><span>{theme || "Cena da história"}</span><span>{audioDuration > 0 ? formatStoryTime(audioDuration) : "--:--"}</span></div>
        </div>
        <details className="sm:col-span-2">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-[var(--accent)]"><ImageIcon className="h-4 w-4" /> {imageSrc ? "Trocar imagem temática" : "Escolher imagem temática"}</summary>
          <div className="mt-4"><ImageBankPicker selectedSrc={imageSrc || null} onSelect={(image) => { setImageSrc(image?.src ?? ""); setTheme(image?.theme ?? ""); setCueOverrides({}); }} /></div>
        </details>
      </section>

      <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div><h2 className="font-semibold text-[var(--text)]">Narração em Kreyòl</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Grave, envie ou converta uma narração de {describeStoryDuration(STORY_AUDIO_MIN_SECONDS)} a {describeStoryDuration(STORY_AUDIO_MAX_SECONDS)}. A duração do vídeo, as legendas e os elementos da cena seguem esse áudio.</p></div>
        <div className="grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Como adicionar a narração">
          {modes.map(([value, label, Icon]) => <button key={value} type="button" role="tab" aria-selected={mode === value} onClick={() => setMode(value)} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${mode === value ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}><Icon className="h-4 w-4" />{label}</button>)}
        </div>

        {mode === "upload" && (
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)] p-4 hover:border-[var(--accent)]">
            <Upload className="h-5 w-5 text-[var(--accent)]" />
            <span className="min-w-0 flex-1 text-sm text-[var(--text)]">{audioFile ? audioFile.name : audioUrl ? "Narração já enviada" : "Selecionar arquivo de áudio"}<span className="block text-xs text-[var(--text-muted)]">{audioDuration ? `${describeStoryDuration(audioDuration)}${audioFile ? ` · ${megabytes(audioFile.size)}` : ""}` : `Máximo ${megabytes(STORY_AUDIO_MAX_BYTES).replace(",0", "")}`}</span></span>
            <input type="file" accept="audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/ogg,audio/webm,.mp3,.m4a,.wav,.ogg,.webm" className="sr-only" disabled={busy} onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              void handleNarrationInput(file);
            }} />
          </label>
        )}

        {mode === "record" && <StoryAudioRecorder disabled={saving || Boolean(conversion)} onBusyChange={setRecorderBusy} onRecorded={(file, seconds) => void adoptNarration(file, "record", seconds)} />}

        {mode === "convert" && (
          <div className="space-y-3">
            <label className={`flex items-center gap-3 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)] p-4 ${conversion ? "cursor-wait opacity-70" : "cursor-pointer hover:border-[var(--accent)]"}`}>
              <Film className="h-5 w-5 text-[var(--accent)]" />
              <span className="min-w-0 flex-1 text-sm text-[var(--text)]">Selecionar vídeo ou áudio MP4<span className="block text-xs text-[var(--text-muted)]">O áudio é extraído e convertido em MP3 aqui no navegador, sem enviar o arquivo. Até {megabytes(MP4_CONVERTER_MAX_BYTES).replace(",0", "")}.</span></span>
              <input type="file" accept="video/mp4,audio/mp4,.mp4,.m4v,.m4a" className="sr-only" disabled={busy} onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void convertVideoToMp3(file);
              }} />
            </label>
            {conversion && (
              <div className="space-y-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] p-4" role="status" aria-live="polite">
                <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><Loader2 className="h-4 w-4 animate-spin" /> {conversion.stage === "decoding" ? "Extraindo o áudio" : "Codificando MP3"} de {conversion.fileName}…</p>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border-soft)]"><div className="h-full bg-[var(--accent)] transition-[width] duration-200" style={{ width: `${Math.round((conversion.stage === "decoding" ? conversion.fraction * 0.3 : 0.3 + conversion.fraction * 0.7) * 100)}%` }} /></div>
              </div>
            )}
          </div>
        )}

        {audioError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{audioError}</p>}

        {audioFile && (
          <div className="space-y-2 rounded-lg border border-[var(--border-soft)] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="min-w-0 truncate font-medium text-[var(--text)]">{audioOrigin === "record" ? "Gravação pronta" : audioOrigin === "convert" ? "MP3 convertido" : "Arquivo selecionado"}: {audioFile.name}</span>
              <span className="text-xs text-[var(--text-muted)]">{describeStoryDuration(audioDuration)} · {megabytes(audioFile.size)}</span>
            </div>
            <audio controls src={audioPreviewUrl} className="w-full" />
            {(audioOrigin === "record" || audioOrigin === "convert") && <a href={audioPreviewUrl} download={audioFile.name} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]"><Download className="h-3.5 w-3.5" /> Baixar MP3</a>}
          </div>
        )}
        {audioUrl && !audioFile && <audio controls src={audioUrl} crossOrigin="anonymous" onLoadedMetadata={(event) => { const value = event.currentTarget.duration; if (Number.isFinite(value) && value > 0) setAudioDuration(value); }} className="w-full" />}
      </section>

      {sceneElements.length > 0 && (
        <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="font-semibold text-[var(--text)]">Elementos da cena</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Cada elemento aparece e fica em destaque na imagem a partir do segundo marcado — no player e no vídeo exportado. Por padrão eles se dividem igualmente ao longo da narração; ajuste para coincidir com o momento em que você fala cada palavra.</p></div>
            <Button type="button" variant="outline" size="sm" onClick={() => setCueOverrides({})} disabled={Object.keys(cueOverrides).length === 0}><RefreshCw className="h-4 w-4" /> Distribuir automaticamente</Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sceneElements.map((element, index) => <label key={element.kreyol} className="rounded-lg border border-[var(--border-soft)] p-3 text-[10px] font-medium text-[var(--text-muted)]"><span className="block text-sm font-semibold text-[var(--text)]">{element.kreyol} <span className="font-normal text-[var(--text-muted)]">· {element.pt}</span></span>Aparece em (s)<Input type="number" min="0" max={audioDuration || undefined} step="0.1" value={elementStarts[index]} onChange={(event) => setCueOverrides((current) => ({ ...current, [element.kreyol]: Math.max(0, Number(event.target.value) || 0) }))} className="mt-1 h-8" /></label>)}
          </div>
        </section>
      )}

      <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="font-semibold text-[var(--text)]">Roteiro e legendas</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Divida a narração em trechos; as duas línguas aparecem sincronizadas durante o vídeo.{audioDuration > 0 ? ` Os tempos vão de 0 a ${describeStoryDuration(audioDuration)}.` : " Adicione a narração para definir os tempos."}</p></div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => { setCaptionsEdited(true); spreadCaptions(audioDuration); }} disabled={!(audioDuration > 0)}><RefreshCw className="h-4 w-4" /> Redistribuir tempos</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setCaptionsEdited(true); setCaptions((items) => [...items, { start: lastEnd, end: Math.min(roundTenth(lastEnd + 30), Math.floor(audioDuration * 10) / 10), kreyol: "", portuguese: "" }]); }} disabled={!(audioDuration > 0) || lastEnd >= audioDuration - 0.1}><Plus className="h-4 w-4" /> Adicionar trecho</Button>
          </div>
        </div>
        <div className="space-y-3">
          {captions.map((caption, index) => <div key={index} className="grid gap-3 rounded-lg border border-[var(--border-soft)] p-3 sm:grid-cols-[110px_1fr_1fr_36px]">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1"><label className="text-[10px] font-medium text-[var(--text-muted)]">Início (s)<Input type="number" min="0" max={audioDuration || undefined} step="0.1" value={caption.start} onChange={(event) => changeCaption(index, "start", event.target.value)} className="mt-1 h-8" /></label><label className="text-[10px] font-medium text-[var(--text-muted)]">Fim (s)<Input type="number" min="0" max={audioDuration || undefined} step="0.1" value={caption.end} onChange={(event) => changeCaption(index, "end", event.target.value)} className="mt-1 h-8" /></label></div>
            <label className="text-[10px] font-semibold text-[var(--text-muted)]">KREYÒL<Textarea value={caption.kreyol} onChange={(event) => changeCaption(index, "kreyol", event.target.value)} rows={2} required className="mt-1 text-sm font-normal" placeholder="Sa k ap pase nan istwa a..." /></label>
            <label className="text-[10px] font-semibold text-[var(--text-muted)]">PORTUGUÊS<Textarea value={caption.portuguese} onChange={(event) => changeCaption(index, "portuguese", event.target.value)} rows={2} required className="mt-1 text-sm font-normal" placeholder="Tradução da fala..." /></label>
            <Button type="button" variant="ghost" size="sm" title="Remover trecho" aria-label="Remover trecho" disabled={captions.length === 1} onClick={() => { setCaptionsEdited(true); setCaptions((items) => items.filter((_, itemIndex) => itemIndex !== index)); }} className="self-center px-2 text-red-600"><Trash2 className="h-4 w-4" /></Button>
          </div>)}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="font-semibold text-[var(--text)]">Publicação</h2>
        <div className="grid gap-2 sm:grid-cols-3">{([
          ["immediate", "Publicar agora"], ["scheduled", "Agendar"], ["draft", "Salvar rascunho"],
        ] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setPublishMode(value)} className={`rounded-lg border px-3 py-3 text-sm font-medium ${publishMode === value ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>{value === "scheduled" && <Calendar className="mr-1 inline h-4 w-4" />}{label}</button>)}</div>
        {publishMode === "scheduled" && <div className="grid max-w-md grid-cols-2 gap-3"><Input type="date" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} required /><Input type="time" value={scheduledTime} onChange={(event) => setScheduledTime(event.target.value)} required /></div>}
      </section>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Cancelar</Button><Button type="submit" disabled={saving || busy}>{saving ? "Salvando..." : initial ? "Salvar alterações" : "Criar história"}</Button></div>
    </form>
  );
}
