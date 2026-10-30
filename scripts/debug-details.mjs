import fs from "fs";
const themeElementDetails = JSON.parse(fs.readFileSync("src/lib/themeElementDetails.json", "utf8"));
const sceneVariantsTyped = JSON.parse(fs.readFileSync("src/lib/imageSceneVariants.json", "utf8"));

console.log("Keys of themeElementDetails:", Object.keys(themeElementDetails));
console.log("Gastronomia in themeElementDetails:", Boolean(themeElementDetails["Gastronomia"]));

const scene2 = sceneVariantsTyped["Gastronomia"]?.scenes[0];
console.log("Scene 2 objects:", scene2?.objects);
scene2?.objects.forEach(obj => {
  console.log(`obj: "${obj}" -> detail:`, themeElementDetails["Gastronomia"]?.[obj]);
});
