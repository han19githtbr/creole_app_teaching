/**
 * Motor de geração de vídeos demonstrativos da "Trilha do Aluno Curioso"
 * para Instagram (Stories, Reels e Feed) e Facebook.
 *
 * Renderiza quadro a quadro (função pura do tempo `t`) na resolução nativa (1080x1920,
 * 1080x1350 ou 1080x1080) com a sequência de jogo completa: o aluno caminha até cada objeto,
 * observa a cena com a seta, escolhe entre alternativas, acerta e avança pela trilha.
 * Usa a MESMA arte da mata, a mesma câmera, o mesmo clima, os mesmos bichos (motor de fauna do jogo)
 * e a mesma avalanche do jogo, refletindo 100% a dinâmica e o visual real da aplicação.
 * No nível 7 o aluno entra feliz na casinha do cume e comemora com balão festivo e confetes.
 */
import {
  DEMO_FORMATS,
  type DemoFormat,
} from "@/lib/gameDemoVideo";
import type { SocialPlatform } from "@/lib/socialLinks";
import type { TrailObjectImages } from "@/lib/curiousTrailObjectImages";
import {
  TRAIL_LEVELS,
  TRAIL_THEMES,
  type TrailLevelConfig,
  type TrailThemeOption,
  type TrailWeather,
} from "@/lib/curiousTrailData";
import { buildWordOptions, type CestQuoiItem } from "@/lib/cquoiContent";
import {
  CAMP_FRACS,
  MARKER_FRACS,
  WORLD_W,
  WORLD_H,
  HUT_DOOR,
  HUT_POSITION,
  getTrailPositionAtFraction,
} from "@/lib/curiousTrailGeometry";
import {
  makeAvalancheTrack,
  initAvalanche,
  stepAvalanche,
  studentFractionAt,
  applyAnswerToAvalanche,
  clampAvalancheGap,
  avalancheDanger,
  avalancheAlert,
  avalancheDistanceMeters,
  avalancheShake,
  drawAvalanche,
  type AvalancheLevel,
} from "@/lib/trailAvalanche";

export type TrailDemoDifficulty = "easy" | "intermediate" | "master" | "native" | "avalanche";
export type AttemptMode = "mixed" | "always" | "never";

const TRAIL_DEMO_DIFFICULTY: Record<TrailDemoDifficulty, { seconds: number; multiplier: number }> = {
  easy: { seconds: 20, multiplier: 1 },
  intermediate: { seconds: 15, multiplier: 1.5 },
  master: { seconds: 10, multiplier: 2 },
  native: { seconds: 6, multiplier: 2.5 },
  avalanche: { seconds: 12, multiplier: 3 },
};

export interface TrailDemoSettings {
  title: string;
  themeId: string;
  levels: number[]; // níveis da montanha incluídos na sequência do vídeo
  difficulty: TrailDemoDifficulty;
  attempts: AttemptMode;
  format: DemoFormat;
  showIntro: boolean;
  showOutro: boolean;
  sound: boolean;
  cta: string;
  platform: SocialPlatform;
  handle: string;
}

export const DEFAULT_TRAIL_DEMO_SETTINGS: TrailDemoSettings = {
  title: "Trilha do Aluno Curioso 🇫🇷\nSuba a montanha e aprenda francês!",
  themeId: "gastronomia",
  levels: [4], // Nível 4 demonstra a transição com chuva e guarda-chuva!
  difficulty: "intermediate",
  attempts: "mixed",
  format: "story",
  showIntro: true,
  showOutro: true,
  sound: true,
  cta: "Jogue a trilha grátis na plataforma",
  platform: "instagram",
  handle: "frances_com_tres_nativos",
};

export interface TrailDemoRound {
  item: CestQuoiItem;
  options: string[];
  correctIndex: number;
  wrongIndex: number | null;
  levelCfg: TrailLevelConfig;
  start: number;
  wrongAt: number | null;
  correctAt: number;
  walkEnd: number;
  end: number;
  scoreBefore: number;
  scoreAfter: number;
  xpAfter: number;
  bonusText: string | null;
  roundIndex: number;
  roundCount: number;
  segmentStart: number;
  segmentEnd: number;
}

export interface TrailDemoAvalanche {
  level: number;
  start: number;
  end: number;
  dt: number;
  active: boolean[];
  front: number[];
  danger: number[];
  meters: number[];
  alert: AvalancheLevel[];
  /** O vídeo é uma demonstração: o tempo da avalanche corre mais rápido que no jogo (mesma física). */
  timeScale: number;
}

export interface TrailDemoLevelTransition {
  level: number;
  nextLevel: number;
  start: number;
  end: number;
  levelCfg: TrailLevelConfig;
  nextLevelCfg: TrailLevelConfig;
  score: number;
  xp: number;
  isFinal?: boolean;
}

export interface TrailDemoPlan {
  settings: TrailDemoSettings;
  theme: TrailThemeOption;
  rounds: TrailDemoRound[];
  levelCfg: TrailLevelConfig;
  introDur: number;
  countdownDur: number;
  /** duração da cena final em que o aluno entra feliz na casinha (nível 7) */
  houseDur: number;
  /** transições entre níveis com o modal TrailLevelCompleteOverlay */
  levelTransitions: TrailDemoLevelTransition[];
  /** linha do tempo da avalanche (modo avalanche), amostrada a 30 quadros/s */
  avalanche: TrailDemoAvalanche[];
  levels: TrailLevelConfig[];
  outroStart: number;
  outroDur: number;
  total: number;
  finalScore: number;
  finalXp: number;
}

export function buildTrailDemoPlan(
  items: CestQuoiItem[],
  settings: TrailDemoSettings
): TrailDemoPlan {
  const theme = TRAIL_THEMES.find((t) => t.id === settings.themeId) || TRAIL_THEMES[0];
  const selectedLevels = [...new Set(settings.levels)].filter((level) => TRAIL_LEVELS.some((cfg) => cfg.level === level)).sort((a, b) => a - b);
  if (!selectedLevels.length) selectedLevels.push(4);
  const levels = selectedLevels.map((level) => TRAIL_LEVELS.find((cfg) => cfg.level === level)!).filter(Boolean);
  const levelCfg = levels[0] || TRAIL_LEVELS[3];

  const introDur = settings.showIntro ? 2.8 : 0;
  const countdownDur = 2.4;
  const themePool = items.filter((item) => item.themeId === settings.themeId);
  const pool = themePool.length ? themePool : items;

  const walkDur = 1.7;
  const difficulty = TRAIL_DEMO_DIFFICULTY[settings.difficulty];
  const isAvalanche = settings.difficulty === "avalanche";
  const startAt = introDur + countdownDur;
  let cursor = startAt;
  let score = 0;
  let xp = 0;
  const roundsByLevel: TrailDemoRound[][] = [];
  const levelTransitions: TrailDemoLevelTransition[] = [];
  const usedItemIds = new Set<string>();
  let think = 5.8;

  for (let order = 0; order < levels.length; order++) {
    const cfg = levels[order];
    if (order > 0) {
      // Transição entre níveis exibindo o TrailLevelCompleteOverlay
      const prevCfg = levels[order - 1];
      const transStart = cursor;
      const transDur = 2.2;
      cursor += transDur;
      levelTransitions.push({
        level: prevCfg.level,
        nextLevel: cfg.level,
        start: transStart,
        end: cursor,
        levelCfg: prevCfg,
        nextLevelCfg: cfg,
        score,
        xp,
      });
      // Pequena contagem preparatória para o novo nível
      cursor += 1.4;
    }

    const segmentStart = CAMP_FRACS[order === 0 ? cfg.level - 1 : levels[order - 1].level];
    const segmentEnd = CAMP_FRACS[cfg.level];
    const levelStartTime = cursor;
    const levelScoreBefore = score;
    const levelXpBefore = xp;
    const fresh = shuffle(pool.filter((item) => !usedItemIds.has(item.id)));
    const picked = [...fresh.slice(0, cfg.elementCount)];
    while (picked.length < cfg.elementCount && pool.length) picked.push(...shuffle(pool).slice(0, cfg.elementCount - picked.length));
    picked.forEach((item) => usedItemIds.add(item.id));

    const buildLevelRounds = (answerDur: number) => picked.map((item, roundIndex) => {
      const start = cursor;
      const isHard = settings.difficulty === "master" || settings.difficulty === "native" || isAvalanche;
      const opts = buildWordOptions(item, items, isHard);
      const correctIndex = opts.indexOf(item.fr);
      const wrongs = opts.map((_, i) => i).filter((i) => i !== correctIndex);

      // Decisão de tentativa errada com base em settings.attempts
      const shouldAttemptWrong =
        settings.attempts === "always" ||
        (settings.attempts === "mixed" && (order + roundIndex) % 2 === 1);

      const hasWrong = shouldAttemptWrong && wrongs.length > 0;
      const wrongIndex = hasWrong ? wrongs[(roundIndex + order) % wrongs.length] : null;

      let wrongAt: number | null = null;
      let correctAt = start + answerDur;
      let bonusText: string | null = null;
      const scoreBefore = score;

      if (hasWrong) {
        // Primeira tentativa errada (o aluno hesita, escolhe a errada, ela treme/risca, entra o retry)
        const thinkWrong = isAvalanche ? Math.max(1.8, answerDur * 0.45) : Math.min(1.8, difficulty.seconds * 0.28);
        const retryThink = isAvalanche ? Math.max(1.6, answerDur * 0.45) : Math.min(1.8, difficulty.seconds * 0.25);
        wrongAt = start + thinkWrong;
        correctAt = wrongAt + retryThink;
        // Na 2ª tentativa ganha pontuação normal sem bônus relâmpago
        score += Math.round(75 * difficulty.multiplier);
        xp += Math.round((cfg.xpBase / cfg.elementCount) * difficulty.multiplier);
        bonusText = null;
      } else {
        // Acerto direto na 1ª tentativa
        const speedRatio = Math.max(0, (difficulty.seconds - answerDur) / difficulty.seconds);
        const speedMultiplier = speedRatio >= 0.65 ? 1.5 : speedRatio >= 0.35 ? 1.25 : 1.1;
        score += Math.round(100 * difficulty.multiplier * speedMultiplier);
        xp += Math.round((cfg.xpBase / cfg.elementCount) * difficulty.multiplier * speedMultiplier);
        bonusText = speedRatio >= 0.65 ? "⚡ Relâmpago! +50% XP" : speedRatio >= 0.35 ? "🚀 Ágil! +25% XP" : "✨ Muito bem! +10% XP";
      }

      const walkEnd = correctAt + walkDur;
      const end = walkEnd;
      cursor = end;

      return {
        item,
        options: opts,
        correctIndex,
        wrongIndex,
        levelCfg: cfg,
        start,
        wrongAt,
        correctAt,
        walkEnd,
        end,
        scoreBefore,
        scoreAfter: score,
        xpAfter: xp,
        bonusText,
        roundIndex,
        roundCount: picked.length,
        segmentStart,
        segmentEnd,
      };
    });

    let levelRounds = buildLevelRounds(isAvalanche ? think : 2.4);
    if (isAvalanche) {
      for (let attempt = 0; attempt < 8; attempt++) {
        const sim = simulateAvalancheTimeline(levelRounds, cfg, cfg.level, levelRounds[0]?.start ?? cursor);
        if (sim.minGapElements >= 0.6) break;
        think = Math.max(3, think - 0.5);
        cursor = levelStartTime;
        score = levelScoreBefore;
        xp = levelXpBefore;
        levelRounds = buildLevelRounds(think);
      }
    }
    roundsByLevel.push(levelRounds);
  }

  const rounds = roundsByLevel.flat();
  const avalanche = isAvalanche ? roundsByLevel.map((levelRounds) => {
    const cfg = levelRounds[0]?.levelCfg;
    return cfg ? simulateAvalancheTimeline(levelRounds, cfg, cfg.level, levelRounds[0].start).timeline : null;
  }).filter((timeline): timeline is TrailDemoAvalanche => Boolean(timeline)) : [];

  score = rounds.at(-1)?.scoreAfter ?? 0;
  xp = rounds.at(-1)?.xpAfter ?? 0;
  const lastLevelCfg = levels.at(-1);
  const isFinalSummit = lastLevelCfg?.level === 7;
  if (lastLevelCfg && !isFinalSummit) {
    const finalTransDur = 3.2;
    levelTransitions.push({
      level: lastLevelCfg.level,
      nextLevel: Math.min(7, lastLevelCfg.level + 1),
      start: cursor,
      end: cursor + finalTransDur,
      levelCfg: lastLevelCfg,
      nextLevelCfg: TRAIL_LEVELS.find((l) => l.level === lastLevelCfg.level + 1) ?? lastLevelCfg,
      score,
      xp,
      isFinal: true,
    });
    cursor += finalTransDur;
  }
  const houseDur = isFinalSummit ? 7.5 : 0;
  if (isFinalSummit) {
    cursor += houseDur;
  }
  const outroStart = cursor;
  const outroDur = settings.showOutro ? 3.4 : 0;
  const total = outroStart + outroDur;

  return {
    settings,
    theme,
    rounds,
    levelCfg,
    levels,
    introDur,
    countdownDur,
    houseDur,
    levelTransitions,
    avalanche,
    outroStart,
    outroDur,
    total,
    finalScore: score,
    finalXp: xp,
  };
}

