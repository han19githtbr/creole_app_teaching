import { bgOutdoor, bgRoom, bgStage, bgStone, r, c, e, p, ln } from "./lib.mjs";

export const CINEMA = {
  id: "cinema", label: "Cinema",
  items: [
    { id: "clap", fr: "Un clap de cinéma", tip: [165, 175], draw: (u) => bgStage(u, "#26262e", "#4a4a5c") +
      r(170, 165, 150, 100, "#2a2a30", 6) + p("M165 135L320 108L330 140L175 168Z", "#f5f5f5", 'stroke="#111" stroke-width="3"') +
      [0, 1, 2, 3, 4].map((i) => p(`M${178 + i * 30} 165L${200 + i * 30} 130L${214 + i * 30} 127L${192 + i * 30} 163Z`, "#111")).join("") +
      r(170, 165, 150, 22, "#f5f5f5", 3) + [0, 1, 2, 3, 4].map((i) => p(`M${178 + i * 30} 187L${194 + i * 30} 165H${210 + i * 30}L${194 + i * 30} 187Z`, "#111")).join("") + ln("M185 215H300M185 238H270", "#f5f5f5", 4) },
    { id: "pop-corn", fr: "Du pop-corn", tip: [165, 170], draw: (u) => bgStage(u, "#3a1f2b", "#7a3a4a") +
      [[200, 150], [235, 135], [270, 140], [300, 160], [220, 170], [260, 168], [188, 178], [310, 185]].map(([x, y]) => `<g><circle cx="${x}" cy="${y}" r="17" fill="#fff6d6"/><circle cx="${x - 9}" cy="${y + 4}" r="11" fill="#fff0bf"/><circle cx="${x + 8}" cy="${y - 5}" r="10" fill="#ffe9a3"/></g>`).join("") +
      p("M185 190H305L290 285H200Z", "#fff", 'stroke="#b91c1c" stroke-width="2"') + [0, 1, 2, 3].map((i) => p(`M${192 + i * 28} 190L${196 + i * 22} 285H${210 + i * 22}L${208 + i * 28} 190Z`, "#d62828")).join("") },
    { id: "ticket", fr: "Un ticket de cinéma", tip: [155, 180], draw: (u) => bgStage(u, "#2a2438", "#52467a") +
      p("M150 150H340V190A14 14 0 0 0 340 218V255H150V218A14 14 0 0 0 150 190Z", "#f5c542", 'stroke="#a67c00" stroke-width="3"') + ln("M290 150V255", "#a67c00", 3, 'stroke-dasharray="6 6"') +
      ln("M175 185H265M175 205H245M175 225H260", "#7a5a00", 5) + p("M312 190l9 18 20-3-14 14 4 20-19-9-19 9 4-20-14-14 20 3z", "#d62828", 'transform="translate(-15 -8) scale(.9)"') },
    { id: "camera", fr: "Une caméra", tip: [150, 185], draw: (u) => bgStage(u, "#2b2b36", "#555570") +
      r(185, 165, 125, 80, "#2d2d34", 10) + p("M310 185L370 160V250L310 225Z", "#3c3c46") + c(215, 140, 32, "#2d2d34") + c(265, 140, 26, "#2d2d34") + c(215, 140, 20, "#9aa5b4") + c(265, 140, 15, "#9aa5b4") +
      c(215, 140, 8, "#2d2d34") + c(265, 140, 6, "#2d2d34") + c(200, 190, 6, "#e53935") + ln("M245 245L215 285M245 245L275 285", "#3c3c46", 6) },
  ],
};

