"use client";

import { useEffect, useState, useCallback } from "react";
import {
  GAMIFICATION_CHANGE_EVENT,
  gamificationStorageKey,
  getDefaultGamificationState,
  getGamificationConfig,
  getGamificationState,
  getLevelInfo,
  buyTitle as buyTitleUtil,
  equipTitle as equipTitleUtil,
  type Badge,
  type GamificationChangeDetail,
  type GamificationState,
  type HonoraryTitle,
} from "@/lib/gamification";
import type { AppLanguage } from "@/lib/languageShared";

/**
 * Progresso (XP, moeda, conquistas, níveis e títulos) do idioma informado.
 * Cada idioma tem o seu próprio progresso — o do Kreyòl nunca aparece no
 * painel do Français e vice-versa.
 */
export function useGamification(language: AppLanguage = "kreyol") {
  const [state, setState] = useState<GamificationState>(() => getGamificationState(language));
  const [stateLanguage, setStateLanguage] = useState<AppLanguage>(language);

  // Trocou de idioma: carrega o progresso do outro idioma.
  if (stateLanguage !== language) {
    setStateLanguage(language);
    setState(getGamificationState(language));
  }

  useEffect(() => {
    function handleUpdate(e: Event) {
      const detail = (e as CustomEvent<GamificationChangeDetail>).detail;
      if (detail && detail.language !== language) return;
      setState(detail?.state ?? getGamificationState(language));
    }

    function handleStorage(e: StorageEvent) {
      if (e.key === gamificationStorageKey(language)) {
        setState(getGamificationState(language));
      }
    }

    window.addEventListener(GAMIFICATION_CHANGE_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(GAMIFICATION_CHANGE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [language]);

  const config = getGamificationConfig(language);
  const safeState = stateLanguage === language ? state : getDefaultGamificationState(language);
  const levelInfo = getLevelInfo(safeState.xp, language);

  const unlockedBadgeList: Badge[] = config.badges.filter((b) =>
    safeState.unlockedBadges.includes(b.id)
  );

  const lockedBadgeList: Badge[] = config.badges.filter(
    (b) => !safeState.unlockedBadges.includes(b.id)
  );

  const activeTitle: HonoraryTitle =
    config.titles.find((t) => t.id === safeState.activeTitleId) || config.titles[0];

  const buyTitle = useCallback(
    (titleId: string) => {
      const res = buyTitleUtil(titleId, language);
      if (res.success && res.state) {
        setState(res.state);
      }
      return res;
    },
    [language]
  );

  const equipTitle = useCallback(
    (titleId: string) => {
      const next = equipTitleUtil(titleId, language);
      setState(next);
    },
    [language]
  );

  return {
    language,
    config,
    state: safeState,
    levelInfo,
    activeTitle,
    unlockedBadgeList,
    lockedBadgeList,
    allBadges: config.badges,
    allLevels: config.levels,
    allTitles: config.titles,
    buyTitle,
    equipTitle,
  };
}
