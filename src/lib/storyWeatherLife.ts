/**
 * Clima e mudança de cenário nas cenas externas (de dia).
 *
 * Um ciclo de ~46 s, função pura do tempo (o vídeo exportado sai idêntico ao player):
 *   0–11 s   céu aberto                          →  a cena como a lição a desenhou
 *   11–16 s  nuvens escuras tapam o sol          →  o céu escurece
 *   14–35 s  CHUVA (respingos, relâmpago, trovão), pessoas atravessam de GUARDA-CHUVA aberto
 *   22–32 s  o cenário MUDA: interior da casa (janela com chuva, porta, cama, mesa, abajur) — quem estava fora entra
 *   36–45 s  a chuva para, o sol volta e surge o ARCO-ÍRIS
 * Cada coisa nova tem nome próprio (Kreyòl · Français · Português) ligado ao que está desenhado, inclusive os
 * móveis do interior. Enquanto o interior cobre a imagem, `cover(t)` > 0 e o player esmaece os rótulos da lição.
 */
import { circ, ell, f, line, person, rngFrom, sin, clamp, G } from "@/lib/storySceneLife";
import { sm, fade, type LabelSpec, type SoundCue, type VignetteInst } from "@/lib/storyVignettes";

export const WEATHER_PERIOD = 46;

export interface WeatherPhase { u: number; veil: number; rain: number; cover: number; rainbow: number; flash: number }

export function weatherPhase(t: number, t0: number): WeatherPhase {
  const u = (((t - t0) % WEATHER_PERIOD) + WEATHER_PERIOD) % WEATHER_PERIOD;
  const flashAt = [19.2, 26.4, 30.1];
  const flash = Math.max(...flashAt.map((a) => (u > a && u < a + 0.45 ? (1 - (u - a) / 0.45) * (Math.floor((u - a) * 12) % 2 === 0 ? 1 : 0.35) : 0)));
  return {
    u,
    veil: sm(11, 15.5, u) * (1 - sm(33, 38, u)),
    rain: sm(14, 16.5, u) * (1 - sm(34, 36.5, u)),
    cover: sm(22, 23.4, u) * (1 - sm(31, 32.4, u)),
    rainbow: sm(36.5, 39, u) * (1 - sm(43, 45.5, u)),
    flash,
  };
}

/* ------------------------------------------------------------------ chuva e nuvens */

function rainLayer(t: number, intensity: number, gt: number, w = 1200, h = 800): string {
  if (intensity <= 0.01) return "";
  const n = Math.round(95 * intensity);
  let s = `<g stroke="rgba(205,225,245,.55)" stroke-width="1.8" stroke-linecap="round" opacity="${f(0.4 + 0.6 * intensity)}">`;
  for (let k = 0; k < n; k++) {
    const y = ((k * 53 + t * (720 + (k % 5) * 70)) % (h + 80)) - 40;
    const x = ((k * 89.3 + y * 0.18) % (w + 60)) - 30;
    s += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 5)}" y2="${f(y + 22)}"/>`;
  }
  s += "</g>";
  // respingos no chão
  for (let k = 0; k < 16; k++) {
    const u = (t * 1.35 + k * 0.37) % 1;
    const x = (k * 167 + 60) % 1100 + 50, y = gt + 36 + ((k * 61) % Math.max(60, 700 - gt));
    s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(3 + u * 13)}" ry="${f(1.2 + u * 4)}" fill="none" stroke="rgba(225,240,255,${f((1 - u) * 0.7 * intensity)})" stroke-width="1.4"/>`;
  }
  return s;
}

function stormClouds(t: number, veil: number, gt: number): string {
  if (veil <= 0.01) return "";
  let s = `<rect x="0" y="0" width="1200" height="800" fill="#27344a" opacity="${f(veil * 0.3)}"/>`;
  const top = Math.min(gt * 0.62, 330);
  for (let k = 0; k < 6; k++) {
    const x = ((k * 230 + t * (7 + k)) % 1500) - 150, y = 40 + (k % 3) * (top / 3);
    s += `<g opacity="${f(veil * 0.92)}">${ell(x, y, 120, 36, "#56647a")}${ell(x - 60, y + 10, 70, 28, "#4a586e")}${ell(x + 64, y + 8, 78, 30, "#5d6c82")}</g>`;
  }
  return s;
}

