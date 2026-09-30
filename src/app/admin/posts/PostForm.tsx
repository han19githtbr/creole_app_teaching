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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initial?._id);
  const bankImage = getBankImage(imageUrl);

  function handleBankSelect(img: BankImage | null) {
    if (!img) {
      setImageUrl("");
      setImageAlt("");
      return;
    }
    setImageUrl(img.src);
    setImageAlt(img.title);
  }

  function useSuggestedCaption() {
    if (!bankImage) return;
    setContent(bankImage.caption);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar a imagem.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
          isPermanent,
          expiresAt: isPermanent ? null : expiresAt || null,
          isPublished,
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
              <div className="overflow-hidden rounded-xl border border-[var(--border)]">
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
                    <Button type="button" size="sm" variant="outline" onClick={useSuggestedCaption}>
                      <Sparkles className="h-3.5 w-3.5" /> Usar legenda sugerida
                    </Button>
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
