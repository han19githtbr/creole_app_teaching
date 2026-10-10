import { bgDesk, bgOutdoor, bgRoom, r, c, e, p, ln } from "./lib.mjs";

// Cada objeto: id, fr (com artigo, igual ao rótulo da resposta), tip (ponta da seta), draw(uid)
export const TECNOLOGIA = {
  id: "tecnologia", label: "Tecnologia",
  items: [
    { id: "ordinateur", fr: "Un ordinateur portable", tip: [150, 165], draw: (u) => bgDesk(u) +
      r(150, 105, 200, 130, "#2b3445", 10) + r(160, 115, 180, 108, "#5aa7e8", 4) + p("M160 115h180v50q-90 30-180-8z", "#8cc6f5", 'opacity=".55"') +
      p("M112 238h276l22 26H90z", "#b9c3d2", 'stroke="#8d97a8" stroke-width="2"') + r(215, 246, 60, 9, "#9aa5b8", 3) },
    { id: "souris", fr: "Une souris d'ordinateur", tip: [205, 205], draw: (u) => bgDesk(u) +
      ln("M245 172 Q250 120 310 110 T380 80", "#3a4254", 4) +
      p("M208 246Q206 178 245 172Q284 178 282 246Q282 270 245 270Q208 270 208 246Z", "#eef1f6", 'stroke="#7f8aa0" stroke-width="3"') +
      ln("M208 212H282M245 173V212", "#7f8aa0", 3) + r(240, 186, 10, 18, "#4a90e2", 5) },
    { id: "cle-usb", fr: "Une clé USB", tip: [180, 200], draw: (u) => bgDesk(u) +
      r(320, 205, 52, 36, "#cdd3de", 4, 'stroke="#8a95a8" stroke-width="3"') + r(332, 216, 10, 14, "#6c7688", 2) + r(350, 216, 10, 14, "#6c7688", 2) +
      r(188, 190, 140, 66, "#2f3b52", 14) + c(212, 223, 10, "#cdd3de") + c(212, 223, 5, "#2f3b52") + r(240, 208, 64, 8, "#4a90e2", 4) + c(300, 238, 4, "#4ade80") },
    { id: "drone", fr: "Un drone", tip: [170, 185], draw: (u) => bgOutdoor(u) +
      ln("M215 200L165 168M275 200L328 168M222 212L170 232M268 212L322 232", "#2f3744", 6) +
      e(160, 163, 44, 7, "#9fb4cc", 'opacity=".75"') + e(332, 163, 44, 7, "#9fb4cc", 'opacity=".75"') + e(165, 233, 44, 7, "#9fb4cc", 'opacity=".75"') + e(325, 233, 44, 7, "#9fb4cc", 'opacity=".75"') +
      c(160, 166, 6, "#2f3744") + c(332, 166, 6, "#2f3744") + c(165, 236, 6, "#2f3744") + c(325, 236, 6, "#2f3744") +
      e(245, 205, 46, 22, "#3a4254") + e(245, 198, 36, 14, "#56607a") + c(245, 232, 11, "#161b26") + c(245, 232, 5, "#4a90e2") },
  ],
};