function rainbow(k: number, gt: number): string {
  if (k <= 0.01) return "";
  const cx = 640, cy = gt + 20, cols = ["#ff5a5a", "#ffa14a", "#ffe45c", "#6ed26e", "#5fb6ff", "#7a6bff"];
  return `<g opacity="${f(0.62 * k)}" fill="none" stroke-width="13">` +
    cols.map((c, i) => `<path d="M${cx - 360 + i * 12} ${cy} A${360 - i * 12} ${360 - i * 12} 0 0 1 ${cx + 360 - i * 12} ${cy}" stroke="${c}"/>`).join("") + `</g>`;
}

/* ------------------------------------------------------------------ guarda-chuvas */

function umbrella(x: number, y: number, s: number, col: string): string {
  return G(x, y, 0, s, s, `<path d="M-34 0 Q-30 -34 0 -38 Q30 -34 34 0 Q22 -6 11 0 Q0 -6 -11 0 Q-22 -6 -34 0 Z" fill="${col}"/>` + line(0, -38, 0, -44, 3, "#333") + line(0, 0, 0, 62, 3, "#3a2c20") + `<path d="M0 62 q0 8 8 6" stroke="#3a2c20" stroke-width="3" fill="none" stroke-linecap="round"/>`);
}

/* ------------------------------------------------------------------ interior da casa */

interface RoomLayout { door: { x: number; y: number; w: number; h: number }; win: { x: number; y: number; w: number; h: number } }
const ROOM: RoomLayout = { door: { x: 560, y: 170, w: 140, h: 390 }, win: { x: 140, y: 120, w: 260, h: 290 } };