export const MUSICA = {
  id: "musica", label: "Música",
  items: [
    { id: "guitare", fr: "Une guitare", tip: [175, 215], draw: (u) => bgStage(u, "#38305a", "#6a5aa6") +
      r(237, 60, 16, 130, "#3a2a1a", 3) + r(231, 36, 28, 30, "#2a1a0e", 5) + [236, 245, 254].map((x) => c(x, 46, 3, "#e5e7eb")).join("") +
      p("M245 160Q205 150 205 195Q205 215 225 228Q190 245 195 268Q205 290 245 290Q285 290 295 268Q300 245 265 228Q285 215 285 195Q285 150 245 160Z", "#c8762f", 'stroke="#7a3f10" stroke-width="4"') +
      c(245, 232, 20, "#1a1008") + r(222, 266, 46, 8, "#3a2a1a", 3) + ln("M241 70V266M245 70V266M249 70V266", "#e5e7eb", 1.4) },
    { id: "trompette", fr: "Une trompette", tip: [150, 200], draw: (u) => bgStage(u, "#2c3f5e", "#557aa8") +
      ln("M180 215H330Q365 215 365 185Q365 155 330 155H190", "#e0a82b", 10) + p("M330 215L395 160V265Z", "#e0a82b", 'stroke="#a8761a" stroke-width="3"') + ln("M200 215V180M230 215V180M260 215V180", "#c9892a", 6) +
      [200, 230, 260].map((x) => c(x, 172, 9, "#f2d36b", 'stroke="#a8761a" stroke-width="2"')).join("") + c(180, 215, 14, "#f2d36b", 'stroke="#a8761a" stroke-width="3"') },
    { id: "casque", fr: "Un casque audio", tip: [160, 190], draw: (u) => bgStage(u, "#3b2a5e", "#7456b6") +
      ln("M185 225Q185 105 245 105Q305 105 305 225", "#2d2d34", 14) + r(160, 195, 50, 85, "#e53935", 22) + r(280, 195, 50, 85, "#e53935", 22) + r(166, 210, 14, 55, "#7f1d1d", 7) + r(310, 210, 14, 55, "#7f1d1d", 7) },
    { id: "microphone", fr: "Un microphone", tip: [165, 160], draw: (u) => bgStage(u, "#3a2d5e", "#7b62b0") +
      c(245, 150, 48, "#9ca3af", 'stroke="#4b5563" stroke-width="4"') + ln("M205 128H285M200 150H290M205 172H285", "#4b5563", 3) + ln("M215 105Q245 85 275 105", "#e5e7eb", 4, 'opacity=".6"') +
      p("M228 195H262L270 280H220Z", "#2d2d34") + r(232, 205, 26, 10, "#6b7280", 3) },
  ],
};

export const LAZERES = {
  id: "lazeres", label: "Lazeres",
  items: [
    { id: "ballon", fr: "Un ballon de football", tip: [160, 195], draw: (u) => bgOutdoor(u, ["#8fd3f4", "#e6f6ff"], "#5fb35a", "#8ccf7d") +
      c(245, 205, 72, "#fff", 'stroke="#222" stroke-width="4"') + p("M245 168L276 190L264 226H226L214 190Z", "#222") + ln("M245 168V135M276 190L305 178M264 226L282 255M226 226L208 255M214 190L185 178", "#222", 4) +
      ln("M245 135L270 140M305 178L310 205M282 255L258 270M208 255L190 232M185 178L195 152", "#222", 3) },
    { id: "velo", fr: "Un vélo", tip: [150, 200], draw: (u) => bgOutdoor(u, ["#8fd3f4", "#e6f6ff"], "#9ac46a", "#b5d98a") +
      c(180, 235, 48, "none", 'stroke="#222" stroke-width="7"') + c(330, 235, 48, "none", 'stroke="#222" stroke-width="7"') + c(180, 235, 6, "#222") + c(330, 235, 6, "#222") +
      ln("M180 235L225 160H300L330 235M225 160L255 235H180M300 160L255 235", "#d62828", 7) + ln("M215 148H240M300 160L292 128H318", "#222", 7) + c(255, 235, 11, "#9ca3af", 'stroke="#222" stroke-width="3"') },
    { id: "cerf-volant", fr: "Un cerf-volant", tip: [185, 130], draw: (u) => bgOutdoor(u, ["#79c7ef", "#e0f4fd"], "#8fcf70", "#a9dc8f") +
      p("M270 55L330 130L270 205L210 130Z", "#e53935") + p("M270 55L330 130L270 130Z", "#fcd34d") + p("M270 205L210 130L270 130Z", "#fcd34d") + ln("M270 55V205M210 130H330", "#7a2a1a", 2.5) +
      ln("M270 205Q250 250 285 280T250 310", "#555", 2.5) + [[262, 242], [274, 262], [268, 284]].map(([x, y]) => p(`M${x} ${y}l12 -8v16z`, "#3b82f6")).join("") },
    { id: "raquette", fr: "Une raquette de tennis", tip: [170, 160], draw: (u) => bgOutdoor(u, ["#8fd3f4", "#e6f6ff"], "#6fae6a", "#92c98b") +
      e(245, 140, 56, 72, "none", 'stroke="#d62828" stroke-width="10"') + ln("M200 110H290M196 135H294M196 160H294M205 185H285M222 78V205M245 70V212M268 78V205", "#e5e7eb", 2) + r(237, 208, 16, 82, "#2d2d34", 6) + c(335, 245, 24, "#d9f20a", 'stroke="#9bb000" stroke-width="3"') + ln("M318 232Q335 245 318 260", "#fff", 3) },
  ],
};

