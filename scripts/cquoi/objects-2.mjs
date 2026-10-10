import { bgOutdoor, bgRoom, bgStage, bgStone, r, c, e, p, ln } from "./lib.mjs";

export const INTERIOR = {
  id: "interior", label: "Vida no interior",
  items: [
    { id: "seau", fr: "Un seau", tip: [165, 205], draw: (u) => bgOutdoor(u, ["#a9dcf2", "#eaf7fc"], "#9ac46a", "#b5d98a") +
      ln("M185 178Q245 105 305 178", "#6b7280", 5) + p("M180 178H310L292 272Q245 284 198 272Z", "#9aa5b4", 'stroke="#6b7280" stroke-width="3"') +
      e(245, 178, 65, 12, "#cfd8e3", 'stroke="#6b7280" stroke-width="3"') + ln("M190 205Q245 218 300 205M194 238Q245 250 296 238", "#6b7280", 3) + e(245, 183, 56, 8, "#6fb7ea", 'opacity=".8"') },
    { id: "arrosoir", fr: "Un arrosoir", tip: [150, 200], draw: (u) => bgOutdoor(u, ["#a9dcf2", "#eaf7fc"], "#9ac46a", "#b5d98a") +
      ln("M200 175Q245 110 290 175", "#2c7a7b", 6) + p("M190 175H300L292 270H198Z", "#38b2ac", 'stroke="#2c7a7b" stroke-width="3"') + e(245, 175, 55, 10, "#81e6d9", 'stroke="#2c7a7b" stroke-width="3"') +
      p("M298 215L395 150L408 164L302 245Z", "#38b2ac", 'stroke="#2c7a7b" stroke-width="3"') + e(412, 150, 16, 22, "#2c7a7b", 'transform="rotate(30 412 150)"') + [0, 1, 2].map((i) => `<circle cx="${425 + i * 6}" cy="${178 + i * 16}" r="3.5" fill="#6fb7ea"/>`).join("") },
    { id: "brouette", fr: "Une brouette", tip: [150, 200], draw: (u) => bgOutdoor(u, ["#a9dcf2", "#eaf7fc"], "#9ac46a", "#b5d98a") +
      ln("M180 205L120 170M285 235L400 170", "#8a5a33", 9) + p("M170 175H330L305 245H205Z", "#d97706", 'stroke="#92400e" stroke-width="3"') + ln("M190 190L215 235M250 190V235M310 190L285 235", "#92400e", 3) +
      c(245, 268, 26, "#2d2d34") + c(245, 268, 11, "#9ca3af") + ln("M210 245L195 285M295 245L310 285", "#8a5a33", 6) },
    { id: "fourche", fr: "Une fourche", tip: [165, 140], draw: (u) => bgOutdoor(u, ["#a9dcf2", "#eaf7fc"], "#9ac46a", "#b5d98a") +
      r(240, 140, 10, 150, "#8a5a33", 4) + r(205, 128, 80, 14, "#9ca3af", 4) + [210, 235, 262, 284].map((x) => r(x - 3, 70, 7, 62, "#9ca3af", 3)).join("") + p("M208 128L282 128L270 140H220Z", "#7b8494") },
  ],
};

