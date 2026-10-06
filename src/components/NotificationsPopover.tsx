"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BookOpen, CheckCheck, Newspaper, Sparkles, Video, X } from "lucide-react";
import { useNotifications, type UnreadLesson, type UnreadPost, type UnreadVideo } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function NotificationsPopover() {
  const router = useRouter();
  const { count, lessons, posts, videos, markAsSeen } = useNotifications();
  const [open, setOpen] = useState(false);
  const [pushState, setPushState] = useState<
    "checking" | "unsupported" | "unconfigured" | "enabled" | "disabled" | "blocked"
  >("checking");
  const [pushBusy, setPushBusy] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        if (!cancelled) setPushState("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        if (!cancelled) setPushState("blocked");
        return;
      }
      try {
        const keyResponse = await fetch("/api/push/vapid-public-key", { cache: "no-store" });
        if (!keyResponse.ok) {
          if (!cancelled) setPushState("unconfigured");
          return;
        }
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (!cancelled) setPushState(subscription ? "enabled" : "disabled");
      } catch {
        if (!cancelled) setPushState("disabled");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Fecha no ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleLessonItemClick = async (lesson: UnreadLesson) => {
    await markAsSeen("lessons");
    setOpen(false);
    router.push(`/dashboard/lessons/${lesson.slug}`);
  };

  const handlePostItemClick = async (post: UnreadPost) => {
    await markAsSeen("posts");
    setOpen(false);
    router.push(`/dashboard#post-${post.id}`);
  };

  const handleVideoItemClick = async (video: UnreadVideo) => {
    await markAsSeen("videos");
    setOpen(false);
    router.push(`/dashboard/videos/${video.id}`);
  };

  const handleMarkAllRead = async () => {
    await markAsSeen("all");
  };

  const handleEnablePush = async () => {
    setPushBusy(true);
    setPushError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushState(permission === "denied" ? "blocked" : "disabled");
        return;
      }

      const keyResponse = await fetch("/api/push/vapid-public-key", { cache: "no-store" });
      if (!keyResponse.ok) throw new Error("Notificações push ainda não estão configuradas no servidor.");
      const { publicKey } = (await keyResponse.json()) as { publicKey: string };
      const padding = "=".repeat((4 - (publicKey.length % 4)) % 4);
      const decodedKey = atob(publicKey.replace(/-/g, "+").replace(/_/g, "/") + padding);
      const applicationServerKey = Uint8Array.from(decodedKey, (char) => char.charCodeAt(0));
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      if (!response.ok) throw new Error("Não foi possível ativar as notificações neste dispositivo.");
      setPushState("enabled");
    } catch (error) {
      setPushError(error instanceof Error ? error.message : "Não foi possível ativar as notificações.");
    } finally {
      setPushBusy(false);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Botão de sino com badge vermelho */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={count > 0 ? `${count} novas notificações` : "Notificações"}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold text-white shadow-md animate-pulse ring-2 ring-[var(--surface)]"
            title={`${count} novidades não vistas`}
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* Popover / Drawer Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)] text-white">
                <Bell className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[var(--text)]">Novidades e Avisos</h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {count > 0 ? `${count} ${count === 1 ? "item novo" : "itens novos"}` : "Tudo em dia!"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {count > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-white hover:font-bold transition cursor-pointer"
                  title="Marcar todas como lidas"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Ler todas
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition cursor-pointer"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 max-h-[22rem] overflow-y-auto space-y-3 pr-1">
            {count === 0 ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCheck className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-[var(--text)]">Nenhuma novidade pendente</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Você já visualizou todas as lições, postagens e vídeos mais recentes.
                </p>
              </div>
            ) : (
              <>
                {/* Lições Novas */}
                {lessons.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      <BookOpen className="h-3.5 w-3.5 text-[var(--accent)]" /> Lições Novas ({lessons.length})
                    </p>
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonItemClick(lesson)}
                        className="group flex items-start justify-between gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-2.5 hover:bg-red-500/10 transition cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                              Nova!
                            </span>
                            <span className="truncate text-xs font-bold text-[var(--text)] group-hover:text-[var(--accent)]">
                              {lesson.title}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                            {lesson.category} · Seção {lesson.sectionNumber}
                          </p>
                        </div>
                        {lesson.createdAt && (
                          <span className="shrink-0 text-[10px] text-[var(--text-muted)]">
                            {formatDistanceToNow(new Date(lesson.createdAt), { addSuffix: true, locale: ptBR })}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Postagens Novas */}
                {posts.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      <Newspaper className="h-3.5 w-3.5 text-amber-500" /> Postagens do Professor ({posts.length})
                    </p>
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handlePostItemClick(post)}
                        className="group flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-2.5 hover:bg-[var(--surface-2)] transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {post.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={post.imageUrl}
                              alt=""
                              className="h-9 w-9 shrink-0 rounded-lg object-cover border border-[var(--border)]"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                              {post.title}
                            </p>
                            <span className="text-[10px] text-[var(--text-muted)]">Aviso do professor</span>
                          </div>
                        </div>
                        {post.createdAt && (
                          <span className="shrink-0 text-[10px] text-[var(--text-muted)]">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Vídeos Novos */}
                {videos.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      <Video className="h-3.5 w-3.5 text-emerald-500" /> Novas Aulas em Vídeo ({videos.length})
                    </p>
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => handleVideoItemClick(video)}
                        className="group flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-2.5 hover:bg-[var(--surface-2)] transition cursor-pointer"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                            {video.title}
                          </p>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {video.authorName} · {Math.round(video.duration)}s
                          </span>
                        </div>
                        {video.createdAt && (
                          <span className="shrink-0 text-[10px] text-[var(--text-muted)]">
                            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true, locale: ptBR })}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-3 border-t border-[var(--border-soft)] pt-2.5 text-center">
            {pushState === "disabled" && (
              <button
                type="button"
                onClick={handleEnablePush}
                disabled={pushBusy}
                className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline disabled:opacity-60"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {pushBusy ? "Ativando..." : "Ativar notificações neste celular"}
              </button>
            )}
            {pushState === "enabled" && (
              <div className="space-y-1.5">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Notificações ativadas neste dispositivo
                </p>
                {count > 0 && (
                  <button
                    type="button"
                    onClick={handleEnablePush}
                    disabled={pushBusy}
                    className="text-xs font-semibold text-[var(--accent)] hover:underline disabled:opacity-60"
                  >
                    {pushBusy ? "Enviando alerta..." : `Enviar alerta de ${count} ${count === 1 ? "novidade" : "novidades"}`}
                  </button>
                )}
              </div>
            )}
            {pushState === "blocked" && (
              <p className="text-xs text-[var(--text-muted)]">Permissão bloqueada nas configurações do navegador</p>
            )}
            {pushState === "unsupported" && (
              <p className="text-xs text-[var(--text-muted)]">Notificações push indisponíveis neste navegador</p>
            )}
            {pushState === "unconfigured" && (
              <p className="text-xs text-[var(--text-muted)]">Notificações em segundo plano não configuradas</p>
            )}
            {pushError && <p role="alert" className="mt-1 text-xs text-red-600">{pushError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