export const ESTOICISMO = {
  id: "estoicismo", label: "Estoicismo",
  items: [
    { id: "colonne", fr: "Une colonne", tip: [175, 150], draw: (u) => bgStone(u, "#e7e0d0", "#cfc4aa") +
      r(190, 80, 110, 20, "#efe9dc", 3, 'stroke="#b5a98c" stroke-width="2"') + r(205, 100, 80, 14, "#e6dfce", 3) + r(210, 114, 70, 150, "#f2ecdf", 4, 'stroke="#b5a98c" stroke-width="2"') +
      [225, 245, 265].map((x) => ln(`M${x} 116V262`, "#cfc4aa", 3)).join("") + r(200, 262, 90, 14, "#e6dfce", 3) + r(185, 276, 120, 14, "#efe9dc", 3, 'stroke="#b5a98c" stroke-width="2"') },
    { id: "sablier", fr: "Un sablier", tip: [165, 170], draw: (u) => bgStone(u, "#d9cfb8", "#bfb08f") +
      r(185, 82, 120, 16, "#8a5a33", 5) + r(185, 262, 120, 16, "#8a5a33", 5) + p("M200 98H290Q290 160 258 180Q290 200 290 262H200Q200 200 232 180Q200 160 200 98Z", "#e6f4fa", 'stroke="#6b7a88" stroke-width="3" opacity=".9"') +
      p("M215 105H275Q272 140 252 165H238Q218 140 215 105Z", "#e8c15b") + p("M232 255Q235 225 245 205Q255 225 258 255Z", "#e8c15b") + ln("M245 178V205", "#e8c15b", 3) },
    { id: "balance", fr: "Une balance", tip: [158, 170], draw: (u) => bgStone(u, "#d9cfb8", "#bfb08f") +
      r(240, 90, 10, 180, "#8a6a2a", 4) + r(205, 266, 80, 14, "#8a6a2a", 4) + ln("M155 118H335", "#8a6a2a", 8) + c(245, 88, 9, "#c9a14a") +
      ln("M165 120L135 205M165 120L195 205M325 120L295 205M325 120L355 205", "#8a6a2a", 3) + p("M125 205H205Q200 235 165 238Q130 235 125 205Z", "#c9a14a", 'stroke="#8a6a2a" stroke-width="3"') + p("M285 205H365Q360 235 325 238Q290 235 285 205Z", "#c9a14a", 'stroke="#8a6a2a" stroke-width="3"') },
    { id: "livre", fr: "Un livre", tip: [160, 195], draw: (u) => bgStone(u, "#d9cfb8", "#bfb08f") +
      p("M150 255V135Q200 120 245 148Q290 120 340 135V255Q290 242 245 268Q200 242 150 255Z", "#f6efe0", 'stroke="#8a6a2a" stroke-width="3"') + ln("M245 148V268", "#8a6a2a", 3) +
      ln("M170 160Q205 155 228 168M170 182Q205 177 228 190M170 204Q205 199 228 212M262 168Q285 155 320 160M262 190Q285 177 320 182M262 212Q285 199 320 204", "#a8956a", 3) + p("M150 255L160 270Q205 255 245 280Q285 255 330 270L340 255Q290 242 245 268Q200 242 150 255Z", "#8b3a2a") },
  ],
};