function room(t: number, p: WeatherPhase, personSeed: { skin: string; shirt: string }): string {
  const { door, win } = ROOM, c = p.cover;
  if (c <= 0.01) return "";
  const lt = p.u - 22; // tempo local do interior
  const lamp = 0.85 + 0.15 * sin(t * 7.3) * sin(t * 2.1);
  let s = "";
  // parede e piso
  s += `<rect x="0" y="0" width="1200" height="800" fill="#ecdcc0"/>` +
    `<rect x="0" y="0" width="1200" height="60" fill="#d9c6a3"/>` +
    `<rect x="0" y="560" width="1200" height="240" fill="#9a6b43"/>` +
    Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${600 + i * 28}" x2="1200" y2="${600 + i * 28}" stroke="#865a38" stroke-width="2"/>`).join("") +
    `<rect x="0" y="548" width="1200" height="16" fill="#f4ead6"/>`;
  // janela com chuva do lado de fora
  const glass = `<rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" fill="#7f93ab"/>`;
  let outside = "";
  for (let k = 0; k < 34; k++) {
    const y = ((k * 41 + t * 520) % (win.h + 40)) - 20 + win.y, x = win.x + ((k * 73) % win.w);
    outside += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 4)}" y2="${f(y + 18)}" stroke="rgba(235,245,255,.7)" stroke-width="1.8"/>`;
  }
  outside += `<rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" fill="#fff" opacity="${f(p.flash * 0.75)}"/>`;
  s += `<rect x="${win.x - 14}" y="${win.y - 14}" width="${win.w + 28}" height="${win.h + 28}" rx="6" fill="#7a4a26"/>` + glass +
    `<clipPath id="wxwin"><rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}"/></clipPath><g clip-path="url(#wxwin)">${outside}</g>` +
    line(win.x + win.w / 2, win.y, win.x + win.w / 2, win.y + win.h, 8, "#7a4a26") + line(win.x, win.y + win.h / 2, win.x + win.w, win.y + win.h / 2, 8, "#7a4a26") +
    `<rect x="${win.x - 24}" y="${win.y + win.h + 12}" width="${win.w + 48}" height="12" rx="4" fill="#6a3f20"/>` +
    `<path d="M${win.x - 26} ${win.y - 20} Q${win.x + 30} ${win.y + 120} ${win.x - 26} ${win.y + win.h}" fill="#c0504d" opacity=".9"/><path d="M${win.x + win.w + 26} ${win.y - 20} Q${win.x + win.w - 30} ${win.y + 120} ${win.x + win.w + 26} ${win.y + win.h}" fill="#c0504d" opacity=".9"/>`;
  // porta (abre quando alguém entra)
  const open = clamp(1 - Math.abs(lt - 1.4) / 1.8, 0, 1);
  s += `<rect x="${door.x - 12}" y="${door.y - 12}" width="${door.w + 24}" height="${door.h + 12}" fill="#5b3a20"/><rect x="${door.x}" y="${door.y}" width="${door.w}" height="${door.h}" fill="${open > 0.05 ? "#4b6a86" : "#8b5a2e"}"/>`;
  if (open > 0.05) s += `<path d="M${door.x} ${door.y} L${f(door.x - 64 * open)} ${f(door.y + 22)} V${f(door.y + door.h - 6)} L${door.x} ${door.y + door.h} Z" fill="#8b5a2e"/>` + rainLayerClip(t, door);
  else s += `<rect x="${door.x + 14}" y="${door.y + 20}" width="${door.w - 28}" height="${door.h * 0.38}" rx="4" fill="#7a4d26"/><rect x="${door.x + 14}" y="${door.y + door.h * 0.5}" width="${door.w - 28}" height="${door.h * 0.42}" rx="4" fill="#7a4d26"/>` + circ(door.x + door.w - 22, door.y + door.h * 0.52, 7, "#e3b341");
  // cama
  s += `<rect x="830" y="300" width="40" height="262" rx="8" fill="#6a3f20"/><rect x="830" y="448" width="300" height="104" rx="10" fill="#7d4c26"/>` +
    `<rect x="840" y="410" width="280" height="62" rx="14" fill="#f4f1ea"/><rect x="842" y="404" width="76" height="44" rx="14" fill="#fff"/>` +
    `<path d="M890 442 H1120 V500 H890 Z" fill="#4f86c6"/><path d="M890 442 H1120 V458 H890 Z" fill="#7aa6dc"/>` +
    `<rect x="846" y="552" width="14" height="30" fill="#5a3418"/><rect x="1100" y="552" width="14" height="30" fill="#5a3418"/>`;
  // mesa + abajur
  s += `<ellipse cx="300" cy="508" rx="96" ry="14" fill="#7d4c26"/><rect x="290" y="508" width="20" height="62" fill="#6a3f20"/><ellipse cx="300" cy="574" rx="56" ry="8" fill="#6a3f20"/>` +
    `<ellipse cx="300" cy="440" rx="${f(90 * lamp)}" ry="${f(70 * lamp)}" fill="#ffe29a" opacity=".22"/>` +
    `<rect x="296" y="462" width="8" height="42" fill="#a07a4a"/><path d="M270 466 L282 424 H318 L330 466 Z" fill="#ffd36e"/>`;
  // quem estava lá fora entra, sacode o guarda-chuva e acena
  const walkIn = clamp((lt - 1.0) / 3.6, 0, 1);
  const px = door.x + door.w / 2 + 10 - walkIn * 150, py = 606;
  const pose = walkIn < 1 ? "walk" : "wave";
  s += fade(lt > 1 ? 1 : 0, person(t, { x: px, y: py, s: 3.6, face: -1, pose, speed: 0.55, skin: personSeed.skin, shirt: personSeed.shirt }) + (walkIn < 1 ? umbrella(px + 70, py - 270, 2.9, "#e0493a") : ""));
  return `<g opacity="${f(c)}">${s}</g>`;
}

