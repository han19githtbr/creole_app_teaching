"use client";

import { useEffect, useState, useCallback } from "react";
import {
  GamificationState,
  getGamificationState,
  getLevelInfo,
  BADGES,
  LEVELS,
  HONORARY_TITLES,
  buyTitle as buyTitleUtil,
  equipTitle as equipTitleUtil,
  type Badge,
  type HonoraryTitle,
} from "@/lib/gamification";

export function useGamification() {
  const [state, setState] = useState<GamificationState>(() => getGamificationState());

  useEffect(() => {
    function handleUpdate(e: Event) {
      const customEvent = e as CustomEvent<GamificationState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      } else {
        setState(getGamificationState());
      }
    }

    function handleStorage(e: StorageEvent) {
      if (e.key === "kreyol:gamification-state") {
        setState(getGamificationState());
      }
    }

    window.addEventListener("kreyol:gamification-update", handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("kreyol:gamification-update", handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const levelInfo = getLevelInfo(state.xp);

  const unlockedBadgeList: Badge[] = BADGES.filter((b) =>
    state.unlockedBadges.includes(b.id)
  );

  const lockedBadgeList: Badge[] = BADGES.filter(
    (b) => !state.unlockedBadges.includes(b.id)
  );

  const activeTitle: HonoraryTitle =
    HONORARY_TITLES.find((t) => t.id === state.activeTitleId) || HONORARY_TITLES[0];

  const buyTitle = useCallback((titleId: string) => {
    const res = buyTitleUtil(titleId);
    if (res.success && res.state) {
      setState(res.state);
    }
    return res;
  }, []);

  const equipTitle = useCallback((titleId: string) => {
    const next = equipTitleUtil(titleId);
    setState(next);
  }, []);

  return {
    state,
    levelInfo,
    activeTitle,
    unlockedBadgeList,
    lockedBadgeList,
    allBadges: BADGES,
    allLevels: LEVELS,
    allTitles: HONORARY_TITLES,
    buyTitle,
    equipTitle,
  };
}
