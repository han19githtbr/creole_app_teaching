/**
 * Contos ilustrados em francês. Cada cena tem a narração (frases curtas, que também viram a
 * legenda), a tradução em português e a descrição da cena (personagens, cenário e câmera).
 */
import type { SceneDef } from "./scene";

export interface TaleScene {
  /** Frases narradas e legendadas, em francês (máx. ~110 caracteres cada, por causa da voz). */
  lines: string[];
  /** Tradução em português, mostrada se o aluno quiser. */
  pt: string;
  /** A moral da história: vira o cartão final em destaque. */
  moral?: boolean;
  art: SceneDef;
}

export interface Tale {
  slug: string;
  title: string;
  /** Linha pequena da abertura (autoria/origem). */
  byline: string;
  level: "A2" | "B1";
  synopsisPt: string;
  coverScene: number;
  /** Já nasce publicado (os contos novos nascem como rascunho até o administrador publicar). */
  publishedByDefault?: boolean;
  scenes: TaleScene[];
}

const dawnCam = { x0: -20, y0: 0, z0: 1.02, x1: 30, y1: 0, z1: 1.12 };

/* ----------------------------------------------------------------- */
/* 1. L'aigle qui se croyait poule                                    */
/* ----------------------------------------------------------------- */

const AIGLE: Tale = {
  slug: "l-aigle-qui-se-croyait-poule",
  publishedByDefault: true,
  title: "L'aigle qui se croyait poule",
  byline: "Une parabole racontée en français",
  level: "A2",
  synopsisPt: "Um filhote de águia cresce entre as galinhas e acredita que não pode voar, até que alguém lhe mostra quem ele realmente é.",
  coverScene: 9,
  scenes: [
    {
      lines: ["Il était une fois un œuf d'aigle, tout en haut d'une montagne.", "Un matin, le vent le fit rouler jusqu'au bas de la vallée."],
      pt: "Era uma vez um ovo de águia, no alto de uma montanha. Uma manhã, o vento o fez rolar até o fundo do vale.",
      art: {
        look: "dawn", terrain: "mountains", seed: 4,
        props: [{ k: "pine", x: 90, row: 0.1, s: 1.3 }, { k: "rock", x: 760, row: 0.55, w: 170, s: 1.2 }, { k: "nest", x: 770, y: 1062, s: 1.3, v: 1 }, { k: "pine", x: 960, row: 0.05, s: 1.5 }],
        actors: [], fx: [{ k: "sparkle", x: 770, y: 1150, n: 12 }, { k: "birds", n: 3, color: "#3b2f4f" }, { k: "dust", n: 24 }],
        cam: { x0: 40, y0: 0, z0: 1.02, x1: -10, y1: 0, z1: 1.2 },
      },
    },
    {
      lines: ["Un fermier trouva l'œuf près de sa ferme.", "Il le posa avec soin dans le nid d'une poule."],
      pt: "Um fazendeiro encontrou o ovo perto da fazenda. Ele o colocou com cuidado no ninho de uma galinha.",
      art: {
        look: "barn", terrain: "interior", ground: "wood", seed: 2,
        props: [{ k: "haystack", x: 140, row: 0.1, s: 1.3 }, { k: "nest", x: 700, row: 0.68, s: 1.5, v: 2 }],
        actors: [{ k: "person", x: 360, row: 0.95, s: 1.35, anim: "idle", variant: 0 }, { k: "hen", x: 860, row: 0.62, s: 1.4, anim: "idle", variant: 1 }],
        fx: [{ k: "rays" }, { k: "dust", n: 46 }], cam: dawnCam,
      },
    },
    {
      lines: ["Quelques jours plus tard, un petit aigle sortit de l'œuf.", "Il se croyait un poussin, comme tous ses frères."],
      pt: "Alguns dias depois, uma pequena águia saiu do ovo. Ela se achava um pintinho, como todos os irmãos.",
      art: {
        look: "barn", terrain: "interior", ground: "wood", seed: 2,
        props: [{ k: "haystack", x: 880, row: 0.12, s: 1.2 }, { k: "nest", x: 300, row: 0.6, s: 1.2, v: 0 }],
        actors: [
          { k: "chick", x: 520, row: 0.85, s: 2.1, anim: "walk", dx: 60 },
          { k: "chick", x: 700, row: 0.95, s: 2.2, anim: "peck" },
          { k: "eagle", x: 600, row: 0.9, s: 0.5, anim: "walk", dx: -40 },
          { k: "hen", x: 220, row: 0.55, s: 1.4, anim: "idle" },
        ],
        fx: [{ k: "rays" }, { k: "dust", n: 40 }, { k: "sparkle", x: 600, y: 1200, n: 8 }], cam: dawnCam,
      },
    },
    {
      lines: ["Il grandit dans la basse-cour, entre les poules.", "Il picorait le grain et ne quittait jamais le sol."],
      pt: "Ele cresceu no galinheiro, entre as galinhas. Bicava os grãos e nunca saía do chão.",
      art: {
        look: "day", terrain: "farm", ground: "dirt", seed: 6,
        props: [{ k: "barn", x: 850, row: 0.05, s: 1.1 }, { k: "haystack", x: 300, row: 0.1, s: 1.1 }, { k: "fence", x: -60, row: 0.28, s: 1.2, w: 900 }, { k: "tree", x: 110, row: 0.04, s: 1.2 }],
        actors: [
          { k: "hen", x: 220, row: 0.78, s: 1.5, anim: "peck", variant: 0 },
          { k: "hen", x: 760, row: 0.86, s: 1.6, anim: "walk", variant: 1, dx: -50 },
          { k: "eagle", x: 470, row: 0.88, s: 1.1, anim: "peck" },
          { k: "chick", x: 640, row: 0.95, s: 1.9, anim: "walk", dx: 50 },
        ],
        fx: [{ k: "dust", n: 26 }], cam: { x0: -30, y0: 0, z0: 1.04, x1: 25, y1: 0, z1: 1.1 },
      },
    },
    {
      lines: ["Parfois, il regardait le ciel et voyait des oiseaux voler très haut.", "« Ils ont de la chance », pensait-il. « Moi, je ne suis qu'une poule. »"],
      pt: "Às vezes olhava para o céu e via pássaros voando bem alto. “Eles têm sorte”, pensava. “Eu sou só uma galinha.”",
      art: {
        look: "day", terrain: "farm", ground: "dirt", seed: 6,
        props: [{ k: "barn", x: 200, row: 0.05, s: 1.1 }, { k: "fence", x: 380, row: 0.3, s: 1.2, w: 800 }, { k: "tree", x: 960, row: 0.05, s: 1.3 }],
        actors: [{ k: "eagle", x: 520, row: 0.9, s: 1.25, anim: "idle" }, { k: "hen", x: 220, row: 0.82, s: 1.4, anim: "peck" }, { k: "hen", x: 860, row: 0.8, s: 1.4, anim: "walk", variant: 1, dx: -40 }],
        fx: [{ k: "birds", n: 5, color: "#2f3b57" }, { k: "dust", n: 18 }], cam: { x0: 0, y0: 30, z0: 1.0, x1: 0, y1: -50, z1: 1.14 },
      },
    },
    {
      lines: ["Un jour, un homme sage passa par la ferme.", "En voyant l'oiseau, il s'écria : « Mais c'est un aigle ! Il est fait pour voler ! »"],
      pt: "Um dia, um homem sábio passou pela fazenda. Ao ver a ave, exclamou: “Mas é uma águia! Ela nasceu para voar!”",
      art: {
        look: "day", terrain: "farm", ground: "dirt", seed: 6,
        props: [{ k: "barn", x: 880, row: 0.05, s: 1.1 }, { k: "haystack", x: 140, row: 0.1, s: 1.0 }, { k: "fence", x: -80, row: 0.3, s: 1.2, w: 700 }],
        actors: [{ k: "person", x: 230, row: 0.95, s: 1.3, anim: "wave", variant: 1 }, { k: "eagle", x: 640, row: 0.88, s: 1.2, anim: "idle" }, { k: "hen", x: 880, row: 0.86, s: 1.3, anim: "peck" }],
        fx: [{ k: "dust", n: 20 }], cam: { x0: 30, y0: 0, z0: 1.02, x1: -20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["« Non, dit le fermier, c'est une poule. Il n'a jamais volé. »", "Mais l'homme prit l'oiseau et le lança vers le ciel."],
      pt: "“Não”, disse o fazendeiro, “é uma galinha. Nunca voou.” Mas o homem pegou a ave e a lançou para o céu.",
      art: {
        look: "day", terrain: "farm", ground: "dirt", seed: 6,
        props: [{ k: "barn", x: 190, row: 0.05, s: 1.1 }, { k: "tree", x: 940, row: 0.06, s: 1.2 }],
        actors: [
          { k: "person", x: 300, row: 0.95, s: 1.3, anim: "idle", variant: 0 },
          { k: "person", x: 780, row: 0.98, s: 1.3, anim: "wave", variant: 1 },
          { k: "eagle", x: 620, y: 760, s: 0.9, anim: "fly", dy: -80 },
        ],
        fx: [{ k: "dust", n: 16 }, { k: "sparkle", x: 620, y: 700, n: 10 }], cam: { x0: 0, y0: 40, z0: 1.0, x1: 0, y1: -30, z1: 1.1 },
      },
    },
    {
      lines: ["Mais l'aigle, effrayé, retomba parmi les poules.", "Il pensa : « Voilà. Je ne sais pas voler. »"],
      pt: "Mas a águia, assustada, caiu de volta entre as galinhas. Pensou: “Pronto. Eu não sei voar.”",
      art: {
        look: "day", terrain: "farm", ground: "dirt", seed: 6,
        props: [{ k: "fence", x: -60, row: 0.3, s: 1.2, w: 1000 }, { k: "haystack", x: 880, row: 0.1, s: 1.1 }],
        actors: [
          { k: "hen", x: 200, row: 0.8, s: 1.5, anim: "walk", dx: -80 },
          { k: "hen", x: 820, row: 0.85, s: 1.5, anim: "walk", variant: 1, dx: 80 },
          { k: "eagle", x: 520, row: 0.9, s: 1.2, anim: "idle" },
          { k: "chick", x: 340, row: 0.97, s: 1.8, anim: "walk", dx: -60 },
        ],
        fx: [{ k: "dust", n: 40 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Le lendemain, l'homme l'emmena au sommet d'une colline, face au soleil.", "« Tu es un aigle, lui dit-il. Ouvre tes ailes ! »"],
      pt: "No dia seguinte, o homem o levou ao topo de uma colina, de frente para o sol. “Você é uma águia”, disse. “Abra as asas!”",
      art: {
        look: "dawn", terrain: "mountains", seed: 8, sun: [540, 760],
        props: [{ k: "rock", x: 640, row: 0.75, w: 190, s: 1.1 }, { k: "pine", x: 90, row: 0.12, s: 1.3 }],
        actors: [{ k: "person", x: 250, row: 0.95, s: 1.3, anim: "wave", variant: 1 }, { k: "eagle", x: 650, y: 1078, s: 1.1, anim: "idle" }],
        fx: [{ k: "rays" }, { k: "dust", n: 30 }], cam: { x0: 0, y0: 20, z0: 1.0, x1: 20, y1: -30, z1: 1.14 },
      },
    },
    {
      lines: ["Alors l'aigle sentit le vent sur ses plumes.", "Il ouvrit ses grandes ailes... et il s'envola vers le soleil !"],
      pt: "Então a águia sentiu o vento nas penas. Abriu as grandes asas… e voou em direção ao sol!",
      art: {
        look: "dawn", terrain: "mountains", seed: 8, sun: [540, 700],
        props: [{ k: "pine", x: 100, row: 0.12, s: 1.3 }, { k: "pine", x: 960, row: 0.1, s: 1.4 }],
        actors: [{ k: "eagle", x: 540, y: 900, s: 1.9, anim: "fly", speed: 5, dy: -170 }],
        fx: [{ k: "birds", n: 4, color: "#3b2f4f" }, { k: "sparkle", x: 540, y: 760, n: 22 }, { k: "rays" }], cam: { x0: 0, y0: 40, z0: 1.0, x1: 0, y1: -60, z1: 1.18 },
      },
    },
    {
      lines: ["Morale : ne laisse jamais personne décider de ce que tu es capable de faire."],
      pt: "Moral: nunca deixe ninguém decidir do que você é capaz.",
      moral: true,
      art: {
        look: "sunset", terrain: "mountains", seed: 5, sun: [540, 820],
        props: [{ k: "pine", x: 90, row: 0.1, s: 1.3 }, { k: "pine", x: 970, row: 0.08, s: 1.5 }],
        actors: [{ k: "eagle", x: 540, y: 760, s: 1.7, anim: "glide", speed: 5 }],
        fx: [{ k: "birds", n: 3, color: "#2a2540" }, { k: "sparkle", x: 540, y: 700, n: 16 }], cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: -30, z1: 1.14 },
      },
    },
  ],
};

/* ----------------------------------------------------------------- */
/* 2. Le lièvre et la tortue                                          */
/* ----------------------------------------------------------------- */

const meadowProps = [{ k: "tree", x: 90, row: 0.05, s: 1.3 }, { k: "bush", x: 330, row: 0.12, s: 1.0 }];

const LIEVRE: Tale = {
  slug: "le-lievre-et-la-tortue",
  publishedByDefault: true,
  title: "Le lièvre et la tortue",
  byline: "D'après Jean de La Fontaine",
  level: "A2",
  synopsisPt: "A lebre se acha rápida demais e zomba da tartaruga. Mas quem vence a corrida?",
  coverScene: 2,
  scenes: [
    {
      lines: ["Un lièvre se moquait toujours de la tortue.", "« Tu es si lente ! » disait-il. « Moi, je cours comme le vent ! »"],
      pt: "Uma lebre zombava sempre da tartaruga. “Você é tão lenta! Eu corro como o vento!”",
      art: {
        look: "day", terrain: "meadow", seed: 3,
        props: [...meadowProps, { k: "flowers", x: 900, row: 1, v: 1 }],
        actors: [{ k: "hare", x: 330, row: 0.78, s: 1.6, anim: "idle" }, { k: "tortoise", x: 760, row: 0.85, s: 1.3, anim: "walk", flip: true, dx: -30 }],
        fx: [{ k: "petals", n: 14 }], cam: { x0: -20, y0: 0, z0: 1.05, x1: 20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["La tortue sourit : « Faisons une course jusqu'à l'arbre là-bas. »", "Le lièvre éclata de rire, mais il accepta le défi."],
      pt: "A tartaruga sorriu: “Vamos apostar uma corrida até aquela árvore.” A lebre caiu na gargalhada, mas aceitou o desafio.",
      art: {
        look: "day", terrain: "meadow", seed: 3,
        props: [...meadowProps, { k: "oak", x: 960, row: 0.06, s: 1.0 }],
        actors: [{ k: "tortoise", x: 380, row: 0.82, s: 1.5, anim: "walk", dx: 30 }, { k: "hare", x: 700, row: 0.8, s: 1.6, anim: "idle", flip: true }],
        fx: [{ k: "birds", n: 3, color: "#3b4a63" }, { k: "petals", n: 10 }], cam: { x0: 10, y0: 0, z0: 1.0, x1: -20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Tous les animaux de la forêt vinrent regarder.", "« Un, deux, trois... partez ! »"],
      pt: "Todos os animais da floresta vieram assistir. “Um, dois, três… já!”",
      art: {
        look: "day", terrain: "meadow", seed: 3,
        props: [{ k: "sign", x: 520, row: 0.4, s: 1.1 }, ...meadowProps, { k: "flowers", x: 200, row: 0.98, v: 2 }],
        actors: [{ k: "hare", x: 280, row: 0.85, s: 1.6, anim: "run", dx: 110 }, { k: "tortoise", x: 440, row: 0.95, s: 1.4, anim: "walk", dx: 30 }],
        fx: [{ k: "dust", n: 24 }], cam: { x0: -30, y0: 0, z0: 1.0, x1: 40, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Le lièvre partit comme une flèche.", "En quelques secondes, il avait disparu au loin."],
      pt: "A lebre saiu como uma flecha. Em poucos segundos, tinha sumido ao longe.",
      art: {
        look: "day", terrain: "meadow", seed: 7,
        props: [{ k: "tree", x: 140, row: 0.06, s: 1.2 }, { k: "bush", x: 820, row: 0.15, s: 1.0 }],
        actors: [{ k: "hare", x: 120, row: 0.78, s: 1.7, anim: "run", dx: 880, speed: 14 }],
        fx: [{ k: "dust", n: 40 }, { k: "petals", n: 12 }], cam: { x0: -30, y0: 0, z0: 1.04, x1: 60, y1: 0, z1: 1.1 },
      },
    },
    {
      lines: ["La tortue avançait lentement, mais sans jamais s'arrêter."],
      pt: "A tartaruga avançava devagar, mas sem nunca parar.",
      art: {
        look: "day", terrain: "meadow", seed: 7,
        props: [{ k: "flowers", x: 220, row: 0.98, v: 1 }, { k: "flowers", x: 800, row: 1, v: 3 }, ...meadowProps],
        actors: [{ k: "tortoise", x: 300, row: 0.8, s: 1.9, anim: "walk", dx: 260 }],
        fx: [{ k: "petals", n: 18 }, { k: "birds", n: 3, color: "#3b4a63" }], cam: { x0: -20, y0: 0, z0: 1.02, x1: 60, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Le lièvre, très sûr de lui, s'arrêta sous un arbre.", "« J'ai le temps de faire une petite sieste », pensa-t-il."],
      pt: "A lebre, muito confiante, parou debaixo de uma árvore. “Tenho tempo para uma sonequinha”, pensou.",
      art: {
        look: "day", terrain: "meadow", seed: 9,
        props: [{ k: "oak", x: 440, row: 0.2, s: 1.7 }, { k: "bush", x: 900, row: 0.2 }, { k: "flowers", x: 150, row: 0.98, v: 2 }],
        actors: [{ k: "hare", x: 440, row: 0.85, s: 1.8, anim: "sleep" }],
        fx: [{ k: "zzz", x: 540, y: 1140 }, { k: "petals", n: 10 }, { k: "rays" }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Pendant que le lièvre dormait, la tortue passait doucement devant lui.", "Pas à pas, elle approchait de la ligne d'arrivée."],
      pt: "Enquanto a lebre dormia, a tartaruga passava devagar por ela. Passo a passo, chegava perto da linha de chegada.",
      art: {
        look: "sunset", terrain: "meadow", seed: 9,
        props: [{ k: "finish", x: 840, row: 0.35, s: 1.2 }, { k: "oak", x: 120, row: 0.15, s: 1.4 }, { k: "flowers", x: 880, row: 1, v: 0 }],
        actors: [{ k: "hare", x: 200, row: 0.8, s: 1.5, anim: "sleep" }, { k: "tortoise", x: 380, row: 0.95, s: 1.6, anim: "walk", dx: 220 }],
        fx: [{ k: "zzz", x: 300, y: 1130 }, { k: "dust", n: 24 }], cam: { x0: -30, y0: 0, z0: 1.02, x1: 40, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Quand le lièvre se réveilla, il courut de toutes ses forces.", "Mais il était trop tard : la tortue franchissait déjà la ligne !"],
      pt: "Quando a lebre acordou, correu com todas as forças. Mas era tarde demais: a tartaruga já cruzava a linha!",
      art: {
        look: "sunset", terrain: "meadow", seed: 9,
        props: [{ k: "finish", x: 700, row: 0.45, s: 1.4 }, { k: "bush", x: 120, row: 0.1 }],
        actors: [{ k: "tortoise", x: 560, row: 0.82, s: 1.7, anim: "walk", dx: 130 }, { k: "hare", x: 60, row: 0.95, s: 1.7, anim: "run", dx: 330, speed: 14 }],
        fx: [{ k: "sparkle", x: 700, y: 1090, n: 16 }, { k: "dust", n: 30 }], cam: { x0: -20, y0: 0, z0: 1.0, x1: 20, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Morale : rien ne sert de courir, il faut partir à point."],
      pt: "Moral: de nada adianta correr; é preciso partir na hora certa.",
      moral: true,
      art: {
        look: "sunset", terrain: "meadow", seed: 5,
        props: [{ k: "finish", x: 760, row: 0.4, s: 1.3 }, { k: "flowers", x: 200, row: 1, v: 1 }],
        actors: [{ k: "tortoise", x: 480, row: 0.85, s: 1.9, anim: "walk", speed: 1.4 }],
        fx: [{ k: "sparkle", x: 480, y: 1100, n: 14 }, { k: "petals", n: 14 }], cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.14 },
      },
    },
  ],
};

/* ----------------------------------------------------------------- */
/* 3. Le corbeau et le renard                                         */
/* ----------------------------------------------------------------- */

const CORBEAU: Tale = {
  slug: "le-corbeau-et-le-renard",
  publishedByDefault: true,
  title: "Le corbeau et le renard",
  byline: "D'après Jean de La Fontaine",
  level: "B1",
  synopsisPt: "Um corvo com um queijo e uma raposa muito esperta: o que acontece quando alguém só diz o que queremos ouvir?",
  coverScene: 4,
  scenes: [
    {
      lines: ["Un corbeau avait volé un beau fromage.", "Il se posa tout en haut d'un grand chêne pour le manger."],
      pt: "Um corvo tinha roubado um belo queijo. Pousou no alto de um grande carvalho para comê-lo.",
      art: {
        look: "day", terrain: "forest", seed: 12,
        props: [{ k: "oak", x: 520, row: 0.3, s: 2.2 }, { k: "bush", x: 120, row: 0.2 }, { k: "bush", x: 940, row: 0.3, s: 1.2 }],
        actors: [{ k: "crow", x: 520, y: 780, s: 1.6, anim: "idle", carry: "cheese" }],
        fx: [{ k: "rays" }, { k: "dust", n: 24 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: -20, z1: 1.14 },
      },
    },
    {
      lines: ["Un renard très rusé passa par là.", "Il sentit l'odeur du fromage et s'arrêta."],
      pt: "Uma raposa muito esperta passou por ali. Sentiu o cheiro do queijo e parou.",
      art: {
        look: "day", terrain: "forest", seed: 12,
        props: [{ k: "oak", x: 820, row: 0.3, s: 2.0 }, { k: "bush", x: 160, row: 0.2 }],
        actors: [{ k: "fox", x: 200, row: 0.85, s: 1.4, anim: "walk", dx: 260 }, { k: "crow", x: 830, y: 800, s: 1.3, anim: "idle", carry: "cheese" }],
        fx: [{ k: "dust", n: 24 }], cam: { x0: -20, y0: 0, z0: 1.0, x1: 30, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Le renard leva la tête et dit : « Bonjour, monsieur du Corbeau ! »", "« Comme vous êtes beau ! Quelles belles plumes ! »"],
      pt: "A raposa levantou a cabeça e disse: “Bom dia, senhor Corvo! Como o senhor é bonito! Que belas penas!”",
      art: {
        look: "day", terrain: "forest", seed: 12,
        props: [{ k: "oak", x: 700, row: 0.25, s: 2.1 }, { k: "bush", x: 120, row: 0.15 }],
        actors: [{ k: "fox", x: 360, row: 0.88, s: 1.55, anim: "idle" }, { k: "crow", x: 700, y: 790, s: 1.5, anim: "idle", carry: "cheese" }],
        fx: [{ k: "sparkle", x: 700, y: 760, n: 12 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: -30, z1: 1.15 },
      },
    },
    {
      lines: ["« Si votre voix est aussi belle que vos plumes... »", "« ... alors vous êtes le roi de la forêt ! »"],
      pt: "“Se a sua voz for tão bonita quanto as suas penas… então o senhor é o rei da floresta!”",
      art: {
        look: "day", terrain: "forest", seed: 12,
        props: [{ k: "oak", x: 700, row: 0.25, s: 2.1 }],
        actors: [{ k: "fox", x: 340, row: 0.9, s: 1.6, anim: "idle" }, { k: "crow", x: 700, y: 790, s: 1.6, anim: "idle", carry: "cheese" }],
        fx: [{ k: "sparkle", x: 700, y: 750, n: 18 }, { k: "petals", n: 8 }], cam: { x0: 10, y0: 0, z0: 1.05, x1: 0, y1: -40, z1: 1.2 },
      },
    },
    {
      lines: ["Le corbeau, très fier, voulut montrer sa belle voix.", "Il ouvrit grand le bec pour chanter... Croâ !"],
      pt: "O corvo, muito orgulhoso, quis mostrar sua bela voz. Abriu bem o bico para cantar… Croá!",
      art: {
        look: "day", terrain: "forest", seed: 12,
        props: [{ k: "oak", x: 700, row: 0.25, s: 2.1 }],
        actors: [{ k: "fox", x: 340, row: 0.9, s: 1.6, anim: "idle" }, { k: "crow", x: 700, y: 790, s: 1.7, anim: "caw" }, { k: "cheese", x: 790, y: 820, s: 1.0, dy: 380, from: 0.45 }],
        fx: [{ k: "dust", n: 16 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: -10, z1: 1.16 },
      },
    },
    {
      lines: ["Le fromage tomba, et le renard l'attrapa aussitôt."],
      pt: "O queijo caiu, e a raposa o pegou na mesma hora.",
      art: {
        look: "day", terrain: "forest", seed: 12,
        props: [{ k: "oak", x: 760, row: 0.25, s: 2.0 }],
        actors: [{ k: "fox", x: 420, row: 0.9, s: 1.7, anim: "idle", carry: "cheese" }, { k: "crow", x: 770, y: 800, s: 1.4, anim: "caw" }],
        fx: [{ k: "sparkle", x: 480, y: 1180, n: 12 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Le renard dit en souriant : « Mon bon monsieur, tout flatteur vit aux dépens de celui qui l'écoute. »"],
      pt: "A raposa disse sorrindo: “Meu bom senhor, todo bajulador vive à custa de quem o escuta.”",
      art: {
        look: "sunset", terrain: "forest", seed: 12,
        props: [{ k: "oak", x: 780, row: 0.25, s: 2.0 }, { k: "bush", x: 140, row: 0.2 }],
        actors: [{ k: "fox", x: 380, row: 0.9, s: 1.7, anim: "idle" }, { k: "crow", x: 780, y: 800, s: 1.3, anim: "idle" }],
        fx: [{ k: "dust", n: 24 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: -20, z1: 1.14 },
      },
    },
    {
      lines: ["Morale : méfie-toi de ceux qui te flattent trop."],
      pt: "Moral: desconfie de quem te elogia demais.",
      moral: true,
      art: {
        look: "sunset", terrain: "forest", seed: 5,
        props: [{ k: "oak", x: 540, row: 0.3, s: 2.2 }],
        actors: [{ k: "crow", x: 540, y: 790, s: 1.5, anim: "idle" }],
        fx: [{ k: "sparkle", x: 540, y: 760, n: 12 }, { k: "dust", n: 24 }], cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.14 },
      },
    },
  ],
};

/* ----------------------------------------------------------------- */
/* 4. La cigale et la fourmi                                          */
/* ----------------------------------------------------------------- */

const CIGALE: Tale = {
  slug: "la-cigale-et-la-fourmi",
  publishedByDefault: true,
  title: "La cigale et la fourmi",
  byline: "D'après Jean de La Fontaine",
  level: "B1",
  synopsisPt: "Uma cigarra canta o verão inteiro; uma formiga trabalha sem parar. Quando chega o inverno, quem tem o que comer?",
  coverScene: 2,
  scenes: [
    {
      lines: ["Pendant tout l'été, la cigale chantait au soleil.", "Elle ne pensait qu'à s'amuser."],
      pt: "O verão inteiro, a cigarra cantava ao sol. Só pensava em se divertir.",
      art: {
        look: "day", terrain: "meadow", seed: 14,
        props: [{ k: "wheat", x: 240, row: 0.3, w: 420, s: 1.1 }, { k: "flowers", x: 880, row: 1, v: 1 }, { k: "tree", x: 940, row: 0.06, s: 1.3 }],
        actors: [{ k: "cicada", x: 520, row: 0.85, s: 1.9, anim: "sing" }],
        fx: [{ k: "notes", x: 560, y: 1130, n: 6 }, { k: "petals", n: 12 }, { k: "rays" }], cam: { x0: -20, y0: 0, z0: 1.02, x1: 20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["La fourmi, elle, travaillait dur.", "Elle portait des grains jusqu'à sa maison."],
      pt: "A formiga, por sua vez, trabalhava duro. Carregava grãos até a sua casa.",
      art: {
        look: "day", terrain: "meadow", seed: 14, ground: "dirt",
        props: [{ k: "anthill", x: 180, row: 0.4, s: 1.3 }, { k: "wheat", x: 780, row: 0.3, w: 400, s: 1.1 }],
        actors: [{ k: "ant", x: 780, row: 0.88, s: 1.8, anim: "walk", carry: "grain", dx: -380, speed: 8 }],
        fx: [{ k: "dust", n: 24 }], cam: { x0: 30, y0: 0, z0: 1.02, x1: -20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["« Pourquoi travailles-tu si fort ? » demanda la cigale. « Viens chanter avec moi ! »", "« Non, répondit la fourmi. Je prépare l'hiver. »"],
      pt: "“Por que você trabalha tanto?”, perguntou a cigarra. “Venha cantar comigo!” “Não”, respondeu a formiga. “Estou preparando o inverno.”",
      art: {
        look: "day", terrain: "meadow", seed: 14, ground: "dirt",
        props: [{ k: "anthill", x: 860, row: 0.4, s: 1.1 }, { k: "flowers", x: 200, row: 1, v: 2 }],
        actors: [{ k: "cicada", x: 280, row: 0.88, s: 1.8, anim: "sing" }, { k: "ant", x: 700, row: 0.9, s: 1.7, anim: "walk", carry: "grain", flip: true, speed: 4 }],
        fx: [{ k: "notes", x: 320, y: 1130, n: 4 }, { k: "dust", n: 20 }], cam: { x0: -10, y0: 0, z0: 1.0, x1: 20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Les feuilles tombèrent, et le vent devint froid.", "La cigale n'avait rien préparé."],
      pt: "As folhas caíram e o vento ficou frio. A cigarra não tinha preparado nada.",
      art: {
        look: "autumn", terrain: "forest", seed: 15, ground: "dirt",
        props: [{ k: "autumn", x: 160, row: 0.2, s: 1.7 }, { k: "autumn", x: 900, row: 0.25, s: 1.5 }, { k: "anthill", x: 560, row: 0.5, s: 0.9 }],
        actors: [{ k: "cicada", x: 470, row: 0.9, s: 1.8, anim: "idle" }],
        fx: [{ k: "leaves", n: 40 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["L'hiver arriva, avec la neige et le froid.", "La cigale avait très faim, et plus rien à manger."],
      pt: "O inverno chegou, com neve e frio. A cigarra estava com muita fome e sem nada para comer.",
      art: {
        look: "winter", terrain: "meadow", seed: 16, ground: "snow",
        props: [{ k: "snowpine", x: 110, row: 0.1, s: 1.4 }, { k: "snowpine", x: 940, row: 0.06, s: 1.6 }, { k: "bare", x: 780, row: 0.4, s: 1.1 }],
        actors: [{ k: "cicada", x: 480, row: 0.9, s: 1.8, anim: "sleep" }],
        fx: [{ k: "snow", n: 140 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Elle alla frapper à la porte de la fourmi.", "« Peux-tu me donner un peu de nourriture ? »"],
      pt: "Ela foi bater à porta da formiga. “Você pode me dar um pouco de comida?”",
      art: {
        look: "winter", terrain: "meadow", seed: 16, ground: "snow",
        props: [{ k: "anthill", x: 700, row: 0.55, s: 1.3 }, { k: "snowpine", x: 110, row: 0.1, s: 1.4 }],
        actors: [{ k: "cicada", x: 330, row: 0.9, s: 1.7, anim: "idle" }, { k: "ant", x: 620, row: 0.88, s: 1.5, anim: "idle", flip: true }],
        fx: [{ k: "snow", n: 100 }], cam: { x0: -20, y0: 0, z0: 1.0, x1: 30, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["La fourmi lui demanda : « Que faisais-tu pendant l'été ? »", "« Je chantais », répondit la cigale, un peu honteuse."],
      pt: "A formiga perguntou: “O que você fazia durante o verão?” “Eu cantava”, respondeu a cigarra, um pouco envergonhada.",
      art: {
        look: "winter", terrain: "meadow", seed: 16, ground: "snow",
        props: [{ k: "anthill", x: 760, row: 0.55, s: 1.2 }],
        actors: [{ k: "cicada", x: 300, row: 0.9, s: 1.8, anim: "idle" }, { k: "ant", x: 600, row: 0.9, s: 1.7, anim: "idle", flip: true }],
        fx: [{ k: "snow", n: 90 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.18 },
      },
    },
    {
      lines: ["Mais la fourmi avait bon cœur : elle la fit entrer au chaud.", "Cet hiver-là, elles mangèrent ensemble."],
      pt: "Mas a formiga tinha bom coração: deixou-a entrar no calor. Naquele inverno, elas comeram juntas.",
      art: {
        look: "barn", terrain: "interior", ground: "wood", seed: 17,
        props: [{ k: "haystack", x: 200, row: 0.15, s: 1.1 }, { k: "wheat", x: 800, row: 0.35, w: 280, s: 0.9 }],
        actors: [{ k: "cicada", x: 360, row: 0.9, s: 1.8, anim: "idle" }, { k: "ant", x: 700, row: 0.9, s: 1.7, anim: "idle", flip: true, carry: "grain" }],
        fx: [{ k: "dust", n: 40 }, { k: "rays" }, { k: "sparkle", x: 540, y: 1100, n: 8 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Morale : prépare demain, mais n'oublie jamais de t'entraider."],
      pt: "Moral: prepare o amanhã, mas nunca se esqueça de ajudar uns aos outros.",
      moral: true,
      art: {
        look: "sunset", terrain: "meadow", seed: 14,
        props: [{ k: "wheat", x: 240, row: 0.3, w: 400, s: 1.1 }, { k: "flowers", x: 860, row: 1, v: 1 }],
        actors: [{ k: "cicada", x: 380, row: 0.9, s: 1.7, anim: "sing" }, { k: "ant", x: 700, row: 0.92, s: 1.6, anim: "idle", flip: true }],
        fx: [{ k: "notes", x: 420, y: 1130, n: 4 }, { k: "petals", n: 12 }], cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.14 },
      },
    },
  ],
};

/* ----------------------------------------------------------------- */
<<<<<<< HEAD
/* 5. Prendre soin de ce que l'on a                                   */
/* ----------------------------------------------------------------- */

const SOIN: Tale = {
  slug: "prendre-soin-de-ce-que-l-on-a",
  title: "Prendre soin de ce que l'on a",
  byline: "Une parabole sur la vraie valeur des choses",
  level: "B1",
  synopsisPt: "Paulo sonhava em ganhar um carro aos 18 anos. Seu pai mecânico lhe deu uma caixa de ferramentas raras, mas ele descuidou da menor peça... sem saber que ela valeria o próprio carro.",
  coverScene: 4,
  scenes: [
    {
      lines: ["Paulo avait seize ans et rêvait du jour où il aurait enfin une vraie voiture.", "Dans sa chambre, il collectionnait avec passion de petites autos miniatures."],
      pt: "Paulo tinha dezesseis anos e sonhava com o dia em que teria um carro de verdade. No seu quarto, colecionava com paixão miniaturas de carros.",
      art: {
        look: "day", terrain: "interior", ground: "wood", seed: 21,
        props: [{ k: "miniCars", x: 260, row: 0.65, s: 1.1 }],
        actors: [{ k: "paulo", x: 640, row: 0.9, s: 1.3, anim: "idle", variant: 0 }],
        fx: [{ k: "rays" }, { k: "dust", n: 20 }],
        cam: { x0: -20, y0: 0, z0: 1.02, x1: 20, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Pour ses seize ans, son père Marcos, un mécanicien réputé, lui offrit un coffret.", "« Prends-en soin, dit-il. Ces outils sont rares et précieux. Tu en auras besoin. »"],
      pt: "Aos dezesseis anos, seu pai Marcos, um mecânico conceituado, deu-lhe uma maleta de ferramentas. “Cuide bem dela”, disse ele. “Estas peças são raras e preciosas. Você vai precisar.”",
      art: {
        look: "day", terrain: "interior", ground: "wood", seed: 22,
        props: [{ k: "toolbox", x: 480, row: 0.72, s: 1.15, v: 0 }],
        actors: [
          { k: "marcos", x: 280, row: 0.94, s: 1.35, anim: "talk" },
          { k: "paulo", x: 740, row: 0.9, s: 1.3, anim: "idle", variant: 0, flip: true },
        ],
        fx: [{ k: "rays" }, { k: "sparkle", x: 480, y: 1180, n: 10 }],
        cam: { x0: -15, y0: 0, z0: 1.0, x1: 25, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Déçu de ne pas avoir reçu un présent plus grand, Paulo laissa traîner les outils.", "Par négligence, il perdit la plus petite pièce, la plus rare de toutes."],
      pt: "Decepcionado por não ganhar um presente maior, Paulo deixou as ferramentas espalhadas. Por descuido, perdeu a menor peça, a mais rara de todas.",
      art: {
        look: "sunset", terrain: "interior", ground: "wood", seed: 23,
        props: [{ k: "toolbox", x: 420, row: 0.7, s: 1.05, v: 1 }],
        actors: [{ k: "paulo", x: 680, row: 0.92, s: 1.3, anim: "sad", variant: 0 }],
        fx: [{ k: "dust", n: 26 }],
        cam: { x0: 20, y0: 0, z0: 1.02, x1: -20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Deux ans passèrent. Pour ses dix-huit ans, son père l'invita à la remise.", "« Aujourd'hui tu as l'âge des grandes responsabilités. Viens avec moi ! »"],
      pt: "Dois anos se passaram. Para seus dezoito anos, o pai o convidou até a garagem. “Hoje você tem idade para grandes responsabilidades. Venha comigo!”",
      art: {
        look: "day", terrain: "interior", ground: "wood", seed: 24,
        props: [{ k: "garageBenches", x: 200, row: 0.2, s: 1.1 }],
        actors: [
          { k: "marcos", x: 340, row: 0.94, s: 1.35, anim: "walk", dx: 70 },
          { k: "paulo", x: 680, row: 0.92, s: 1.32, anim: "walk", variant: 1, dx: 70, flip: true },
        ],
        fx: [{ k: "rays" }, { k: "dust", n: 30 }],
        cam: { x0: -30, y0: 0, z0: 1.02, x1: 30, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Sous la lumière brillait une automobile rarissime, un chef-d'œuvre de collection.", "Paulo resta bouche bée d'émerveillement devant cette merveille."],
      pt: "Sob a luz brilhava um automóvel raríssimo, uma verdadeira obra-prima de coleção. Paulo ficou de boca aberta, maravilhado diante de tamanha perfeição.",
      art: {
        look: "day", terrain: "interior", ground: "wood", seed: 25,
        props: [{ k: "car", x: 530, row: 0.78, s: 1.35, v: 0 }, { k: "garageBenches", x: 160, row: 0.15, s: 1.0 }],
        actors: [
          { k: "marcos", x: 180, row: 0.95, s: 1.35, anim: "point" },
          { k: "paulo", x: 880, row: 0.94, s: 1.32, anim: "shock", variant: 1, flip: true },
        ],
        fx: [{ k: "sparkle", x: 530, y: 1100, n: 18 }, { k: "rays" }],
        cam: { x0: 0, y0: 20, z0: 1.02, x1: 0, y1: -20, z1: 1.15 },
      },
    },
    {
      lines: ["« Si tu n'en prends pas soin, avertit Marcos, elle ira à qui sait l'estimer. »", "« Merci mille fois papa, promit Paulo, j'en prendrai le plus grand soin ! »"],
      pt: "“Se você não cuidar bem dele”, advertiu Marcos, “ele irá para quem saiba estimá-lo.” “Muito obrigado, pai!”, prometeu Paulo. “Vou cuidar dele com todo o zelo!”",
      art: {
        look: "day", terrain: "interior", ground: "wood", seed: 25,
        props: [{ k: "car", x: 530, row: 0.78, s: 1.35, v: 0 }],
        actors: [
          { k: "marcos", x: 260, row: 0.94, s: 1.35, anim: "talk" },
          { k: "paulo", x: 820, row: 0.92, s: 1.32, anim: "wave", variant: 1, flip: true },
        ],
        fx: [{ k: "dust", n: 20 }],
        cam: { x0: -20, y0: 0, z0: 1.0, x1: 20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Quelques mois plus tard, le moteur s'arrêta net. Aucun garage ne trouva la panne.", "Cette mécanique unique était un véritable casse-tête pour les experts."],
      pt: "Alguns meses depois, o motor parou de repente. Nenhuma oficina encontrou a falha. Aquele mecanismo único era um quebra-cabeça para os especialistas.",
      art: {
        look: "storm", terrain: "interior", ground: "wood", seed: 26,
        props: [{ k: "car", x: 510, row: 0.8, s: 1.35, v: 1 }],
        actors: [{ k: "paulo", x: 850, row: 0.94, s: 1.32, anim: "sad", variant: 1, flip: true }],
        fx: [{ k: "dust", n: 32 }],
        cam: { x0: 20, y0: 0, z0: 1.02, x1: -20, y1: 0, z1: 1.15 },
      },
    },
    {
      lines: ["Paulo appela son père. Marcos découvrit la boîte et constata l'absence.", "« L'outil que tu as égaré était l'unique clé capable de réparer ce moteur. »"],
      pt: "Paulo chamou o pai. Marcos olhou a caixa e viu a ausência. “A ferramenta que você perdeu era a única chave capaz de consertar este motor.”",
      art: {
        look: "sunset", terrain: "interior", ground: "wood", seed: 27,
        props: [{ k: "toolbox", x: 510, row: 0.72, s: 1.12, v: 1 }, { k: "car", x: 850, row: 0.45, s: 0.85, v: 1 }],
        actors: [
          { k: "marcos", x: 290, row: 0.94, s: 1.35, anim: "talk" },
          { k: "paulo", x: 720, row: 0.92, s: 1.32, anim: "sad", variant: 1, flip: true },
        ],
        fx: [{ k: "dust", n: 24 }],
        cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: -20, z1: 1.18 },
      },
    },
    {
      lines: ["Sans cette pièce introuvable, la voiture d'exception fut perdue à jamais.", "Morale : prends soin de ce que tu as ; ce qui paraît banal aujourd'hui sera précieux demain."],
      pt: "Sem aquela chave insubstituível, o carro dos sonhos foi perdido para sempre. Moral: cuide do que você tem; o que parece banal hoje pode ser precioso amanhã.",
      moral: true,
      art: {
        look: "sunset", terrain: "interior", ground: "wood", seed: 28,
        props: [{ k: "toolbox", x: 540, row: 0.74, s: 1.12, v: 1 }],
        actors: [{ k: "paulo", x: 540, row: 0.94, s: 1.32, anim: "sad", variant: 1 }],
        fx: [{ k: "sparkle", x: 540, y: 1100, n: 12 }, { k: "dust", n: 25 }],
        cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.15 },
      },
    },
  ],
};

/* ----------------------------------------------------------------- */
/* 6. L'aquarium de l'amour                                           */
/* ----------------------------------------------------------------- */

const AQUARIUM: Tale = {
  slug: "l-aquarium-de-l-amour",
  title: "L'aquarium de l'amour",
  byline: "Une parabole sur le respect et l'attention",
  level: "B1",
  synopsisPt: "Pedro e Sabrina pareciam o casal perfeito. Para seus 30 anos, Sabrina deu a Pedro um lindo aquário representando seu coração... mas a cada descuido e promessa quebrada, uma pedra era lançada.",
  coverScene: 1,
  scenes: [
    {
      lines: ["Pedro et Sabrina formaient pour leur entourage le modèle du couple idéal.", "Lui réussissait dans les affaires ; elle régalait tous les cœurs dans son restaurant."],
      pt: "Pedro e Sabrina formavam para todos o modelo de casal ideal. Ele prosperava nos negócios; ela encantava a todos em seu restaurante conceituado.",
      art: {
        look: "day", terrain: "interior", ground: "wood", seed: 31,
        props: [{ k: "diningTable", x: 540, row: 0.72, s: 1.1 }],
        actors: [
          { k: "pedro", x: 310, row: 0.94, s: 1.32, anim: "idle" },
          { k: "sabrina", x: 740, row: 0.92, s: 1.3, anim: "idle", flip: true },
        ],
        fx: [{ k: "rays" }, { k: "petals", n: 10 }],
        cam: { x0: -20, y0: 0, z0: 1.02, x1: 20, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Pour ses trente ans, Sabrina lui offrit un aquarium étincelant de vie.", "« Cet aquarium représente mon cœur, dit-elle. Prends-en grand soin, je t'aime. »"],
      pt: "Para seus trinta anos, Sabrina deu-lhe de presente um aquário repleto de vida. “Este aquário representa o meu coração”, disse ela. “Cuide muito bem dele, te amo.”",
      art: {
        look: "day", terrain: "interior", ground: "wood", seed: 32,
        props: [{ k: "aquarium", x: 540, row: 0.75, s: 1.25, v: 0 }],
        actors: [
          { k: "pedro", x: 260, row: 0.94, s: 1.32, anim: "talk" },
          { k: "sabrina", x: 800, row: 0.92, s: 1.3, anim: "idle", flip: true },
        ],
        fx: [{ k: "sparkle", x: 540, y: 1100, n: 16 }, { k: "rays" }],
        cam: { x0: 0, y0: 20, z0: 1.02, x1: 0, y1: -20, z1: 1.15 },
      },
    },
    {
      lines: ["Sabrina lui demanda une minute d'aide, mais Pedro refusa pour son travail.", "Blessée par son dédain, elle alla poser une première pierre dans l'eau claire."],
      pt: "Magoada pelo descaso quando Pedro preferiu o trabalho a um minuto de ajuda, ela colocou a primeira pedra na água límpida.",
      art: {
        look: "day", terrain: "interior", ground: "wood", seed: 33,
        props: [
          { k: "officeDesk", x: 280, row: 0.7, s: 1.1 },
          { k: "aquarium", x: 800, row: 0.75, s: 1.1, v: 1 },
        ],
        actors: [
          { k: "pedro", x: 260, row: 0.92, s: 1.32, anim: "work" },
          { k: "sabrina", x: 740, row: 0.92, s: 1.3, anim: "drop_stone" },
        ],
        fx: [{ k: "dust", n: 20 }],
        cam: { x0: -25, y0: 0, z0: 1.0, x1: 25, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Le soir de l'anniversaire de Sabrina, Pedro annula leur dîner pour un client.", "Rentrée seule, elle déposa une deuxième pierre lourde dans le bassin."],
      pt: "Na noite de aniversário de Sabrina, Pedro cancelou o jantar deles por um cliente. Voltando sozinha, ela colocou uma segunda pedra pesada no aquário.",
      art: {
        look: "night", terrain: "interior", ground: "wood", seed: 34,
        props: [
          { k: "diningTable", x: 280, row: 0.7, s: 1.0 },
          { k: "aquarium", x: 780, row: 0.75, s: 1.15, v: 2 },
        ],
        actors: [{ k: "sabrina", x: 720, row: 0.92, s: 1.3, anim: "drop_stone" }],
        fx: [{ k: "dust", n: 24 }],
        cam: { x0: 25, y0: 0, z0: 1.02, x1: -15, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Au restaurant, une fête rendit hommage au dévouement exceptionnel de Sabrina.", "Pedro avait juré de venir, mais il préféra encore un rendez-vous d'affaires."],
      pt: "No restaurante, uma grande festa homenageou a dedicação de Sabrina. Pedro havia jurado comparecer, mas preferiu mais uma reunião de negócios.",
      art: {
        look: "sunset", terrain: "interior", ground: "wood", seed: 35,
        props: [{ k: "diningTable", x: 540, row: 0.72, s: 1.2 }],
        actors: [{ k: "sabrina", x: 540, row: 0.92, s: 1.3, anim: "sad" }],
        fx: [{ k: "petals", n: 12 }, { k: "dust", n: 20 }],
        cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: -20, z1: 1.14 },
      },
    },
    {
      lines: ["Sabrina jeta une nouvelle pierre. L'aquarium était désormais étouffé de roches.", "Les plantes étaient broyées, les poissons étaient morts, et l'eau n'était que boue."],
      pt: "Sabrina jogou outra pedra. O aquário estava agora sufocado de pedras. As plantas foram esmagadas, os peixes morreram e a água virou pura sujeira.",
      art: {
        look: "storm", terrain: "interior", ground: "wood", seed: 36,
        props: [{ k: "aquarium", x: 540, row: 0.75, s: 1.3, v: 3 }],
        actors: [{ k: "sabrina", x: 780, row: 0.92, s: 1.3, anim: "drop_stone", flip: true }],
        fx: [{ k: "dust", n: 36 }],
        cam: { x0: 0, y0: 20, z0: 1.02, x1: 0, y1: -20, z1: 1.16 },
      },
    },
    {
      lines: ["Le samedi, Sabrina prit l'aquarium sans vie pour le jeter aux ordures.", "« Pourquoi est-il plein de cailloux ? » s'étonna Pedro, stupéfait."],
      pt: "No sábado, Sabrina pegou o aquário sem vida para jogá-lo no lixo. “Por que ele está cheio de pedras?”, espantou-se Pedro, atônito.",
      art: {
        look: "day", terrain: "interior", ground: "wood", seed: 37,
        props: [],
        actors: [
          { k: "sabrina", x: 400, row: 0.92, s: 1.3, anim: "carry_tank" },
          { k: "pedro", x: 800, row: 0.94, s: 1.32, anim: "shock", flip: true },
        ],
        fx: [{ k: "dust", n: 24 }],
        cam: { x0: -20, y0: 0, z0: 1.0, x1: 20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["« Chaque pierre est l'un de tes mépris », murmura-t-elle avec une peine immense.", "« Voilà ce qu'est devenu mon cœur : un bloc froid et lourd, sans plus aucune vie. »"],
      pt: "“Cada pedra é um dos seus desprezos”, murmurou ela com imensa tristeza. “Eis o que virou o meu coração: um bloco frio e pesado, sem mais nenhuma vida.”",
      art: {
        look: "sunset", terrain: "interior", ground: "wood", seed: 38,
        props: [{ k: "aquarium", x: 540, row: 0.74, s: 1.25, v: 3 }],
        actors: [
          { k: "sabrina", x: 320, row: 0.92, s: 1.3, anim: "talk" },
          { k: "pedro", x: 780, row: 0.94, s: 1.32, anim: "sad", flip: true },
        ],
        fx: [{ k: "dust", n: 28 }],
        cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: -20, z1: 1.16 },
      },
    },
    {
      lines: ["Pedro comprit trop tard qu'aucune excuse ne ranimerait ce qu'il avait étouffé.", "Morale : les petits manques d'égard répétés finissent par détruire l'amour le plus pur."],
      pt: "Pedro compreendeu tarde demais que nenhuma desculpa reviveria o que ele sufocou. Moral: as pequenas faltas de consideração repetidas acabam destruindo o amor mais puro.",
      moral: true,
      art: {
        look: "sunset", terrain: "interior", ground: "wood", seed: 39,
        props: [{ k: "aquarium", x: 540, row: 0.74, s: 1.25, v: 3 }],
        actors: [{ k: "pedro", x: 540, row: 0.94, s: 1.32, anim: "sad" }],
        fx: [{ k: "sparkle", x: 540, y: 1100, n: 12 }, { k: "dust", n: 24 }],
        cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.15 },
      },
    },
  ],
};

export const TALES: Tale[] = [AIGLE, LIEVRE, CORBEAU, CIGALE, SOIN, AQUARIUM];
=======
/* 5. La poule aux œufs d'or                                          */
/* ----------------------------------------------------------------- */
>>>>>>> 1262605a07663215c7998d8dbbc089ef578a0cdb

const POULE: Tale = {
  slug: "la-poule-aux-oeufs-d-or",
  title: "La poule aux œufs d'or",
  byline: "D'après Jean de La Fontaine",
  level: "A2",
  synopsisPt: "Um fazendeiro tem uma galinha que põe ovos de ouro. Mas a ganância pode fazer perder tudo.",
  coverScene: 1,
  scenes: [
    {
      lines: ["Un fermier avait une poule très spéciale.", "Chaque matin, elle pondait un œuf en or !"],
      pt: "Um fazendeiro tinha uma galinha muito especial. Toda manhã, ela botava um ovo de ouro!",
      art: {
        look: "dawn", terrain: "farm", ground: "dirt", seed: 21,
        props: [{ k: "barn", x: 850, row: 0.05, s: 1.1 }, { k: "haystack", x: 180, row: 0.1, s: 1.1 }, { k: "nest", x: 420, row: 0.8, s: 1.6, v: 11 }, { k: "fence", x: -60, row: 0.28, s: 1.2, w: 700 }],
        actors: [{ k: "person", x: 220, row: 0.95, s: 1.3, anim: "idle", variant: 0 }, { k: "hen", x: 600, row: 0.85, s: 1.8, anim: "idle" }],
        fx: [{ k: "sparkle", x: 430, y: 1230, n: 16 }, { k: "rays" }], cam: { x0: -20, y0: 0, z0: 1.02, x1: 30, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Le fermier vendait les œufs au marché.", "Petit à petit, il devint très riche."],
      pt: "O fazendeiro vendia os ovos no mercado. Aos poucos, ficou muito rico.",
      art: {
        look: "day", terrain: "farm", ground: "dirt", seed: 21,
        props: [{ k: "barn", x: 200, row: 0.05, s: 1.1 }, { k: "nest", x: 760, row: 0.8, s: 1.6, v: 13 }, { k: "tree", x: 960, row: 0.06, s: 1.2 }],
        actors: [{ k: "person", x: 450, row: 0.95, s: 1.3, anim: "wave", variant: 0 }, { k: "hen", x: 880, row: 0.7, s: 1.5, anim: "idle" }],
        fx: [{ k: "sparkle", x: 760, y: 1230, n: 22 }, { k: "dust", n: 20 }], cam: { x0: 20, y0: 0, z0: 1.02, x1: -20, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Mais il voulait toujours plus d'or.", "« Pourquoi attendre chaque matin ? » se dit-il."],
      pt: "Mas ele queria sempre mais ouro. “Por que esperar toda manhã?”, pensou.",
      art: {
        look: "sunset", terrain: "farm", ground: "dirt", seed: 22,
        props: [{ k: "barn", x: 850, row: 0.05, s: 1.1 }, { k: "haystack", x: 120, row: 0.12, s: 1.0 }],
        actors: [{ k: "person", x: 360, row: 0.95, s: 1.4, anim: "idle", variant: 0 }, { k: "hen", x: 700, row: 0.85, s: 1.6, anim: "peck" }],
        fx: [{ k: "dust", n: 24 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.16 },
      },
    },
    {
      lines: ["Un soir, il enferma la poule et lui cria :", "« Donne-moi tout ton or, tout de suite ! »"],
      pt: "Uma noite, ele prendeu a galinha e gritou: “Dê-me todo o seu ouro, agora mesmo!”",
      art: {
        look: "barn", terrain: "interior", ground: "wood", seed: 23,
        props: [{ k: "haystack", x: 150, row: 0.1, s: 1.2 }, { k: "nest", x: 760, row: 0.7, s: 1.4, v: 0 }],
        actors: [{ k: "person", x: 300, row: 0.95, s: 1.5, anim: "wave", variant: 0 }, { k: "hen", x: 740, row: 0.8, s: 1.7, anim: "idle", flip: true }],
        fx: [{ k: "dust", n: 30 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.18 },
      },
    },
    {
      lines: ["Mais la poule, effrayée, ne pondit plus rien.", "Le lendemain matin, le nid était vide."],
      pt: "Mas a galinha, assustada, não botou mais nada. Na manhã seguinte, o ninho estava vazio.",
      art: {
        look: "dawn", terrain: "interior", ground: "wood", seed: 23,
        props: [{ k: "nest", x: 540, row: 0.8, s: 1.9, v: 0 }, { k: "haystack", x: 160, row: 0.1, s: 1.2 }],
        actors: [{ k: "hen", x: 820, row: 0.65, s: 1.3, anim: "idle", variant: 0, flip: true }],
        fx: [{ k: "rays" }, { k: "dust", n: 40 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: 0, z1: 1.16 },
      },
    },
    {
      lines: ["Le fermier attendit, attendit... mais aucun œuf ne vint.", "Il comprit alors son erreur."],
      pt: "O fazendeiro esperou, esperou… mas nenhum ovo veio. Então entendeu o seu erro.",
      art: {
        look: "sunset", terrain: "farm", ground: "dirt", seed: 22,
        props: [{ k: "barn", x: 840, row: 0.05, s: 1.1 }, { k: "fence", x: -60, row: 0.3, s: 1.2, w: 700 }],
        actors: [{ k: "person", x: 440, row: 0.95, s: 1.5, anim: "idle", variant: 0 }, { k: "hen", x: 780, row: 0.85, s: 1.4, anim: "idle" }],
        fx: [{ k: "dust", n: 18 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.18 },
      },
    },
    {
      lines: ["Morale : qui veut tout, risque de tout perdre."],
      pt: "Moral: quem quer tudo corre o risco de perder tudo.",
      moral: true,
      art: {
        look: "sunset", terrain: "farm", ground: "dirt", seed: 22,
        props: [{ k: "nest", x: 540, row: 0.8, s: 1.7, v: 11 }, { k: "barn", x: 880, row: 0.05, s: 1.0 }],
        actors: [{ k: "hen", x: 340, row: 0.85, s: 1.6, anim: "idle" }],
        fx: [{ k: "sparkle", x: 540, y: 1230, n: 18 }], cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.14 },
      },
    },
  ],
};

/* ----------------------------------------------------------------- */
/* 6. Le renard et les raisins                                        */
/* ----------------------------------------------------------------- */

const RAISINS: Tale = {
  slug: "le-renard-et-les-raisins",
  title: "Le renard et les raisins",
  byline: "D'après Ésope et La Fontaine",
  level: "A2",
  synopsisPt: "Uma raposa faminta vê uvas lá no alto. O que ela diz quando não consegue alcançá-las?",
  coverScene: 2,
  scenes: [
    {
      lines: ["Un renard avait très faim.", "Il marchait depuis le matin sans rien trouver."],
      pt: "Uma raposa estava com muita fome. Caminhava desde a manhã sem encontrar nada.",
      art: {
        look: "day", terrain: "meadow", seed: 31,
        props: [{ k: "bush", x: 150, row: 0.15 }, { k: "tree", x: 940, row: 0.06, s: 1.2 }],
        actors: [{ k: "fox", x: 200, row: 0.85, s: 1.5, anim: "walk", dx: 380 }],
        fx: [{ k: "dust", n: 24 }], cam: { x0: -20, y0: 0, z0: 1.02, x1: 40, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Soudain, il vit de beaux raisins, tout en haut d'une vigne."],
      pt: "De repente, viu belas uvas no alto de uma parreira.",
      art: {
        look: "day", terrain: "meadow", seed: 31,
        props: [{ k: "grapevine", x: 700, row: 0.45, s: 1.5 }, { k: "bush", x: 120, row: 0.15 }],
        actors: [{ k: "fox", x: 300, row: 0.88, s: 1.5, anim: "idle" }],
        fx: [{ k: "sparkle", x: 700, y: 760, n: 14 }], cam: { x0: -10, y0: 0, z0: 1.0, x1: 20, y1: -20, z1: 1.16 },
      },
    },
    {
      lines: ["« Quel délice ! » dit-il. « Je vais les attraper ! »"],
      pt: "“Que delícia!”, disse ele. “Vou pegá-las!”",
      art: {
        look: "day", terrain: "meadow", seed: 31,
        props: [{ k: "grapevine", x: 640, row: 0.5, s: 1.7 }],
        actors: [{ k: "fox", x: 360, row: 0.9, s: 1.6, anim: "idle" }],
        fx: [{ k: "sparkle", x: 640, y: 700, n: 16 }, { k: "petals", n: 8 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: -20, z1: 1.18 },
      },
    },
    {
      lines: ["Il sauta une fois, deux fois, trois fois...", "Mais les raisins étaient beaucoup trop hauts."],
      pt: "Pulou uma vez, duas vezes, três vezes… Mas as uvas estavam muito altas.",
      art: {
        look: "day", terrain: "meadow", seed: 31,
        props: [{ k: "grapevine", x: 700, row: 0.5, s: 1.7 }],
        actors: [{ k: "fox", x: 420, y: 1290, s: 1.6, anim: "walk", speed: 12, dy: -90 }],
        fx: [{ k: "dust", n: 30 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: -10, z1: 1.14 },
      },
    },
    {
      lines: ["Fatigué, le renard s'assit par terre.", "Il regarda les raisins avec envie."],
      pt: "Cansada, a raposa sentou no chão. Olhou as uvas com vontade.",
      art: {
        look: "sunset", terrain: "meadow", seed: 32,
        props: [{ k: "grapevine", x: 680, row: 0.5, s: 1.6 }],
        actors: [{ k: "fox", x: 350, row: 0.92, s: 1.6, anim: "idle" }],
        fx: [{ k: "dust", n: 20 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.16 },
      },
    },
    {
      lines: ["Alors il s'éloigna en disant : « Ils sont trop verts ! »", "« De toute façon, je n'en voulais pas ! »"],
      pt: "Então foi embora dizendo: “Estão verdes demais!” “De qualquer jeito, eu nem queria!”",
      art: {
        look: "sunset", terrain: "meadow", seed: 32,
        props: [{ k: "grapevine", x: 220, row: 0.45, s: 1.3 }, { k: "tree", x: 960, row: 0.06, s: 1.2 }],
        actors: [{ k: "fox", x: 700, row: 0.9, s: 1.5, anim: "walk", dx: 360, flip: false }],
        fx: [{ k: "dust", n: 24 }], cam: { x0: 20, y0: 0, z0: 1.02, x1: -20, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Morale : il ne faut pas mépriser ce que l'on n'arrive pas à avoir."],
      pt: "Moral: não devemos desprezar aquilo que não conseguimos ter.",
      moral: true,
      art: {
        look: "sunset", terrain: "meadow", seed: 32,
        props: [{ k: "grapevine", x: 540, row: 0.4, s: 1.6 }],
        actors: [{ k: "fox", x: 800, row: 0.92, s: 1.4, anim: "idle", flip: true }],
        fx: [{ k: "sparkle", x: 540, y: 740, n: 14 }], cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.14 },
      },
    },
  ],
};

/* ----------------------------------------------------------------- */
/* 7. Le lion et le rat                                               */
/* ----------------------------------------------------------------- */

const LION: Tale = {
  slug: "le-lion-et-le-rat",
  title: "Le lion et le rat",
  byline: "D'après Jean de La Fontaine",
  level: "B1",
  synopsisPt: "Um leão poupa um ratinho. Um dia, é o pequeno quem salva o grande.",
  coverScene: 2,
  scenes: [
    {
      lines: ["Un lion dormait paisiblement sous un arbre.", "Un petit rat, qui jouait, lui courut sur la patte."],
      pt: "Um leão dormia tranquilo debaixo de uma árvore. Um ratinho que brincava correu por cima da sua pata.",
      art: {
        look: "autumn", terrain: "plain", ground: "sand", seed: 41,
        props: [{ k: "oak", x: 720, row: 0.15, s: 1.6 }, { k: "rock", x: 150, row: 0.4, w: 120 }],
        actors: [{ k: "lion", x: 420, row: 0.82, s: 1.0, anim: "sleep" }, { k: "mouse", x: 100, row: 0.95, s: 1.8, anim: "run", dx: 560 }],
        fx: [{ k: "zzz", x: 440, y: 1170 }, { k: "dust", n: 20 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 20, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Le lion se réveilla en colère et attrapa le rat."],
      pt: "O leão acordou furioso e agarrou o ratinho.",
      art: {
        look: "autumn", terrain: "plain", ground: "sand", seed: 41,
        props: [{ k: "oak", x: 860, row: 0.15, s: 1.5 }],
        actors: [{ k: "lion", x: 380, row: 0.86, s: 1.1, anim: "roar" }, { k: "mouse", x: 700, row: 0.95, s: 2.0, anim: "idle", flip: true }],
        fx: [{ k: "dust", n: 24 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.18 },
      },
    },
    {
      lines: ["« Laisse-moi partir ! » supplia le rat.", "« Un jour, je pourrai t'aider ! »"],
      pt: "“Deixe-me ir!”, implorou o ratinho. “Um dia eu poderei ajudá-lo!”",
      art: {
        look: "autumn", terrain: "plain", ground: "sand", seed: 41,
        props: [{ k: "oak", x: 140, row: 0.15, s: 1.5 }],
        actors: [{ k: "lion", x: 700, row: 0.88, s: 1.1, anim: "idle", flip: true }, { k: "mouse", x: 150, row: 0.95, s: 2.2, anim: "idle" }],
        fx: [{ k: "dust", n: 20 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.18 },
      },
    },
    {
      lines: ["Le lion éclata de rire : « Toi, m'aider ? Quelle drôle d'idée ! »", "Mais il le laissa partir."],
      pt: "O leão caiu na gargalhada: “Você, me ajudar? Que ideia engraçada!” Mas deixou o ratinho ir embora.",
      art: {
        look: "autumn", terrain: "plain", ground: "sand", seed: 41,
        props: [{ k: "rock", x: 880, row: 0.45, w: 110 }],
        actors: [{ k: "lion", x: 700, row: 0.88, s: 1.1, anim: "idle", flip: true }, { k: "mouse", x: 380, row: 0.95, s: 2.0, anim: "run", dx: -280, flip: true, speed: 18 }],
        fx: [{ k: "dust", n: 28 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: -20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Quelque temps après, des chasseurs posèrent un grand filet.", "Le lion tomba dedans et ne put plus bouger."],
      pt: "Algum tempo depois, caçadores armaram uma grande rede. O leão caiu nela e não conseguiu mais se mexer.",
      art: {
        look: "sunset", terrain: "forest", ground: "dirt", seed: 42,
        props: [{ k: "oak", x: 120, row: 0.2, s: 1.6 }, { k: "net", x: 560, row: 0.9, s: 1.2 }],
        actors: [{ k: "lion", x: 560, row: 0.84, s: 1.0, anim: "idle" }],
        fx: [{ k: "dust", n: 20 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Il rugissait de toutes ses forces, mais personne ne venait."],
      pt: "Ele rugia com todas as forças, mas ninguém vinha.",
      art: {
        look: "sunset", terrain: "forest", ground: "dirt", seed: 42,
        props: [{ k: "oak", x: 960, row: 0.2, s: 1.6 }, { k: "net", x: 520, row: 0.9, s: 1.3 }],
        actors: [{ k: "lion", x: 520, row: 0.84, s: 1.05, anim: "roar" }],
        fx: [{ k: "dust", n: 24 }], cam: { x0: 0, y0: 0, z0: 1.06, x1: 0, y1: 0, z1: 1.2 },
      },
    },
    {
      lines: ["Le petit rat entendit le lion et accourut.", "Avec ses dents, il rongea les cordes une à une."],
      pt: "O ratinho ouviu o leão e correu até ele. Com os dentes, roeu as cordas uma a uma.",
      art: {
        look: "sunset", terrain: "forest", ground: "dirt", seed: 42,
        props: [{ k: "oak", x: 140, row: 0.2, s: 1.6 }, { k: "net", x: 600, row: 0.86, s: 1.1 }],
        actors: [{ k: "lion", x: 640, row: 0.84, s: 1.0, anim: "idle", flip: true }, { k: "mouse", x: 300, row: 0.98, s: 2.4, anim: "gnaw", dx: 40 }],
        fx: [{ k: "sparkle", x: 420, y: 1290, n: 8 }], cam: { x0: -20, y0: 0, z0: 1.04, x1: 20, y1: 0, z1: 1.18 },
      },
    },
    {
      lines: ["Bientôt, le lion fut libre.", "« Merci, petit ami ! » dit-il avec un grand sourire."],
      pt: "Logo o leão estava livre. “Obrigado, pequeno amigo!”, disse com um grande sorriso.",
      art: {
        look: "sunset", terrain: "forest", ground: "dirt", seed: 42,
        props: [{ k: "oak", x: 900, row: 0.2, s: 1.6 }],
        actors: [{ k: "lion", x: 720, row: 0.86, s: 1.1, anim: "idle", flip: true }, { k: "mouse", x: 150, row: 0.97, s: 2.2, anim: "idle" }],
        fx: [{ k: "sparkle", x: 440, y: 1180, n: 18 }, { k: "dust", n: 16 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: 0, z1: 1.16 },
      },
    },
    {
      lines: ["Morale : on a parfois besoin d'un plus petit que soi."],
      pt: "Moral: às vezes precisamos de alguém menor do que nós.",
      moral: true,
      art: {
        look: "sunset", terrain: "plain", ground: "sand", seed: 41,
        props: [{ k: "oak", x: 140, row: 0.15, s: 1.5 }],
        actors: [{ k: "lion", x: 720, row: 0.88, s: 1.1, anim: "idle", flip: true }, { k: "mouse", x: 150, row: 0.96, s: 2.2, anim: "idle" }],
        fx: [{ k: "sparkle", x: 460, y: 1180, n: 14 }], cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.14 },
      },
    },
  ],
};

/* ----------------------------------------------------------------- */
/* 8. Le petit poussin perdu (histoire originale, A1)                 */
/* ----------------------------------------------------------------- */

const POUSSIN: Tale = {
  slug: "le-petit-poussin-perdu",
  title: "Le petit poussin perdu",
  byline: "Une histoire originale pour débutants",
  level: "A2",
  synopsisPt: "Um pintinho curioso segue uma borboleta e se perde. Quem vai ajudá-lo a voltar para casa?",
  coverScene: 3,
  scenes: [
    {
      lines: ["Un petit poussin jouait dans le jardin de la ferme.", "Il était très curieux et il aimait explorer."],
      pt: "Um pintinho brincava no jardim da fazenda. Ele era muito curioso e adorava explorar.",
      art: {
        look: "day", terrain: "farm", ground: "grass", seed: 51,
        props: [{ k: "barn", x: 860, row: 0.05, s: 1.1 }, { k: "fence", x: -60, row: 0.3, s: 1.2, w: 800 }, { k: "flowers", x: 220, row: 1, v: 1 }, { k: "flowers", x: 760, row: 0.95, v: 2 }],
        actors: [{ k: "chick", x: 450, row: 0.9, s: 2.5, anim: "walk", dx: 70 }, { k: "hen", x: 200, row: 0.75, s: 1.4, anim: "peck" }],
        fx: [{ k: "petals", n: 12 }], cam: { x0: -20, y0: 0, z0: 1.02, x1: 20, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Un jour, il vit un joli papillon jaune.", "« Attends-moi ! » cria-t-il, et il le suivit."],
      pt: "Um dia, ele viu uma linda borboleta amarela. “Espere por mim!”, gritou, e a seguiu.",
      art: {
        look: "day", terrain: "farm", ground: "grass", seed: 51,
        props: [{ k: "fence", x: 300, row: 0.3, s: 1.2, w: 800 }, { k: "flowers", x: 150, row: 1, v: 0 }],
        actors: [{ k: "butterfly", x: 700, row: 0.8, s: 2.2, dx: 200, dy: -40 }, { k: "chick", x: 340, row: 0.92, s: 2.5, anim: "walk", dx: 280, speed: 11 }],
        fx: [{ k: "petals", n: 14 }], cam: { x0: -20, y0: 0, z0: 1.0, x1: 50, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Le poussin suivit le papillon très loin, jusqu'à un grand champ."],
      pt: "O pintinho seguiu a borboleta muito longe, até um grande campo.",
      art: {
        look: "day", terrain: "plain", ground: "grass", seed: 52,
        props: [{ k: "wheat", x: 250, row: 0.45, w: 420, s: 1.1 }, { k: "wheat", x: 820, row: 0.5, w: 400, s: 1.1 }],
        actors: [{ k: "butterfly", x: 360, row: 0.8, s: 2.2, dx: 300, dy: -60 }, { k: "chick", x: 240, row: 0.95, s: 2.4, anim: "walk", dx: 320, speed: 11 }],
        fx: [{ k: "dust", n: 24 }], cam: { x0: -30, y0: 0, z0: 1.0, x1: 50, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Quand il leva la tête, la ferme avait disparu.", "« Maman ? Où es-tu ? » appela-t-il."],
      pt: "Quando levantou a cabeça, a fazenda tinha sumido. “Mamãe? Onde você está?”, chamou.",
      art: {
        look: "sunset", terrain: "plain", ground: "grass", seed: 52,
        props: [{ k: "wheat", x: 180, row: 0.5, w: 380, s: 1.1 }, { k: "wheat", x: 900, row: 0.5, w: 380, s: 1.1 }],
        actors: [{ k: "chick", x: 540, row: 0.92, s: 2.8, anim: "idle" }],
        fx: [{ k: "dust", n: 26 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.2 },
      },
    },
    {
      lines: ["Soudain, un renard sortit des buissons.", "Le poussin eut très peur et cria : « Piou, piou ! »"],
      pt: "De repente, uma raposa saiu dos arbustos. O pintinho ficou com muito medo e gritou: “Piu, piu!”",
      art: {
        look: "sunset", terrain: "plain", ground: "grass", seed: 52,
        props: [{ k: "bush", x: 860, row: 0.3, s: 1.4 }, { k: "wheat", x: 160, row: 0.5, w: 380, s: 1.1 }],
        actors: [{ k: "chick", x: 280, row: 0.95, s: 2.6, anim: "idle" }, { k: "fox", x: 880, row: 0.88, s: 1.4, anim: "walk", dx: -240, flip: true }],
        fx: [{ k: "dust", n: 22 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: -20, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Mais sa maman, la poule, l'avait entendu.", "Elle arriva en courant, les ailes grandes ouvertes !"],
      pt: "Mas a mãe dele, a galinha, tinha ouvido. Chegou correndo, com as asas bem abertas!",
      art: {
        look: "sunset", terrain: "plain", ground: "grass", seed: 52,
        props: [{ k: "wheat", x: 880, row: 0.5, w: 380, s: 1.1 }],
        actors: [{ k: "chick", x: 280, row: 0.96, s: 2.6, anim: "idle" }, { k: "hen", x: 1000, row: 0.88, s: 2.0, anim: "run", dx: -520, speed: 14, variant: 1 }, { k: "fox", x: 130, row: 0.7, s: 1.2, anim: "idle" }],
        fx: [{ k: "dust", n: 34 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: -30, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Le renard eut peur de la poule et s'enfuit."],
      pt: "A raposa teve medo da galinha e fugiu.",
      art: {
        look: "sunset", terrain: "plain", ground: "grass", seed: 52,
        props: [{ k: "bush", x: 120, row: 0.3, s: 1.4 }],
        actors: [{ k: "fox", x: 420, row: 0.86, s: 1.4, anim: "walk", dx: -420, speed: 16 }, { k: "hen", x: 760, row: 0.9, s: 2.0, anim: "idle", variant: 1, flip: true }, { k: "chick", x: 960, row: 0.97, s: 2.4, anim: "idle", flip: true }],
        fx: [{ k: "dust", n: 40 }], cam: { x0: 20, y0: 0, z0: 1.02, x1: -30, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Le poussin se cacha sous les ailes de sa maman.", "« Je ne m'éloignerai plus jamais ! » dit-il."],
      pt: "O pintinho se escondeu embaixo das asas da mãe. “Nunca mais vou me afastar!”, disse.",
      art: {
        look: "sunset", terrain: "farm", ground: "grass", seed: 51,
        props: [{ k: "barn", x: 860, row: 0.05, s: 1.1 }, { k: "flowers", x: 200, row: 1, v: 1 }],
        actors: [{ k: "hen", x: 520, row: 0.9, s: 2.2, anim: "idle", variant: 1 }, { k: "chick", x: 700, row: 0.97, s: 2.4, anim: "idle" }],
        fx: [{ k: "sparkle", x: 600, y: 1200, n: 16 }, { k: "petals", n: 10 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Morale : reste toujours près de ceux qui t'aiment."],
      pt: "Moral: fique sempre perto de quem ama você.",
      moral: true,
      art: {
        look: "sunset", terrain: "farm", ground: "grass", seed: 51,
        props: [{ k: "barn", x: 860, row: 0.05, s: 1.0 }, { k: "flowers", x: 220, row: 1, v: 2 }],
        actors: [{ k: "hen", x: 480, row: 0.9, s: 2.0, anim: "idle", variant: 1 }, { k: "chick", x: 660, row: 0.97, s: 2.3, anim: "idle" }],
        fx: [{ k: "sparkle", x: 560, y: 1200, n: 14 }], cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.14 },
      },
    },
  ],
};

/* ----------------------------------------------------------------- */
/* 9. Le petit lièvre qui voulait voler (histoire originale, A1)      */
/* ----------------------------------------------------------------- */

const PETIT_LIEVRE: Tale = {
  slug: "le-petit-lievre-qui-voulait-voler",
  title: "Le petit lièvre qui voulait voler",
  byline: "Une histoire originale pour débutants",
  level: "A2",
  synopsisPt: "Um coelhinho sonha em voar como as aves. A águia lhe ensina o que ele faz melhor que ninguém.",
  coverScene: 3,
  scenes: [
    {
      lines: ["Un petit lièvre regardait le ciel tous les jours.", "Il rêvait de voler comme les oiseaux."],
      pt: "Um coelhinho olhava o céu todos os dias. Sonhava em voar como os pássaros.",
      art: {
        look: "day", terrain: "meadow", seed: 61,
        props: [{ k: "tree", x: 940, row: 0.06, s: 1.3 }, { k: "flowers", x: 200, row: 1, v: 1 }],
        actors: [{ k: "hare", x: 440, row: 0.88, s: 1.6, anim: "idle" }],
        fx: [{ k: "birds", n: 6, color: "#2f3b57" }, { k: "petals", n: 10 }], cam: { x0: 0, y0: 30, z0: 1.0, x1: 0, y1: -40, z1: 1.14 },
      },
    },
    {
      lines: ["Un jour, une grande aigle passa au-dessus de lui."],
      pt: "Um dia, uma grande águia passou por cima dele.",
      art: {
        look: "day", terrain: "meadow", seed: 61,
        props: [{ k: "tree", x: 120, row: 0.06, s: 1.3 }],
        actors: [{ k: "hare", x: 640, row: 0.9, s: 1.6, anim: "idle" }, { k: "eagle", x: 260, y: 760, s: 1.0, anim: "glide", dx: 520, dy: -40 }],
        fx: [{ k: "rays" }], cam: { x0: 0, y0: 30, z0: 1.0, x1: 0, y1: -30, z1: 1.12 },
      },
    },
    {
      lines: ["« Je voudrais voler comme toi ! » cria le lièvre.", "L'aigle se posa près de lui, très surprise."],
      pt: "“Eu queria voar como você!”, gritou o coelhinho. A águia pousou perto dele, muito surpresa.",
      art: {
        look: "day", terrain: "meadow", seed: 61,
        props: [{ k: "rock", x: 880, row: 0.5, w: 130 }, { k: "flowers", x: 150, row: 1, v: 2 }],
        actors: [{ k: "hare", x: 300, row: 0.9, s: 1.7, anim: "idle" }, { k: "eagle", x: 700, row: 0.85, s: 1.0, anim: "idle", flip: true }],
        fx: [{ k: "dust", n: 20 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["« Pour voler, il faut des ailes », dit l'aigle avec douceur."],
      pt: "“Para voar, é preciso ter asas”, disse a águia com carinho.",
      art: {
        look: "day", terrain: "meadow", seed: 61,
        props: [{ k: "rock", x: 880, row: 0.5, w: 130 }],
        actors: [{ k: "hare", x: 290, row: 0.9, s: 1.7, anim: "idle" }, { k: "eagle", x: 700, row: 0.85, s: 1.05, anim: "spread", flip: true }],
        fx: [{ k: "sparkle", x: 700, y: 1000, n: 12 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.16 },
      },
    },
    {
      lines: ["Mais le lièvre voulait essayer.", "Il grimpa sur un gros rocher."],
      pt: "Mas o coelhinho queria tentar. Subiu em uma grande pedra.",
      art: {
        look: "day", terrain: "meadow", seed: 62,
        props: [{ k: "rock", x: 560, row: 0.7, w: 230, s: 1.2 }, { k: "tree", x: 960, row: 0.06, s: 1.3 }],
        actors: [{ k: "hare", x: 560, y: 1040, s: 1.5, anim: "idle" }, { k: "eagle", x: 880, row: 0.9, s: 0.9, anim: "idle", flip: true }],
        fx: [{ k: "dust", n: 18 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: -20, z1: 1.14 },
      },
    },
    {
      lines: ["Il ferma les yeux, prit son élan... et sauta !"],
      pt: "Fechou os olhos, tomou impulso… e pulou!",
      art: {
        look: "day", terrain: "meadow", seed: 62,
        props: [{ k: "rock", x: 400, row: 0.7, w: 230, s: 1.2 }],
        actors: [{ k: "hare", x: 460, y: 960, s: 1.5, anim: "run", dx: 280, dy: -140, speed: 13 }],
        fx: [{ k: "sparkle", x: 700, y: 800, n: 14 }, { k: "birds", n: 3, color: "#2f3b57" }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 30, y1: -30, z1: 1.14 },
      },
    },
    {
      lines: ["Il retomba doucement dans l'herbe, mais il se mit à rire.", "« Je ne vole pas, mais je saute très, très haut ! »"],
      pt: "Caiu suavemente na grama, mas começou a rir. “Eu não voo, mas pulo muito, muito alto!”",
      art: {
        look: "day", terrain: "meadow", seed: 62,
        props: [{ k: "flowers", x: 220, row: 1, v: 1 }, { k: "flowers", x: 840, row: 0.98, v: 2 }, { k: "tree", x: 940, row: 0.06, s: 1.2 }],
        actors: [{ k: "hare", x: 560, row: 0.9, s: 1.8, anim: "idle" }],
        fx: [{ k: "petals", n: 20 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["L'aigle sourit : « Chacun a ses talents. Toi, tu es un champion du saut ! »"],
      pt: "A águia sorriu: “Cada um tem seus talentos. Você é um campeão de salto!”",
      art: {
        look: "sunset", terrain: "meadow", seed: 62,
        props: [{ k: "tree", x: 120, row: 0.06, s: 1.2 }],
        actors: [{ k: "hare", x: 320, row: 0.9, s: 1.7, anim: "idle" }, { k: "eagle", x: 740, row: 0.85, s: 1.05, anim: "idle", flip: true }],
        fx: [{ k: "sparkle", x: 540, y: 1060, n: 16 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.16 },
      },
    },
    {
      lines: ["Morale : chacun a un don unique. Découvre le tien !"],
      pt: "Moral: cada um tem um dom único. Descubra o seu!",
      moral: true,
      art: {
        look: "sunset", terrain: "meadow", seed: 62,
        props: [{ k: "flowers", x: 220, row: 1, v: 2 }],
        actors: [{ k: "eagle", x: 540, y: 820, s: 1.25, anim: "glide" }],
        fx: [{ k: "birds", n: 3, color: "#2a2540" }, { k: "sparkle", x: 540, y: 760, n: 14 }], cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.14 },
      },
    },
  ],
};

/* ----------------------------------------------------------------- */
/* 10. Le corbeau et la cruche                                        */
/* ----------------------------------------------------------------- */

const CRUCHE: Tale = {
  slug: "le-corbeau-et-la-cruche",
  title: "Le corbeau et la cruche",
  byline: "D'après Ésope",
  level: "B1",
  synopsisPt: "Um corvo com muita sede encontra um jarro com pouca água. Só a inteligência pode ajudá-lo.",
  coverScene: 5,
  scenes: [
    {
      lines: ["Il faisait très chaud, et un corbeau avait très soif.", "Il volait depuis des heures sans trouver d'eau."],
      pt: "Fazia muito calor, e um corvo estava com muita sede. Voava havia horas sem encontrar água.",
      art: {
        look: "day", terrain: "plain", ground: "sand", seed: 71, sun: [800, 340],
        props: [{ k: "rock", x: 180, row: 0.5, w: 110 }, { k: "bare", x: 900, row: 0.3, s: 1.2 }],
        actors: [{ k: "crow", x: 200, y: 700, s: 1.8, anim: "fly", dx: 560, dy: 60 }],
        fx: [{ k: "dust", n: 30 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 20, y1: 0, z1: 1.12 },
      },
    },
    {
      lines: ["Enfin, il vit une cruche posée près d'un arbre."],
      pt: "Finalmente, viu um jarro perto de uma árvore.",
      art: {
        look: "day", terrain: "plain", ground: "sand", seed: 71,
        props: [{ k: "oak", x: 840, row: 0.2, s: 1.5 }, { k: "jug", x: 400, row: 0.8, s: 1.5, v: 0 }, { k: "rock", x: 130, row: 0.5, w: 100 }],
        actors: [{ k: "crow", x: 160, y: 760, s: 1.6, anim: "fly", dx: 140, dy: 140 }],
        fx: [{ k: "sparkle", x: 400, y: 1040, n: 10 }], cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: 0, z1: 1.14 },
      },
    },
    {
      lines: ["Il y avait un peu d'eau au fond, mais le bec du corbeau était trop court."],
      pt: "Havia um pouco de água no fundo, mas o bico do corvo era curto demais.",
      art: {
        look: "day", terrain: "plain", ground: "sand", seed: 71,
        props: [{ k: "oak", x: 880, row: 0.2, s: 1.5 }, { k: "jug", x: 560, row: 0.86, s: 1.7, v: 0 }],
        actors: [{ k: "crow", x: 330, row: 0.92, s: 1.8, anim: "idle" }],
        fx: [{ k: "dust", n: 16 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: 0, z1: 1.16 },
      },
    },
    {
      lines: ["« Je ne peux pas renverser la cruche », pensa-t-il.", "« Que faire ? »"],
      pt: "“Não consigo derrubar o jarro”, pensou. “O que fazer?”",
      art: {
        look: "day", terrain: "plain", ground: "sand", seed: 71,
        props: [{ k: "oak", x: 880, row: 0.2, s: 1.5 }, { k: "jug", x: 560, row: 0.86, s: 1.7, v: 0 }, { k: "rock", x: 180, row: 0.95, w: 70, s: 1.3 }],
        actors: [{ k: "crow", x: 330, row: 0.92, s: 1.8, anim: "idle" }],
        fx: [{ k: "dust", n: 16 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.18 },
      },
    },
    {
      lines: ["Soudain, il eut une idée : il ramassa des petits cailloux."],
      pt: "De repente, teve uma ideia: pegou pedrinhas.",
      art: {
        look: "day", terrain: "plain", ground: "sand", seed: 71,
        props: [{ k: "oak", x: 900, row: 0.2, s: 1.5 }, { k: "jug", x: 640, row: 0.86, s: 1.6, v: 0 }, { k: "rock", x: 160, row: 0.95, w: 70, s: 1.3 }],
        actors: [{ k: "crow", x: 330, row: 0.92, s: 1.8, anim: "walk", carry: "pebble", dx: 150 }],
        fx: [{ k: "sparkle", x: 330, y: 1100, n: 10 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: 0, z1: 1.16 },
      },
    },
    {
      lines: ["Il les laissa tomber un par un dans la cruche.", "Peu à peu, l'eau monta !"],
      pt: "Deixou-as cair uma a uma no jarro. Pouco a pouco, a água subiu!",
      art: {
        look: "day", terrain: "plain", ground: "sand", seed: 71,
        props: [{ k: "oak", x: 900, row: 0.2, s: 1.5 }, { k: "jug", x: 560, row: 0.86, s: 1.8, v: 9 }],
        actors: [{ k: "crow", x: 380, row: 0.92, s: 1.8, anim: "walk", carry: "pebble", speed: 5 }],
        fx: [{ k: "sparkle", x: 560, y: 1000, n: 14 }], cam: { x0: 0, y0: 0, z0: 1.02, x1: 0, y1: 0, z1: 1.18 },
      },
    },
    {
      lines: ["Quand l'eau fut assez haute, le corbeau put enfin boire."],
      pt: "Quando a água ficou alta o bastante, o corvo finalmente pôde beber.",
      art: {
        look: "sunset", terrain: "plain", ground: "sand", seed: 71,
        props: [{ k: "oak", x: 900, row: 0.2, s: 1.5 }, { k: "jug", x: 600, row: 0.86, s: 1.8, v: 3 }],
        actors: [{ k: "crow", x: 360, row: 0.92, s: 1.8, anim: "drink" }],
        fx: [{ k: "sparkle", x: 600, y: 940, n: 18 }], cam: { x0: 0, y0: 0, z0: 1.04, x1: 0, y1: 0, z1: 1.18 },
      },
    },
    {
      lines: ["Morale : avec de la patience et de l'intelligence, on trouve toujours une solution."],
      pt: "Moral: com paciência e inteligência, sempre se encontra uma solução.",
      moral: true,
      art: {
        look: "sunset", terrain: "plain", ground: "sand", seed: 71,
        props: [{ k: "jug", x: 540, row: 0.86, s: 1.8, v: 3 }, { k: "oak", x: 900, row: 0.2, s: 1.4 }],
        actors: [{ k: "crow", x: 330, row: 0.92, s: 1.7, anim: "idle" }],
        fx: [{ k: "sparkle", x: 540, y: 930, n: 14 }], cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: 0, z1: 1.14 },
      },
    },
  ],
};

export const TALES: Tale[] = [AIGLE, LIEVRE, CORBEAU, CIGALE, POULE, RAISINS, LION, POUSSIN, PETIT_LIEVRE, CRUCHE];
export function getTale(slug: string): Tale | undefined {
  return TALES.find((tale) => tale.slug === slug);
}

/** Todas as frases narradas de um conto (título, frases das cenas). */
export function taleNarrationTexts(tale: Tale): string[] {
  return [tale.title, ...tale.scenes.flatMap((scene) => scene.lines)];
}
