import fs from "fs";

let s = fs.readFileSync("src/lib/imageQuiz.ts", "utf8");
s = s.replace(
  `export function translateQuizToFrench(quiz: ImageQuizConfig): ImageQuizConfig {
  const unique = (words: string[]) => words.filter((word, index) => words.indexOf(word) === index);
  return {
    options: unique(quiz.options.map(kreyolToFrench)),
    answers: unique(quiz.answers.map(kreyolToFrench)),
  };
}`,
  `export function translateQuizToFrench(quiz: ImageQuizConfig, theme?: string): ImageQuizConfig {
  const unique = (words: string[]) => words.filter((word, index) => words.indexOf(word) === index);
  return {
    options: unique(quiz.options.map((w) => kreyolToFrench(w, theme))),
    answers: unique(quiz.answers.map((w) => kreyolToFrench(w, theme))),
  };
}`
);

s = s.replace(
  `return quiz && language === "francais" ? translateQuizToFrench(quiz) : quiz;`,
  `return quiz && language === "francais" ? translateQuizToFrench(quiz, image.theme) : quiz;`
);

fs.writeFileSync("src/lib/imageQuiz.ts", s, "utf8");
console.log("Updated imageQuiz.ts successfully");
