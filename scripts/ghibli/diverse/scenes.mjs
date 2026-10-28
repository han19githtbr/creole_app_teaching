// Especificação das 19 cenas diversificadas de cada tema (imagens 02..20; a 01 de cada tema não muda).
// sky: tipo de céu · far: [camada distante, y, cor] · ground: [tipo, topo do chão] · water: [tipo, y0, y1] · decor: [[nome, ...args]]
// els: ids dos 4 elementos rotulados (ver cultura-els.mjs / natureza-els.mjs). Cada elemento aparece em no máximo 2 cenas
// do tema e duas cenas quaisquer compartilham no máximo 1 elemento.
export const CULTURA_SCENES = [
  { n: 2, title: "Banda Rara ao entardecer", sky: "sunset", far: ["mountains", 470, "#7a6a9a"], ground: ["dirt", 570], decor: [["palms"], ["dust", 600]], els: ["vaksin", "kon", "banye", "tcha-tcha"] },
  { n: 3, title: "Mercado de tecidos e lenços", sky: "day", far: ["town", 500, "#8fa8b8"], ground: ["cobble", 560], decor: [["bunting", 180]], els: ["twal", "chal", "foula", "makout"] },
  { n: 4, title: "Ateliê de arte naïf", sky: "golden", far: ["hills", 500, "#8aa87a"], ground: ["grass", 560], decor: [["wall"]], els: ["penti", "atis", "eskilti", "kolye"] },
  { n: 5, title: "Cozinha ao ar livre", sky: "clear", far: ["treeline", 510, "#6a9a6a"], ground: ["dirt", 570], decor: [["smoke", 900, 560], ["fence"]], els: ["motye", "kannari", "kalbas", "panye"] },
  { n: 6, title: "Contos ao redor da fogueira", sky: "night", far: ["pines", 510, "#26385a"], ground: ["night", 580], decor: [["fireflies"]], els: ["konte", "dife", "chez", "timoun"] },
  { n: 7, title: "Estrada do tap-tap", sky: "day", far: ["mountains", 480, "#8aa4c0"], ground: ["dirt", 580], decor: [["poles"], ["dust", 610]], els: ["tap-tap", "bourik", "granmoun", "chapo"] },
  { n: 8, title: "Praça do coreto", sky: "day", far: ["town", 500, "#9ab0be"], ground: ["cobble", 570], decor: [["trees"]], els: ["kyosk", "fonten", "balkon", "lanp"] },
  { n: 9, title: "Bastidores do carnaval", sky: "violet", far: ["town", 490, "#6a5a8a"], ground: ["cobble", 570], decor: [["bunting", 200]], els: ["teyat", "kostim", "tanbou", "plim"] },
  { n: 10, title: "Ferreiro do vilarejo", sky: "overcast", far: ["hills", 500, "#7a8a8a"], ground: ["rock", 580], decor: [["smoke", 180, 570]], els: ["fo", "eskilti", "bourik", "kay pay"] },
  { n: 11, title: "Colheita de cana e café", sky: "dawn", far: ["treeline", 510, "#6a8a6a"], ground: ["meadow", 570], decor: [["crops"]], els: ["kann", "kafe", "panye", "makout"] },
  { n: 12, title: "Praia dos leques e canoas", sky: "clear", far: ["islands", 430, "#7aa0a8"], water: ["sea", 430, 590], ground: ["sand", 590], decor: [["birds", 4], ["foam", 590]], els: ["evantay", "kanot", "plim", "chal"] },
  { n: 13, title: "Festa de rua à noite", sky: "night", far: ["town", 500, "#1c2a4a"], ground: ["night", 575], decor: [["lanterns", 170], ["fireflies"]], els: ["lanp", "tanbou", "evantay", "vaksin"] },
  { n: 14, title: "Casa de campo", sky: "mist", far: ["hills", 500, "#9ab0a8"], ground: ["meadow", 580], decor: [["fence"], ["fog", 520]], els: ["kay pay", "chez", "kannari", "kann"] },
  { n: 15, title: "Procissão ao pôr do sol", sky: "golden", far: ["mountains", 480, "#a89070"], ground: ["dirt", 575], decor: [["bunting", 210, ["#2f6bb5", "#e8464a", "#ffffff"]], ["dust", 610]], els: ["kon", "kostim", "chapo", "timoun"] },
  { n: 16, title: "Praça do estandarte", sky: "day", far: ["town", 495, "#9ab0c0"], ground: ["cobble", 570], decor: [["bunting", 170, ["#2f6bb5", "#e8464a"]]], els: ["banye", "kyosk", "foula", "konte"] },
  { n: 17, title: "Feira de rua", sky: "clear", far: ["hills", 500, "#88a888"], ground: ["dirt", 575], decor: [["parasols"]], els: ["tcha-tcha", "balkon", "twal", "granmoun"] },
  { n: 18, title: "Oficina de arte e fogo", sky: "violet", far: ["town", 490, "#5a4a7a"], ground: ["cobble", 570], decor: [["lanterns", 190]], els: ["penti", "teyat", "dife", "fo"] },
  { n: 19, title: "Estrada dos artistas", sky: "sunset", far: ["mountains", 480, "#8a6a8a"], ground: ["grass", 575], decor: [["trees"], ["birds", 5]], els: ["atis", "tap-tap", "kalbas", "kafe"] },
  { n: 20, title: "Beira-mar ao luar", sky: "night", far: ["islands", 430, "#1c2e58"], water: ["night", 430, 590], ground: ["nightsand", 590], decor: [["foam", 590]], els: ["kolye", "motye", "fonten", "kanot"] },
];

