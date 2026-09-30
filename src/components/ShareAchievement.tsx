"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Download, Share2, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMAGE_BANK } from "@/lib/imageBank";
import { currentMilestone, shareCaption } from "@/lib/achievements";
import { cn } from "@/lib/utils";


// Ícones de marca (o lucide-react desta versão não os inclui).
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const CARD_W = 1080;
const CARD_H = 1350; // 4:5 — formato de feed do Instagram/Facebook

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao carregar imagem"));
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function renderCard(
  canvas: HTMLCanvasElement,
  opts: { completed: number; total: number; name: string; bgSrc: string; host: string }
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { completed, total, name, bgSrc, host } = opts;
  canvas.width = CARD_W;
  canvas.height = CARD_H;

  // Fundo: ilustração do banco, cobrindo o cartão
  ctx.fillStyle = "#1e1b4b";
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  try {
    const img = await loadImage(bgSrc);
    const iw = img.naturalWidth || 1200;
    const ih = img.naturalHeight || 800;
    const scale = Math.max(CARD_W / iw, CARD_H / ih);
    ctx.drawImage(img, (CARD_W - iw * scale) / 2, (CARD_H - ih * scale) / 2, iw * scale, ih * scale);
  } catch {
    /* mantém a cor sólida */
  }

  // Escurece a parte de baixo para o texto ficar legível
  const grad = ctx.createLinearGradient(0, CARD_H * 0.28, 0, CARD_H);
  grad.addColorStop(0, "rgba(15,12,45,0)");
  grad.addColorStop(0.55, "rgba(15,12,45,0.72)");
  grad.addColorStop(1, "rgba(15,12,45,0.94)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const milestone = currentMilestone(completed, total);
  const done = total > 0 && completed >= total;
  const pct = total > 0 ? Math.min(1, completed / total) : 0;

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 18;

  // Selo/emoji
  ctx.font = "150px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(milestone?.emoji ?? "🌱", CARD_W / 2, 700);

  // Título
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 104px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.fillText(milestone?.kreyol ?? "Felisitasyon!", CARD_W / 2, 850);

  ctx.font = "600 46px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.fillStyle = "#fde68a";
  ctx.fillText(milestone?.title ?? "Começando a jornada", CARD_W / 2, 918);

  // Texto principal
  ctx.fillStyle = "#ffffff";
  ctx.font = "500 54px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const firstName = name.trim().split(" ")[0] || "Aluno";
  const message = done
    ? `${firstName} concluiu todas as ${total} lições de Kreyòl Ayisyen!`
    : `${firstName} concluiu ${completed} de ${total} lições de Kreyòl Ayisyen`;
  const lines = wrapText(ctx, message, CARD_W - 200);
  lines.forEach((l, i) => ctx.fillText(l, CARD_W / 2, 1000 + i * 66));

  // Barra de progresso
  ctx.shadowBlur = 0;
  const barW = CARD_W - 240;
  const barX = 120;
  const barY = 1000 + lines.length * 66 + 30;
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, 26, 13);
  ctx.fill();
  if (pct > 0) {
    const g2 = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    g2.addColorStop(0, "#fbbf24");
    g2.addColorStop(1, "#f97316");
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.roundRect(barX, barY, Math.max(26, barW * pct), 26, 13);
    ctx.fill();
  }
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 34px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.fillText(`${Math.round(pct * 100)}% do curso`, CARD_W / 2, barY + 78);

  // Rodapé
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 34px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.fillText(`🇭🇹 Kreyòl Ayisyen  ·  ${host}`, CARD_W / 2, CARD_H - 56);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Falha ao gerar a imagem."))), "image/png");
  });
}