/**
 * Sintetiza a trilha sonora de efeitos sonoros em PCM 32-bit float a 48000 Hz:
 * - Tiques 3-2-1 da contagem regressiva e tiques de urgência nos últimos segundos.
 * - Whoosh de início da escalada.
 * - Som de erro quando há tentativa errada (buzz em dente de serra).
 * - Chime brilhante de 3 harmônicos ao acertar (idêntico ao soundEffects.playSuccess).
 * - Fanfarra de streak a cada 3 acertos.
 * - Acordes de subida de nível em cada transição (TrailLevelCompleteOverlay).
 * - Fanfarra triunfal e sinos festivos da vitória ao chegar na cabana do cume (Nível 7).
 */
export function synthTrailDemoSfx(plan: TrailDemoPlan, sampleRate = 48000): Float32Array {
  const length = Math.ceil((plan.total + 0.6) * sampleRate);
  const pcm = new Float32Array(length);

  const add = (start: number, dur: number, vol: number, fn: (x: number, i: number) => number) => {
    const from = Math.floor(start * sampleRate);
    const n = Math.floor(dur * sampleRate);
    for (let i = 0; i < n && from + i < length; i++) {
      const x = i / sampleRate;
      pcm[from + i] += fn(x, i) * vol;
    }
  };
  const env = (x: number, dur: number, attack = 0.003) =>
    Math.min(1, x / attack) * Math.pow(Math.max(0, 1 - x / dur), 2);
  let seed = 42;
  const noise = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed / 2147483647) * 2 - 1;
  };

  // 1. Contagem regressiva inicial
  if (plan.countdownDur > 0) {
    const cdStep = plan.countdownDur / 3;
    for (let c = 0; c < 3; c++) {
      const tTick = plan.introDur + c * cdStep;
      add(tTick, 0.05, 0.22, (x) => Math.sin(2 * Math.PI * 1800 * x) * env(x, 0.05, 0.001));
    }
    const tWhoosh = plan.introDur + plan.countdownDur;
    let lp = 0;
    add(tWhoosh, 0.45, 0.24, (x) => {
      const a = 0.04 + 0.5 * Math.sin(Math.PI * Math.min(1, x / 0.45));
      lp += (noise() - lp) * a;
      return lp * Math.sin(Math.PI * Math.min(1, x / 0.45));
    });
  }

  // 2. Rodadas do jogo
  let streakCounter = 0;
  for (const r of plan.rounds) {
    // Tiques nos últimos 2 segundos da tentativa
    if (plan.settings.difficulty !== "avalanche") {
      const endThink = r.wrongAt ?? r.correctAt;
      const t1 = endThink - 2.0;
      const t2 = endThink - 1.0;
      if (t1 > r.start) add(t1, 0.04, 0.14, (x) => Math.sin(2 * Math.PI * 1900 * x) * env(x, 0.04, 0.001));
      if (t2 > r.start) add(t2, 0.04, 0.16, (x) => Math.sin(2 * Math.PI * 1900 * x) * env(x, 0.04, 0.001));
    }

    // Erro (se houver tentativa errada)
    if (r.wrongAt != null) {
      streakCounter = 0;
      add(r.wrongAt, 0.32, 0.24, (x) => {
        const s1 = 2 * ((x * 140) % 1) - 1;
        const s2 = 2 * ((x * 148) % 1) - 1;
        return (s1 + s2) * 0.5 * env(x, 0.32, 0.006);
      });
    }

    // Acerto! Ding luminoso 3-harmônico
    streakCounter++;
    [1046.5, 1318.5, 1568].forEach((f, i) => {
      add(r.correctAt + i * 0.075, 0.7, 0.22, (x) =>
        (Math.sin(2 * Math.PI * f * x) + 0.28 * Math.sin(2 * Math.PI * f * 2 * x)) * env(x, 0.7, 0.003)
      );
    });

    // Bônus streak a cada 3 acertos
    if (streakCounter % 3 === 0) {
      [1174.66, 1318.51, 1567.98, 1760.0].forEach((f, i) => {
        add(r.correctAt + 0.24 + i * 0.06, 0.55, 0.18, (x) =>
          Math.sin(2 * Math.PI * f * x) * env(x, 0.55, 0.004)
        );
      });
    }
  }

  // 3. Conclusão de nível
  for (const tr of plan.levelTransitions) {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      add(tr.start + i * 0.1, 0.9, 0.25, (x) =>
        (Math.sin(2 * Math.PI * f * x) + 0.3 * Math.sin(2 * Math.PI * f * 2 * x)) * env(x, 0.9, 0.005)
      );
    });
  }

  // 4. Vitória no Cume (Nível 7)
  const isFinalSummit = plan.levels.at(-1)?.level === 7;
  if (isFinalSummit) {
    const endT = plan.rounds.at(-1)?.end ?? 0;
    const fArrival = endT + 1.8;
    [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568.0].forEach((f, i) => {
      add(fArrival + i * 0.11, 1.2, 0.28, (x) =>
        (Math.sin(2 * Math.PI * f * x) + 0.25 * Math.sin(2 * Math.PI * f * 2 * x)) * env(x, 1.2, 0.004)
      );
    });
    const fOverlay = endT + 3.8;
    [1568.0, 1760.0, 2093.0].forEach((f, i) => {
      add(fOverlay + i * 0.09, 0.8, 0.22, (x) =>
        Math.sin(2 * Math.PI * f * x) * env(x, 0.8, 0.002)
      );
    });
  }

  // Normalização anti-clipping
  let maxAmp = 0;
  for (let i = 0; i < length; i++) {
    const a = Math.abs(pcm[i]);
    if (a > maxAmp) maxAmp = a;
  }
  if (maxAmp > 0.95) {
    const scale = 0.95 / maxAmp;
    for (let i = 0; i < length; i++) pcm[i] *= scale;
  }

  return pcm;
}


/* ------------------------------------------------------------------ avalanche, aluno e câmera (compartilhados) */

const AV_DT = 1 / 30;
const AVALANCHE_DEMO_TIME_SCALE = 3;

/**
 * Simula a avalanche com a MESMA física do jogo (trailAvalanche.ts) ao longo das rodadas do vídeo:
 * corre enquanto o aluno pensa e durante erros, desacelera na comemoração e recua a cada acerto.
 */
function simulateAvalancheTimeline(
  rounds: TrailDemoRound[],
  levelCfg: TrailLevelConfig,
  level: number,
  startAt: number
): { timeline: TrailDemoAvalanche; minGapElements: number } {
  const track = makeAvalancheTrack(rounds[0]?.segmentStart ?? CAMP_FRACS[level - 1], rounds[0]?.segmentEnd ?? CAMP_FRACS[level], levelCfg.elementCount, level);
  const st = initAvalanche(track);
  const endT = rounds.at(-1)?.end ?? startAt;
  const total = endT + 6;
  const timeline: TrailDemoAvalanche = { level, start: startAt, end: endT, dt: AV_DT, active: [], front: [], danger: [], meters: [], alert: [], timeScale: AVALANCHE_DEMO_TIME_SCALE };
  const recoiled = new Set<number>();
  let minGap = Infinity;

  for (let i = 0; i * AV_DT <= total; i++) {
    const tt = i * AV_DT;
    const ri = rounds.findIndex((r) => tt >= r.start && tt < r.end);
    const index = ri >= 0 ? ri : tt >= endT ? rounds.length : 0;
    if (tt >= startAt && tt < endT && ri >= 0) {
      const r = rounds[ri];
      if (tt >= r.correctAt && !recoiled.has(ri)) {
        recoiled.add(ri);
        applyAnswerToAvalanche(st, track, r.wrongIndex != null ? "retry" : "first");
        clampAvalancheGap(st, track, studentFractionAt(track, ri, false));
      }
      const sf = studentFractionAt(track, ri, false);
      stepAvalanche(st, AV_DT * AVALANCHE_DEMO_TIME_SCALE, track, sf, tt >= r.correctAt);
      minGap = Math.min(minGap, (sf - st.front) / track.spacing);
    }
    const sfNow = studentFractionAt(track, Math.min(index, rounds.length - 1), tt >= endT);
    timeline.active.push(tt >= startAt && tt < endT);
    timeline.front.push(st.front);
    timeline.danger.push(avalancheDanger(st, track, sfNow));
    timeline.meters.push(avalancheDistanceMeters(st, sfNow));
    timeline.alert.push(avalancheAlert(st, track, sfNow));
  }
  return { timeline, minGapElements: st.caught ? 0 : minGap };
}

