"use client";

import { useEffect, useState, useCallback } from "react";
import {
  GamificationState,
  getGamificationState,
  getLevelInfo,
  BADGES,
  LEVELS,
  type Badge,
  type LevelInfo,
} from "@/lib/gamification";

export function useGamification() {
  const [state, setState] = useState<GamificationState>(() => getGamificationState());

  useEffect(() => {
    // Sincroniza inicial
    setState(getGamificationState());

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

  return {
    state,
    levelInfo,
    unlockedBadgeList,
    lockedBadgeList,
    allBadges: BADGES,
    allLevels: LEVELS,
  };
}