export function ShareAchievementModal({
  open,
  onClose,
  completed,
  total,
  name,
}: {
  open: boolean;
  onClose: () => void;
  completed: number;
  total: number;
  name: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgId, setBgId] = useState<string>("natureza");
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [mounted, setMounted] = useState(false);

  const host = typeof window !== "undefined" ? window.location.host : "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const caption = shareCaption(completed, total, origin);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Web Share com arquivos: celulares (Android/iOS) abrem a folha de
    // compartilhamento com Instagram, Facebook, WhatsApp etc.
    try {
      const probe = new File([new Blob(["x"], { type: "image/png" })], "x.png", { type: "image/png" });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanNativeShare(typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] }));
    } catch {
      setCanNativeShare(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const bgSrc = IMAGE_BANK.find((i) => i.id === bgId)?.src ?? IMAGE_BANK[0].src;

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    renderCard(canvasRef.current, { completed, total, name, bgSrc, host });
  }, [open, completed, total, name, bgSrc, host]);

  const getFile = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Imagem indisponível.");
    await renderCard(canvas, { completed, total, name, bgSrc, host });
    const blob = await canvasToBlob(canvas);
    return new File([blob], `conquista-kreyol-${completed}-licoes.png`, { type: "image/png" });
  }, [completed, total, name, bgSrc, host]);

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setStatus("Não foi possível copiar automaticamente — selecione e copie o texto abaixo.");
    }
  }

  async function download() {
    try {
      const file = await getFile();
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setStatus("Imagem baixada! Agora é só postar.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Erro ao baixar.");
    }
  }

  async function nativeShare() {
    try {
      const file = await getFile();
      await navigator.share({ files: [file], text: caption, title: "Minha conquista em Kreyòl Ayisyen" });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return; // usuário cancelou
      setStatus("Não foi possível abrir o compartilhamento — use os botões abaixo.");
    }
  }

  async function shareToFacebook() {
    // O Facebook não aceita anexar imagem por link: baixamos a imagem e abrimos
    // o compartilhador com o endereço do app (a legenda vai para a área de transferência).
    await download();
    await copyCaption();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(origin)}&quote=${encodeURIComponent(caption)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function shareToInstagram() {
    // O Instagram não permite publicar direto pelo navegador: baixamos a
    // imagem, copiamos a legenda e abrimos o Instagram para o aluno postar.
    await download();
    await copyCaption();
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compartilhar conquista"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <Trophy className="h-5 w-5 text-amber-500" /> Compartilhe sua conquista
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-2)] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 overflow-y-auto p-5 sm:grid-cols-[minmax(0,17rem)_1fr]">
          <div>
            <canvas
              ref={canvasRef}
              width={CARD_W}
              height={CARD_H}
              className="aspect-[4/5] w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] shadow-lg"
            />
            <p className="mt-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Cenário do cartão
            </p>
            <div className="flex flex-wrap gap-1.5">
              {IMAGE_BANK.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  title={i.theme}
                  aria-label={`Fundo ${i.theme}`}
                  aria-pressed={bgId === i.id}
                  onClick={() => setBgId(i.id)}
                  className={cn(
                    "h-8 w-8 overflow-hidden rounded-md border-2 transition-all cursor-pointer",
                    bgId === i.id ? "border-[var(--accent)] scale-105" : "border-transparent opacity-80 hover:opacity-100"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Legenda pronta
              </p>
              <p className="whitespace-pre-line rounded-xl bg-[var(--surface-2)] p-3 text-sm text-[var(--text-secondary)]">
                {caption}
              </p>
              <Button type="button" size="sm" variant="outline" className="mt-2" onClick={copyCaption}>
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado!" : "Copiar legenda"}
              </Button>
            </div>

            <div className="space-y-2">
              {canNativeShare && (
                <Button type="button" className="w-full" onClick={nativeShare}>
                  <Share2 className="h-4 w-4" /> Compartilhar (Instagram, Facebook, WhatsApp…)
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={shareToFacebook}
                  className="border-[#1877f2]/40 text-[#1877f2]"
                >
                  <FacebookIcon className="h-4 w-4" /> Facebook
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={shareToInstagram}
                  className="border-[#d62976]/40 text-[#d62976]"
                >
                  <InstagramIcon className="h-4 w-4" /> Instagram
                </Button>
              </div>
              <Button type="button" variant="ghost" className="w-full" onClick={download}>
                <Download className="h-4 w-4" /> Só baixar a imagem
              </Button>
            </div>

            <p className="rounded-xl bg-[var(--accent-soft)] p-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              {canNativeShare
                ? "No celular, o botão de compartilhar abre a lista de apps direto com a imagem."
                : "Facebook e Instagram não permitem postar direto pelo navegador: a imagem é baixada, a legenda é copiada e o site abre para você colar e publicar."}
            </p>

            {status && (
              <p className="text-xs text-[var(--text-secondary)]" role="status">
                {status}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ShareAchievementButton({
  completed,
  total,
  name,
  className,
  children,
  variant = "primary",
}: {
  completed: number;
  total: number;
  name: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "outline" | "secondary";
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="sm"
        className={className}
        onClick={() => setOpen(true)}
        disabled={completed <= 0}
        title={completed <= 0 ? "Conclua uma lição para liberar" : undefined}
      >
        {children ?? (
          <>
            <Share2 className="h-4 w-4" /> Compartilhar conquista
          </>
        )}
      </Button>
      <ShareAchievementModal
        open={open}
        onClose={() => setOpen(false)}
        completed={completed}
        total={total}
        name={name}
      />
    </>
  );
}