export function trailAvalancheAt(plan: TrailDemoPlan, t: number) {
  const av = plan.avalanche.find((segment) => t >= segment.start && t < segment.end);
  if (!av) return null;
  const f = Math.max(0, t) / av.dt;
  const i = Math.min(av.front.length - 2, Math.floor(f));
  const k = Math.min(1, f - i);
  if (i < 0) return null;
  const lerp = (arr: number[]) => arr[i] + (arr[i + 1] - arr[i]) * k;
  return { active: av.active[i], front: lerp(av.front), danger: lerp(av.danger), meters: Math.round(lerp(av.meters)), alert: av.alert[i] };
}

/** Fração da trilha em que o aluno está (visual) no instante `t`. */
export function trailStudentFraction(plan: TrailDemoPlan, t: number): number {
  const ri = plan.rounds.findIndex((entry) => t >= entry.start && t < entry.end);
  if (ri >= 0) {
    const r = plan.rounds[ri];
    const elementFraction = (index: number) => r.segmentStart + ((r.segmentEnd - r.segmentStart) * (index + 1)) / (r.roundCount + 1);
    const from = r.roundIndex === 0 ? r.segmentStart : elementFraction(r.roundIndex - 1);
    const to = r.roundIndex === r.roundCount - 1 ? r.segmentEnd : elementFraction(r.roundIndex);
    const walking = t >= r.correctAt;
    const p = walking ? easeOut((t - r.correctAt) / (r.walkEnd - r.correctAt)) : 0;
    return from + (to - from) * p;
  }
  const previous = [...plan.rounds].reverse().find((entry) => t >= entry.end);
  return previous ? previous.segmentEnd : plan.rounds[0]?.segmentStart ?? CAMP_FRACS[0];
}

export function trailLevelForTime(plan: TrailDemoPlan, t: number): TrailLevelConfig {
  const active = plan.rounds.find((entry) => t >= entry.start && t < entry.end);
  if (active) return active.levelCfg;
  const trans = plan.levelTransitions.find((tr) => t >= tr.start && t < tr.end);
  if (trans) return trans.levelCfg;
  const previous = [...plan.rounds].reverse().find((entry) => t >= entry.end);
  return previous?.levelCfg ?? plan.rounds.find((entry) => t < entry.start)?.levelCfg ?? plan.levelCfg;
}

/** O mapa ocupa a área superior do vídeo e mantém as respostas logo abaixo dele. */
export function trailMapHeight(videoHeight: number): number {
  return Math.round(videoHeight * 0.70);
}

export interface TrailCamera {
  s: number;
  tx: number;
  ty: number;
}

/** Segundos depois da última pergunta em que o aluno reaparece na porta da casinha, comemorando. */
export const HOUSE_REAPPEAR = 2.0;

/** Intensidade (0..1) da festa na casinha do cume no instante t: acende a porta quando ele reaparece comemorando. */
export function trailHouseCelebrate(plan: TrailDemoPlan, t: number): number {
  const end = plan.rounds.at(-1)?.end ?? Infinity;
  const finalLevel = plan.rounds.at(-1)?.levelCfg.level ?? plan.levelCfg.level;
  return finalLevel === 7 && t >= end + HOUSE_REAPPEAR ? Math.min(1, (t - end - HOUSE_REAPPEAR) / 0.4) : 0;
}

const VIDEO_ZOOM = 1.55;

function cameraTarget(plan: TrailDemoPlan, t: number) {
  const f = trailStudentFraction(plan, t);
  const p = getTrailPositionAtFraction(f);
  const ri = plan.rounds.findIndex((entry) => t >= entry.start && t < entry.end);
  if (ri >= 0) {
    const round = plan.rounds[ri];
    const qFraction = round.segmentStart + ((round.segmentEnd - round.segmentStart) * (round.roundIndex + 1)) / (round.roundCount + 1);
    const q = getTrailPositionAtFraction(qFraction);
    return { x: p.x + (q.x - p.x) * 0.75, y: p.y + (q.y - p.y) * 0.75 };
  }
  return p;
}

/** Câmera do vídeo: a mesma lógica do jogo (mundo cobrindo a largura, zoom, segue o aluno e o próximo objeto). */
export function computeTrailCamera(plan: TrailDemoPlan, t: number, w: number, h: number): TrailCamera {
  const s = Math.max(w / WORLD_W, h / WORLD_H) * VIDEO_ZOOM;
  let fx = 0;
  let fy = 0;
  const SAMPLES = 5;
  for (let i = 0; i < SAMPLES; i++) {
    const c = cameraTarget(plan, Math.max(0, t - i * 0.12));
    fx += c.x / SAMPLES;
    fy += c.y / SAMPLES;
  }
  const tx = clamp(w * 0.5 - fx * s, w - WORLD_W * s, 0);
  const ty = clamp(h * 0.44 - fy * s, h - WORLD_H * s, 0);
  return { s, tx, ty };
}

const FONT = '"Inter", "Segoe UI", -apple-system, sans-serif';
const OPTION_LETTERS = ["A", "B", "C", "D"];
const OPTION_COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"];

function shuffle<T>(values: T[]): T[] {
  const shuffled = [...values];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

function fitCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  let fitted = text;
  while (fitted.length > 1 && ctx.measureText(fitted).width > maxWidth) {
    fitted = `${fitted.slice(0, -2)}…`;
  }
  return fitted;
}

/* ------------------------------------------------------------------ Renderização do Aluno com alta fidelidade */

