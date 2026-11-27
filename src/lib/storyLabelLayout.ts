/**
 * Evita que os rótulos dos elementos (pílulas) se sobreponham.
 * Trabalha em qualquer unidade (px do palco no player, px do quadro na exportação).
 * É determinístico: as mesmas entradas dão as mesmas posições, então o rótulo não "pula" durante o vídeo.
 */
export interface LabelBox {
  /** Centro de ancoragem do rótulo. */
  cx: number;
  cy: number;
  /** Tamanho da pílula. */
  w: number;
  h: number;
}

export interface LabelBounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function resolveLabelCollisions(
  boxes: LabelBox[],
  bounds: LabelBounds,
  gap = 8
): { dx: number; dy: number }[] {
  const pos = boxes.map((box) => ({ x: box.cx, y: box.cy }));

  const clamp = () => {
    boxes.forEach((box, i) => {
      const minX = bounds.x + box.w / 2;
      const maxX = bounds.x + bounds.w - box.w / 2;
      const minY = bounds.y + box.h / 2;
      const maxY = bounds.y + bounds.h - box.h / 2;
      pos[i].x = minX > maxX ? bounds.x + bounds.w / 2 : Math.min(maxX, Math.max(minX, pos[i].x));
      pos[i].y = minY > maxY ? bounds.y + bounds.h / 2 : Math.min(maxY, Math.max(minY, pos[i].y));
    });
  };

  clamp();
  for (let pass = 0; pass < 60; pass++) {
    let moved = false;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const overlapX = (boxes[i].w + boxes[j].w) / 2 + gap - Math.abs(pos[i].x - pos[j].x);
        const overlapY = (boxes[i].h + boxes[j].h) / 2 + gap - Math.abs(pos[i].y - pos[j].y);
        if (overlapX <= 0 || overlapY <= 0) continue;
        moved = true;
        // Pílulas são largas: separar na vertical quase sempre custa menos.
        if (overlapY <= overlapX * 2.2) {
          const upper = pos[i].y <= pos[j].y ? i : j;
          const lower = upper === i ? j : i;
          pos[upper].y -= overlapY / 2;
          pos[lower].y += overlapY / 2;
        } else {
          const left = pos[i].x <= pos[j].x ? i : j;
          const right = left === i ? j : i;
          pos[left].x -= overlapX / 2;
          pos[right].x += overlapX / 2;
        }
      }
    }
    clamp();
    if (!moved) break;
  }

  return boxes.map((box, i) => ({ dx: pos[i].x - box.cx, dy: pos[i].y - box.cy }));
}

export interface LabelAnchorInput {
  /** Ponto exato do objeto que o rótulo nomeia. */
  ax: number;
  ay: number;
  /** Tamanho da pílula (já com folga para o destaque). */
  w: number;
  h: number;
}

type Pt = { x: number; y: number };
const segIntersects = (p1: Pt, p2: Pt, p3: Pt, p4: Pt) => {
  const d = (a: Pt, b: Pt, c: Pt) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4);
  return d1 * d2 < 0 && d3 * d4 < 0;
};
const segHitsRect = (a: Pt, b: Pt, r: { x0: number; y0: number; x1: number; y1: number }) => {
  const c = [{ x: r.x0, y: r.y0 }, { x: r.x1, y: r.y0 }, { x: r.x1, y: r.y1 }, { x: r.x0, y: r.y1 }];
  return segIntersects(a, b, c[0], c[1]) || segIntersects(a, b, c[1], c[2]) || segIntersects(a, b, c[2], c[3]) || segIntersects(a, b, c[3], c[0]);
};

/**
 * Posiciona todos os rótulos de uma cena de forma que:
 *  - nenhum rótulo cubra outro rótulo, nem o ponto de OUTRO objeto, nem o próprio ponto;
 *  - a seta de um rótulo nunca atravesse outro rótulo nem outra seta (sem ambiguidade de quem aponta para quem);
 *  - tudo fique dentro de `bounds` (abaixo da faixa de selos do topo e acima da legenda).
 * Devolve o deslocamento (dx, dy) do CENTRO do rótulo em relação ao seu ponto, em px. É determinístico e não
 * depende do tempo: o rótulo não pula durante o vídeo, só acompanha a câmera.
 */
