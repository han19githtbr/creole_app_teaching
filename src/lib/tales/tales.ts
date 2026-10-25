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

export const TALES: Tale[] = [AIGLE, LIEVRE, CORBEAU, CIGALE];

export function getTale(slug: string): Tale | undefined {
  return TALES.find((tale) => tale.slug === slug);
}

/** Todas as frases narradas de um conto (título, frases das cenas). */
export function taleNarrationTexts(tale: Tale): string[] {
  return [tale.title, ...tale.scenes.flatMap((scene) => scene.lines)];
}