function rainLayerClip(t: number, door: { x: number; y: number; w: number; h: number }): string {
  let s = "";
  for (let k = 0; k < 14; k++) {
    const y = ((k * 37 + t * 480) % door.h) + door.y, x = door.x + 6 + ((k * 29) % (door.w - 14));
    s += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 3)}" y2="${f(Math.min(y + 14, door.y + door.h))}" stroke="rgba(235,245,255,.75)" stroke-width="1.6"/>`;
  }
  return s;
}

/* ------------------------------------------------------------------ vinheta */

export interface WeatherOpts { sceneId: string; gt: number }

export function buildWeather(o: WeatherOpts): VignetteInst {
  const r = rngFrom(`${o.sceneId}|clima`);
  const t0 = 3 + r() * 9;
  const skins = ["#f3c9a5", "#c68a5c", "#a86f45", "#7a4a2c"], shirts = ["#e8564a", "#3c7dd9", "#f2b632", "#4aa96c"];
  const seed = { skin: skins[Math.floor(r() * skins.length)], shirt: shirts[Math.floor(r() * shirts.length)] };
  const gt = clamp(o.gt, 430, 650);
  const lane = [gt + 90, gt + 150, gt + 70];
  const cols = ["#e0493a", "#3c7dd9", "#f2b632"];
  const walkerX = (t: number, k: number) => {
    const p = weatherPhase(t, t0), a = (p.u - 14 - k * 2.2) / 13; // cruzam a cena enquanto chove, antes de a casa aparecer
    return { x: -90 + 1380 * clamp(a, 0, 1), vis: a > 0 && a < 1 && p.cover < 0.3 };
  };
  return {
    id: "clima",
    z: 9999,
    draw: (t) => {
      const p = weatherPhase(t, t0);
      let out = stormClouds(t, p.veil, gt) + rainbow(p.rainbow, gt);
      for (let k = 0; k < 3; k++) {
        const q = walkerX(t, k);
        if (!q.vis) continue;
        const y = lane[k], s = 0.62 + (y - gt) / 900;
        out += person(t, { x: q.x, y, s, face: 1, pose: "walk", speed: 1.15, shirt: shirts[(k + 1) % 4], skin: skins[k % 4] }) + umbrella(q.x + 6 * s, y - 128 * s, 0.9 * s, cols[k]);
      }
      out += rainLayer(t, p.rain, gt);
      out += room(t, p, seed);
      return out;
    },
    labels: (t) => {
      const p = weatherPhase(t, t0), L: LabelSpec[] = [];
      const outdoor = 1 - p.cover;
      if (p.rain > 0.5 && outdoor > 0.5) L.push({ key: "chuva", x: 880, y: 150, alpha: p.rain * outdoor });
      const q = walkerX(t, 0);
      if (q.vis && p.rain > 0.5) L.push({ key: "guardaChuva", x: q.x + 6, y: lane[0] - 150, alpha: p.rain });
      if (p.rainbow > 0.4) L.push({ key: "arcoIris", x: 640, y: o.gt + 20 - 345, alpha: p.rainbow });
      if (p.cover > 0.6) {
        const a = p.cover;
        L.push(
          { key: "janela", x: 270, y: 200, alpha: a }, { key: "porta", x: 630, y: 250, alpha: a }, { key: "cama", x: 980, y: 420, alpha: a },
          { key: "abajur", x: 300, y: 430, alpha: a }, { key: "mesa", x: 300, y: 512, alpha: a },
        );
      }
      return L;
    },
    cues: (duration) => {
      const out: SoundCue[] = [];
      for (let c = 0; ; c++) {
        const base = t0 + c * WEATHER_PERIOD;
        if (base + 14 >= duration) break;
        for (let tt = base + 14.5; tt < base + 35; tt += 4.2) out.push({ t: tt, kind: "rain", gain: 0.5 });
        for (const a of [19.2, 26.4, 30.1]) out.push({ t: base + a + 0.7, kind: "thunder", gain: 0.5 });
        out.push({ t: base + 38.6, kind: "chime", gain: 0.3 });
        out.push({ t: base + 40, kind: "bird", gain: 0.25 });
      }
      return out.filter((e) => e.t < duration);
    },
    cover: (t) => weatherPhase(t, t0).cover,
  };
}

