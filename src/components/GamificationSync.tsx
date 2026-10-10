"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  GAMIFICATION_CHANGE_EVENT,
  applySyncedGamificationState,
  getDefaultGamificationState,
  getGamificationConfig,
  getGamificationState,
  type GamificationChangeDetail,
  type GamificationState,
} from "@/lib/gamification";
import type { AppLanguage } from "@/lib/languageShared";

const ACCOUNT_KEY = "kreyol:gamification-account";
const SYNC_INTERVAL_MS = 30_000;
// Cada idioma sincroniza o SEU progresso de forma independente.
const SYNCED_LANGUAGES: AppLanguage[] = ["kreyol", "francais"];

function hasProgress(state: GamificationState, language: AppLanguage): boolean {
  return Boolean(
    state.xp || state.goud || state.totalSolved || state.highestStreak || state.currentStreak ||
    state.perfectRoundsCount || state.totalWordsFound || state.unlockedBadges.length ||
    state.scenesSolved.length || state.unlockedTitles.length > 1 ||
    state.activeTitleId !== getGamificationConfig(language).defaultTitleId
  );
}

/** Inicia a sincronização do progresso de UM idioma; devolve a função de limpeza. */
function startLanguageSync(language: AppLanguage, email: string): () => void {
  {
    const authenticatedEmail = email;
    // O Kreyòl mantém as chaves originais (não perde o progresso salvo); o Français usa chaves próprias.
    const suffix = language === "kreyol" ? "" : `:${language}`;
    const accountKey = `${ACCOUNT_KEY}${suffix}`;
    const apiUrl = `/api/gamification?language=${language}`;

    let disposed = false;
    let setupChangedState = false;
    let syncTimer: ReturnType<typeof setTimeout> | undefined;
    let inFlight = false;
    let ready = false;
    let dirty = false;
    let applyingRemote = false;
    let pendingMode: "replace" | "mergeLegacy" = "replace";

    const encodedEmail = encodeURIComponent(authenticatedEmail);
    const migrationKey = `kreyol:gamification-migrated:${encodedEmail}${suffix}`;
    const pendingKey = `kreyol:gamification-pending:${encodedEmail}${suffix}`;
    const baseKey = `kreyol:gamification-base:${encodedEmail}${suffix}`;
    const revisionKey = `kreyol:gamification-revision:${encodedEmail}${suffix}`;
    const accountAtStart = localStorage.getItem(accountKey);
    const canImportLegacy = !accountAtStart || accountAtStart === authenticatedEmail;
    const localAtStart = getGamificationState(language);
    let baseState = getDefaultGamificationState(language);
    let revision = Number(localStorage.getItem(revisionKey)) || 0;
    try {
      const storedBase = localStorage.getItem(baseKey);
      if (storedBase) baseState = JSON.parse(storedBase) as GamificationState;
    } catch {
      baseState = getDefaultGamificationState(language);
    }

    function applyRemote(state: GamificationState) {
      applyingRemote = true;
      applySyncedGamificationState(state, language);
      applyingRemote = false;
    }

    function rememberServerVersion(state: GamificationState, nextRevision: number) {
      baseState = state;
      revision = nextRevision;
      try {
        localStorage.setItem(baseKey, JSON.stringify(state));
        localStorage.setItem(revisionKey, String(nextRevision));
      } catch {
        // A falha no cache local não impede a sincronização com o servidor.
      }
    }

    async function syncNow() {
      if (disposed || !ready || inFlight) return;
      inFlight = true;
      let retryAfterRequest = false;
      try {
        if (dirty) {
          const sentState = getGamificationState(language);
          const response = await fetch(apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: sentState, baseState, revision, mode: pendingMode, language }),
          });
          if (!response.ok) return;
          const result = (await response.json()) as { state: GamificationState; revision: number };
          rememberServerVersion(result.state, result.revision);
          const currentState = getGamificationState(language);
          localStorage.setItem(accountKey, authenticatedEmail);
          localStorage.setItem(migrationKey, "1");
          if (JSON.stringify(currentState) === JSON.stringify(sentState)) {
            dirty = false;
            pendingMode = "replace";
            localStorage.removeItem(pendingKey);
            applyRemote(result.state);
          } else {
            retryAfterRequest = true;
          }
        } else {
          const response = await fetch(apiUrl, { cache: "no-store" });
          if (!response.ok) return;
          const result = (await response.json()) as {
            state: GamificationState;
            initialized: boolean;
            revision: number;
          };
          rememberServerVersion(result.state, result.revision);
          if (!dirty && result.initialized && JSON.stringify(getGamificationState(language)) !== JSON.stringify(result.state)) {
            applyRemote(result.state);
          } else if (dirty) {
            retryAfterRequest = true;
          }
        }
      } catch {
        // Mantém o cache local para tentar novamente quando a conexão voltar.
      } finally {
        inFlight = false;
        if (retryAfterRequest && dirty && ready && !disposed) scheduleSync();
      }
    }

    function scheduleSync() {
      if (syncTimer) clearTimeout(syncTimer);
      syncTimer = setTimeout(() => void syncNow(), 350);
    }

    function handleLocalUpdate(event?: Event) {
      const detail = (event as CustomEvent<GamificationChangeDetail> | undefined)?.detail;
      if (detail && detail.language !== language) return; // alteração de outro idioma
      if (applyingRemote) return;
      if (!ready) {
        setupChangedState = true;
        return;
      }
      dirty = true;
      pendingMode = "replace";
      localStorage.setItem(pendingKey, "1");
      scheduleSync();
    }

    window.addEventListener(GAMIFICATION_CHANGE_EVENT, handleLocalUpdate);

    void (async () => {
      try {
        const response = await fetch(apiUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("Gamification sync unavailable");
        const result = (await response.json()) as {
          state: GamificationState;
          initialized: boolean;
          revision: number;
        };
        if (disposed) return;
        rememberServerVersion(result.state, result.revision);

        const localState = setupChangedState ? getGamificationState(language) : localAtStart;
        const wasMigrated = localStorage.getItem(migrationKey) === "1";
        const hasPendingState = localStorage.getItem(pendingKey) === "1";
        const canMigrateState = canImportLegacy && hasProgress(localState, language);

        if (hasPendingState || setupChangedState || (!wasMigrated && canMigrateState)) {
          dirty = true;
          pendingMode = result.initialized ? "mergeLegacy" : "replace";
          localStorage.setItem(pendingKey, "1");
          ready = true;
          localStorage.setItem(accountKey, authenticatedEmail);
          localStorage.setItem(migrationKey, "1");
          await syncNow();
          return;
        }

        if (result.initialized) {
          applyRemote(result.state);
        } else if (accountAtStart && accountAtStart !== email) {
          applyRemote(getDefaultGamificationState(language));
        }

        localStorage.setItem(accountKey, authenticatedEmail);
        localStorage.setItem(migrationKey, "1");
        ready = true;
      } catch {
        if (disposed) return;
        ready = true;
        if (accountAtStart && accountAtStart !== authenticatedEmail) {
          applyRemote(getDefaultGamificationState(language));
        }
        const hasPendingState = localStorage.getItem(pendingKey) === "1";
        if (hasPendingState || (canImportLegacy && hasProgress(getGamificationState(language), language))) {
          dirty = true;
          pendingMode = localStorage.getItem(migrationKey) === "1" ? "replace" : "mergeLegacy";
          localStorage.setItem(pendingKey, "1");
        }
      }
    })();

    const interval = setInterval(() => void syncNow(), SYNC_INTERVAL_MS);
    const onFocus = () => void syncNow();
    const onOnline = () => void syncNow();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void syncNow();
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      if (syncTimer) clearTimeout(syncTimer);
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(GAMIFICATION_CHANGE_EVENT, handleLocalUpdate);
    };
  }
}

export function GamificationSync() {
  const { data: session, status } = useSession();
  const email = session?.user?.email?.toLowerCase().trim();

  useEffect(() => {
    if (status !== "authenticated" || !email) return;
    const stops = SYNCED_LANGUAGES.map((language) => startLanguageSync(language, email));
    return () => stops.forEach((stop) => stop());
  }, [email, status]);

  return null;
}
