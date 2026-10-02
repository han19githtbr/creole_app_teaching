"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { ImagePlus, Images, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageBankPicker } from "@/components/ImageBankPicker";
import { PostCard } from "@/components/PostCard";
import { getBankImage, type BankImage } from "@/lib/imageBank";
import { getDefaultImageQuiz, isValidImageQuiz, type ImageQuizConfig } from "@/lib/imageQuiz";
import { cn } from "@/lib/utils";

interface PostFormValues {
  _id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  isPermanent: boolean;
  expiresAt?: string | null;
  isPublished: boolean;
  acceptsAnswers?: boolean;
  imageQuiz?: ImageQuizConfig;
}

export function PostForm({ initial }: { initial?: PostFormValues }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.imageAlt ?? "");
  const [imageTab, setImageTab] = useState<"bank" | "upload">("bank");
  const [showImagePanel, setShowImagePanel] = useState(Boolean(initial?.imageUrl));
  const [uploading, setUploading] = useState(false);
  const [isPermanent, setIsPermanent] = useState(initial?.isPermanent ?? true);
  const [expiresAt, setExpiresAt] = useState(initial?.expiresAt?.slice(0, 10) ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [acceptsAnswers, setAcceptsAnswers] = useState(initial?.acceptsAnswers ?? true);
  const initialBankImage = getBankImage(initial?.imageUrl);
  const initialQuiz = initial?.imageQuiz ?? getDefaultImageQuiz(initialBankImage?.theme ?? "", initialBankImage?.id);
  const [quizEnabled, setQuizEnabled] = useState(Boolean(initialQuiz));
  const [quizOptions, setQuizOptions] = useState<string[]>(initialQuiz?.options ?? Array(10).fill(""));
  const [quizAnswers, setQuizAnswers] = useState<string[]>(initialQuiz?.answers ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initial?._id);
  const bankImage = getBankImage(imageUrl);

  function handleBankSelect(img: BankImage | null) {
    if (!img) {
      setImageUrl("");
      setImageAlt("");
      setQuizOptions(Array(10).fill(""));
      setQuizAnswers([]);
      setQuizEnabled(false);
      return;
    }
    setImageUrl(img.src);
    setImageAlt(img.title);
    if (!title.trim()) {
      setTitle(img.title);
    }
    if (!content.trim()) {
      setContent(img.caption);
    }
    const quiz = getDefaultImageQuiz(img.theme, img.id);
    setQuizOptions(quiz?.options ?? Array(10).fill(""));
    setQuizAnswers(quiz?.answers ?? []);
    setQuizEnabled(Boolean(quiz));
  }

  function useSuggestedCaption() {
    if (!bankImage) return;
    setContent(bankImage.caption);
  }

  function useSuggestedTitle() {
    if (!bankImage) return;
    setTitle(bankImage.title);
  }

  function handleAutoSelectQuizAnswers() {
    if (!bankImage?.elements) return;
    const elementWords = bankImage.elements.map((el) => el.kreyol.toLowerCase());
    const matched = quizOptions.filter((opt) => elementWords.includes(opt.trim().toLowerCase()));
    if (matched.length > 0) {
      setQuizAnswers(matched);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Use uma imagem JPG, PNG, WebP ou GIF.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 8 MB.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await upload(`posts/${Date.now()}_${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/posts/image-upload",
        contentType: file.type,
      });
      setImageUrl(blob.url);
      if (!imageAlt) setImageAlt(file.name.replace(/\.[^.]+$/, ""));
      setQuizOptions(Array(10).fill(""));
      setQuizAnswers([]);
      setQuizEnabled(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar a imagem.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const imageQuiz = imageUrl && quizEnabled
      ? { options: quizOptions, answers: quizAnswers }
      : null;
    if (imageUrl && quizEnabled && !isValidImageQuiz(imageQuiz)) {
      setError("Preencha as dez palavras e marque pelo menos uma resposta correta.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(isEdit ? `/api/posts/${initial!._id}` : "/api/posts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          imageUrl,
          imageAlt,
          imageQuiz,
          isPermanent,
          expiresAt: isPermanent ? null : expiresAt || null,
          isPublished,
          acceptsAnswers,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erro ao salvar a postagem.");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar a postagem.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Título</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      {/* Imagem da postagem */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Imagem da postagem</p>
            <p className="text-xs text-[var(--text-muted)]">
              Opcional — escolha uma ilustração do banco ou envie a sua.
            </p>
          </div>
          {!showImagePanel && !imageUrl && (
            <Button type="button" size="sm" variant="outline" onClick={() => setShowImagePanel(true)}>
              <ImagePlus className="h-4 w-4" /> Adicionar imagem
            </Button>
          )}
        </div>

        {(showImagePanel || imageUrl) && (
          <div className="mt-4 space-y-4">
            {imageUrl && (
              <div className="overflow-hidden rounded-xl border border-[var(--border)] shadow-sm">
                <div className="flex items-center justify-between bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border-b border-emerald-500/20">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    Imagem escolhida para a postagem! Pré-visualização pronta para montagem.
                  </span>
                  <span className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 hidden sm:inline font-normal">
                    {bankImage ? `Tema: ${bankImage.theme}` : "Imagem personalizada"}
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={imageAlt || "Imagem da postagem"} className="max-h-72 w-full object-cover" />
                <div className="flex flex-wrap items-center gap-2 bg-[var(--surface-2)] p-2.5">
                  <Input
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Descrição da imagem (acessibilidade)"
                    className="h-8 flex-1 min-w-[12rem] text-xs"
                    maxLength={200}
                  />
                  {bankImage && (
                    <>
                      <Button type="button" size="sm" variant="outline" onClick={useSuggestedTitle}>
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Sugerir título
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={useSuggestedCaption}>
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Usar legenda sugerida
                      </Button>
                    </>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setImageUrl("");
                      setImageAlt("");
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remover
                  </Button>
                </div>
                {bankImage && bankImage.elements && bankImage.elements.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 bg-[var(--surface)] px-3 py-2 border-t border-[var(--border)]">
                    <span className="text-[11px] font-semibold text-[var(--accent)]">
                      Elementos identificáveis na cena:
                    </span>
                    {bankImage.elements.map((el) => (
                      <span
                        key={el.kreyol}
                        className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--text)] border border-[var(--border-soft)]"
                      >
                        <strong>{el.kreyol}</strong>{" "}
                        <span className="text-[var(--text-muted)]">({el.pt})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-1 border-b border-[var(--border-soft)]">
              {(
                [
                  { id: "bank", label: "Banco de imagens", icon: Images },
                  { id: "upload", label: "Enviar minha imagem", icon: UploadCloud },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setImageTab(id)}
                  className={cn(
                    "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer",
                    imageTab === id
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
            </div>

            {imageTab === "bank" ? (
              <ImageBankPicker selectedSrc={bankImage ? bankImage.src : null} onSelect={handleBankSelect} />
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--border-strong)] p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFile}
                />
                <UploadCloud className="mx-auto mb-2 h-8 w-8 text-[var(--text-muted)]" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? "Enviando..." : "Escolher arquivo"}
                </Button>
                <p className="mt-2 text-[11px] text-[var(--text-muted)]">JPG, PNG, WebP ou GIF (animado) — até 8 MB.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
          {imageUrl ? "Legenda da imagem (Markdown)" : "Conteúdo (Markdown)"}
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          rows={imageUrl ? 5 : 10}
          placeholder={imageUrl ? "Escreva a legenda que acompanha a imagem..." : undefined}
        />
      </div>

      {imageUrl && (
        <label className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={quizEnabled}
            onChange={(event) => setQuizEnabled(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-strong)]"
          />
          <span>
            <span className="block font-medium text-[var(--text)]">Ativar jogo de palavras para esta imagem</span>
            <span className="mt-0.5 block text-xs text-[var(--text-muted)]">As imagens do banco já vêm com opções e gabarito; em uploads, informe as dez opções corretas manualmente.</span>
          </span>
        </label>
      )}

      {imageUrl && quizEnabled && (
        <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Jogo de palavras em Kreyòl</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Defina dez opções e marque todas as palavras que representam elementos visíveis na imagem.
              </p>
            </div>
            {bankImage?.elements && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAutoSelectQuizAnswers}
                className="text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Marcar elementos visíveis ({quizAnswers.length} marcadas)
              </Button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {quizOptions.map((word, index) => {
              const isVisibleInGhibli = bankImage?.elements?.some(
                (el) => el.kreyol.toLowerCase() === word.trim().toLowerCase()
              );
              return (
                <div key={index} className="flex items-center gap-2">
                  <input
                    aria-label={`Palavra correta ${index + 1}`}
                    type="checkbox"
                    checked={quizAnswers.includes(word) && Boolean(word.trim())}
                    disabled={!word.trim()}
                    onChange={(event) =>
                      setQuizAnswers((answers) =>
                        event.target.checked
                          ? [...answers, word]
                          : answers.filter((answer) => answer !== word)
                      )
                    }
                    className="h-4 w-4 shrink-0 rounded border-[var(--border-strong)] accent-[var(--accent)] cursor-pointer"
                  />
                  <div className="relative flex-1">
                    <Input
                      value={word}
                      onChange={(event) => {
                        const value = event.target.value;
                        setQuizOptions((options) =>
                          options.map((item, itemIndex) => (itemIndex === index ? value : item))
                        );
                        setQuizAnswers((answers) => answers.filter((answer) => answer !== word));
                      }}
                      placeholder={`Opção ${index + 1} em Kreyòl`}
                      maxLength={40}
                      required
                      className="h-9 text-sm pr-16"
                    />
                    {isVisibleInGhibli && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                        visível
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Caixa marcada = resposta correta. O aluno terá três tentativas para encontrar as palavras certas na ilustração Ghibli.
          </p>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={isPermanent}
            onChange={(e) => setIsPermanent(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border-strong)]"
          />
          Permanente
        </label>
        {!isPermanent && (
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">Expira em</label>
            <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
        )}
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border-strong)]"
          />
          Publicada
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={acceptsAnswers}
            onChange={(e) => setAcceptsAnswers(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border-strong)]"
          />
          Alunos podem responder
        </label>
      </div>

      {(title || content || imageUrl) && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Pré-visualização para os alunos
          </p>
          <PostCard
            title={title || "Sem título"}
            content={content}
            imageUrl={imageUrl || undefined}
            imageAlt={imageAlt}
            createdAt={new Date()}
            isPermanent={isPermanent}
            expiresAt={expiresAt || null}
          />
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-[#dc2626] dark:bg-red-950/30" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar postagem"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
