"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { UserMonetizationStatus } from "@/lib/monetization";

interface UseUsageTrackerOptions {
  feature: "stories" | "cquoi";
  enabled?: boolean;
}

export function useUsageTracker({ feature, enabled = true }: UseUsageTrackerOptions) {
  const { status: authStatus } = useSession();
  const [monetizationStatus, setMonetizationStatus] = useState<UserMonetizationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  const lastActivityRef = useRef<number>(0);
  const activeSecondsAccumulatorRef = useRef<number>(0);
  const isHeartbeatInFlightRef = useRef<boolean>(false);

  // Inicializa timestamp no cliente
  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Carrega status inicial
  const refreshStatus = useCallback(async () => {
    if (authStatus !== "authenticated") {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/user/monetization/status", { cache: "no-store" });
      if (res.ok) {
        const data: UserMonetizationStatus = await res.json();
        setMonetizationStatus(data);

        // Verifica bloqueio
        const hasAccess =
          data.hasUnlimitedAccess ||
          (feature === "stories" ? data.canAccessStories : data.canAccessGame);
        setIsBlocked(!hasAccess);
      }
    } catch (err) {
      console.warn("[useUsageTracker] Falha ao carregar status:", err);
    } finally {
      setLoading(false);
    }
  }, [authStatus, feature]);

  useEffect(() => {
    let isMounted = true;
    const loadInitial = async () => {
      if (authStatus !== "authenticated") {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/user/monetization/status", { cache: "no-store" });
        if (res.ok && isMounted) {
          const data: UserMonetizationStatus = await res.json();
          setMonetizationStatus(data);
          const hasAccess =
            data.hasUnlimitedAccess ||
            (feature === "stories" ? data.canAccessStories : data.canAccessGame);
          setIsBlocked(!hasAccess);
        }
      } catch (err) {
        console.warn("[useUsageTracker] Falha ao carregar status:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadInitial();
    return () => {
      isMounted = false;
    };
  }, [authStatus, feature]);

  // Listener de atividade do usuário
  useEffect(() => {
    if (!enabled || authStatus !== "authenticated") return;

    const onUserAction = () => {
      lastActivityRef.current = Date.now();
      setIsActive(true);
    };

    window.addEventListener("mousemove", onUserAction, { passive: true });
    window.addEventListener("keydown", onUserAction, { passive: true });
    window.addEventListener("touchstart", onUserAction, { passive: true });
    window.addEventListener("scroll", onUserAction, { passive: true });
    window.addEventListener("click", onUserAction, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onUserAction);
      window.removeEventListener("keydown", onUserAction);
      window.removeEventListener("touchstart", onUserAction);
      window.removeEventListener("scroll", onUserAction);
      window.removeEventListener("click", onUserAction);
    };
  }, [enabled, authStatus]);

  // Loop de contagem e envio de heartbeat
  useEffect(() => {
    if (!enabled || authStatus !== "authenticated") return;

    const interval = setInterval(async () => {
      // 1. Se aba oculta, não acumula
      if (document.hidden) {
        setIsActive(false);
        return;
      }

      // 2. Se inativo por mais de 45s (e nenhum áudio/vídeo tocando)
      const now = Date.now();
      const lastAct = lastActivityRef.current || now;
      const isAudible =
        Boolean(document.querySelector("audio:not([paused]), video:not([paused])"));
      const isIdle = now - lastAct > 45000 && !isAudible;

      if (isIdle) {
        setIsActive(false);
        return;
      }

      setIsActive(true);
      activeSecondsAccumulatorRef.current += 1;

      // A cada 30 segundos acumulados, envia o heartbeat
      if (activeSecondsAccumulatorRef.current >= 30 && !isHeartbeatInFlightRef.current) {
        isHeartbeatInFlightRef.current = true;
        const secondsToSend = activeSecondsAccumulatorRef.current;
        activeSecondsAccumulatorRef.current = 0;

        try {
          const res = await fetch("/api/user/monetization/heartbeat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feature, seconds: secondsToSend }),
          });

          if (res.ok) {
            const data: UserMonetizationStatus = await res.json();
            setMonetizationStatus(data);

            const hasAccess =
              data.hasUnlimitedAccess ||
              (feature === "stories" ? data.canAccessStories : data.canAccessGame);
            setIsBlocked(!hasAccess);
          }
        } catch (err) {
          console.warn("[useUsageTracker] Erro no envio de batimento:", err);
        } finally {
          isHeartbeatInFlightRef.current = false;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, authStatus, feature]);

  // Função para registrar consumo de unidade (1 história ou 1 jogo)
  const consume = useCallback(
    async (unitType: "story" | "game") => {
      if (authStatus !== "authenticated") return { success: false };
      try {
        const res = await fetch("/api/user/monetization/consume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feature: unitType }),
        });

        const data = await res.json();
        if (res.ok) {
          await refreshStatus();
          return { success: true, ...data };
        } else {
          if (res.status === 402) {
            setIsBlocked(true);
          }
          return { success: false, ...data };
        }
      } catch (err) {
        console.error("[useUsageTracker] Erro ao consumir unidade:", err);
        return { success: false };
      }
    },
    [authStatus, refreshStatus]
  );

  return {
    status: monetizationStatus,
    loading,
    isActive,
    isBlocked,
    refreshStatus,
    consume,
  };
}