export const NATUREZA = {
  id: "natureza", label: "Natureza",
  items: [
    { id: "arbre", fr: "Un arbre", tip: [160, 175], draw: (u) => bgOutdoor(u) +
      p("M228 290L234 175H256L262 290Z", "#8a5a33") + ln("M246 215L218 188M246 200L274 178", "#6e4526", 7) +
      c(245, 125, 68, "#3f9a4a") + c(190, 160, 50, "#4cb05a") + c(300, 160, 50, "#4cb05a") + c(245, 165, 52, "#58bb64") + c(215, 120, 20, "#6bcf76", 'opacity=".6"') },
    { id: "fleur", fr: "Une fleur", tip: [175, 140], draw: (u) => bgOutdoor(u) +
      ln("M245 290V165", "#3a8a3e", 8) + p("M245 250Q200 240 190 205Q235 205 245 250Z", "#4cb05a") + p("M245 235Q290 225 300 192Q255 192 245 235Z", "#4cb05a") +
      [0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="245" cy="108" rx="19" ry="36" fill="#f26ca7" transform="rotate(${a} 245 150)"/>`).join("") + c(245, 150, 22, "#ffd23f") + c(245, 150, 11, "#f2a516") },
    { id: "papillon", fr: "Un papillon", tip: [168, 160], draw: (u) => bgOutdoor(u) +
      p("M245 195Q180 90 160 160Q150 200 245 205Z", "#f59e0b", 'stroke="#7c2d12" stroke-width="3"') + p("M245 195Q310 90 330 160Q340 200 245 205Z", "#f59e0b", 'stroke="#7c2d12" stroke-width="3"') +
      p("M245 207Q190 215 185 260Q200 285 245 225Z", "#8b5cf6", 'stroke="#4c1d95" stroke-width="3"') + p("M245 207Q300 215 305 260Q290 285 245 225Z", "#8b5cf6", 'stroke="#4c1d95" stroke-width="3"') +
      c(190, 150, 14, "#fff", 'opacity=".85"') + c(300, 150, 14, "#fff", 'opacity=".85"') + e(245, 205, 8, 40, "#2b2118") + ln("M243 168Q225 135 210 128M247 168Q265 135 280 128", "#2b2118", 3) },
    { id: "champignon", fr: "Un champignon", tip: [165, 185], draw: (u) => bgOutdoor(u, ["#bfe3c2", "#eef9ee"], "#5f9e4f", "#7db36d") +
      p("M222 215Q216 275 205 285H285Q274 275 268 215Z", "#f6ecd9", 'stroke="#d8c8a6" stroke-width="3"') +
      p("M160 220Q160 118 245 112Q330 118 330 220Q245 236 160 220Z", "#d6392b", 'stroke="#8f1d14" stroke-width="3"') +
      c(210, 160, 14, "#fff") + c(262, 140, 17, "#fff") + c(296, 185, 11, "#fff") + c(228, 198, 9, "#fff") },
  ],
};

export const CULTURA = {
  id: "cultura", label: "Cultura",
  items: [
    { id: "tambour", fr: "Un tambour", tip: [172, 205], draw: (u) => bgRoom(u, ["#f8dfb3", "#eebf80"], "#a56a3a", "#c88f5a") +
      r(180, 175, 130, 90, "#b5651d", 6) + e(245, 265, 65, 16, "#8a4a12") + e(245, 175, 65, 18, "#f2dca8", 'stroke="#8a4a12" stroke-width="3"') +
      ln("M190 180L215 260L240 180L265 260L290 180L300 255", "#f5e2b8", 4) + ln("M300 140L265 165M190 140L225 165", "#7a4a22", 6) + c(302, 138, 8, "#7a4a22") + c(188, 138, 8, "#7a4a22") },
    { id: "drapeau", fr: "Un drapeau", tip: [197, 150], draw: (u) => bgOutdoor(u) +
      r(200, 85, 8, 195, "#6b4a2a", 3) + c(204, 82, 7, "#f2c14e") +
      p("M208 95Q270 80 320 98T370 100V150H208Z", "#1f4fb8") + p("M208 150H370V195Q320 210 270 192T208 200Z", "#d1122b") +
      r(262, 124, 34, 34, "#fff", 3, 'opacity=".95"') + c(279, 141, 9, "#3a8a3e") },
    { id: "lanterne", fr: "Une lanterne", tip: [172, 185], draw: (u) => bgRoom(u, ["#33284a", "#1c1530"], "#4a3a2a", "#6a553a") +
      ln("M245 40V92", "#d9b25a", 4) + r(222, 90, 46, 12, "#d9a53a", 4) + p("M215 104H275Q290 160 275 235H215Q200 160 215 104Z", "#d62828") +
      e(245, 170, 36, 54, "#ff8a3d", 'opacity=".55"') + ln("M222 108Q208 170 222 232M268 108Q282 170 268 232M215 140H275M217 200H273", "#f2c14e", 4) + r(220, 234, 50, 12, "#d9a53a", 4) +
      ln("M245 246V275", "#f2c14e", 4) + c(245, 280, 6, "#f2c14e") },
    { id: "masque", fr: "Un masque", tip: [170, 175], draw: (u) => bgRoom(u, ["#e9f2e4", "#cfe3c4"], "#8a6a45", "#b08a5a") +
      p("M245 85Q330 90 320 190Q310 270 245 285Q180 270 170 190Q160 90 245 85Z", "#e9b44c", 'stroke="#8a5a12" stroke-width="4"') +
      p("M195 160Q215 140 235 162Q215 178 195 160Z", "#2b1b0e") + p("M255 162Q275 140 295 160Q275 178 255 162Z", "#2b1b0e") +
      p("M232 200L245 180L258 200Q245 212 232 200Z", "#c98a2c") + p("M215 238Q245 262 275 238Q245 252 215 238Z", "#7a1d1d") +
      ln("M245 88V140", "#d62828", 8) + c(210, 118, 7, "#d62828") + c(280, 118, 7, "#d62828") },
  ],
};

export const TURISMO = {
  id: "turismo", label: "Turismo",
  items: [
    { id: "valise", fr: "Une valise", tip: [160, 195], draw: (u) => bgOutdoor(u, ["#8fd3f4", "#dff3fb"], "#e8d5a2", "#c9e6f5") +
      ln("M215 175V150Q215 140 225 140H265Q275 140 275 150V175", "#5a3b1e", 8) + r(165, 172, 160, 106, "#c0392b", 12) +
      r(165, 205, 160, 8, "#8e2a20") + r(185, 172, 10, 106, "#8e2a20") + r(295, 172, 10, 106, "#8e2a20") + r(232, 214, 26, 16, "#f2c14e", 3) +
      c(190, 285, 8, "#333") + c(300, 285, 8, "#333") },
    { id: "appareil-photo", fr: "Un appareil photo", tip: [160, 190], draw: (u) => bgOutdoor(u, ["#8fd3f4", "#dff3fb"], "#e8d5a2", "#c9e6f5") +
      r(165, 170, 160, 100, "#2d2d34", 14) + p("M205 170L215 150H265L275 170Z", "#3b3b44") + r(176, 180, 34, 14, "#e5e7eb", 3) + c(298, 188, 7, "#f2c14e") +
      c(245, 222, 42, "#55555e") + c(245, 222, 33, "#1b1e2e") + c(245, 222, 20, "#2c3a64") + c(236, 213, 7, "#fff", 'opacity=".7"') + r(172, 252, 146, 10, "#c0392b", 2) },
    { id: "parasol", fr: "Un parasol", tip: [152, 168], draw: (u) => bgOutdoor(u, ["#8fd3f4", "#dff3fb"], "#f0dca8", "#7dd3e8") +
      r(242, 118, 7, 170, "#7a5a3a", 3) +
      p("M245 62Q150 78 120 165Q150 148 182 165Z", "#e53935") + p("M245 62Q215 90 182 165Q213 148 245 165Z", "#f3f3f3") +
      p("M245 62Q275 90 308 165Q277 148 245 165Z", "#e53935") + p("M245 62Q340 78 370 165Q340 148 308 165Z", "#f3f3f3") + c(245, 60, 6, "#7a5a3a") },
    { id: "avion", fr: "Un avion", tip: [150, 170], draw: (u) => bgOutdoor(u, ["#5fb3ee", "#d7efff"]) +
      p("M130 190Q135 160 200 158H350Q400 165 375 190Q350 215 200 215Q140 215 130 190Z", "#f4f6f8", 'stroke="#9aa5b4" stroke-width="3"') +
      p("M215 178L170 120H210L275 178Z", "#cfd8e3", 'stroke="#9aa5b4" stroke-width="3"') + p("M215 198L170 252H210L275 198Z", "#cfd8e3", 'stroke="#9aa5b4" stroke-width="3"') +
      p("M345 165L378 128H395L378 168Z", "#1f4fb8") + [210, 235, 260, 285, 310].map((x) => c(x, 176, 6, "#6fb7ea")).join("") + r(150, 188, 220, 6, "#1f4fb8") + p("M130 190Q132 175 160 168L165 190Z", "#6fb7ea") },
  ],
};