export const DANCA = {
  id: "danca", label: "Dança",
  items: [
    { id: "chaussons", fr: "Des chaussons de danse", tip: [160, 205], draw: (u) => bgStage(u, "#45315f", "#8a64b8") +
      [[190, 0], [290, 8]].map(([x, rot]) => `<g transform="rotate(${rot} ${x} 235)"><path d="M${x - 40} 255Q${x - 40} 205 ${x - 5} 200Q${x + 25} 195 ${x + 40} 225Q${x + 50} 255 ${x} 262Z" fill="#f9a8c4" stroke="#d6639a" stroke-width="3"/><ellipse cx="${x - 2}" cy="214" rx="20" ry="10" fill="#fff" opacity=".35"/></g>`).join("") +
      ln("M178 205Q150 150 150 105M210 203Q232 140 220 95M292 212Q270 150 282 100M318 215Q344 160 335 110", "#f9a8c4", 5) },
    { id: "eventail", fr: "Un éventail", tip: [165, 205], draw: (u) => bgStage(u, "#2f4a63", "#5b8fb9") +
      Array.from({ length: 7 }, (_, i) => { const a = -75 + i * 25; return `<path d="M245 290L${245 + 190 * Math.sin((a - 12) * Math.PI / 180)} ${290 - 190 * Math.cos((a - 12) * Math.PI / 180)}L${245 + 190 * Math.sin((a + 12) * Math.PI / 180)} ${290 - 190 * Math.cos((a + 12) * Math.PI / 180)}Z" fill="${i % 2 ? "#fcd34d" : "#ef4444"}" stroke="#7c2d12" stroke-width="2"/>`; }).join("") + c(245, 290, 10, "#7c2d12") },
    { id: "ruban", fr: "Un ruban", tip: [180, 165], draw: (u) => bgStage(u, "#473a6e", "#8b7fd1") +
      ln("M120 250Q160 110 230 190T330 120T395 215", "#ec4899", 14) + ln("M120 250Q160 110 230 190T330 120T395 215", "#f9a8d4", 5) + r(110, 240, 16, 70, "#8a5a33", 6) },
    { id: "chapeau", fr: "Un chapeau", tip: [150, 195], draw: (u) => bgStage(u, "#3a2d5e", "#7b62b0") +
      e(245, 245, 125, 28, "#d8b26a", 'stroke="#8a6a2a" stroke-width="3"') + p("M175 245Q172 150 245 140Q318 150 315 245Q245 262 175 245Z", "#e7c27e", 'stroke="#8a6a2a" stroke-width="3"') + p("M176 232Q245 252 314 232V215Q245 235 176 215Z", "#c0392b") + c(300, 222, 9, "#f2c14e") },
  ],
};

