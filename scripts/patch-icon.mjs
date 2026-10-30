import fs from "fs";

let s = fs.readFileSync("src/lib/storyElementIcon.ts", "utf8");

s = s.replace(
  `  "garrafa de leite": "🥛",`,
  `  "garrafa de leite": "🥛",\n  "leite": "🥛",`
);

s = s.replace(
  `const FR_TO_ICON: Record<string, string> = {`,
  `const FR_TO_ICON: Record<string, string> = {\n  lait: "🥛", "bouteille de lait": "🥛",`
);

fs.writeFileSync("src/lib/storyElementIcon.ts", s, "utf8");
console.log("Updated storyElementIcon.ts successfully");
