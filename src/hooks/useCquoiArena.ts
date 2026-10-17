"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Level } from "@/lib/cquoiLevels";

export type ArenaBoard = "week" | "all" | Level;

export interface ArenaPerson {
  id: string;
  name: string;
  image: string | null;
}
export interface ArenaOnlinePlayer extends ArenaPerson {
  status: "lobby" | "playing";
  level: Level | null;
  score: number;
  round: number;
  total: number;
}
export interface ArenaRankRow extends ArenaPerson {
  rank: number;
  points: number;
  games: number;
  duelWins: number;
  online: boolean;
  isMe: boolean;
}
export interface ArenaInvite {
  id: string;
  from: ArenaPerson;
  level: Level;
  themeId: string;
  rounds: number;
  createdAt: string;
}
export interface ArenaDuel {
  id: string;
  opponent: ArenaPerson;
  level: Level;
  status: "pending" | "accepted" | "declined" | "finished";
  iAmChallenger: boolean;
  myScore: number | null;
  theirScore: number | null;
  result: "win" | "loss" | "draw" | null;
  canPlay: boolean;
}
export interface ArenaData {
  me: { id: string; visible: boolean };
  board: ArenaBoard;
  weekKey: string;
  totalOnline: number;
  online: ArenaOnlinePlayer[];
  ranking: ArenaRankRow[];
  myRank: { rank: number; points: number } | null;
  incoming: ArenaInvite[];
  duels: ArenaDuel[];
}

export interface ArenaPresence {
  status: "lobby" | "playing";
  level: Level | null;
  score: number;
  round: number;
  total: number;
}

export interface DuelConfig {
  id: string;
  level: Level;
  themeId: string;
  itemIds: string[];
}
export interface DuelOutcome {
  id: string;
  status: string;
  myScore: number;
  theirScore: number | null;
  result: "win" | "loss" | "draw" | null;
}

const VISIBLE_KEY = "cquoi:visible:v1";
const LOBBY_EVERY_MS = 20_000;
const PLAYING_EVERY_MS = 15_000;
const URL = "/api/cquoi/arena";

async function post(body: Record<string, unknown>): Promise<{ ok: boolean; status: number; json: Record<string, unknown> }> {
  try {
    const res = await fetch(URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: res.ok, status: res.status, json };
  } catch {
    return { ok: false, status: 0, json: { error: "Sem conexão com o servidor." } };
  }
}

/**
 * Presença online + ranking + duelos do "C'est quoi ?".
 * Manda um "batimento" ao servidor (a cada 8 s no lobby e 15 s jogando) que marca o jogador como online
 * e devolve o painel já atualizado: quem está online, ranking e convites de duelo.
 */
export function useCquoiArena(presence: ArenaPresence) {
  const [data, setData] = useState<ArenaData | null>(null);
  const [board, setBoardState] = useState<ArenaBoard>("week");
  const [visible, setVisibleState] = useState(true);
  const [offline, setOffline] = useState(false);

  const presenceRef = useRef(presence);
  const boardRef = useRef(board);
  const visibleRef = useRef(true);
  const lastBeat = useRef(0);
  const beating = useRef(false);

  useEffect(() => {
    presenceRef.current = presence;
  }, [presence]);

  // preferência "aparecer online" guardada neste navegador
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VISIBLE_KEY);
      if (saved === "0") {
        visibleRef.current = false;
        window.setTimeout(() => setVisibleState(false), 0);
      }
    } catch {
      // sem armazenamento: usa o padrão (visível)
    }
  }, []);

  const beat = useCallback(async () => {
    if (beating.current) return;
    beating.current = true;
    lastBeat.current = Date.now();
    const p = presenceRef.current;
    const res = await post({
      action: "heartbeat",
      status: p.status,
      level: p.level,
      score: p.score,
      round: p.round,
      total: p.total,
      visible: visibleRef.current,
      board: boardRef.current,
    });
    beating.current = false;
    if (res.ok) {
      setOffline(false);
      setData(res.json as unknown as ArenaData);
    } else {
      setOffline(true);
    }
  }, []);

  // batimento periódico (pausa quando a aba está escondida)
  useEffect(() => {
    void beat();
    const id = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      const every = presenceRef.current.status === "playing" ? PLAYING_EVERY_MS : LOBBY_EVERY_MS;
      if (Date.now() - lastBeat.current >= every - 500) void beat();
    }, 2_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void beat();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [beat]);

  // mudou de fase/rodada: avisa na hora (no máximo 1 vez a cada 3 s)
  useEffect(() => {
    const wait = Math.max(0, 3_000 - (Date.now() - lastBeat.current));
    const id = window.setTimeout(() => void beat(), wait);
    return () => window.clearTimeout(id);
  }, [presence.status, presence.level, presence.round, beat]);

  // ao sair da página, some da lista de online
  useEffect(() => {
    const leave = () => {
      try {
        navigator.sendBeacon(URL, new Blob([JSON.stringify({ action: "leave" })], { type: "application/json" }));
      } catch {
        // ignora
      }
    };
    window.addEventListener("pagehide", leave);
    return () => {
      window.removeEventListener("pagehide", leave);
      leave();
    };
  }, []);

  const setBoard = useCallback(
    (next: ArenaBoard) => {
      boardRef.current = next;
      setBoardState(next);
      void beat();
    },
    [beat]
  );

  const setVisible = useCallback(
    (next: boolean) => {
      visibleRef.current = next;
      setVisibleState(next);
      try {
        window.localStorage.setItem(VISIBLE_KEY, next ? "1" : "0");
      } catch {
        // ignora
      }
      void beat();
    },
    [beat]
  );

  /** Convida um jogador online para jogar as mesmas imagens. Devolve o id do desafio ou a mensagem de erro. */
  const challenge = useCallback(
    async (to: string, level: Level, themeId: string, itemIds: string[]): Promise<{ id?: string; error?: string }> => {
      const res = await post({ action: "challenge", to, level, themeId, itemIds });
      if (res.ok) return { id: String(res.json.challengeId) };
      return { error: String(res.json.error ?? "Não foi possível enviar o desafio.") };
    },
    []
  );

  /** Aceita (ou recusa) um desafio. Ao aceitar, devolve as imagens que os dois vão jogar. */
  const respond = useCallback(
    async (id: string, accept: boolean): Promise<{ config?: DuelConfig; error?: string }> => {
      const res = await post({ action: "respond", id, accept, board: boardRef.current });
      void beat();
      if (!res.ok) return { error: String(res.json.error ?? "Não foi possível responder ao desafio.") };
      return { config: (res.json.challenge as DuelConfig | undefined) ?? undefined };
    },
    [beat]
  );

  /** Envia o resultado da partida ao ranking (e ao duelo, quando houver). */
  const submitScore = useCallback(
    async (payload: { level: Level; score: number; hits: number; total: number; challengeId?: string | null }): Promise<{ duel: DuelOutcome | null; error?: string }> => {
      const res = await post({ action: "score", ...payload, challengeId: payload.challengeId ?? undefined, board: boardRef.current });
      if (!res.ok) return { duel: null, error: String(res.json.error ?? "Não foi possível enviar a pontuação.") };
      if (res.json.arena) setData(res.json.arena as ArenaData);
      return { duel: (res.json.duel as DuelOutcome | null) ?? null };
    },
    []
  );

  return { data, board, setBoard, visible, setVisible, offline, refresh: beat, challenge, respond, submitScore };
}