export function placeLabels(
  items: LabelAnchorInput[],
  bounds: LabelBounds,
  opts: { lift: number; gap?: number } = { lift: 20 }
): { dx: number; dy: number }[] {
  const gap = opts.gap ?? 6;
  const placed: { rect: { x0: number; y0: number; x1: number; y1: number }; arrow: [Pt, Pt] }[] = [];
  const result: { dx: number; dy: number }[] = new Array(items.length);
  // Os objetos mais ao alto/esquerda primeiro: ficam com os melhores lugares e os demais desviam.
  const order = items.map((_, i) => i).sort((a, b) => items[a].ay - items[b].ay || items[a].ax - items[b].ax);
  const L = opts.lift;

  for (const i of order) {
    const it = items[i];
    const { w, h } = it;
    const cands: Pt[] = [
      { x: 0, y: -(L + h / 2) },
      { x: -w * 0.32, y: -(L + h / 2) },
      { x: w * 0.32, y: -(L + h / 2) },
      { x: 0, y: L + h / 2 },
      { x: -w * 0.32, y: L + h / 2 },
      { x: w * 0.32, y: L + h / 2 },
      { x: -(w / 2 + L * 0.7), y: -h * 0.2 },
      { x: w / 2 + L * 0.7, y: -h * 0.2 },
      { x: -w * 0.5, y: -(L * 2 + h * 1.5) },
      { x: w * 0.5, y: -(L * 2 + h * 1.5) },
      { x: 0, y: -(L * 2 + h * 1.5) },
      { x: 0, y: L * 2 + h * 1.5 },
      { x: -w * 0.55, y: L * 2 + h * 1.5 },
      { x: w * 0.55, y: L * 2 + h * 1.5 },
    ];
    // anéis de posições em volta do ponto (do mais próximo ao mais distante), para cenas densas
    for (const k of [1, 1.8, 2.8]) {
      for (let a = 0; a < 360; a += 30) {
        const r = (a * Math.PI) / 180;
        cands.push({ x: Math.cos(r) * (w / 2 + L * 0.6) * k, y: -Math.sin(r) * (h / 2 + L) * k });
      }
    }
    let best = { score: Infinity, dx: 0, dy: -(L + h / 2) };
    cands.forEach((c, ci) => {
      let cx = it.ax + c.x;
      let cy = it.ay + c.y;
      const minX = bounds.x + w / 2, maxX = bounds.x + bounds.w - w / 2;
      const minY = bounds.y + h / 2, maxY = bounds.y + bounds.h - h / 2;
      const px = minX > maxX ? bounds.x + bounds.w / 2 : Math.min(maxX, Math.max(minX, cx));
      const py = minY > maxY ? bounds.y + bounds.h / 2 : Math.min(maxY, Math.max(minY, cy));
      let score = ci * 6 + (Math.abs(px - cx) + Math.abs(py - cy)) * 4;
      cx = px; cy = py;
      const rect = { x0: cx - w / 2 - gap, y0: cy - h / 2 - gap, x1: cx + w / 2 + gap, y1: cy + h / 2 + gap };
      const arrow: [Pt, Pt] = [{ x: cx, y: cy }, { x: it.ax, y: it.ay }];
      // não cobrir o próprio ponto nem o ponto de outro objeto
      items.forEach((o, j) => {
        const covers = o.ax > rect.x0 - 4 && o.ax < rect.x1 + 4 && o.ay > rect.y0 - 4 && o.ay < rect.y1 + 4;
        if (covers) score += j === i ? 6000 : 3500;
      });
      for (const p of placed) {
        const ox = Math.min(rect.x1, p.rect.x1) - Math.max(rect.x0, p.rect.x0);
        const oy = Math.min(rect.y1, p.rect.y1) - Math.max(rect.y0, p.rect.y0);
        if (ox > 0 && oy > 0) score += 2500 + ox * oy;
        if (segHitsRect(arrow[0], arrow[1], p.rect)) score += 2200; // minha seta atravessa outro rótulo
        if (segHitsRect(p.arrow[0], p.arrow[1], rect)) score += 2200; // a seta dele atravessa meu rótulo
        if (segIntersects(arrow[0], arrow[1], p.arrow[0], p.arrow[1])) score += 1800; // setas se cruzam
      }
      // setas de objetos ainda não colocados também não devem ser cortadas pelo meu rótulo (pontos já testados acima)
      score += Math.hypot(cx - it.ax, cy - it.ay) * 0.15;
      if (score < best.score) best = { score, dx: cx - it.ax, dy: cy - it.ay };
    });
    result[i] = { dx: best.dx, dy: best.dy };
    const cx = it.ax + best.dx, cy = it.ay + best.dy;
    placed.push({
      rect: { x0: cx - w / 2 - gap, y0: cy - h / 2 - gap, x1: cx + w / 2 + gap, y1: cy + h / 2 + gap },
      arrow: [{ x: cx, y: cy }, { x: it.ax, y: it.ay }],
    });
  }
  return result;
}
