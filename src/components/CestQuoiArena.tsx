"use client";

import { useState } from "react";
import { Crown, Eye, EyeOff, Loader2, Swords, Trophy, Users } from "lucide-react";
import { LEVELS, LEVEL_ORDER, isLevel, type Level } from "@/lib/cquoiLevels";
import type { ArenaBoard, ArenaDuel, ArenaInvite, ArenaOnlinePlayer, ArenaPerson, useCquoiArena } from "@/hooks/useCquoiArena";
import { soundEffects } from "@/lib/soundEffects";
import { cn } from "@/lib/utils";

type Tab = "ranking" | "online" | "duels";

function Avatar({ person, size = 36, online }: { person: ArenaPerson; size?: number; online?: boolean }) {
  const initial = (person.name.trim()[0] ?? "?").toUpperCase();
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      {person.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={person.image} alt="" referrerPolicy="no-referrer" className="h-full w-full rounded-full object-cover ring-2 ring-white shadow dark:ring-slate-700" />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-black text-white ring-2 ring-white shadow dark:ring-slate-700">{initial}</span>
      )}
      {online !== undefined && (
        <span className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--surface)]", online ? "bg-green-500" : "bg-slate-400")} aria-label={online ? "online" : "offline"} />
      )}
    </span>
  );
}

const MEDALS = ["🥇", "🥈", "🥉"];

const BOARD_LABEL: Record<"week" | "all", string> = { week: "Semana", all: "Geral" };

function levelChip(level: Level | null) {
  if (!level) return null;
  const cfg = LEVELS[level];
  return (
    <span className="rounded-full px-1.5 py-0.5 text-[10px] font-extrabold text-white" style={{ background: `linear-gradient(90deg, ${cfg.c1}, ${cfg.c2})` }}>
      {cfg.emoji} {cfg.short}
    </span>
  );
}

