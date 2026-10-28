// Sorteia (de forma determinística) 19 grupos de 4 elementos: cada elemento em no máximo `cap` cenas e
// duas cenas quaisquer com no máximo 1 elemento em comum. Elementos de praia só entram nas cenas de praia.
export function solveGroups(ids, { beach = [], beachScenes = [2, 11, 17], cap = 4, seed = 1, scenes = 19, allow = () => true } = {}) {
  const normal = ids.filter((i) => !beach.includes(i));
  for (let attempt = 0; attempt < 4000; attempt++) {
    let a = (seed * 7919 + attempt * 104729) >>> 0;
    const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const use = Object.fromEntries(ids.map((i) => [i, 0]));
    const pairs = new Set(); const groups = []; let fail = false;
    for (let s = 0; s < scenes && !fail; s++) {
      const pool = (beachScenes.includes(s) ? [...beach, ...normal] : normal).filter((id) => allow(s, id));
      const order = pool.map((i) => [i, use[i] + rnd() * 1.4]).sort((x, y) => x[1] - y[1]).map((x) => x[0]);
      const g = [];
      if (beachScenes.includes(s) && beach.length) { // garante 1-2 elementos de praia
        const want = beach.filter((b) => use[b] < 2).sort((x, y) => use[x] - use[y] + (rnd() - 0.5)).slice(0, 2);
        for (const b of want) if (!g.some((x) => pairs.has([x, b].sort().join("|")))) g.push(b);
      }
      for (const e of order) {
        if (g.length === 4) break;
        if (g.includes(e) || use[e] >= cap) continue;
        if (g.some((x) => pairs.has([x, e].sort().join("|")))) continue;
        g.push(e);
      }
      if (g.length < 4) { fail = true; break; }
      groups.push(g);
      for (let i = 0; i < 4; i++) { use[g[i]]++; for (let j = i + 1; j < 4; j++) pairs.add([g[i], g[j]].sort().join("|")); }
    }
    if (!fail && ids.every((i) => use[i] > 0)) return groups;
  }
  throw new Error("sem solução para os grupos");
}
