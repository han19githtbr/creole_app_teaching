import fs from "node:fs";
import path from "node:path";

const filePath = path.resolve("./src/lib/imageSceneVariants.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

const additionalScenes = {
  "Turismo": [
    { "title": "Mirante sobre o oceano", "setting": "cliff", "palette": "dia", "objects": ["ocean", "lighthouse", "mountain", "map"] },
    { "title": "Voo panorâmico sobre o mar", "setting": "sky", "palette": "dia", "objects": ["balloon", "airplane", "ocean", "mountain"] },
    { "title": "Passeio de catamarã ao pôr do sol", "setting": "coast", "palette": "entardecer", "objects": ["boat", "ocean", "beach", "mountain"] },
    { "title": "Resort tropical à beira-mar", "setting": "beach", "palette": "dia", "objects": ["hotel", "beach", "suitcase", "boat"] },
    { "title": "Farol sob as estrelas", "setting": "island", "palette": "night", "objects": ["lighthouse", "ocean", "boat", "map"] },
    { "title": "Enseada dos pescadores", "setting": "harbor", "palette": "dia", "objects": ["boat", "beach", "ocean", "mountain"] },
    { "title": "Aeroporto na ilha caribenha", "setting": "airport", "palette": "dia", "objects": ["airplane", "suitcase", "mountain", "hotel"] },
    { "title": "Aventura de balão no litoral", "setting": "coast", "palette": "entardecer", "objects": ["balloon", "ocean", "beach", "lighthouse"] },
    { "title": "Recepção elegante do hotel", "setting": "town", "palette": "entardecer", "objects": ["hotel", "suitcase", "map", "boat"] },
    { "title": "Caminhada ao longo da falésia", "setting": "cliff", "palette": "dia", "objects": ["mountain", "ocean", "lighthouse", "beach"] }
  ],
  "Vida no interior": [
    { "title": "Pastoreio no campo verde", "setting": "meadow", "palette": "dia", "objects": ["goat", "fence", "tree", "wheat"] },
    { "title": "Pomar de frutas no sítio", "setting": "garden", "palette": "dia", "objects": ["tree", "garden", "house", "chicken"] },
    { "title": "Descanso sob a figueira", "setting": "farmland", "palette": "entardecer", "objects": ["tree", "well", "farm", "fence"] },
    { "title": "Galinheiro ao entardecer", "setting": "farmyard", "palette": "entardecer", "objects": ["chicken", "fence", "house", "tree"] },
    { "title": "Manhã de arado na terra", "setting": "farmland", "palette": "dia", "objects": ["tractor", "farm", "wheat", "tree"] },
    { "title": "Poço de água na encosta", "setting": "hill", "palette": "dia", "objects": ["well", "goat", "tree", "garden"] },
    { "title": "Celeiro e fardos de trigo", "setting": "farmland", "palette": "entardecer", "objects": ["wheat", "tractor", "farm", "fence"] },
    { "title": "Cabritos brincando na cerca", "setting": "farmyard", "palette": "dia", "objects": ["goat", "fence", "house", "chicken"] },
    { "title": "Horta irrigada ao amanhecer", "setting": "garden", "palette": "dia", "objects": ["garden", "well", "chicken", "tree"] },
    { "title": "Noite serena na fazenda", "setting": "farmyard", "palette": "night", "objects": ["house", "tree", "fence", "farm"] }
  ],
  "Dança": [
    { "title": "Dança folclórica na praça", "setting": "square", "palette": "dia", "objects": ["dancer", "ribbon", "flower", "drum"] },
    { "title": "Performance no teatro iluminado", "setting": "stage", "palette": "night", "objects": ["stage", "costume", "lantern", "dancer"] },
    { "title": "Dança com leques coloridos", "setting": "courtyard", "palette": "entardecer", "objects": ["fan", "dancer", "costume", "flower"] },
    { "title": "Tambores e dança sob a lua", "setting": "square", "palette": "night", "objects": ["drum", "dancer", "star", "music"] },
    { "title": "Bailarinas de fitas e flores", "setting": "garden", "palette": "dia", "objects": ["dancer", "ribbon", "flower", "costume"] },
    { "title": "Salão de konpa iluminado", "setting": "studio", "palette": "night", "objects": ["dancer", "lantern", "music", "stage"] },
    { "title": "Dança das sombrinhas e leques", "setting": "parade", "palette": "dia", "objects": ["fan", "costume", "dancer", "ribbon"] },
    { "title": "Celebração sob as lanternas", "setting": "square", "palette": "night", "objects": ["dancer", "star", "lantern", "drum"] },
    { "title": "Cortejo carnavalesco vibrante", "setting": "parade", "palette": "entardecer", "objects": ["costume", "dancer", "drum", "ribbon"] },
    { "title": "Valsa sob as estrelas", "setting": "stage", "palette": "night", "objects": ["dancer", "star", "stage", "flower"] }
  ],
  "Geografia": [
    { "title": "Delta do grande rio", "setting": "river", "palette": "dia", "objects": ["river", "ocean", "bridge", "mountain"] },
    { "title": "Cume nevado e bandeira guia", "setting": "mountain", "palette": "dia", "objects": ["mountain", "flag", "compass", "map"] },
    { "title": "Lago da caldeira vulcânica", "setting": "volcano", "palette": "entardecer", "objects": ["volcano", "mountain", "forest", "flag"] },
    { "title": "Estreito marítimo e arquipélago", "setting": "coast", "palette": "dia", "objects": ["island", "ocean", "compass", "map"] },
    { "title": "Floresta equatorial densa", "setting": "forest", "palette": "dia", "objects": ["forest", "river", "mountain", "compass"] },
    { "title": "Ponte suspensa no desfiladeiro", "setting": "canyon", "palette": "entardecer", "objects": ["bridge", "mountain", "river", "forest"] },
    { "title": "Enseada do vulcão adormecido", "setting": "volcano", "palette": "night", "objects": ["volcano", "ocean", "island", "flag"] },
    { "title": "Cartografia dos três picos", "setting": "mountain", "palette": "dia", "objects": ["map", "compass", "mountain", "flag"] },
    { "title": "Encontro das águas no manguezal", "setting": "river", "palette": "entardecer", "objects": ["river", "ocean", "forest", "bridge"] },
    { "title": "Vista aérea das ilhas caribenhas", "setting": "island", "palette": "dia", "objects": ["island", "ocean", "map", "compass"] }
  ],
  "História": [
    { "title": "Bastilha da cidadela sob o sol", "setting": "castle", "palette": "dia", "objects": ["fortress", "flag", "cannon", "stone"] },
    { "title": "Nau capitânia no ancoradouro", "setting": "harbor", "palette": "dia", "objects": ["boat", "stone", "flag", "torch"] },
    { "title": "Manuscrito dos patriotas", "setting": "library", "palette": "entardecer", "objects": ["book", "torch", "oldhouse", "stone"] },
    { "title": "Sentinela a cavalo na colina", "setting": "ruins", "palette": "entardecer", "objects": ["horse", "flag", "fortress", "stone"] },
    { "title": "Obelisco da independência", "setting": "square", "palette": "dia", "objects": ["monument", "flag", "stone", "horse"] },
    { "title": "Mansão colonial preservada", "setting": "square", "palette": "dia", "objects": ["oldhouse", "horse", "stone", "monument"] },
    { "title": "Canhoneira na muralha alta", "setting": "castle", "palette": "entardecer", "objects": ["cannon", "fortress", "torch", "flag"] },
    { "title": "Arquivo de tratados históricos", "setting": "library", "palette": "dia", "objects": ["book", "oldhouse", "monument", "stone"] },
    { "title": "Tochas acesas na fortaleza", "setting": "castle", "palette": "night", "objects": ["torch", "fortress", "cannon", "flag"] },
    { "title": "Cerimônia junto ao monumento", "setting": "square", "palette": "entardecer", "objects": ["monument", "flag", "horse", "oldhouse"] }
  ],
  "Cinema": [
    { "title": "Cineclube na praça florida", "setting": "square", "palette": "entardecer", "objects": ["screen", "chair", "tree", "lantern"] },
    { "title": "Rolo de filme e câmera retrô", "setting": "studio", "palette": "dia", "objects": ["camera", "ticket", "projector", "screen"] },
    { "title": "Sacola de pipoca e ingressos", "setting": "cinema", "palette": "dia", "objects": ["popcorn", "ticket", "cinema", "lantern"] },
    { "title": "Sessão cinema na praia à noite", "setting": "openCinema", "palette": "night", "objects": ["screen", "star", "chair", "popcorn"] },
    { "title": "Iluminação de cena no estúdio", "setting": "studio", "palette": "dia", "objects": ["lantern", "camera", "chair", "screen"] },
    { "title": "Fachada neon do cinema", "setting": "cinema", "palette": "night", "objects": ["cinema", "screen", "star", "popcorn"] },
    { "title": "Filmagem no jardim arborizado", "setting": "forest", "palette": "entardecer", "objects": ["camera", "chair", "tree", "ticket"] },
    { "title": "Sala com poltronas confortáveis", "setting": "cinema", "palette": "night", "objects": ["chair", "screen", "projector", "lantern"] },
    { "title": "Projetor no piquenique do parque", "setting": "openCinema", "palette": "entardecer", "objects": ["projector", "screen", "tree", "popcorn"] },
    { "title": "Noite de gala do festival", "setting": "square", "palette": "night", "objects": ["cinema", "lantern", "ticket", "star"] }
  ],
  "Música": [
    { "title": "Violão acústico ao luar", "setting": "garden", "palette": "night", "objects": ["guitar", "note", "dancer", "light"] },
    { "title": "Roda de tambor comunitária", "setting": "square", "palette": "dia", "objects": ["drum", "note", "dancer", "speaker"] },
    { "title": "Cabine de mixagem com fones", "setting": "studio", "palette": "dia", "objects": ["headphones", "keyboard", "speaker", "mic"] },
    { "title": "Piano de cauda na sala nobre", "setting": "concertHall", "palette": "night", "objects": ["piano", "light", "note", "mic"] },
    { "title": "Palco do festival ao entardecer", "setting": "stage", "palette": "entardecer", "objects": ["speaker", "mic", "light", "guitar"] },
    { "title": "Serenata sob as estrelas", "setting": "courtyard", "palette": "night", "objects": ["guitar", "note", "light", "dancer"] },
    { "title": "Oficina de tambores tradicionais", "setting": "square", "palette": "dia", "objects": ["drum", "note", "speaker", "dancer"] },
    { "title": "Teclado eletrônico e fones", "setting": "studio", "palette": "entardecer", "objects": ["keyboard", "headphones", "light", "note"] },
    { "title": "Trio acústico no parque", "setting": "garden", "palette": "dia", "objects": ["guitar", "note", "speaker", "piano"] },
    { "title": "Grande orquestra e percussão", "setting": "stage", "palette": "night", "objects": ["piano", "drum", "light", "speaker"] }
  ],
  "Lazeres": [
    { "title": "Revoada de pipas na colina", "setting": "meadow", "palette": "dia", "objects": ["kite", "tree", "flower", "ball"] },
    { "title": "Piquenique com cesta de vime", "setting": "park", "palette": "dia", "objects": ["picnic", "blanket", "tree", "duck"] },
    { "title": "Bicicleta no caminho florido", "setting": "meadow", "palette": "entardecer", "objects": ["bike", "tree", "flower", "book"] },
    { "title": "Balanço de corda no bosque", "setting": "grove", "palette": "dia", "objects": ["swing", "tree", "blanket", "flower"] },
    { "title": "Lago dos patos ao entardecer", "setting": "lake", "palette": "entardecer", "objects": ["duck", "tree", "blanket", "picnic"] },
    { "title": "Jogo de bola no gramado", "setting": "park", "palette": "dia", "objects": ["ball", "tree", "bike", "flower"] },
    { "title": "Cantinho de leitura no jardim", "setting": "garden", "palette": "dia", "objects": ["book", "tree", "blanket", "swing"] },
    { "title": "Pipa colorida sobre os campos", "setting": "meadow", "palette": "entardecer", "objects": ["kite", "flower", "bike", "ball"] },
    { "title": "Tarde ensolarada na lagoa", "setting": "lake", "palette": "dia", "objects": ["duck", "picnic", "ball", "tree"] },
    { "title": "Passeio de bicicleta no fim da tarde", "setting": "park", "palette": "entardecer", "objects": ["bike", "flower", "kite", "book"] }
  ],
  "Estoicismo": [
    { "title": "Ágora clássica sob o céu azul", "setting": "columns", "palette": "dia", "objects": ["column", "statue", "sage", "path"] },
    { "title": "Escadaria do templo antigo", "setting": "ruins", "palette": "dia", "objects": ["column", "gate", "jar", "scroll"] },
    { "title": "Leitura meditativa na oliveira", "setting": "grove", "palette": "entardecer", "objects": ["olive", "book", "sage", "jar"] },
    { "title": "Lamparina acesa sobre o papiro", "setting": "library", "palette": "night", "objects": ["lamp", "scroll", "book", "jar"] },
    { "title": "Busto de mármore do filósofo", "setting": "courtyard", "palette": "dia", "objects": ["statue", "column", "olive", "book"] },
    { "title": "Portão de pedra para o templo", "setting": "columns", "palette": "entardecer", "objects": ["gate", "column", "path", "statue"] },
    { "title": "Diálogo filosófico ao ar livre", "setting": "grove", "palette": "dia", "objects": ["sage", "olive", "scroll", "column"] },
    { "title": "Pátio circular com ânforas", "setting": "columns", "palette": "entardecer", "objects": ["column", "jar", "statue", "path"] },
    { "title": "Vigília filosófica noturna", "setting": "ruins", "palette": "night", "objects": ["sage", "lamp", "column", "scroll"] },
    { "title": "Passeio sereno entre oliveiras", "setting": "grove", "palette": "entardecer", "objects": ["olive", "path", "book", "sage"] }
  ],
  "Religião": [
    { "title": "Campanário ao amanhecer", "setting": "village", "palette": "dia", "objects": ["bell", "church", "dove", "cross"] },
    { "title": "Vitral gótico multicolorido", "setting": "chapelInterior", "palette": "dia", "objects": ["window", "light", "chair", "cross"] },
    { "title": "Altar com velas e escrituras", "setting": "chapelInterior", "palette": "entardecer", "objects": ["candle", "book", "cross", "flower"] },
    { "title": "Revoada de pombas brancas", "setting": "square", "palette": "dia", "objects": ["dove", "church", "cross", "bell"] },
    { "title": "Procissão com flores e velas", "setting": "village", "palette": "entardecer", "objects": ["candle", "flower", "church", "cross"] },
    { "title": "Interior sereno do santuário", "setting": "chapelInterior", "palette": "night", "objects": ["chair", "candle", "window", "book"] },
    { "title": "Capela costeira com cruz de pedra", "setting": "chapel", "palette": "entardecer", "objects": ["church", "cross", "dove", "light"] },
    { "title": "Grande sino de bronze", "setting": "village", "palette": "dia", "objects": ["bell", "cross", "dove", "light"] },
    { "title": "Jardim de oração com lírios", "setting": "garden", "palette": "dia", "objects": ["flower", "dove", "cross", "church"] },
    { "title": "Vigília de velas sob as estrelas", "setting": "chapel", "palette": "night", "objects": ["candle", "light", "church", "book"] }
  ],
  "Gastronomia": [
    { "title": "Fogão a lenha com caldeirão", "setting": "kitchen", "palette": "entardecer", "objects": ["pot", "vegetable", "pepper", "bottle"] },
    { "title": "Pães artesanais crocantes", "setting": "bakery", "palette": "dia", "objects": ["bread", "table", "knife", "fruit"] },
    { "title": "Mesa com frutas tropicais", "setting": "garden", "palette": "dia", "objects": ["fruit", "table", "bottle", "plate"] },
    { "title": "Caldo saboroso na panela", "setting": "kitchen", "palette": "dia", "objects": ["pot", "pepper", "vegetable", "plate"] },
    { "title": "Mesa posta para banquete", "setting": "dining", "palette": "entardecer", "objects": ["plate", "fork", "knife", "bread"] },
    { "title": "Banca de pimentas e temperos", "setting": "market", "palette": "dia", "objects": ["pepper", "bottle", "vegetable", "fruit"] },
    { "title": "Café da manhã com pão e frutas", "setting": "farmhouse", "palette": "dia", "objects": ["bread", "fruit", "plate", "table"] },
    { "title": "Cozinhando ao ar livre no quintal", "setting": "kitchen", "palette": "entardecer", "objects": ["pot", "table", "pepper", "vegetable"] },
    { "title": "Garrafas artesanais e pimentas", "setting": "kitchen", "palette": "dia", "objects": ["bottle", "pepper", "knife", "plate"] },
    { "title": "Jantar especial acolhedor", "setting": "dining", "palette": "night", "objects": ["table", "plate", "fork", "pot"] }
  ]
};

for (const [theme, scenes] of Object.entries(additionalScenes)) {
  if (data[theme]) {
    // Only add if not already added (ensure length is 19)
    if (data[theme].scenes.length === 9) {
      data[theme].scenes.push(...scenes);
    }
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
console.log("imageSceneVariants.json atualizado com sucesso!");
for (const [k, v] of Object.entries(data)) {
  console.log(`${k}: ${v.scenes.length} cenas variantes (+1 principal = ${v.scenes.length + 1})`);
}
