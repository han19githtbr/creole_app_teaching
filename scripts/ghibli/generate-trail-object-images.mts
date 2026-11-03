import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { IDIOMAS_EXTRA_ITEMS } from "../../src/lib/curiousTrailData";
import { TRAIL_EXTRA_ITEMS } from "../../src/lib/curiousTrailExtraItems";
import { commonDefs, f } from "./diverse/kit.mjs";
import { THEMES } from "./diverse/themes.mjs";

type DrawingEntry = {
  fr?: string;
  pt?: string;
  k?: string;
  w: number;
  h: number;
  s?: number;
  draw: () => string;
};

const outputDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../public/ghibli/trail-objects");
const items = [...TRAIL_EXTRA_ITEMS, ...IDIOMAS_EXTRA_ITEMS];
const drawingAliases: Record<string, string> = {
  "idiomas-dictionnaire": "dictionary",
  "idiomas-livre-ouvert": "openbook",
  "idiomas-globe": "globe",
  "idiomas-cahier": "notebook",
  "idiomas-crayon": "pencil",
  "idiomas-tableau": "blackboard",
  "idiomas-drapeaux": "flags",
  "idiomas-cartable": "schoolbag",
  "idiomas-lettres": "alphabet",
  "idiomas-pupitre": "desk",
  "musica-trail-extra-partition": "score",
  "idiomas-trail-extra-gomme": "eraser",
  "idiomas-trail-extra-regle": "ruler",
  "idiomas-trail-extra-carnet": "notebook",
  "idiomas-trail-extra-globe-lum": "globe",
};
const fallbackDrawings: Record<string, string> = {
  "geografia-trail-extra-altimetre": `<g stroke="#385a68" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"><circle cx="600" cy="400" r="205" fill="#e9f2f4"/><circle cx="600" cy="400" r="150" fill="#fffdf4"/><path d="M600 400 720 285" stroke="#d64a36" stroke-width="18"/><circle cx="600" cy="400" r="22" fill="#d64a36"/><path d="M600 280v30M720 400h-30M600 520v-30M480 400h30M515 315l22 22M685 315l-22 22" fill="none"/></g>`,
  "geografia-trail-extra-sextant": `<g fill="none" stroke="#b48136" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"><path d="M390 550a280 280 0 0 1 420 0"/><path d="M410 550h380M600 550 730 260M600 550 470 320"/><path d="M710 250h145M785 250l-70 70"/><circle cx="600" cy="550" r="24" fill="#b48136"/></g>`,
  "geografia-trail-extra-relief": `<g stroke="#56734d" stroke-width="18" stroke-linejoin="round"><path d="M300 300 500 210l200 90 200-90v300l-200 90-200-90-200 90z" fill="#c6d9a8"/><path d="m300 300 200 90 200-90 200 90M500 210v300M700 300v300" fill="none"/><path d="M350 320q70-100 140-30t130 0q70-70 130 10M350 400q70-90 140-25t130 0q70-60 130 10M350 480q70-80 140-25t130 0q70-50 130 10" fill="none" stroke="#8ba96f" stroke-width="12"/></g>`,
  "historia-trail-extra-relique": `<g stroke="#75472d" stroke-width="20" stroke-linejoin="round"><path d="M520 260h160l-20 85q120 85 70 245-130 110-260 0-50-160 70-245z" fill="#b8623d"/><path d="M520 260q80-90 160 0M520 345q-120-10-60 90M680 345q120-10 60 90M480 470q120 60 240 0" fill="none"/><path d="M520 510q80 70 160 0" fill="none" stroke="#e0b774" stroke-width="12"/></g>`,
  "historia-trail-extra-blason": `<g stroke="#4a5260" stroke-width="20" stroke-linejoin="round"><path d="M390 220h420v250q0 180-210 280-210-100-210-280z" fill="#b83d42"/><path d="M600 230h200v240q0 130-200 230z" fill="#315c96" stroke="none"/><path d="M600 220v500M390 460h420" fill="none" stroke="#f2d47b" stroke-width="24"/><path d="M565 310h70v95h90v70h-90v105h-70V475h-90v-70h90z" fill="#f3d16b" stroke="#8b6828" stroke-width="12"/></g>`,
  "historia-trail-extra-parchemin": `<g stroke="#8a6437" stroke-width="18" stroke-linejoin="round"><path d="M380 250q-80 0-80 75v260q0 75 80 75h440q80 0 80-75V325q0-75-80-75z" fill="#f0d99e"/><path d="M380 250q65 0 65 75t-65 75q-65 0-65-75t65-75M820 250q-65 0-65 75t65 75q65 0 65-75t-65-75" fill="#dfc17d"/><path d="M470 395h260M470 455h260M470 515h200" fill="none" stroke="#977344" stroke-width="14"/></g>`,
  "historia-trail-extra-arbalete": `<g fill="none" stroke="#70472b" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"><path d="M600 430 600 610M390 370q210-210 420 0M390 370 600 430 810 370M410 388 790 388"/><path d="M410 300 790 300" stroke="#c49a50" stroke-width="12"/><path d="M780 276 835 300 780 324Z" fill="#c49a50" stroke="none"/></g>`,
  "musica-trail-extra-diapason": `<g fill="none" stroke="#73818b" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"><path d="M470 230v250q0 150 130 150t130-150V230M600 630v-80"/><path d="M460 230h20M720 230h20" stroke="#d6e0e5" stroke-width="18"/></g>`,
  "musica-trail-extra-pupitre": `<g fill="none" stroke="#79562f" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"><path d="M390 230h420v250H390z" fill="#fff8e6"/><path d="M420 285h350M420 325h350M420 365h350M420 405h350" stroke="#6b7280" stroke-width="10"/><path d="M600 480v155M600 540 475 680M600 540l125 140" /></g>`,
  "cinema-trail-extra-spot": `<g stroke="#4d5963" stroke-width="22" stroke-linejoin="round"><path d="M440 235h320l-45 205H485z" fill="#495562"/><path d="M485 440h230L840 660H360z" fill="#fff2b0" fill-opacity=".72" stroke="none"/><path d="M600 440v180M500 640h200" fill="none" stroke="#79562f" stroke-width="30" stroke-linecap="round"/></g>`,
  "cinema-trail-extra-micro": `<g fill="none" stroke="#4a5560" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"><path d="M600 320v250M490 620h220M530 570l-40 50M670 570l40 50"/><rect x="520" y="170" width="160" height="250" rx="80" fill="#8d99a2"/><path d="M550 220h100M550 270h100M550 320h100" stroke="#d9e0e4" stroke-width="14"/><path d="M450 360q0 180 150 180t150-180" stroke="#c28b4a" stroke-width="18"/></g>`,
  "cinema-trail-extra-trophy": `<g stroke="#7b5b28" stroke-width="22" stroke-linejoin="round"><path d="M440 190h320v155q0 180-160 225-160-45-160-225z" fill="#e8bd45"/><path d="M440 235H330v70q0 120 150 120M760 235h110v70q0 120-150 120" fill="none"/><path d="M570 565v115M490 690h220" fill="none" stroke="#a98136" stroke-width="32"/><path d="M600 240v190M530 335h140" stroke="#fff1a8" stroke-width="16"/></g>`,
  "cinema-trail-extra-script": `<g stroke="#664b33" stroke-width="18" stroke-linejoin="round"><path d="M400 190h400v420H400z" fill="#fff9e9"/><path d="M455 270h290M455 330h290M455 390h250M455 450h280M455 510h210" stroke="#51606b" stroke-width="12"/><path d="M400 190h60v420h-60z" fill="#c18d52"/></g>`,
  "cinema-trail-extra-bobine": `<g stroke="#27323d" stroke-width="22"><circle cx="600" cy="390" r="225" fill="#394653"/><circle cx="600" cy="390" r="170" fill="#c9a65a"/><circle cx="600" cy="390" r="40" fill="#e8464a"/><circle cx="600" cy="270" r="32" fill="#394653"/><circle cx="704" cy="330" r="32" fill="#394653"/><circle cx="704" cy="450" r="32" fill="#394653"/><circle cx="600" cy="510" r="32" fill="#394653"/><circle cx="496" cy="450" r="32" fill="#394653"/><circle cx="496" cy="330" r="32" fill="#394653"/><path d="M810 520q90 80 10 150H620" fill="none" stroke-width="34" stroke-linecap="round"/></g>`,
  "cinema-trail-extra-fauteuil": `<g stroke="#394653" stroke-width="22" stroke-linejoin="round"><path d="M420 300q0-50 50-50h260q50 0 50 50v250H420z" fill="#a72e42"/><path d="M380 450h440q50 0 50 50v120H330V500q0-50 50-50z" fill="#c33d50"/><path d="M400 620v80M760 620v80M460 330v150M740 330v150" fill="none" stroke-width="28" stroke-linecap="round"/></g>`,
  "cinema-trail-extra-clap": `<g stroke="#323b45" stroke-width="20" stroke-linejoin="round"><rect x="350" y="345" width="500" height="300" rx="18" fill="#27323d"/><path d="M350 345h500v100H350z" fill="#394653"/><path d="m390 355 55 80m45-80 55 80m45-80 55 80m45-80 55 80m45-80 55 80" stroke="#fff8e9" stroke-width="28"/><path d="M430 500h340M430 555h260" stroke="#cfd6dc" stroke-width="14"/></g>`,
  "cinema-trail-extra-costume": `<g stroke="#4d5663" stroke-width="20" stroke-linejoin="round"><path d="m520 250 80-55 80 55 95 60-65 95-55-35v250H445V370l-55 35-65-95z" fill="#8d2940"/><path d="M600 195v105M535 250l65 50 65-50" fill="none" stroke="#f4d8a8" stroke-width="14"/></g>`,
  "lazeres-trail-extra-volant": `<g stroke="#526372" stroke-width="22" stroke-linejoin="round"><path d="M600 220 450 500q150 110 300 0z" fill="#f3f5ef"/><path d="M450 500q150 110 300 0M485 445h230M520 380h160M555 315h90" fill="none"/><path d="M600 500v100" stroke="#d7a741" stroke-width="52" stroke-linecap="round"/></g>`,
  "lazeres-trail-extra-fleche": `<g stroke="#394c5a" stroke-width="20"><circle cx="600" cy="410" r="210" fill="#e6c45f"/><circle cx="600" cy="410" r="150" fill="#fff8e9"/><circle cx="600" cy="410" r="88" fill="#cf5544"/><circle cx="600" cy="410" r="28" fill="#304e75"/><path d="m790 190-180 180" stroke="#67472d" stroke-width="22"/><path d="m770 160 70-35-35 70z" fill="#bb4b3b"/></g>`,
  "lazeres-trail-extra-trottinette": `<g fill="none" stroke="#4d5963" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"><circle cx="430" cy="570" r="72" fill="#d8e0e3"/><circle cx="760" cy="570" r="72" fill="#d8e0e3"/><path d="M430 570h300l-95-250M665 320h125M635 320h60"/></g>`,
  "lazeres-trail-extra-frisbee": `<g stroke="#38556a" stroke-width="26"><ellipse cx="600" cy="410" rx="280" ry="130" fill="#3c9b8a"/><ellipse cx="600" cy="410" rx="205" ry="78" fill="#8fd3bf"/><ellipse cx="600" cy="410" rx="132" ry="43" fill="#e9f3d2"/><path d="M360 420q240 150 480 0" fill="none" stroke="#276c67" stroke-width="14"/></g>`,
  "lazeres-trail-extra-chateau": `<g stroke="#9a6938" stroke-width="22" stroke-linejoin="round"><path d="M360 630V410h140v220M500 630V330h200v300M700 630V410h140v220z" fill="#e7c384"/><path d="M330 410h200v-95l-100-75-100 75zM670 410h200v-95l-100-75-100 75z" fill="#d7a85e"/><path d="M540 330v-75l60-55 60 55v75" fill="#edcf96"/><path d="M575 630V510q25-55 50 0v120" fill="#8a5738"/><path d="M360 630h480" stroke="#c29a5a" stroke-width="30"/></g>`,
  "lazeres-trail-extra-canot": `<g stroke="#435c6b" stroke-width="22" stroke-linejoin="round"><path d="M330 500q270-300 540 0-90 130-270 130T330 500Z" fill="#b85a3b"/><path d="M440 495h320M600 310v240M500 335 700 535M700 335 500 535" fill="none" stroke="#f1d08b" stroke-width="18"/></g>`,
  "religiao-trail-extra-encensoir": `<g fill="none" stroke="#a27936" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"><path d="M470 220 560 500M600 205v295M730 220 640 500"/><path d="M470 480q130-85 260 0v115q-130 110-260 0z" fill="#d8b15c"/><path d="M500 545h200M550 650v35M650 650v35"/><path d="M520 160q-45-55 0-100M600 160q-45-55 0-100M680 160q-45-55 0-100" stroke="#a8b7bd" stroke-width="14"/></g>`,
  "religiao-trail-extra-calice": `<g stroke="#8a682e" stroke-width="22" stroke-linejoin="round"><path d="M420 210h360q0 260-180 330-180-70-180-330z" fill="#e5c354"/><path d="M600 540v120M480 680h240" fill="none" stroke-width="34"/><path d="M455 260q145 90 290 0" fill="none" stroke="#fff2a8" stroke-width="16"/></g>`,
  "religiao-trail-extra-chapelet": `<g fill="none" stroke="#7f5637" stroke-width="16"><ellipse cx="600" cy="350" rx="190" ry="190" stroke-dasharray="2 1"/><path d="M600 540v100M550 640h100M570 615h60"/></g><g fill="#a34c43" stroke="#56392b" stroke-width="10"><circle cx="600" cy="160" r="20"/><circle cx="735" cy="215" r="20"/><circle cx="790" cy="350" r="20"/><circle cx="735" cy="485" r="20"/><circle cx="600" cy="540" r="20"/><circle cx="465" cy="485" r="20"/><circle cx="410" cy="350" r="20"/><circle cx="465" cy="215" r="20"/></g><path d="M600 640v70m-40-35h80" stroke="#caa64f" stroke-width="22" stroke-linecap="round"/>`,
  "religiao-trail-extra-vitrail": `<g stroke="#3b4149" stroke-width="24" stroke-linejoin="round"><path d="M350 660V330q0-210 250-250 250 40 250 250v330z" fill="#47505a"/><path d="M400 640V330q0-165 200-205 200 40 200 205v310z" fill="#337ca4"/><path d="M600 125v515M400 390h400M400 520h400" fill="none" stroke-width="16"/><path d="M420 370v-40q0-145 180-180v220zM620 150q180 35 180 180v40H620zM420 410h160v100H420zM620 410h180v100H620zM420 540h160v100H420zM620 540h180v100H620z" fill="#e5a84a" fill-opacity=".8" stroke-width="8"/></g>`,
  "idiomas-trail-extra-stylo": `<g stroke="#41505b" stroke-width="18" stroke-linejoin="round"><path d="m485 560 235-320q45-55 95-15t5 95L500 640z" fill="#3c74a5"/><path d="m715 240 105 80M485 560l80 80-65 45z" fill="#d9b866"/><path d="m790 280 58 45" stroke="#f5e8c1" stroke-width="14"/></g>`,
  "idiomas-trail-extra-loupe": `<g fill="none" stroke="#526372" stroke-width="34" stroke-linecap="round"><circle cx="520" cy="350" r="175" fill="#e8f4f4" fill-opacity=".72"/><path d="m650 480 185 190" stroke="#8a5a32" stroke-width="62"/><path d="M425 255q75-75 160-20" stroke="#fff" stroke-width="16"/></g>`,
  "idiomas-trail-extra-trousse": `<g stroke="#4c5d68" stroke-width="20" stroke-linejoin="round"><path d="M335 370q0-60 60-60h410q60 0 60 60v220q0 60-60 60H395q-60 0-60-60z" fill="#3d8b83"/><path d="M335 405h530M420 310v95M760 310v95" fill="none"/><path d="M470 345v-95M565 345v-120M660 345v-85" stroke="#d7b24e" stroke-width="16"/></g>`,
  "idiomas-trail-extra-marquepage": `<g stroke="#9c3e42" stroke-width="20" stroke-linejoin="round"><path d="M420 180h360v450l-180-115-180 115z" fill="#d65a5d"/><path d="M500 265h200M500 335h200" fill="none" stroke="#f8e6c4" stroke-width="14"/><circle cx="600" cy="440" r="34" fill="#f8e6c4" stroke="none"/></g>`,
  "idiomas-trail-extra-surligneur": `<g stroke="#4e5964" stroke-width="18" stroke-linejoin="round"><path d="m465 590 225-360q38-55 90-20t15 95L570 665z" fill="#f4dc45"/><path d="m690 230 105 65M465 590l105 75-70 35z" fill="#eaa54b"/><path d="m770 270 58 36" stroke="#fff8c5" stroke-width="12"/></g>`,
  "idiomas-trail-extra-taillecrayon": `<g stroke="#4d5963" stroke-width="20" stroke-linejoin="round"><path d="M390 350q0-55 55-55h310q55 0 55 55v170q0 55-55 55H445q-55 0-55-55z" fill="#d8e1e4"/><path d="M390 380h420M465 295l55-80M735 295l-55-80" fill="none"/><circle cx="600" cy="440" r="68" fill="#b68042"/><circle cx="600" cy="440" r="28" fill="#27333b"/></g>`,
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

fs.mkdirSync(outputDirectory, { recursive: true });
const missing: string[] = [];

for (const item of items) {
  const match = item.id.match(/^(.+)-trail-\d+-(.+)$/);
  const themeId = match?.[1] ?? item.themeId;
  const key = drawingAliases[item.id] ?? match?.[2] ?? item.id.slice(`${themeId}-`.length);
  const registry = Object.entries(THEMES).find(([id]) => id === themeId)?.[1].reg as
    | Record<string, DrawingEntry>
    | undefined;
  const direct = registry?.[key];
  const itemName = normalize(item.name);
  const itemKey = normalize(key);
  const equivalent = direct ?? Object.values(registry ?? {}).find((entry) =>
    [entry.fr, entry.pt, entry.k].some(
      (value) => typeof value === "string" && [itemName, itemKey].includes(normalize(value))
    )
  );
  const image = equivalent
    ? (() => {
        const fit = Math.min(780 / equivalent.w, 460 / equivalent.h);
        const scale = fit * (equivalent.s ?? 1);
        const baseline = 370 + (equivalent.h * scale) / 2;
        return `<defs>${commonDefs}</defs><g transform="translate(600 ${f(baseline)}) scale(${f(scale)})">${equivalent.draw()}</g>`;
      })()
    : fallbackDrawings[item.id] ?? null;

  if (!image) {
    missing.push(`${item.id} | ${item.name}`);
    continue;
  }

  const title = item.name.replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
  })[character]!);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><title>${title}</title>${image}</svg>\n`;
  fs.writeFileSync(path.join(outputDirectory, `${item.id}.svg`), svg);
}

if (missing.length) {
  throw new Error(`Missing isolated illustrations for ${missing.length} items:\n${missing.join("\n")}`);
}

console.log(`Generated ${items.length} isolated trail object images.`);