function drawStudentFigure(
  ctx: CanvasRenderingContext2D,
  options: {
    weather: TrailWeather;
    hasUmbrella: boolean;
    hasSnowGear: boolean;
    isWalking: boolean;
    isCheering: boolean;
    time: number;
    incline?: number;
    facing?: "left" | "right";
  }
) {
  const { weather, hasUmbrella, hasSnowGear, isWalking, isCheering, time, incline = 0, facing = "right" } = options;
  const isSnow = weather === "snow";
  const isRain = weather === "rain";
  const showUmbrella = hasUmbrella && isRain;
  const showSnowGear = hasSnowGear && isSnow;

  ctx.save();

  // Inclinação orgânica ao subir a montanha (inclina tronco para a frente no sentido do passo)
  const forwardLean = isWalking ? (facing === "left" ? -4 - Math.abs(incline) * 0.4 : 4 + Math.abs(incline) * 0.4) : 0;
  if (forwardLean !== 0) {
    ctx.rotate((forwardLean * Math.PI) / 180);
  }

  // Sombra suave no solo da trilha
  ctx.fillStyle = isSnow ? "rgba(15, 23, 42, 0.32)" : "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(0, 38, isSnow ? 26 : 22, isSnow ? 6 : 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pegadas na neve quando caminha
  if (isSnow) {
    ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
    ctx.beginPath();
    ctx.ellipse(-12, 38, 7, 2.5, 0, 0, Math.PI * 2);
    ctx.ellipse(12, 39, 6.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Respingos d'água na chuva
  if (isRain) {
    ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
    ctx.beginPath();
    ctx.ellipse(0, 39, 14, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bobbing rítmico do passo de montanha
  const stepBob = isWalking ? Math.sin(time * 12) * 4 : 0;
  ctx.translate(0, stepBob);

  // Tremorzinho de frio na neve quando parado
  if (isSnow && !isWalking && !isCheering) {
    const shiver = Math.sin(time * 35) * 0.8;
    ctx.translate(shiver, 0);
  }

  // 1. MOCHILA TÉCNICA 40L (Costas)
  ctx.save();
  ctx.translate(-24, 0);
  if (isWalking) {
    const sway = Math.sin(time * 12) * 0.08;
    ctx.rotate(sway);
  }
  // Corpo da mochila
  const packGrad = ctx.createLinearGradient(-10, 0, 10, 28);
  packGrad.addColorStop(0, "#ea580c");
  packGrad.addColorStop(0.7, "#c2410c");
  packGrad.addColorStop(1, "#7c2d12");
  ctx.fillStyle = packGrad;
  ctx.strokeStyle = "#7c2d12";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-4, 0, 18, 30, 6);
  ctx.fill();
  ctx.stroke();

  // Bolso frontal
  ctx.fillStyle = "#ea580c";
  ctx.strokeStyle = "#9a3412";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-6, 8, 7, 15, 3);
  ctx.fill();
  ctx.stroke();

  // Fita refletiva
  ctx.strokeStyle = "#fed7aa";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(-3, 10);
  ctx.lineTo(-3, 21);
  ctx.stroke();
  ctx.setLineDash([]);

  // Saco de dormir enrolado no topo
  ctx.fillStyle = "#059669";
  ctx.strokeStyle = "#047857";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(-5, -6, 20, 7, 3.5);
  ctx.fill();
  ctx.stroke();

  // Garrafa d'água na lateral
  ctx.fillStyle = "#0284c7";
  ctx.strokeStyle = "#0369a1";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.roundRect(10, 9, 5, 12, 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 2. PERNAS E BOTAS DE MONTANHA
  const legSwing = isWalking ? Math.sin(time * 12) * 12 : 0;
  // Perna esquerda (traseira)
  ctx.strokeStyle = isSnow ? "#0f172a" : "#1e293b";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-6, 24);
  ctx.lineTo(-6 - legSwing * 0.5, 36);
  ctx.stroke();
  // Guetra / tornozeleira
  if (isSnow) {
    ctx.fillStyle = "#334155";
    ctx.fillRect(-10 - legSwing * 0.5, 31, 8, 5);
  }
  // Bota esquerda
  ctx.fillStyle = "#54280b";
  ctx.beginPath();
  ctx.roundRect(-12 - legSwing * 0.5, 34, 12, 5, 1);
  ctx.fill();
  ctx.fillStyle = "#18181b"; // sola
  ctx.fillRect(-12 - legSwing * 0.5, 37, 13, 2.5);

  // Perna direita (dianteira)
  ctx.beginPath();
  ctx.strokeStyle = isSnow ? "#0f172a" : "#1e293b";
  ctx.moveTo(6, 24);
  ctx.lineTo(6 + legSwing * 0.5, 36);
  ctx.stroke();
  if (isSnow) {
    ctx.fillStyle = "#334155";
    ctx.fillRect(2 + legSwing * 0.5, 31, 8, 5);
  }
  // Bota direita
  ctx.fillStyle = "#54280b";
  ctx.beginPath();
  ctx.roundRect(1 + legSwing * 0.5, 34, 12, 5, 1);
  ctx.fill();
  ctx.fillStyle = "#18181b"; // sola
  ctx.fillRect(1 + legSwing * 0.5, 37, 13, 2.5);

  // 3. TRONCO / ANORAK TÉRMICO E ZÍPER
  const jacketGrad = ctx.createLinearGradient(-14, 0, 14, 26);
  if (isSnow) {
    jacketGrad.addColorStop(0, "#0284c7");
    jacketGrad.addColorStop(0.5, "#0369a1");
    jacketGrad.addColorStop(1, "#0c4a6e");
  } else {
    jacketGrad.addColorStop(0, "#2563eb");
    jacketGrad.addColorStop(0.6, "#1d4ed8");
    jacketGrad.addColorStop(1, "#1e3a8a");
  }
  ctx.fillStyle = jacketGrad;
  ctx.strokeStyle = isSnow ? "#075985" : "#1e40af";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(-14, 0, 28, 26, 8);
  ctx.fill();
  ctx.stroke();

  // Zíper frontal dourado reforçado
  ctx.strokeStyle = "#fcd34d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 24);
  ctx.stroke();
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(-1.5, 8, 3, 4);

  // Fitas refletivas nos ombros
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-11, 4);
  ctx.lineTo(-4, 4);
  ctx.moveTo(4, 4);
  ctx.lineTo(11, 4);
  ctx.stroke();

  // Neve acumulada nos ombros
  if (isSnow) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-12, 1);
    ctx.quadraticCurveTo(-7, -2, -2, 1);
    ctx.moveTo(2, 1);
    ctx.quadraticCurveTo(7, -2, 12, 1);
    ctx.stroke();
  }

  // 4. BASTÃO DE TRILHA DE FIBRA DE CARBONO
  if (!showUmbrella && !isCheering) {
    const poleSwing = isWalking ? Math.sin(time * 12 + Math.PI) * 14 : 0;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-12, 10);
    ctx.lineTo(-15 + poleSwing, 38);
    ctx.stroke();
    // Anel de neve
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(-15 + poleSwing, 34, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. CABEÇA E ROSTO
  const skinGrad = ctx.createRadialGradient(-3, -16, 2, 0, -14, 15);
  skinGrad.addColorStop(0, "#fed7aa");
  skinGrad.addColorStop(0.8, "#fcd34d");
  skinGrad.addColorStop(1, "#f59e0b");
  ctx.fillStyle = skinGrad;
  ctx.strokeStyle = isSnow ? "#b45309" : "#ca8a04";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, -14, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Bochechas rosadas (na neve ficam bem mais vermelhas pelo frio)
  ctx.fillStyle = isSnow ? "#ef4444" : "#f87171";
  ctx.beginPath();
  ctx.arc(-5, -11, isSnow ? 3.5 : 2.4, 0, Math.PI * 2);
  ctx.arc(5, -11, isSnow ? 3.5 : 2.4, 0, Math.PI * 2);
  ctx.fill();

  // Pontinha do nariz vermelha de frio na neve
  if (isSnow) {
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(0, -13, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Olhos e expressão
  if (isCheering) {
    // Olhos felizes de vitória (^ ^)
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-4, -15, 2.8, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(4, -15, 2.8, Math.PI, 0);
    ctx.stroke();
  } else if (isSnow) {
    // Olhos semicerrados contra o vento e nevasca
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-6, -18); ctx.lineTo(-2, -17);
    ctx.moveTo(6, -18); ctx.lineTo(2, -17);
    ctx.stroke();
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(-4, -14, 1.4, 0, Math.PI * 2);
    ctx.arc(4, -14, 1.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Olhos curiosos abertos com brilho
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(-4, -15, 1.8, 0, Math.PI * 2);
    ctx.arc(4, -15, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-3.5, -15.5, 0.6, 0, Math.PI * 2);
    ctx.arc(4.5, -15.5, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Boca
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1.6;
  if (isCheering) {
    // Sorriso triunfante aberto
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(0, -10, 4, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
  } else if (isSnow && !isWalking) {
    // Boca vibrando de frio ("Brrrr!")
    ctx.beginPath();
    ctx.moveTo(-4, -10);
    ctx.lineTo(-2, -9);
    ctx.lineTo(0, -11);
    ctx.lineTo(2, -9);
    ctx.lineTo(4, -10);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(0, -10, 3.5, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  // 6. GORRO DE INVERNO OU BOINA FRANCESA
  if (showSnowGear) {
    // Dobra canelada branca do gorro
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-14, -26, 28, 6, 3);
    ctx.fill();
    ctx.stroke();

    // Cúpula do gorro vermelho
    const beanieGrad = ctx.createLinearGradient(0, -38, 0, -25);
    beanieGrad.addColorStop(0, "#ef4444");
    beanieGrad.addColorStop(1, "#991b1b");
    ctx.fillStyle = beanieGrad;
    ctx.beginPath();
    ctx.arc(0, -25, 12, Math.PI, Math.PI * 2);
    ctx.fill();

    // Pompom felpudo
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, -38, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Cachecol de lã grosso em volta do pescoço com ponta ondulando ao vento
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.roundRect(-12, -4, 24, 7, 3.5);
    ctx.fill();
    // Ponta do cachecol tremulando
    const scarfWave = Math.sin(time * 6) * 5;
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.quadraticCurveTo(14 + scarfWave * 0.5, 6, 12 + scarfWave, 16);
    ctx.stroke();
    // Franjas douradas
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(11 + scarfWave, 16);
    ctx.lineTo(15 + scarfWave, 19);
    ctx.stroke();

    // Fumaça de vapor da respiração no ar gélido
    const vapor = (time * 2.5) % 2;
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(6 + vapor * 8, -12 - vapor * 6, 2.5 + vapor * 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Boina alpina clássica azul-marinho
    const beretGrad = ctx.createLinearGradient(-16, -26, 16, -18);
    beretGrad.addColorStop(0, "#1e40af");
    beretGrad.addColorStop(0.7, "#172554");
    beretGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = beretGrad;
    ctx.beginPath();
    ctx.ellipse(0, -23, 16, 6, 0, 0, Math.PI * 2);
    ctx.arc(0, -23, 11, Math.PI, Math.PI * 2);
    ctx.fill();
    // Rabicho da boina
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, -27);
    ctx.lineTo(0, -32);
    ctx.stroke();
  }

  // 7. BRAÇOS: GUARDA-CHUVA, COMEMORAÇÃO OU POSTURA NATURAL
  if (showUmbrella) {
    // Haste do guarda-chuva
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, 6);
    ctx.lineTo(8, -32);
    ctx.stroke();
    // Cúpula do guarda-chuva listrado com pontas
    const umbGrad = ctx.createLinearGradient(-26, -34, 42, -34);
    umbGrad.addColorStop(0, "#f59e0b");
    umbGrad.addColorStop(0.35, "#ef4444");
    umbGrad.addColorStop(0.7, "#f59e0b");
    umbGrad.addColorStop(1, "#dc2626");
    ctx.fillStyle = umbGrad;
    ctx.beginPath();
    ctx.arc(8, -32, 34, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#991b1b";
    ctx.lineWidth = 2;
    ctx.stroke();
    // Respingos na cúpula
    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    ctx.arc(-4, -42, 1.8, 0, Math.PI * 2);
    ctx.arc(18, -44, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (isCheering) {
    // Dois braços erguidos comemorando (\o/)
    ctx.strokeStyle = isSnow ? "#0369a1" : "#1d4ed8";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-10, 8); ctx.lineTo(-20, -14);
    ctx.moveTo(10, 8); ctx.lineTo(20, -14);
    ctx.stroke();
    ctx.fillStyle = isSnow ? "#1e293b" : "url(#studSkinGrad)";
    ctx.beginPath();
    ctx.arc(-20, -14, 3.8, 0, Math.PI * 2);
    ctx.arc(20, -14, 3.8, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Braço dianteiro natural
    ctx.strokeStyle = isSnow ? "#0369a1" : "#1d4ed8";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(10, 8);
    ctx.lineTo(14, 20);
    ctx.stroke();
    ctx.fillStyle = isSnow ? "#1e293b" : "#fcd34d";
    ctx.beginPath();
    ctx.arc(14, 20, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ Confetti do Cume */

function drawConfetti(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const count = 45;
  const colors = ["#fbbf24", "#f43f5e", "#38bdf8", "#34d399", "#a855f7", "#ffffff"];
  ctx.save();
  for (let i = 0; i < count; i++) {
    const seed = i * 137.5;
    const x0 = (seed * 29) % w;
    const speed = 140 + (i % 7) * 35;
    const y = ((t * speed + seed * 12) % (h + 120)) - 60;
    const x = x0 + Math.sin(t * 3 + i) * 35;
    const rot = t * 4 + i * 2;
    const color = colors[i % colors.length];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = color;
    ctx.fillRect(-5, -3, 10, 6);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Renderiza um quadro do vídeo no canvas dado o tempo `t` em segundos.
 */
export function renderTrailDemoFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  plan: TrailDemoPlan,
  assets: {
    images: TrailObjectImages;
    sceneImages?: TrailObjectImages;
    scene?: CanvasImageSource | null;
    /** água + folhagem + bichos (mundo do vídeo) */
    world?: { drawWorld: (ctx: CanvasRenderingContext2D, t: number) => void; drawAvalancheLayer?: (ctx: CanvasRenderingContext2D, t: number) => void } | null;
    /** avalanche (imagem rasterizada do quadro) */
    dyn?: CanvasImageSource | null;
  }
) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const { theme, introDur, countdownDur, outroStart } = plan;
  const activeRoundIndex = plan.rounds.findIndex((entry) => t >= entry.start && t < entry.end);
  const round = activeRoundIndex >= 0 ? plan.rounds[activeRoundIndex] : undefined;
  const previousRound = [...plan.rounds].reverse().find((entry) => t >= entry.end);
  const nextRound = plan.rounds.find((entry) => t < entry.start);
  const levelCfg = trailLevelForTime(plan, t);

  const isRain = levelCfg.weather === "rain";
  const isSnow = levelCfg.weather === "snow";
  const isNight = levelCfg.weather === "night";
  const firstNightStart = plan.rounds.find((entry) => entry.levelCfg.weather === "night")?.start;
  const nightfall = isNight ? (firstNightStart === undefined ? 1 : clamp((t - firstNightStart) / 2.6)) : 0;

  // Dimensões do palco
  const mapH = trailMapHeight(h);
  const dockTop = mapH + Math.max(10, h * 0.01);
  const dockHeight = h - dockTop - Math.max(10, h * 0.01);
  const kPx = w / 1080;

  // Modo avalanche e tremor de câmera sísmico
  const avNow = trailAvalancheAt(plan, t);
  const shake = avNow && avNow.active ? avalancheShake(t, avNow.danger) : { dx: 0, dy: 0 };

  const cam = computeTrailCamera(plan, t, w, mapH);
  const camTx = cam.tx + shake.dx * kPx;
  const camTy = cam.ty + shake.dy * kPx;
  const toScreen = (p: { x: number; y: number }) => ({ x: p.x * cam.s + camTx, y: p.y * cam.s + camTy });

  // Fundo base verde escuro
  ctx.save();
  ctx.fillStyle = "#031c0e";
  ctx.fillRect(0, 0, w, h);

  // 1. O MUNDO DA TRILHA (Cenário, Trilha, Estações e Fauna)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(14 * kPx, 12 * kPx, w - 28 * kPx, mapH - 12 * kPx, 24 * kPx);
  ctx.clip();

  ctx.save();
  ctx.translate(camTx, camTy);
  ctx.scale(cam.s, cam.s);

  if (assets.scene) {
    ctx.drawImage(assets.scene, 0, 0, WORLD_W, WORLD_H);
  } else {
    const fallback = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    fallback.addColorStop(0, "#38bdf8");
    fallback.addColorStop(0.12, "#65a30d");
    fallback.addColorStop(1, "#14532d");
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  }

  // Céu noturno com lua e estrelas
  if (isNight) {
    ctx.save();
    ctx.globalAlpha = nightfall;
    ctx.fillStyle = "rgba(16, 26, 58, 0.28)";
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // Lua volumosa
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath(); ctx.arc(780, 108, 35, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(148, 163, 184, 0.32)";
    ctx.beginPath(); ctx.arc(770, 98, 7.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(792, 114, 9, 0, Math.PI * 2); ctx.fill();

    const stars = [
      [175, 94, 2.8], [280, 168, 2], [380, 64, 3.2], [460, 218, 2.2],
      [580, 82, 3], [670, 205, 2], [900, 175, 3], [935, 72, 2.2],
    ] as const;
    stars.forEach(([sx, sy, sr], idx) => {
      const twinkle = 0.55 + Math.sin(t * 2.2 + idx * 1.6) * 0.35;
      ctx.fillStyle = `rgba(255, 248, 214, ${twinkle})`;
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  // Nuvens animadas no céu
  const drawCloud = (cx: number, cy: number, scale: number, alpha: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#f7fcff";
    ctx.beginPath();
    ctx.ellipse(0, 0, 62, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(-23, -9, 28, 22, 0, 0, Math.PI * 2);
    ctx.ellipse(8, -19, 34, 29, 0, 0, Math.PI * 2);
    ctx.ellipse(34, -6, 26, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawCloud(524 + Math.sin(t * Math.PI * 2 / 28) * 45, 150, 1, 0.48 - nightfall * 0.28);
  drawCloud(827 - Math.sin(t * Math.PI * 2 / 22) * 42, 267, 0.78, 0.4 - nightfall * 0.22);

  // Poças na chuva e flocos decorativos na neve ao longo do traçado
  if (isRain) {
    [0.08, 0.19, 0.31, 0.43, 0.55, 0.67, 0.79, 0.91].forEach((fraction, index) => {
      const point = getTrailPositionAtFraction(fraction);
      const rx = index % 2 === 0 ? 21 : 16;
      const ry = index % 2 === 0 ? 9 : 7;
      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.fillStyle = "rgba(117, 201, 223, 0.48)";
      ctx.strokeStyle = "rgba(212, 245, 244, 0.72)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    });
  } else if (isSnow) {
    [0.04, 0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84, 0.94].forEach((fraction) => {
      const point = getTrailPositionAtFraction(fraction);
      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
  }

  // Água, casinha e bichos vivos da mata
  assets.world?.drawWorld(ctx, t);

  const finalLevel = plan.levels.at(-1)?.level ?? levelCfg.level;
  const endT = plan.rounds.at(-1)?.end ?? Infinity;

  // As 7 Estações (Waypoints) na curva da trilha
  TRAIL_LEVELS.forEach((cfg, idx) => {
    const lvl = idx + 1;
    const pt = getTrailPositionAtFraction(MARKER_FRACS[idx]);
    const selectedIndex = plan.levels.findIndex((selected) => selected.level === lvl);
    const currentOrder = plan.levels.findIndex((selected) => selected.level === levelCfg.level);
    const currentTransition = plan.levelTransitions.find((tr) => t >= tr.start && tr.levelCfg.level === lvl);
    const isDone = (selectedIndex >= 0 && selectedIndex < currentOrder) || (lvl === levelCfg.level && (Boolean(currentTransition) || t >= endT));
    const isCur = lvl === levelCfg.level;
    const isUnl = lvl <= finalLevel;

    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.scale(kPx / cam.s, kPx / cam.s);

    // Aura pulsante na estação atual
    if (isCur) {
      ctx.fillStyle = "rgba(245, 158, 11, 0.45)";
      ctx.beginPath();
      ctx.arc(0, 0, 26 + Math.sin(t * 6) * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Botão circular da estação
    const btnGrad = ctx.createLinearGradient(-18, -18, 18, 18);
    if (isCur) {
      btnGrad.addColorStop(0, "#fbbf24");
      btnGrad.addColorStop(0.5, "#f97316");
      btnGrad.addColorStop(1, "#d97706");
    } else if (isDone) {
      btnGrad.addColorStop(0, "#10b981");
      btnGrad.addColorStop(1, "#047857");
    } else if (isUnl) {
      btnGrad.addColorStop(0, "#fde68a");
      btnGrad.addColorStop(1, "#f59e0b");
    } else {
      btnGrad.addColorStop(0, "#64748b");
      btnGrad.addColorStop(1, "#334155");
    }

    ctx.fillStyle = btnGrad;
    ctx.strokeStyle = isCur ? "#fef08a" : isDone ? "#6ee7b7" : "#ffffff";
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isUnl && !isCur && !isDone ? "#0f172a" : "#ffffff";
    ctx.font = `900 17px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isDone ? "✓" : !isUnl ? "🔒" : String(lvl), 0, 1);

    // Pílula com o nome e altitude da estação
    const label = `${cfg.name} · ${cfg.altitude.toLocaleString("pt-BR")}m`;
    ctx.font = `800 13px ${FONT}`;
    const lw = ctx.measureText(label).width + 20;
    ctx.fillStyle = isCur
      ? "rgba(234, 88, 12, 0.95)"
      : isDone
      ? "rgba(4, 120, 87, 0.95)"
      : "rgba(20, 25, 61, 0.92)";
    ctx.strokeStyle = isCur ? "rgba(253, 230, 138, 0.8)" : isDone ? "rgba(110, 231, 183, 0.8)" : "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(24, -12, lw, 24, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(label, 34, 1);
    ctx.restore();
  });

  // 2. CAMADA DA AVALANCHE (se ativa, renderizada no espaço do mundo com a câmera)
  if (avNow && avNow.active) {
    drawAvalanche(ctx, avNow.front, t, avNow.danger);
  }

  ctx.restore(); // fim do espaço do mundo

  // 3. CLIMA ANIMADO NA TELA (chuva ou neve caindo suavemente)
  if (isRain) {
    ctx.save();
    ctx.strokeStyle = "rgba(186, 230, 253, 0.42)";
    ctx.lineWidth = 1.5;
    const rainOffset = (t * 900) % 140;
    for (let rx = -50; rx < w + 50; rx += 40) {
      for (let ry = -40; ry < mapH; ry += 65) {
        const y = (ry + rainOffset) % mapH;
        const x = rx + y * 0.35;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 12, y + 26);
        ctx.stroke();
      }
    }
    ctx.restore();
  } else if (isSnow) {
    ctx.save();
    for (let sx = -20; sx < w + 20; sx += 42) {
      for (let sy = -10; sy < mapH + 10; sy += 52) {
        const phase = (sx * 0.13 + sy * 0.07) % 1;
        const y = (sy + (t * (70 + (sx % 3) * 12)) % 120 + 120) % mapH;
        const x = sx + Math.sin(t * 1.4 + sy * 0.035 + sx * 0.02) * 20;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.44 + Math.abs(Math.sin(phase * Math.PI * 2)) * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.abs(Math.sin(phase * Math.PI * 2)) * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // 4. AVALANCHE VIGNETTE (borda gelada pulsante)
  if (avNow && avNow.active) {
    const a = Math.min(0.85, avNow.danger * avNow.danger * 0.9);
    if (a > 0.02) {
      const vg = ctx.createRadialGradient(w / 2, mapH / 2, Math.min(w, mapH) * 0.3, w / 2, mapH / 2, Math.max(w, mapH) * 0.75);
      vg.addColorStop(0, "rgba(255, 255, 255, 0)");
      vg.addColorStop(1, `rgba(190, 215, 255, ${a * 0.75})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, mapH);
    }
  }

  // 5. O ALUNO EXPLORADOR (Posição precisa na trilha + caminhada anatômica)
  const isWalking = Boolean(round && t >= round.correctAt && t < round.walkEnd);
  const studentFraction = trailStudentFraction(plan, t);
  const studentPosition = getTrailPositionAtFraction(studentFraction);
  const nextPosition = getTrailPositionAtFraction(Math.min(1, studentFraction + 0.002));
  const studentScreen = toScreen(studentPosition);
  const studentX = studentScreen.x;
  const studentY = studentScreen.y - 18 * kPx;
  const isFacingLeft = nextPosition.x < studentPosition.x;
  const trailSlope = (nextPosition.y - studentPosition.y) / (Math.abs(nextPosition.x - studentPosition.x) + 0.001);
  const studentIncline = clamp(trailSlope * 15, -15, 15);

  // Celebração na casinha do topo (Nível 7)
  const isFinalSummit = finalLevel === 7;
  const houseP = isFinalSummit ? clamp((t - endT - 0.4) / 1.6) : 0;
  const reappear = isFinalSummit && t >= endT + HOUSE_REAPPEAR;
  const hopHappy = isFinalSummit && t >= endT && (houseP < 1 || reappear) ? Math.abs(Math.sin(t * 9)) * 10 : 0;
  const houseScale = reappear ? 1 : 1 - houseP * 0.65;

  ctx.save();
  ctx.translate(studentX, studentY - hopHappy * kPx);
  ctx.scale(1.28 * kPx * houseScale, 1.28 * kPx * houseScale);
  ctx.globalAlpha = reappear ? clamp((t - endT - HOUSE_REAPPEAR) / 0.3) : 1 - clamp((houseP - 0.45) / 0.45);
  if (isFacingLeft) ctx.scale(-1, 1);

  drawStudentFigure(ctx, {
    weather: levelCfg.weather,
    hasUmbrella: levelCfg.hasUmbrella,
    hasSnowGear: levelCfg.hasSnowGear,
    isWalking,
    isCheering: isFinalSummit && t >= endT,
    time: t,
    incline: studentIncline,
    facing: "right",
  });
  ctx.restore();

  // Balão de vitória sobre o aluno no cume
  if (isFinalSummit && reappear && t < outroStart) {
    ctx.save();
    const bx = studentX;
    const by = studentY - 95 * kPx - hopHappy * kPx;
    const bubbleText = "🎉 Victoire! J'ai réussi! 🏔️✨";
    ctx.font = `bold ${Math.max(13, w * 0.016)}px ${FONT}`;
    const bw = ctx.measureText(bubbleText).width + 24;
    const bh = 34;

    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 14);
    ctx.fill();
    ctx.stroke();

    // Triângulo inferior
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.beginPath();
    ctx.moveTo(bx - 6, by + bh / 2);
    ctx.lineTo(bx + 6, by + bh / 2);
    ctx.lineTo(bx, by + bh / 2 + 7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fde047";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(bubbleText, bx, by);
    ctx.restore();

    // Chuva de confetes no cume!
    drawConfetti(ctx, w, mapH, t - (endT + HOUSE_REAPPEAR));
  }

  // 6. CARTÃO DO OBJETO NO MAPA (com Seta Vermelha Animada e Caret)
  if (round && t >= round.start && t < round.walkEnd) {
    const elementFraction = round.segmentStart + ((round.segmentEnd - round.segmentStart) * (round.roundIndex + 1)) / (round.roundCount + 1);
    const target = toScreen(getTrailPositionAtFraction(elementFraction));
    const targetX = target.x;
    const targetY = target.y;

    const maxImageW = Math.min(w * 0.44, 460);
    const imageH = Math.min(maxImageW * (round.item.h / round.item.w), mapH * 0.23);
    const imageW = imageH * (round.item.w / round.item.h);
    const revealed = t >= round.correctAt;
    const answerLabelH = revealed ? 34 : 0;

    const rawPosWorld = getTrailPositionAtFraction(elementFraction);
    const below = rawPosWorld.y < 360;

    const imageX = clamp(targetX - imageW / 2, 22, w - imageW - 22);
    const imageY = below
      ? clamp(targetY + 22, 100, mapH - imageH - answerLabelH - 24)
      : clamp(targetY - imageH - 24, 96, mapH - imageH - answerLabelH - 24);

    const hasIsolatedImage = assets.images.has(round.item.id);
    const isSceneFallback = !hasIsolatedImage && Boolean(assets.sceneImages?.has(round.item.id));
    const image = assets.images.get(round.item.id) ?? assets.sceneImages?.get(round.item.id);

    // Aura âmbar difusa
    ctx.save();
    ctx.fillStyle = "rgba(251, 191, 36, 0.45)";
    ctx.filter = "blur(10px)";
    ctx.beginPath();
    ctx.roundRect(imageX - 4, imageY - 4, imageW + 8, imageH + 8, 22);
    ctx.fill();
    ctx.restore();

    // Triângulo indicador (Caret) apontando para o ponto da trilha
    ctx.save();
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    if (below) {
      ctx.moveTo(targetX, imageY - 8);
      ctx.lineTo(targetX - 9, imageY);
      ctx.lineTo(targetX + 9, imageY);
    } else {
      ctx.moveTo(targetX, imageY + imageH + 8);
      ctx.lineTo(targetX - 9, imageY + imageH);
      ctx.lineTo(targetX + 9, imageY + imageH);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Moldura com gradiente vibrante
    const frame = ctx.createLinearGradient(imageX, imageY, imageX + imageW, imageY + imageH);
    frame.addColorStop(0, "#fbbf24");
    frame.addColorStop(0.5, "#f97316");
    frame.addColorStop(1, "#f43f5e");
    ctx.fillStyle = frame;
    ctx.beginPath();
    ctx.roundRect(imageX - 4, imageY - 4, imageW + 8, imageH + 8, 18);
    ctx.fill();

    // Fundo branco do cartão
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(imageX, imageY, imageW, imageH, 14);
    ctx.fill();

    // Imagem do elemento
    if (image) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imageX, imageY, imageW, imageH, 14);
      ctx.clip();
      const sourceW = image.naturalWidth || round.item.w;
      const sourceH = image.naturalHeight || round.item.h;
      const imageScale = Math.min(imageW / sourceW, imageH / sourceH);
      const drawW = sourceW * imageScale;
      const drawH = sourceH * imageScale;
      const drawX = imageX + (imageW - drawW) / 2;
      const drawY = imageY + (imageH - drawH) / 2;
      ctx.drawImage(image, drawX, drawY, drawW, drawH);

      // Seta Vermelha apontando para o objeto com balanço suave
      const arrowSway = Math.sin(t * 3.5) * 4;
      const arrowX = isSceneFallback
        ? drawX + (round.item.arrow.x / round.item.w) * drawW
        : drawX + (600 / round.item.w) * drawW;
      const arrowY = isSceneFallback
        ? drawY + (round.item.arrow.y / round.item.h) * drawH
        : drawY + (690 / round.item.h) * drawH;
      const baseRot = isSceneFallback ? 25 : -90;
      const baseScale = isSceneFallback ? 1.15 : 1.0;
      const arrowScale = baseScale * (drawW / round.item.w);
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(((baseRot + arrowSway) * Math.PI) / 180);
      ctx.scale(arrowScale * (1 + Math.sin(t * 4) * 0.04), arrowScale * (1 + Math.sin(t * 4) * 0.04));
      ctx.beginPath();
      ctx.moveTo(-90, -10);
      ctx.lineTo(-40, -10);
      ctx.lineTo(-45, -25);
      ctx.lineTo(0, 0);
      ctx.lineTo(-45, 25);
      ctx.lineTo(-40, 10);
      ctx.lineTo(-90, 10);
      ctx.closePath();
      ctx.fillStyle = "#ef4444";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 7;
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    // Selo circular com o número do objeto
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(imageX + imageW - 4, imageY - 4, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = "#fcd34d";
    ctx.font = `900 ${Math.max(12, w * 0.015)}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(round.roundIndex + 1), imageX + imageW - 4, imageY - 4);
    ctx.textBaseline = "alphabetic";

    // Pílula verde ao revelar a resposta com ícone de áudio
    if (revealed) {
      const labelW = Math.min(imageW + 16, 240);
      const labelY = imageY + imageH + 10;
      ctx.fillStyle = "rgba(5, 150, 105, 0.96)";
      ctx.strokeStyle = "#6ee7b7";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(imageX + (imageW - labelW) / 2, labelY, labelW, answerLabelH, 17);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.max(12, w * 0.014)}px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`🔊 ${round.item.fr}`, imageX + imageW / 2, labelY + answerLabelH / 2);
      ctx.textBaseline = "alphabetic";
    }
  }

  // Borda arredondada externa do mapa
  ctx.restore(); // fim do clipe do mapa
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(14 * kPx, 12 * kPx, w - 28 * kPx, mapH - 12 * kPx, 24 * kPx);
  ctx.stroke();
  ctx.restore();

  // 7. HUD SUPERIOR (Idêntico ao CuriousTrailMountain do jogo)
  ctx.save();
  // Card Esquerdo: Clima e Nível
  const hudLeftW = Math.min(w * 0.58, 480);
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(24 * kPx, 24 * kPx, hudLeftW, 68 * kPx, 18 * kPx);
  ctx.fill();
  ctx.stroke();

  const weatherEmoji = isSnow ? "❄️" : isRain ? "🌧️" : isNight ? "🌙" : "☀️";
  ctx.font = `bold ${Math.max(18, w * 0.024)}px ${FONT}`;
  ctx.textAlign = "left";
  ctx.fillText(weatherEmoji, 38 * kPx, 66 * kPx);

  ctx.fillStyle = "#fbbf24";
  ctx.font = `bold ${Math.max(13, w * 0.016)}px ${FONT}`;
  ctx.fillText(`Nível ${levelCfg.level} · ${levelCfg.name}`, 74 * kPx, 52 * kPx);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = `600 ${Math.max(11, w * 0.012)}px ${FONT}`;
  const wxDesc = isSnow
    ? "Neve · vento alpino"
    : isRain
    ? "Chuva · rajadas de vento"
    : isNight
    ? "Noite · lua e estrelas"
    : "Ensolarado · brisa leve";
  ctx.fillText(`Altitude: ${levelCfg.altitude} m · ${wxDesc}`, 74 * kPx, 74 * kPx);

  // Card Direito (TrailPlayHud): Pontos, Streak e Relógio/Avalanche
  const score = round ? (t >= round.correctAt ? round.scoreAfter : round.scoreBefore) : previousRound?.scoreAfter ?? 0;
  const difficulty = TRAIL_DEMO_DIFFICULTY[plan.settings.difficulty];
  const secondsLeft = round
    ? Math.ceil(Math.max(0, difficulty.seconds - (Math.min(t, round.correctAt) - round.start)))
    : 0;

  const hudRightW = Math.min(w * 0.34, 280);
  const hudRightX = w - hudRightW - 24 * kPx;
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(hudRightX, 24 * kPx, hudRightW, 68 * kPx, 18 * kPx);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "right";
  ctx.fillStyle = "#fcd34d";
  ctx.font = `bold ${Math.max(13, w * 0.016)}px ${FONT}`;
  ctx.fillText(`✨ ${score} pts`, hudRightX + hudRightW - 68 * kPx, 51 * kPx);

  const streak = round
    ? t >= round.correctAt
      ? round.roundIndex + 1
      : round.roundIndex
    : (previousRound?.roundIndex ?? -1) + 1;
  const roundNumber = round ?? previousRound;
  ctx.fillStyle = streak > 1 ? "#fdba74" : "#94a3b8";
  ctx.font = `bold ${Math.max(11, w * 0.012)}px ${FONT}`;
  ctx.fillText(`🔥 ${streak} · ${roundNumber ? roundNumber.roundIndex + 1 : 0}/${roundNumber?.roundCount ?? 0}`, hudRightX + hudRightW - 68 * kPx, 73 * kPx);

  if (avNow) {
    // Medidor da Avalanche
    const avColor = avNow.alert === "danger" ? "#dc2626" : avNow.alert === "warn" ? "#f59e0b" : "#0284c7";
    ctx.fillStyle = avColor;
    ctx.beginPath();
    ctx.roundRect(hudRightX + hudRightW - 58 * kPx, 32 * kPx, 48 * kPx, 50 * kPx, 14 * kPx);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = `bold ${Math.max(14, w * 0.016)}px ${FONT}`;
    ctx.fillText("🏔️", hudRightX + hudRightW - 34 * kPx, 52 * kPx);
    ctx.font = `bold ${Math.max(10, w * 0.012)}px ${FONT}`;
    ctx.fillText(`${avNow.meters}m`, hudRightX + hudRightW - 34 * kPx, 72 * kPx);
  } else {
    // Cronômetro Circular
    const timerColor = secondsLeft <= 3 ? "#dc2626" : secondsLeft <= difficulty.seconds * 0.5 ? "#f59e0b" : "#2563eb";
    ctx.fillStyle = timerColor;
    ctx.beginPath();
    ctx.arc(hudRightX + hudRightW - 32 * kPx, 58 * kPx, 22 * kPx, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.max(12, w * 0.014)}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(round ? `${secondsLeft}s` : "✓", hudRightX + hudRightW - 32 * kPx, 58 * kPx);
    ctx.textBaseline = "alphabetic";
  }
  ctx.restore();

  // 8. DOCA DE RESPOSTAS (TrailAnswerDock)
  ctx.save();
  if (round && t >= round.start && t < round.walkEnd) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(18, dockTop, w - 36, dockHeight, 24);
    ctx.fill();
    ctx.stroke();

    // Barra de progresso do tempo / perigo da avalanche
    const progress = clamp((Math.min(t, round.correctAt) - round.start) / (round.correctAt - round.start));
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.roundRect(20, dockTop, w - 40, 6, 3);
    ctx.fill();

    const barFill = avNow ? Math.max(0.04, avNow.danger) : 1 - progress;
    const barColor = avNow
      ? avNow.danger > 0.7 ? "#ef4444" : avNow.danger > 0.4 ? "#fbbf24" : "#38bdf8"
      : secondsLeft <= 3 ? "#ef4444" : secondsLeft <= difficulty.seconds * 0.5 ? "#fbbf24" : "#38bdf8";

    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.roundRect(20, dockTop, (w - 40) * barFill, 6, 3);
    ctx.fill();

    // Cabeçalho da Doca
    const isRetry = round.wrongIndex != null && t >= (round.wrongAt ?? 0) && t < round.correctAt;
    ctx.textAlign = "left";
    ctx.font = `bold ${Math.max(13, w * 0.016)}px ${FONT}`;

    if (isRetry) {
      ctx.fillStyle = "#fde047";
      ctx.fillText("Quase! Você tem mais uma chance 👀", 38, dockTop + 42);
    } else {
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText("Que objeto a ", 38, dockTop + 42);
      const qPrefixW = ctx.measureText("Que objeto a ").width;
      ctx.fillStyle = "#f87171";
      ctx.fillText("seta vermelha", 38 + qPrefixW, dockTop + 42);
      const qArrowW = ctx.measureText("seta vermelha").width;
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText(" aponta?", 38 + qPrefixW + qArrowW, dockTop + 42);
    }

    // Bônus saltando à direita
    if (t >= round.correctAt && round.bonusText) {
      ctx.textAlign = "right";
      ctx.fillStyle = "#fcd34d";
      ctx.font = `900 ${Math.max(13, w * 0.016)}px ${FONT}`;
      ctx.fillText(round.bonusText, w - 38, dockTop + 42);
    } else if (t >= round.correctAt) {
      ctx.textAlign = "right";
      ctx.fillStyle = "#6ee7b7";
      ctx.font = `bold ${Math.max(12, w * 0.015)}px ${FONT}`;
      ctx.fillText(`Correto! +${round.scoreAfter - round.scoreBefore} pts`, w - 38, dockTop + 42);
    }

    // Grade 2x2 com as 4 Alternativas
    const options = round.options.slice(0, 4);
    const gap = 12;
    const left = 32;
    const top = dockTop + 58;
    const optionW = (w - left * 2 - gap) / 2;
    const optionH = Math.max(46, Math.min(84, (dockHeight - 94) / 2 - gap / 2));

    options.forEach((opt, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const ox = left + col * (optionW + gap);
      const oy = top + row * (optionH + gap);

      const isWrongAttempt = round.wrongIndex === idx && t >= (round.wrongAt ?? 0);
      const isCorrectAttempt = round.correctIndex === idx && t >= round.correctAt;

      // Fundo e Borda
      if (isCorrectAttempt) {
        ctx.fillStyle = "rgba(16, 185, 129, 0.28)";
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 2.4;
      } else if (isWrongAttempt) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.22)";
        ctx.strokeStyle = "rgba(248, 113, 113, 0.75)";
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        ctx.lineWidth = 1.6;
      }

      ctx.beginPath();
      ctx.roundRect(ox, oy, optionW, optionH, 14);
      ctx.fill();
      ctx.stroke();

      // Selo de letra A-D
      ctx.fillStyle = OPTION_COLORS[idx % OPTION_COLORS.length];
      ctx.beginPath();
      ctx.roundRect(ox + 10, oy + (optionH - 32) / 2, 32, 32, 8);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 18px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(OPTION_LETTERS[idx], ox + 26, oy + optionH / 2);

      // Texto da Alternativa
      ctx.textAlign = "left";
      ctx.font = `bold ${Math.max(12, Math.min(20, w * 0.02))}px ${FONT}`;
      ctx.fillStyle = isWrongAttempt ? "rgba(254, 202, 202, 0.85)" : "#ffffff";
      const fitOpt = fitCanvasText(ctx, opt, optionW - 68);
      ctx.fillText(fitOpt, ox + 52, oy + optionH / 2);

      // Risco de erro (strikethrough)
      if (isWrongAttempt) {
        const textW = ctx.measureText(fitOpt).width;
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(ox + 52, oy + optionH / 2);
        ctx.lineTo(ox + 52 + textW, oy + optionH / 2);
        ctx.stroke();
      }

      // Checkmark de acerto
      if (isCorrectAttempt) {
        ctx.textAlign = "right";
        ctx.fillStyle = "#6ee7b7";
        ctx.font = `bold ${Math.max(14, w * 0.016)}px ${FONT}`;
        ctx.fillText("✓", ox + optionW - 14, oy + optionH / 2);
      }
      ctx.textBaseline = "alphabetic";
    });
  } else if (t >= plan.introDur) {
    // Entre perguntas / transições: banner de altitude e clima
    const cfgNow = plan.rounds.find((r) => r.end > t)?.levelCfg ?? plan.rounds.at(-1)?.levelCfg ?? plan.levelCfg;
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(18, dockTop, w - 36, dockHeight, 24);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#fbbf24";
    ctx.font = `900 ${Math.max(18, w * 0.024)}px ${FONT}`;
    ctx.fillText(`Nível ${cfgNow.level} · ${cfgNow.name}`, w / 2, dockTop + dockHeight * 0.42);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = `600 ${Math.max(13, w * 0.016)}px ${FONT}`;
    ctx.fillText(`${cfgNow.altitude.toLocaleString("pt-BR")} m de altitude`, w / 2, dockTop + dockHeight * 0.62);
  }
  ctx.restore();

  // 9. OVERLAYS DO JOGO (Countdown, Level Complete e Summit Victory)

  // 9A. Contagem Regressiva Inicial (TrailCountdownOverlay)
  if (t >= introDur && t < introDur + countdownDur) {
    const elapsed = t - introDur;
    const count = Math.max(1, Math.ceil(3 - (elapsed / countdownDur) * 3));
    const pulse = 1 + Math.sin(elapsed * 7) * 0.08;

    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
    ctx.fillRect(0, 0, w, h);

    const mw = Math.min(w * 0.82, 440);
    const mh = 310;
    const mx = (w - mw) / 2;
    const my = (h - mh) / 2 - 40;

    // Card fosco
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(mx, my, mw, mh, 28);
    ctx.fill();
    ctx.stroke();

    // Emoji saltando
    ctx.font = `36px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(levelCfg.badgeEmoji, w / 2, my + 44);

    // Nível e Altitude
    ctx.fillStyle = "#fbbf24";
    ctx.font = `900 ${Math.max(12, w * 0.014)}px ${FONT}`;
    ctx.fillText(`NÍVEL ${levelCfg.level} · ${levelCfg.name.toUpperCase()} (${levelCfg.altitude}M)`, w / 2, my + 72);

    // Descrição
    ctx.fillStyle = "#e2e8f0";
    ctx.font = `bold ${Math.max(13, w * 0.015)}px ${FONT}`;
    ctx.fillText(levelCfg.description, w / 2, my + 96);

    // Círculo de contagem pulsante com gradiente âmbar
    ctx.save();
    ctx.translate(w / 2, my + 170);
    ctx.scale(pulse, pulse);
    const circleGrad = ctx.createLinearGradient(-38, -38, 38, 38);
    circleGrad.addColorStop(0, "#fbbf24");
    circleGrad.addColorStop(1, "#f97316");
    ctx.fillStyle = circleGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = `900 48px ${FONT}`;
    ctx.textBaseline = "middle";
    ctx.fillText(String(count), 0, 2);
    ctx.restore();

    // Subtítulo inferior
    ctx.fillStyle = "#94a3b8";
    ctx.font = `600 ${Math.max(12, w * 0.013)}px ${FONT}`;
    ctx.fillText(`Reconheça ${levelCfg.elementCount} ${levelCfg.elementCount === 1 ? "objeto" : "objetos"} pelo caminho!`, w / 2, my + 265);
    ctx.restore();
  }

  // 9B. Nível Concluído (TrailLevelCompleteOverlay)
  const currentTransition = plan.levelTransitions.find((tr) => t >= tr.start && t < tr.end);
  if (currentTransition) {
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
    ctx.fillRect(0, 0, w, h);

    const mw = Math.min(w * 0.84, 460);
    const mh = 330;
    const mx = (w - mw) / 2;
    const my = clamp((mapH - mh) / 2, 20, mapH - mh - 20);

    // Card com borda esmeralda dupla
    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.strokeStyle = "rgba(52, 211, 153, 0.75)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(mx, my, mw, mh, 28);
    ctx.fill();
    ctx.stroke();

    // Selo de nível conquistado
    const badgeText = `NÍVEL ${currentTransition.level} CONQUISTADO!`;
    ctx.font = `900 12px ${FONT}`;
    const badgeW = ctx.measureText(badgeText).width + 24;
    ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
    ctx.beginPath();
    ctx.roundRect(w / 2 - badgeW / 2, my + 24, badgeW, 26, 13);
    ctx.fill();
    ctx.fillStyle = "#6ee7b7";
    ctx.textAlign = "center";
    ctx.fillText(badgeText, w / 2, my + 41);

    // Título
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${Math.max(20, w * 0.024)}px ${FONT}`;
    ctx.fillText(`${currentTransition.levelCfg.name} superada! 🌲✨`, w / 2, my + 84);

    // Descrição
    ctx.fillStyle = "#cbd5e1";
    ctx.font = `500 ${Math.max(12, w * 0.014)}px ${FONT}`;
    if (currentTransition.isFinal) {
      ctx.fillText(`Você reconheceu todos os objetos do Nível ${currentTransition.level}.`, w / 2, my + 114);
      ctx.fillText(`Etapa concluída com maestria pela Trilha Curiosa!`, w / 2, my + 134);
    } else {
      ctx.fillText(`Você reconheceu todos os objetos. O caminho para o`, w / 2, my + 114);
      ctx.fillText(`Nível ${currentTransition.nextLevel} (${currentTransition.nextLevelCfg.name}) está aberto.`, w / 2, my + 134);
    }

    // Caixas de XP e Pontos
    const boxW = 110;
    const boxH = 54;
    // Caixa XP
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(w / 2 - boxW - 10, my + 160, boxW, boxH, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = `700 10px ${FONT}`;
    ctx.fillText("XP", w / 2 - boxW / 2 - 10, my + 178);
    ctx.fillStyle = "#38bdf8";
    ctx.font = `900 17px ${FONT}`;
    ctx.fillText(`+${currentTransition.xp}`, w / 2 - boxW / 2 - 10, my + 201);

    // Caixa Pontos
    ctx.beginPath();
    ctx.roundRect(w / 2 + 10, my + 160, boxW, boxH, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = `700 10px ${FONT}`;
    ctx.fillText("PONTOS", w / 2 + boxW / 2 + 10, my + 178);
    ctx.fillStyle = "#fcd34d";
    ctx.font = `900 17px ${FONT}`;
    ctx.fillText(`+${currentTransition.score}`, w / 2 + boxW / 2 + 10, my + 201);

    // Botão Subir ao Próximo Nível ou Concluído
    const btnW = mw - 64;
    const btnH = 46;
    const btnGrad = ctx.createLinearGradient(mx + 32, my + 242, mx + 32 + btnW, my + 242);
    btnGrad.addColorStop(0, "#10b981");
    btnGrad.addColorStop(1, "#059669");
    ctx.fillStyle = btnGrad;
    ctx.beginPath();
    ctx.roundRect(mx + 32, my + 242, btnW, btnH, 16);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${Math.max(13, w * 0.016)}px ${FONT}`;
    ctx.fillText(currentTransition.isFinal ? "Nível Concluído ✓" : `Subir ao Nível ${currentTransition.nextLevel} →`, w / 2, my + 270);

    ctx.restore();

    // Confetes caindo
    drawConfetti(ctx, w, mapH, t - currentTransition.start);
  }

  // 9C. Cabana do Topo Conquistada (TrailSummitOverlay)
  if (isFinalSummit && t >= endT + 3.8 && t < outroStart) {
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
    ctx.fillRect(0, 0, w, h);

    const mw = Math.min(w * 0.86, 460);
    const mh = 380;
    const mx = (w - mw) / 2;
    const my = clamp((mapH - mh) / 2, 16, mapH - mh - 16);

    // Card com borda dourada âmbar
    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(mx, my, mw, mh, 28);
    ctx.fill();
    ctx.stroke();

    // Selo do topo
    const summitBadgeText = "🏡 Cabana do topo conquistada · 3950m";
    ctx.font = `900 12px ${FONT}`;
    const sBadgeW = ctx.measureText(summitBadgeText).width + 24;
    ctx.fillStyle = "rgba(245, 158, 11, 0.22)";
    ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(w / 2 - sBadgeW / 2, my + 20, sBadgeW, 26, 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fcd34d";
    ctx.textAlign = "center";
    ctx.fillText(summitBadgeText, w / 2, my + 37);

    // Ícones 🏔️🏆
    ctx.font = `34px ${FONT}`;
    ctx.fillText("🏔️🏆", w / 2, my + 86);

    // Título
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${Math.max(20, w * 0.024)}px ${FONT}`;
    ctx.fillText("Você chegou à cabana!", w / 2, my + 124);

    // Subtítulo
    ctx.fillStyle = "#cbd5e1";
    ctx.font = `500 ${Math.max(12, w * 0.014)}px ${FONT}`;
    ctx.fillText(`Félicitations ! Os 7 níveis do tema`, w / 2, my + 148);
    ctx.fillStyle = "#fde047";
    ctx.font = `bold ${Math.max(12, w * 0.014)}px ${FONT}`;
    ctx.fillText(`${theme.label} estão completos.`, w / 2, my + 166);

    // 3 Caixas de estatísticas (Níveis, XP total, Sequência)
    const statW = (mw - 64) / 3;
    const statH = 56;
    const statY = my + 188;

    // 1. Níveis
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(mx + 22, statY, statW, statH, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = `700 10px ${FONT}`;
    ctx.fillText("NÍVEIS", mx + 22 + statW / 2, statY + 17);
    ctx.fillStyle = "#6ee7b7";
    ctx.font = `900 16px ${FONT}`;
    ctx.fillText("7/7", mx + 22 + statW / 2, statY + 40);

    // 2. XP Total
    ctx.beginPath();
    ctx.roundRect(mx + 22 + statW + 10, statY, statW, statH, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = `700 10px ${FONT}`;
    ctx.fillText("XP TOTAL", mx + 22 + statW + 10 + statW / 2, statY + 17);
    ctx.fillStyle = "#38bdf8";
    ctx.font = `900 16px ${FONT}`;
    ctx.fillText(`+${plan.finalXp}`, mx + 22 + statW + 10 + statW / 2, statY + 40);

    // 3. Sequência
    ctx.beginPath();
    ctx.roundRect(mx + 22 + (statW + 10) * 2, statY, statW, statH, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = `700 10px ${FONT}`;
    ctx.fillText("SEQUÊNCIA", mx + 22 + (statW + 10) * 2 + statW / 2, statY + 17);
    ctx.fillStyle = "#fdba74";
    ctx.font = `900 16px ${FONT}`;
    const maxStreak = Math.max(1, plan.rounds.length);
    ctx.fillText(`${maxStreak} 🔥`, mx + 22 + (statW + 10) * 2 + statW / 2, statY + 40);

    // Botões inferiores (Outro tema & Jogar de novo)
    const btnW = (mw - 54) / 2;
    const btnH = 44;
    const btnY = my + 262;

    // Botão 1: Outro tema (gradiente âmbar/laranja)
    const btn1Grad = ctx.createLinearGradient(mx + 22, btnY, mx + 22 + btnW, btnY);
    btn1Grad.addColorStop(0, "#f59e0b");
    btn1Grad.addColorStop(1, "#ea580c");
    ctx.fillStyle = btn1Grad;
    ctx.beginPath();
    ctx.roundRect(mx + 22, btnY, btnW, btnH, 16);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${Math.max(12, w * 0.015)}px ${FONT}`;
    ctx.fillText("✨ Outro tema", mx + 22 + btnW / 2, btnY + 27);

    // Botão 2: Jogar de novo
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(mx + 22 + btnW + 10, btnY, btnW, btnH, 16);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.fillText("🔄 Jogar de novo", mx + 22 + btnW + 10 + btnW / 2, btnY + 27);

    ctx.restore();

    // Chuva de confetes pelo cenário
    drawConfetti(ctx, w, mapH, t - (endT + 2.0));
  }

  // 10. ABERTURA (INTRO)
  if (plan.settings.showIntro && t < introDur) {
    const introProgress = t / introDur;
    const alpha = introProgress > 0.8 ? (1 - introProgress) / 0.2 : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = "center";
    ctx.fillStyle = "#f59e0b";
    ctx.font = `900 32px ${FONT}`;
    ctx.fillText("🏔️ TRILHA DO ALUNO CURIOSO", w / 2, h * 0.4);

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 42px ${FONT}`;
    ctx.fillText(plan.settings.title.split("\n")[0] || "Escale a Montanha", w / 2, h * 0.48);

    ctx.fillStyle = "#93c5fd";
    ctx.font = `bold 26px ${FONT}`;
    ctx.fillText(`Tema: ${theme.emoji} ${theme.label}`, w / 2, h * 0.55);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = `500 20px ${FONT}`;
    ctx.fillText(
      `${plan.levels.length} ${plan.levels.length === 1 ? "nível" : "níveis"} · ${plan.rounds.length} perguntas · Caminhe, acerte e avance`,
      w / 2,
      h * 0.61
    );
    ctx.restore();
  }

  // 11. ENCERRAMENTO (OUTRO) COM REDE SOCIAL
  if (plan.settings.showOutro && t >= outroStart) {
    const outroT = t - outroStart;
    const alpha = Math.min(1, outroT / 0.4);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(15, 23, 42, 0.96)";
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = "center";
    ctx.fillStyle = "#f59e0b";
    ctx.font = `900 64px sans-serif`;
    const summitWon = finalLevel === 7;
    const levelSummary = plan.levels.length === 1 ? `Nível ${finalLevel} concluído!` : `${plan.levels.length} níveis concluídos!`;
    ctx.fillText(summitWon ? "🏔️ 🇫🇷 🏆" : "🌲 🇫🇷 ⭐", w / 2, h * 0.38);

    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${Math.min(38, w * 0.035)}px ${FONT}`;
    ctx.fillText(
      summitWon ? "Cabana do Cume conquistada!" : levelSummary,
      w / 2,
      h * 0.46
    );

    ctx.fillStyle = "#10b981";
    ctx.font = `bold 28px ${FONT}`;
    ctx.fillText(`${plan.finalXp} XP · ${plan.finalScore} pts`, w / 2, h * 0.52);

    ctx.fillStyle = "#fcd34d";
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText(
      summitWon ? "Chegada triunfal à cabana do cume (3.950m)!" : `Níveis concluídos: ${plan.levels.map((level) => level.level).join(" · ")}`,
      w / 2,
      h * 0.56
    );

    ctx.fillStyle = "#93c5fd";
    ctx.font = `bold ${Math.min(22, w * 0.02)}px ${FONT}`;
    ctx.fillText(fitCanvasText(ctx, plan.settings.cta, w - 80), w / 2, h * 0.62);

    // Cartão da Rede Social
    const socW = Math.min(440, w - 64);
    const socH = 70;
    const socX = (w - socW) / 2;
    const socY = h * 0.66;
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(socX, socY, socW, socH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText(`@${plan.settings.handle}`, w / 2, socY + 44);
    ctx.restore();
  }
}