export function CestQuoiArena({
  arena,
  challengeLevel,
  busyId,
  notice,
  onChallenge,
  onAccept,
  onDecline,
  onPlayDuel,
  className,
}: {
  arena: ReturnType<typeof useCquoiArena>;
  /** Nível que será usado se o jogador desafiar alguém. */
  challengeLevel: Level;
  busyId?: string | null;
  notice?: { kind: "ok" | "error"; text: string } | null;
  onChallenge: (player: ArenaOnlinePlayer) => void;
  onAccept: (invite: ArenaInvite) => void;
  onDecline: (invite: ArenaInvite) => void;
  onPlayDuel: (duel: ArenaDuel) => void;
  className?: string;
}) {
  const { data, board, setBoard, visible, setVisible, offline } = arena;
  const [tab, setTab] = useState<Tab>("ranking");

  const online = data?.online ?? [];
  const duels = data?.duels ?? [];
  const incoming = data?.incoming ?? [];
  const activeDuels = duels.filter((d) => d.status === "accepted" || d.status === "pending").length;
  const inTop = data?.ranking.some((r) => r.isMe) ?? false;

  function pickTab(next: Tab) {
    soundEffects.playTap();
    setTab(next);
  }

  return (
    <section className={cn("cqa-card overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] text-left shadow-lg", className)} aria-label="Arena online">
      {/* cabeçalho */}
      <div className="cqa-head relative flex items-center justify-between gap-2 px-4 py-3 text-white">
        <div className="relative z-10 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 shadow-inner"><Trophy className="h-5 w-5" strokeWidth={2.6} /></span>
          <div>
            <p className="text-base font-black leading-tight">Arena online</p>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-50">
              <span className={cn("h-2 w-2 rounded-full", offline ? "bg-slate-300" : "cqa-live bg-green-400")} />
              {offline ? "Sem conexão" : data ? `${data.totalOnline} ${data.totalOnline === 1 ? "jogador online" : "jogadores online"}` : "Conectando…"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { soundEffects.playTap(); setVisible(!visible); }}
          className="relative z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1.5 text-[11px] font-extrabold hover:bg-white/30"
          aria-pressed={visible}
          title={visible ? "Você aparece como online para os outros jogadores" : "Você está invisível: não aparece na lista de online nem recebe desafios"}
        >
          {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {visible ? "Aparecendo" : "Invisível"}
        </button>
      </div>

      {/* convites recebidos */}
      {incoming.length > 0 && (
        <div className="space-y-2 border-b border-[var(--border)] bg-amber-500/10 p-3">
          {incoming.map((invite) => {
            const cfg = LEVELS[invite.level];
            return (
              <div key={invite.id} className="cqa-invite flex items-center gap-2.5 rounded-2xl border border-amber-400/60 bg-[var(--surface)] p-2.5 shadow">
                <Avatar person={invite.from} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-[var(--text)]">⚔️ {invite.from.name} te desafiou!</p>
                  <p className="text-[11px] font-semibold text-[var(--text-secondary)]">{cfg.emoji} {cfg.label} · {invite.rounds} imagens · mesmas imagens para os dois</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button type="button" onClick={() => onAccept(invite)} className="cursor-pointer rounded-lg border-b-2 border-green-800 bg-green-500 px-2.5 py-1 text-xs font-black text-white active:translate-y-[1px]">Aceitar</button>
                  <button type="button" onClick={() => onDecline(invite)} className="cursor-pointer rounded-lg border border-[var(--border)] px-2.5 py-1 text-[11px] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-2)]">Recusar</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {notice && (
        <p className={cn("px-4 py-2 text-xs font-bold", notice.kind === "ok" ? "bg-green-500/15 text-green-700 dark:text-green-300" : "bg-red-500/15 text-red-700 dark:text-red-300")} role="status">
          {notice.text}
        </p>
      )}

      {/* abas */}
      <div className="grid grid-cols-3 gap-1 border-b border-[var(--border)] bg-[var(--surface-2)] p-1.5" role="tablist">
        {([
          { id: "ranking" as const, label: "Ranking", icon: <Crown className="h-4 w-4" />, badge: 0 },
          { id: "online" as const, label: "Online", icon: <Users className="h-4 w-4" />, badge: online.length },
          { id: "duels" as const, label: "Duelos", icon: <Swords className="h-4 w-4" />, badge: activeDuels },
        ]).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => pickTab(t.id)}
            className={cn(
              "relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-extrabold transition-all active:scale-95",
              tab === t.id ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow" : "text-[var(--text-secondary)] hover:bg-[var(--surface)]"
            )}
          >
            {t.icon} {t.label}
            {t.badge > 0 && <span className={cn("rounded-full px-1.5 text-[10px] font-black", tab === t.id ? "bg-white/30 text-white" : "bg-[var(--accent)] text-white")}>{t.badge}</span>}
          </button>
        ))}
      </div>

      <div className="p-3">
        {/* ----------------- RANKING ----------------- */}
        {tab === "ranking" && (
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {(["week", "all"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => { soundEffects.playTap(); setBoard(b); }}
                  className={cn("cursor-pointer rounded-full border px-3 py-1 text-xs font-bold transition-all active:scale-95", board === b ? "border-indigo-500 bg-indigo-500 text-white" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]")}
                >
                  {BOARD_LABEL[b]}
                </button>
              ))}
              <select
                value={isLevel(board) ? board : ""}
                onChange={(e) => { const v = e.target.value; if (isLevel(v)) setBoard(v as ArenaBoard); }}
                className={cn("cursor-pointer rounded-full border px-2.5 py-1 text-xs font-bold", isLevel(board) ? "border-indigo-500 bg-indigo-500 text-white" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]")}
                aria-label="Ranking por nível (melhor partida)"
              >
                <option value="">Melhor partida por nível…</option>
                {LEVEL_ORDER.map((lv) => <option key={lv} value={lv}>{LEVELS[lv].emoji} {LEVELS[lv].label}</option>)}
              </select>
            </div>
            <p className="text-[11px] font-semibold text-[var(--text-muted)]">
              {board === "week" ? "Pontos somados nesta semana (reinicia na segunda-feira)." : board === "all" ? "Total de pontos de todas as partidas." : "Melhor pontuação em uma única partida neste nível."}
            </p>

            {!data ? (
              <p className="flex items-center justify-center gap-2 py-6 text-sm font-semibold text-[var(--text-muted)]"><Loader2 className="h-4 w-4 animate-spin" /> Carregando ranking…</p>
            ) : data.ranking.length === 0 ? (
              <div className="rounded-2xl bg-[var(--surface-2)] px-3 py-6 text-center">
                <p className="text-3xl" aria-hidden>🏁</p>
                <p className="mt-1 text-sm font-bold text-[var(--text)]">Ninguém pontuou ainda.</p>
                <p className="text-xs text-[var(--text-secondary)]">Termine uma partida para abrir o ranking!</p>
              </div>
            ) : (
              <ol className="space-y-1.5">
                {data.ranking.map((row, i) => (
                  <li
                    key={row.id}
                    style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
                    className={cn(
                      "cq2-opt-in flex items-center gap-2.5 rounded-2xl border px-2.5 py-2",
                      row.isMe ? "border-indigo-400 bg-indigo-500/10" : "border-[var(--border)] bg-[var(--surface)]",
                      row.rank === 1 && "cqa-gold"
                    )}
                  >
                    <span className="w-7 shrink-0 text-center text-lg font-black text-[var(--text-secondary)]">{row.rank <= 3 ? MEDALS[row.rank - 1] : `#${row.rank}`}</span>
                    <Avatar person={row} size={34} online={row.online} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-[var(--text)]">
                        {row.name} {row.isMe && <span className="ml-1 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-black text-white">você</span>}
                      </p>
                      <p className="text-[11px] font-semibold text-[var(--text-muted)]">
                        {row.games} {row.games === 1 ? "partida" : "partidas"}{row.duelWins > 0 && ` · ⚔️ ${row.duelWins} ${row.duelWins === 1 ? "vitória" : "vitórias"}`}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-xs font-black text-white shadow">{row.points} pts</span>
                  </li>
                ))}
              </ol>
            )}

            {data && !inTop && data.myRank && (
              <p className="rounded-2xl border border-indigo-400 bg-indigo-500/10 px-3 py-2 text-center text-xs font-extrabold text-[var(--text)]">
                Sua posição: #{data.myRank.rank} · {data.myRank.points} pts
              </p>
            )}
          </div>
        )}

        {/* ----------------- ONLINE ----------------- */}
        {tab === "online" && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-[var(--text-muted)]">
              Desafie alguém: vocês dois jogam as mesmas imagens ({LEVELS[challengeLevel].emoji} {LEVELS[challengeLevel].label}, nível escolhido acima) e vence quem fizer mais pontos.
            </p>
            {!visible && <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-300">Você está invisível: os outros não veem você aqui nem podem te desafiar.</p>}
            {online.length === 0 ? (
              <div className="rounded-2xl bg-[var(--surface-2)] px-3 py-6 text-center">
                <p className="text-3xl" aria-hidden>🌙</p>
                <p className="mt-1 text-sm font-bold text-[var(--text)]">Nenhum outro jogador online agora.</p>
                <p className="text-xs text-[var(--text-secondary)]">Chame um colega: a lista atualiza sozinha.</p>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {online.map((p) => {
                  const playing = p.status === "playing";
                  return (
                    <li key={p.id} className="cq2-opt-in flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2">
                      <Avatar person={p} size={38} online />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-[var(--text)]">{p.name}</p>
                        <p className="flex flex-wrap items-center gap-1 text-[11px] font-semibold text-[var(--text-muted)]">
                          {playing ? (
                            <>
                              <span className="cqa-live inline-block h-1.5 w-1.5 rounded-full bg-red-500" /> Jogando {levelChip(p.level)}
                              <span>· {p.score} pts · {p.round}/{p.total}</span>
                            </>
                          ) : (
                            <>🟢 No lobby</>
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={playing || busyId === p.id || !visible}
                        onClick={() => onChallenge(p)}
                        className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-xl border-b-4 border-purple-900 bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-3 py-1.5 text-xs font-black text-white shadow active:translate-y-[2px] active:border-b-2 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {busyId === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Swords className="h-3.5 w-3.5" />} Desafiar
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* ----------------- DUELOS ----------------- */}
        {tab === "duels" && (
          <div className="space-y-2">
            {duels.length === 0 ? (
              <div className="rounded-2xl bg-[var(--surface-2)] px-3 py-6 text-center">
                <p className="text-3xl" aria-hidden>⚔️</p>
                <p className="mt-1 text-sm font-bold text-[var(--text)]">Nenhum duelo nas últimas 24 horas.</p>
                <p className="text-xs text-[var(--text-secondary)]">Abra a aba Online e desafie um jogador.</p>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {duels.map((d) => {
                  const cfg = LEVELS[d.level];
                  const label =
                    d.result === "win" ? "🏆 Vitória" : d.result === "loss" ? "😢 Derrota" : d.result === "draw" ? "🤝 Empate" :
                    d.status === "pending" ? (d.iAmChallenger ? "⏳ Aguardando resposta" : "📨 Convite") :
                    d.canPlay ? "▶ Sua vez" : d.myScore !== null ? "⏳ Aguardando o adversário" : "🎮 Em andamento";
                  return (
                    <li key={d.id} className={cn("cq2-opt-in flex items-center gap-2.5 rounded-2xl border px-2.5 py-2", d.result === "win" ? "border-green-400 bg-green-500/10" : d.result === "loss" ? "border-red-300 bg-red-500/5" : "border-[var(--border)] bg-[var(--surface)]")}>
                      <Avatar person={d.opponent} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-[var(--text)]">vs {d.opponent.name}</p>
                        <p className="text-[11px] font-semibold text-[var(--text-muted)]">{cfg.emoji} {cfg.short} · {label}</p>
                      </div>
                      {d.myScore !== null ? (
                        <span className="shrink-0 rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-xs font-black tabular-nums text-[var(--text)]">{d.myScore} × {d.theirScore ?? "…"}</span>
                      ) : null}
                      {d.canPlay && (
                        <button type="button" onClick={() => onPlayDuel(d)} className="shrink-0 cursor-pointer rounded-xl border-b-4 border-green-800 bg-green-500 px-3 py-1.5 text-xs font-black text-white active:translate-y-[2px] active:border-b-2">Jogar</button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