export const GEOGRAFIA = {
  id: "geografia", label: "Geografia",
  items: [
    { id: "boussole", fr: "Une boussole", tip: [165, 175], draw: (u) => bgRoom(u, ["#f0e6d2", "#e0cfae"], "#9b7b53", "#c19a6b") +
      c(245, 190, 80, "#c9a14a", 'stroke="#8a6a1a" stroke-width="4"') + c(245, 190, 68, "#fffaf0", 'stroke="#8a6a1a" stroke-width="3"') + c(245, 112, 8, "#c9a14a") +
      p("M245 190L228 190L245 130L262 190Z", "#d62828") + p("M245 190L228 190L245 250L262 190Z", "#3b82f6") + c(245, 190, 6, "#333") +
      [["N", 245, 143], ["S", 245, 247], ["E", 298, 195], ["O", 192, 195]].map(([t, x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="16" fill="#5a4a2a">${t}</text>`).join("") },
    { id: "globe", fr: "Un globe terrestre", tip: [165, 165], draw: (u) => bgRoom(u, ["#e9eef7", "#cfd9ea"], "#7d6a52", "#a58a68") +
      ln("M200 280H290M245 275V252", "#6b4a2a", 9) + c(245, 170, 80, "#4aa3df", 'stroke="#2b6ea3" stroke-width="3"') +
      p("M200 130Q230 110 250 135Q235 160 215 150Q195 160 200 130Z", "#6bbf59") + p("M255 175Q300 160 312 190Q300 225 270 225Q255 205 255 175Z", "#6bbf59") + p("M205 190Q225 185 232 215Q215 235 205 215Z", "#6bbf59") +
      ln("M165 170Q245 200 325 170", "#fff", 2, 'opacity=".5"') + ln("M245 90Q300 170 245 250", "#fff", 2, 'opacity=".5"') + p("M190 120Q215 100 245 96", "none", 'stroke="#fff" stroke-width="5" opacity=".5"') },
    { id: "carte", fr: "Une carte", tip: [150, 175], draw: (u) => bgRoom(u, ["#efe4cf", "#ddc9a3"], "#8f6d45", "#b58f5f") +
      p("M140 130L205 112L285 135L350 115V265L285 285L205 262L140 282Z", "#f4e4b8", 'stroke="#8a6a2a" stroke-width="3"') + ln("M205 112V262M285 135V285", "#cdb27a", 3) +
      p("M165 175Q200 160 220 190Q200 220 170 210Z", "#8bc27a") + p("M300 160Q335 150 338 190Q320 220 295 205Z", "#8bc27a") + ln("M180 250Q240 200 300 250", "#d62828", 3, 'stroke-dasharray="8 7"') + ln("M308 248L328 270M328 248L308 270", "#d62828", 6) },
    { id: "montagne", fr: "Une montagne", tip: [170, 175], draw: (u) => bgOutdoor(u, ["#8ec9f0", "#e4f4fc"], "#7bb36a", "#9cc98a") +
      p("M110 285L220 110L300 230L345 160L420 285Z", "#7a8aa0") + p("M220 110L184 168Q205 178 220 165Q236 182 256 170Z", "#fff") + p("M345 160L322 198Q336 204 346 195Q356 206 370 198Z", "#fff") + p("M220 110L300 230L260 285H200Z", "#000", 'opacity=".12"') },
  ],
};

export const HISTORIA = {
  id: "historia", label: "História",
  items: [
    { id: "epee", fr: "Une épée", tip: [180, 150], draw: (u) => bgStone(u) +
      p("M238 60L252 60L256 215H234Z", "#d5dbe5", 'stroke="#8a95a8" stroke-width="3"') + ln("M245 66V210", "#fff", 3, 'opacity=".7"') + r(205, 213, 80, 14, "#c9a14a", 5) + r(238, 227, 14, 52, "#6b4a2a", 4) + c(245, 288, 10, "#c9a14a") },
    { id: "couronne", fr: "Une couronne", tip: [158, 170], draw: (u) => bgStone(u, "#c9bfdc", "#a89bc7") +
      p("M165 245L150 140L205 185L245 120L285 185L340 140L325 245Z", "#f2c14e", 'stroke="#a8761a" stroke-width="4"') + r(165, 232, 160, 24, "#e0a82b", 4, 'stroke="#a8761a" stroke-width="3"') +
      [150, 245, 340].map((x, i) => c(x, [135, 114, 135][i], 9, "#d62828")).join("") + c(205, 244, 7, "#2b6ea3") + c(245, 244, 7, "#2b8a4a") + c(285, 244, 7, "#2b6ea3") },
    { id: "parchemin", fr: "Un parchemin", tip: [160, 160], draw: (u) => bgStone(u, "#cdbf9d", "#b2a07a") +
      r(180, 105, 130, 160, "#f2e2b3", 4, 'stroke="#a8863a" stroke-width="3"') + e(245, 105, 65, 11, "#e8d49a", 'stroke="#a8863a" stroke-width="3"') + e(245, 265, 65, 11, "#e8d49a", 'stroke="#a8863a" stroke-width="3"') +
      ln("M200 140H290M200 162H290M200 184H275M200 206H290M200 228H260", "#8a6a2a", 3) + c(285, 235, 11, "#b91c1c") },
    { id: "bouclier", fr: "Un bouclier", tip: [168, 165], draw: (u) => bgStone(u) +
      p("M165 105H325V190Q325 255 245 290Q165 255 165 190Z", "#2b4c9b", 'stroke="#c9a14a" stroke-width="7"') + r(235, 105, 20, 185, "#f2c14e") + r(165, 160, 160, 20, "#f2c14e") + p("M245 105H325V190H245Z", "#fff", 'opacity=".08"') },
  ],
};
