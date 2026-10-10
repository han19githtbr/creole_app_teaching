"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { setAppBadge } from "@/lib/badgeManager";

export interface UnreadLesson {
  id: string;
  title: string;
  slug: string;
  sectionNumber: number;
  category: string;
  createdAt: string | null;
  announcedAt: string | null;
}

export interface UnreadPost {
  id: string;
  title: string;
  imageUrl: string | null;
  createdAt: string | null;
}

export interface UnreadVideo {
  id: string;
  title: string;
  duration: number;
  authorName: string;
  createdAt: string | null;
}

export interface NotificationsData {
  count: number;
  lessons: UnreadLesson[];
  posts: UnreadPost[];
  videos: UnreadVideo[];
}

export function useNotifications() {
  const { status } = useSession();
  const [data, setData] = useState<NotificationsData>({
    count: 0,
    lessons: [],
    posts: [],
    videos: [],
  });
  const fetchUnread = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      const res = await fetch("/api/notifications/unread", { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as NotificationsData;
      setData(json);
      // Atualiza o ícone do aplicativo no celular (Badging API), navegador e favicon
      await setAppBadge(json.count);
    } catch {
      // Ignora falhas de rede temporárias
    }
  }, [status]);

  const markAsSeen = useCallback(
    async (type: "all" | "lessons" | "posts" | "videos" = "all") => {
      if (status !== "authenticated") return;
      try {
        const response = await fetch("/api/notifications/unread", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });
        if (!response.ok) return;
        await fetchUnread();
      } catch {
        // Ignora erro
      }
    },
    [fetchUnread, status]
  );

  useEffect(() => {
    if (status !== "authenticated") {
      setAppBadge(0).catch(() => {});
      return;
    }

    void Promise.resolve().then(fetchUnread);

    // Atualiza a cada 45 segundos e quando o usuário voltar para o app
    const interval = setInterval(fetchUnread, 45000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchUnread();
      }
    };
    const onFocus = () => fetchUnread();
    const onCustomRefresh = () => fetchUnread();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("kreyol:notifications-refresh", onCustomRefresh);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("kreyol:notifications-refresh", onCustomRefresh);
    };
  }, [status, fetchUnread]);

  return {
    count: data.count,
    lessons: data.lessons,
    posts: data.posts,
    videos: data.videos,
    refresh: fetchUnread,
    markAsSeen,
  };
}
