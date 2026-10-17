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