export const NATUREZA_SCENES = [
  { n: 2, title: "Praia de conchas e caranguejos", sky: "day", far: ["islands", 420, "#7aa8b0"], water: ["sea", 420, 570], ground: ["sand", 570], decor: [["birds", 4], ["foam", 570]], els: ["krab", "zetwal", "koki", "pelikan"] },
  { n: 3, title: "Golfinho e baleia no mar aberto", sky: "clear", far: ["islands", 400, "#7aa0a8"], water: ["sea", 400, 820], decor: [["birds", 3]], els: ["dofen", "balen", "zile", "lakansyel"] },
  { n: 4, title: "Recife de corais", sky: "clear", water: ["sea", 300, 820], ground: ["sand", 735], decor: [["rayswater"], ["bubbles"]], els: ["koray", "pwason", "zetwal", "balen"] },
  { n: 5, title: "Manguezal ao amanhecer", sky: "dawn", far: ["treeline", 430, "#6a9a7a"], water: ["lake", 430, 575], ground: ["moss", 575], decor: [["reeds"], ["fog", 440]], els: ["manglye", "flamen", "krab", "pwason"] },
  { n: 6, title: "Lagoa dos flamingos", sky: "sunset", far: ["hills", 480, "#a07a8a"], ground: ["moss", 560], decor: [["reeds"], ["birds", 4]], els: ["letan", "flamen", "pelikan", "nenifa"] },
  { n: 7, title: "Baía tranquila", sky: "violet", far: ["islands", 420, "#6a6a9a"], water: ["sea", 420, 585], ground: ["sand", 585], decor: [["foam", 585], ["birds", 3]], els: ["dofen", "koki", "manglye", "nenifa"] },
  { n: 8, title: "Costa rochosa e recife", sky: "overcast", water: ["sea", 420, 640], ground: ["rock", 640], decor: [["birds", 4, 120, 280, "#3a4450"], ["foam", 640]], els: ["zile", "koray", "malfini", "roch"] },
  { n: 9, title: "Floresta úmida ao amanhecer", sky: "dawn", far: ["treeline", 500, "#5a8a6a"], ground: ["forest", 570], decor: [["fog", 540]], els: ["chwet", "fey", "kolibri", "krapo"] },
  { n: 10, title: "Prado de girassóis", sky: "day", far: ["hills", 500, "#8ab88a"], ground: ["meadow", 570], decor: [["petals"], ["trees", 5]], els: ["lapen", "myel", "sef", "tounesol"] },
  { n: 11, title: "Terra vulcânica e dunas", sky: "golden", far: ["mountains", 470, "#a88a6a"], ground: ["dune", 560], decor: [["dust", 600]], els: ["din", "kaven", "lezar", "volkan"] },
  { n: 12, title: "Floresta de pinheiros na neblina", sky: "mist", far: ["pines", 480, "#7a9a8a"], ground: ["forest", 570], decor: [["fog", 500]], els: ["chanpiyon", "ekirey", "nich", "pen"] },
  { n: 13, title: "Penhasco seco", sky: "clear", far: ["peaks", 520, "#8a9aaa"], ground: ["rock", 580], decor: [["birds", 3]], els: ["falez", "kaktis", "lezar", "pen"] },
  { n: 14, title: "Encosta rochosa com ninhos", sky: "day", far: ["hills", 500, "#8aa888"], ground: ["grass", 575], decor: [["birds", 4], ["mound"]], els: ["kaven", "malfini", "myel", "nich"] },
  { n: 15, title: "Noite na floresta", sky: "night", far: ["pines", 500, "#1f3550"], ground: ["night", 575], decor: [["fireflies"]], els: ["chanpiyon", "koukouy", "krapo", "lis"] },
  { n: 16, title: "Lagoa ao amanhecer", sky: "dawn", far: ["hills", 500, "#a8a0b0"], ground: ["meadow", 570], decor: [["reeds"], ["fog", 520]], els: ["kolibri", "letan", "lis", "tounesol"] },
  { n: 17, title: "Vale da montanha", sky: "overcast", far: ["peaks", 500, "#7a8a96"], ground: ["moss", 575], decor: [["fog", 510]], els: ["ekirey", "falez", "sef", "volkan"] },
  { n: 18, title: "Chuva na floresta tropical", sky: "rain", far: ["treeline", 480, "#4a6a5a"], ground: ["forest", 570], decor: [["fog", 520]], els: ["bambou", "bannann", "fey", "foje"] },
  { n: 19, title: "Deserto depois da chuva", sky: "mist", far: ["mountains", 480, "#b0a08a"], ground: ["dune", 570], decor: [["dust", 610]], els: ["din", "kaktis", "lakansyel", "roch"] },
  { n: 20, title: "Jardim ao luar", sky: "night", far: ["treeline", 500, "#1c3048"], ground: ["night", 575], decor: [["fireflies", 20]], els: ["chwet", "foje", "koukouy", "lapen"] },
];