export const RELIGIAO = {
  id: "religiao", label: "Religião",
  items: [
    { id: "eglise", fr: "Une église", tip: [160, 175], draw: (u) => bgOutdoor(u, ["#a9d8f0", "#f1f8fc"], "#86c474", "#a5d894") +
      r(190, 170, 120, 110, "#f2ead8", 3, 'stroke="#b5a98c" stroke-width="3"') + p("M180 172L250 105L320 172Z", "#9a4a2a") + r(236, 55, 28, 60, "#f2ead8", 2, 'stroke="#b5a98c" stroke-width="3"') + p("M232 58L250 28L268 58Z", "#9a4a2a") +
      ln("M250 30V10M242 18H258", "#c9a14a", 3) + p("M230 280V230Q250 205 270 230V280Z", "#7a4a2a") + [[208, 215], [292, 215]].map(([x, y]) => p(`M${x - 9} ${y + 22}V${y}Q${x} ${y - 12} ${x + 9} ${y}V${y + 22}Z`, "#6fb7ea")).join("") + c(250, 140, 9, "#6fb7ea") },
    { id: "bougie", fr: "Une bougie", tip: [180, 175], draw: (u) => bgStone(u, "#3b2f3f", "#241b2b") +
      p("M205 160H285V275H205Z", "#fff6dc", 'stroke="#d9c79a" stroke-width="3"') + p("M205 160Q225 190 245 168Q265 192 285 160Z", "#f1e2b8") + ln("M245 160V132", "#333", 4) +
      p("M245 70Q222 105 232 128Q245 140 258 128Q268 105 245 70Z", "#ffb020") + p("M245 92Q235 112 240 126Q245 132 250 126Q255 112 245 92Z", "#fff3a0") + e(245, 275, 55, 8, "#d9c79a") + c(245, 110, 52, "#ffb020", 'opacity=".12"') },
    { id: "colombe", fr: "Une colombe", tip: [165, 165], draw: (u) => bgOutdoor(u, ["#8fc9ee", "#eaf6fd"]) +
      p("M205 200Q200 160 245 160Q285 160 300 190Q330 195 345 225Q310 225 285 215Q265 245 220 240Q205 230 205 200Z", "#fff", 'stroke="#aab6c4" stroke-width="3"') +
      p("M245 170Q230 100 190 90Q205 135 225 175Z", "#fff", 'stroke="#aab6c4" stroke-width="3"') + p("M255 170Q285 105 330 100Q305 145 275 178Z", "#f4f7fa", 'stroke="#aab6c4" stroke-width="3"') +
      c(222, 180, 3.5, "#222") + p("M205 190L186 198L205 206Z", "#f59e0b") + ln("M235 160Q222 120 190 115", "#78b83e", 3) },
    { id: "croix", fr: "Une croix", tip: [170, 150], draw: (u) => bgStone(u, "#e8e0cf", "#cfc4aa") +
      r(228, 80, 34, 190, "#8a5a33", 4, 'stroke="#5a3a1a" stroke-width="3"') + r(180, 126, 130, 34, "#8a5a33", 4, 'stroke="#5a3a1a" stroke-width="3"') + ln("M236 90V262M188 143H302", "#a8793f", 3, 'opacity=".6"') + e(245, 285, 60, 8, "#000", 'opacity=".12"') },
  ],
};
