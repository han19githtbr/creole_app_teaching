// Motor de Vida e Comportamento dos Elementos da História (Story Life Engine).
//
// Transforma elementos estáticos da cena em seres e objetos animados que
// reagem dinamicamente à narração do áudio e às legendas em tempo real.
// Tanto o player interativo da web quanto o exportador de vídeo para MP4/WebM
// utilizam este mesmo motor para garantir sincronia e fidelidade perfeitas.

export type EntityType =
  | "dog"
  | "cat"
  | "bird"
  | "butterfly"
  | "horse"
  | "tree"
  | "flower"
  | "sun"
  | "cloud"
  | "water"
  | "boat"
  | "car"
  | "drone"
  | "robot"
  | "drum"
  | "music"
  | "lantern"
  | "fire"
  | "house"
  | "person"
  | "windmill"
  | "fish"
  | "airplane"
  | "generic";

export type EntityAction =
  | "flying"
  | "running"
  | "jumping"
  | "barking"
  | "singing"
  | "dancing"
  | "playing_music"
  | "shining"
  | "blowing"
  | "swimming"
  | "sleeping"
  | "eating"
  | "speaking"
  | "walking"
  | "celebrating"
  | "rowing"
  | "hunting"
  | "dining"
  | "watching_movie"
  | "traveling"
  | "interacting"
  | "idle";

export interface ActionMeta {
  id: EntityAction;
  label: string;
  emoji: string;
  description: string;
}

export const ACTION_METAS: Record<EntityAction, ActionMeta> = {
  flying: { id: "flying", label: "Voando", emoji: "🦅", description: "Bate asas e plana em arco pelo ar" },
  running: { id: "running", label: "Correndo", emoji: "🐾", description: "Passos rápidos com salto e agilidade" },
  jumping: { id: "jumping", label: "Pulando", emoji: "⚡", description: "Salto dinâmico com compressão e impulsão" },
  barking: { id: "barking", label: "Latindo", emoji: "🐶", description: "Ondas sonoras expansivas e movimento enérgico" },
  singing: { id: "singing", label: "Cantando", emoji: "🎶", description: "Notas musicais flutuando no ar" },
  dancing: { id: "dancing", label: "Dançando", emoji: "💃", description: "Ginga rítmica e balanço alegre" },
  playing_music: { id: "playing_music", label: "Tocando", emoji: "🥁", description: "Vibração rítmica com ondas de impacto" },
  shining: { id: "shining", label: "Brilhando", emoji: "✨", description: "Pulsação radiante e partículas de brilho" },
  blowing: { id: "blowing", label: "Balançando", emoji: "🍃", description: "Movimento ao vento com folhas flutuantes" },
  swimming: { id: "swimming", label: "Navegando", emoji: "🌊", description: "Balanço suave sobre as ondas e respingos" },
  sleeping: { id: "sleeping", label: "Descansando", emoji: "💤", description: "Respiração lenta e pacífica com Zzz" },
  eating: { id: "eating", label: "Comendo", emoji: "🌾", description: "Movimento rítmico de aproximação e mastigação" },
  speaking: { id: "speaking", label: "Falando", emoji: "💬", description: "Gesto expressivo e pulso de voz" },
  walking: { id: "walking", label: "Caminhando", emoji: "🚶", description: "Passo cadenciado e suave inclinação" },
  celebrating: { id: "celebrating", label: "Celebrando", emoji: "🎉", description: "Saltos de alegria e confetes de luz" },
  rowing: { id: "rowing", label: "Remando", emoji: "🚣", description: "Remando compassado sobre as águas em harmonia" },
  hunting: { id: "hunting", label: "Caçando", emoji: "🦈", description: "Perseguição ágil e dinamicamente focada" },
  dining: { id: "dining", label: "Jantando", emoji: "🍲", description: "Confraternização à mesa compartilhando a refeição" },
  watching_movie: { id: "watching_movie", label: "No Cinema", emoji: "🍿", description: "Fascinados diante da tela grande do cinema" },
  traveling: { id: "traveling", label: "Viajando", emoji: "✈️", description: "Cruzando o horizonte explorando pontos turísticos" },
  interacting: { id: "interacting", label: "Interagindo", emoji: "🤝", description: "Humano e robô colaborando e conversando em sintonia" },
  idle: { id: "idle", label: "Atento", emoji: "🌿", description: "Comportamento natural e vivo no ambiente" },
};

/** Identifica o tipo semântico da entidade a partir do nome em português, Kreyòl ou francês. */
export function identifyEntityType(name: string): EntityType {
  const norm = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (/(tubarao|peixe|peixes|baleia|golfinho|pwason|rekren|requin|poisson|dauphin)/.test(norm)) return "fish";
  if (/(aviao|aeroplano|aeroporto|avion|aeroport)/.test(norm)) return "airplane";
  if (/(cachorr|cao|cadela|puppy|filhote|chen|chyen|chien|chiot)/.test(norm)) return "dog";
  if (/(gato|gata|gatinho|chat|chaton)/.test(norm)) return "cat";
  if (/(passar|ave|gaivota|gaviao|sabia|pombo|zwazo|pijon|oiseau|colombe|pigeon|pipa|kap\b|cerf-volant|sevolan)/.test(norm)) return "bird";
  if (/(borbolet|mariposa|papiyon|papillon)/.test(norm)) return "butterfly";
  if (/(caval|egua|potro|chwal|jiman|cheval|jument)/.test(norm)) return "horse";
  if (/(arvore|bosque|floresta|galho|oliveira|pyebwa|pye bwa|pye oliv|arbre|foret|olivier)/.test(norm)) return "tree";
  if (/(flor|flores|rosa|margarida|jardim|plantacao|fle\b|jaden|fleur|plantation)/.test(norm)) return "flower";
  if (/(sol\b|solzao|amanhecer|entardecer|estrela|estrelas|soley|zetwal|soleil|etoile)/.test(norm)) return "sun";
  if (/(nuvem|ceu\b|nevoa|nyaj|nuage|ciel)/.test(norm)) return "cloud";
  if (/(rio|mar|lago|agua|onda|cachoeira|dlo|lanme|rivye|kaskad|mer|riviere|lac|eau|cascade)/.test(norm)) return "water";
  if (/(barco|canoa|navio|veleiro|bote|balao|bato|balon|chaloup|bateau|navire|montgolfiere)/.test(norm)) return "boat";
  if (/(carro|caminhao|automovel|veiculo|bicicleta|machin|oto|bisiklet|voiture|velo|bicyclette)/.test(norm)) return "car";
  if (/(drone|dron|bussola|bousol|boussole)/.test(norm)) return "drone";
  if (/(robo|androide|robot|computador|odinate|ordinateur)/.test(norm)) return "robot";
  if (/(tambor|atabaque|bateria|percussao|canhao|tanbou|kanon|tambour|canon)/.test(norm)) return "drum";
  if (/(musica|violao|guitarra|melodia|som|alto-falante|mizik|gita|opale|guitare|haut-parleur|notes)/.test(norm)) return "music";
  if (/(lanterna|lampada|vela|farol|lanp|bouji|fa\b|lanterne|lampe|bougie|phare)/.test(norm)) return "lantern";
  if (/(fogo|fogueira|chama|labareda|tocha|caldeirao|panela|dife|flanbo|chodye|feu|flamme|torche|chaudron|casserole)/.test(norm)) return "fire";
  if (/(casa|cabana|castelo|edificio|choupana|fortaleza|igreja|capela|colunas|cerca|kay|chato|fo\b|legliz|kolon|kloti|maison|chateau|forteresse|eglise|chapelle|colonne|cloture)/.test(norm)) return "house";
  if (/(homem|mulher|crianca|menino|menina|pessoa|filosofo|sabio|dancarino|moun|timoun|gason|fi\b|moun saj|danse|homme|femme|enfant|sage|philosophe|danseur|danseuse)/.test(norm)) return "person";
  if (/(moinho|catavento|bandeira|moulen|drapo|moulin|drapeau)/.test(norm)) return "windmill";

  return "generic";
}

/** Detecta a ação do elemento com base no texto da legenda/áudio e tipo da entidade (PT, Kreyòl e FR). */
export function detectActionFromCaption(
  entity: EntityType,
  captionText: string
): EntityAction {
  const norm = captionText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Verbos de voo
  if (/(voa|voar|voando|sobrevoa|bate asas|plana|levantou voo|vole|ap vole|anle|voler|volant|plane|planer|s'envole|senvole)/.test(norm)) {
    if (entity === "bird" || entity === "butterfly" || entity === "drone" || entity === "boat") return "flying";
  }

  // Verbos de corrida e rapidez
  if (/(corre|correr|correndo|dispara|apressado|veloz|kouri|ap kouri|galope|court|courir|courant|galoper|fonce|foncer)/.test(norm)) {
    if (entity === "dog" || entity === "horse" || entity === "cat" || entity === "person") return "running";
    if (entity === "car") return "running";
  }

  // Verbos de pulo / salto
  if (/(pula|pular|pulando|salta|saltando|empina|sote|ap sote|rebondi|saute|sauter|bondit|bondir)/.test(norm)) {
    return "jumping";
  }

  // Latidos e sons animais
  if (/(late|latir|latindo|uiva|rosna|jape|ap jape|rele|oyo|aboie|aboyer|aboiement|jappe|japper|rugit)/.test(norm)) {
    if (entity === "dog") return "barking";
  }

  // Canto e gorjeio
  if (/(canta|cantando|gorjeia|assobia|chante|ap chante|melodi|chanter|chantant|gazouille|gazouiller|siffle|siffler)/.test(norm)) {
    return "singing";
  }

  // Dança e festa
  if (/(dança|danca|dancar|dancando|festa|alegria|ginga|danse|ap danse|fet\b|danser|dansant|tournoie|tournoyer|fete)/.test(norm)) {
    return "dancing";
  }

  // Tocar música e percussão
  if (/(toca|tocando|batucada|ritmo|tamborilando|jwe mizik|tanbouye|barye|joue|jouer|rythme|percussion|gratte|gratter)/.test(norm)) {
    return "playing_music";
  }

  // Brilho e luz
  if (/(brilha|brilhar|brilhando|reluz|ilumina|radiante|claro|ekla|klere|ap klere|limye|brille|briller|brillant|illumine|illuminer|rayon|rayonne|etincelle|lumiere)/.test(norm)) {
    return "shining";
  }

  // Vento e balanço
  if (/(vento|ventando|sopra|soprando|balanca|balancando|farfalha|van\b|soufle|ap soufle|balanse|vent|souffle|souffler|balance|balancer|oscille|osciller|ondove|frissonne)/.test(norm)) {
    return "blowing";
  }

  // Nado e navegação
  if (/(nada|nadar|nadando|navega|flutua|mergulha|onda|naje|ap naje|flote|nage|nager|navigue|naviguer|flotte|flotter|vogue|voguer|mer\b|vague)/.test(norm)) {
    return "swimming";
  }

  // Sono e descanso
  if (/(dorme|dormir|dormindo|descansa|repousa|sono|deita|domi|ap domi|repoze|dort|dormant|repose|reposer|calme|paisible|endormi)/.test(norm)) {
    return "sleeping";
  }

  // Alimentação
  if (/(come|comer|comendo|bica|mastiga|alimenta|manje|ap manje|mange|manger|mangent|deguste|croque|savoure|croquer|bouillonne|mijote)/.test(norm)) {
    return "eating";
  }

  // Fala e contação
  if (/(fala|falando|conversa|conta|diz|exclama|pale|ap pale|rakonte|parle|parler|raconte|raconter|dit|explique)/.test(norm)) {
    return "speaking";
  }

  // Caminhada
  if (/(anda|andando|caminha|caminhando|passeia|mache|ap mache|marche|marcher|promene|promener|balade|avance)/.test(norm)) {
    return "walking";
  }

  // Celebração
  if (/(comemora|celebra|viva|festeja|selebre|celebre|celebrer|fete|feter|hourra|bravo|felicite)/.test(norm)) {
    return "celebrating";
  }

  // Remando no mar / lago
  if (/(rema|remando|remo\b|remar|rame|ramer|rameurs|chaloupe|pagayer|canotier)/.test(norm)) {
    return "rowing";
  }

  // Caçando / perseguição aquática ou animal
  if (/(caca|cacando|persegu|tubarao|predador|chasse|chasser|chassant|requin|proie|traque)/.test(norm)) {
    return "hunting";
  }

  // Jantar / refeição em família
  if (/(jantar|jantando|almoco|refeicao|familia|ceia|diner|mangeant ensemble|repas|souper|famille)/.test(norm)) {
    return "dining";
  }

  // Cinema / assistindo filme
  if (/(cinema|filme|pipoca|tela grande|assistindo|sinema|regarde le film|spectateurs|pop-corn)/.test(norm)) {
    return "watching_movie";
  }

  // Viagem / turismo / voo
  if (/(viaja|viajando|turismo|passeio|aeroporto|aviao|embarque|voyage|voyager|tourisme|aeroport|valise)/.test(norm)) {
    return "traveling";
  }

  // Interação colaborativa entre humano e robô
  if (/(interag|humano e robo|colabora|aprende junto|parceria|interagit|interaction|collaborer|partenaire)/.test(norm)) {
    return "interacting";
  }

  // Comportamentos padrão por tipo de entidade na ausência de verbo específico
  if (entity === "bird" || entity === "butterfly") return "flying";
  if (entity === "airplane") return "traveling";
  if (entity === "sun" || entity === "lantern" || entity === "fire") return "shining";
  if (entity === "drum" || entity === "music") return "playing_music";
  if (entity === "tree" || entity === "flower" || entity === "windmill") return "blowing";
  if (entity === "boat") return "rowing";
  if (entity === "fish") return "hunting";
  if (entity === "water") return "swimming";
  if (entity === "dog") return "running";

  return "idle";
}

export interface Particle {
  x: number; // offset em px
  y: number; // offset em px
  char: string;
  opacity: number;
  scale: number;
  rotation: number;
}

export interface LivingElementState {
  entity: EntityType;
  action: EntityAction;
  actionMeta: ActionMeta;
  /** Deslocamentos relativos em porcentagem do quadro (ex: -3.5% até +3.5%) */
  dx: number;
  dy: number;
  scaleX: number;
  scaleY: number;
  rotation: number; // em graus
  pulse: number; // 0 a 1
  badgeEmoji: string;
  badgeText: string;
  particles: Particle[];
}

/**
 * Calcula o estado vivo do elemento para um instante de tempo exato da narração.
 * Totalmente determinístico baseado em `time` (relógio do áudio).
 */
export function calculateLivingElementState(
  elementPt: string,
  elementKreyol: string,
  time: number,
  captionText: string,
  isActiveInTimeline: boolean,
  elementExtra?: string
): LivingElementState {
  const entity = identifyEntityType(`${elementPt} ${elementKreyol} ${elementExtra || ""}`);
  const action = detectActionFromCaption(entity, captionText);
  const actionMeta = ACTION_METAS[action];

  // Fatores de tempo
  const t = time;
  // Elementos ativos têm energia total; elementos no ambiente têm vida suave e orgânica
  const intensity = isActiveInTimeline ? 1.0 : 0.42;

  let dx = 0;
  let dy = 0;
  let scaleX = 1;
  let scaleY = 1;
  let rotation = 0;
  let pulse = 0;
  const particles: Particle[] = [];

  switch (action) {
    case "flying": {
      // Voo suave com física aerodinâmica: batimento assimétrico (descida potente + subida suave) e sustentação térmica
      const flapCycle = (t * 2.6) % 1;
      const flap = flapCycle < 0.38
        ? Math.sin((flapCycle / 0.38) * Math.PI)
        : -Math.sin(((flapCycle - 0.38) / 0.62) * Math.PI) * 0.4;
      const thermal = Math.sin(t * 1.1) * 2.4 + Math.sin(t * 2.3) * 0.8;
      dx = Math.cos(t * 1.3) * 3.6 * intensity;
      dy = (thermal - flap * 1.5) * intensity;
      // Inclinação proporcional à curva de deslocamento
      rotation = -Math.sin(t * 1.3) * 7.5 + flap * 3.5;
      scaleY = 1 + flap * 0.11;
      scaleX = 1 - flap * 0.05;
      pulse = (flap + 1) / 2;

      if (isActiveInTimeline) {
        const pPhase = (t * 1.6) % 1;
        particles.push({
          x: -16 - pPhase * 14,
          y: 6 + Math.sin(t * 3.2) * 5,
          char: "🪶",
          opacity: 0.85 * Math.sin(pPhase * Math.PI),
          scale: 0.75 + pPhase * 0.15,
          rotation: Math.sin(t * 2) * 25,
        });
      }
      break;
    }

    case "running": {
      // Galope / corrida orgânica: ciclo contínuo sem solavancos mecânicos
      const gait = t * 7.2;
      const verticalBounce = (Math.sin(gait * 2) * 0.7 + Math.sin(gait * 4) * 0.18) * -2.6 * intensity;
      dx = Math.sin(gait) * 2.8 * intensity;
      dy = verticalBounce;
      rotation = Math.sin(gait) * 4.5;
      const footImpact = Math.cos(gait * 2);
      scaleY = 1 - footImpact * 0.06 * intensity;
      scaleX = 1 + footImpact * 0.05 * intensity;
      pulse = (verticalBounce / -2.6 + 1) / 2;

      if (isActiveInTimeline) {
        const pPhase = (t * 2.2) % 1;
        particles.push({
          x: -18 - pPhase * 16,
          y: 12 + Math.sin(t * 4) * 3,
          char: "💨",
          opacity: 0.8 * Math.sin(pPhase * Math.PI),
          scale: 0.7 + pPhase * 0.2,
          rotation: 0,
        });
      }
      break;
    }

    case "walking": {
      // Caminhada compassada e natural: transferência suave de peso entre passadas
      const cadence = t * 4.2;
      const bob = Math.sin(cadence * 2) * -1.2 * intensity;
      dx = Math.sin(cadence) * 1.6 * intensity;
      dy = bob;
      rotation = Math.sin(cadence) * 2.5;
      scaleY = 1 - Math.cos(cadence * 2) * 0.03 * intensity;
      scaleX = 1 + Math.cos(cadence * 2) * 0.02 * intensity;
      pulse = (bob / -1.2 + 1) / 2;
      break;
    }

    case "jumping": {
      // Salto realista com 3 fases físicas: compressão prévia, arco parabólico gravitacional e amortecimento
      const cycle = (t * 1.7) % 1;
      if (cycle < 0.22) {
        // Fase 1: Agachamento preparatório
        const p = cycle / 0.22;
        dy = Math.sin(p * Math.PI) * 1.4 * intensity;
        scaleY = 1 - Math.sin(p * Math.PI) * 0.16;
        scaleX = 1 + Math.sin(p * Math.PI) * 0.12;
      } else if (cycle < 0.82) {
        // Fase 2: Voo parabólico com gravidade
        const p = (cycle - 0.22) / 0.6;
        const parabola = 4 * p * (1 - p);
        dy = parabola * -5.8 * intensity;
        dx = Math.sin(p * Math.PI) * 1.8 * intensity;
        scaleY = p < 0.4 ? 1.15 : 0.98;
        scaleX = 1 / Math.max(0.75, scaleY);
        rotation = (p - 0.5) * 8;
        pulse = parabola;
      } else {
        // Fase 3: Amortecimento suave no solo
        const p = (cycle - 0.82) / 0.18;
        const cushion = Math.sin(p * Math.PI);
        dy = cushion * 0.6 * intensity;
        scaleY = 1 - cushion * 0.08;
        scaleX = 1 + cushion * 0.06;
      }

      if (isActiveInTimeline && cycle > 0.22 && cycle < 0.82) {
        particles.push({
          x: 0,
          y: 16,
          char: "✨",
          opacity: 0.85,
          scale: 0.85,
          rotation: t * 50,
        });
      }
      break;
    }

    case "barking": {
      // Reação expressiva: respiração rápida, elevação corporal e onda sonora suave
      const barkRhythm = Math.sin(t * 8.5);
      const isBark = barkRhythm > 0.4;
      dx = Math.sin(t * 2.4) * 1.2;
      dy = isBark ? -1.8 * intensity : 0;
      scaleX = isBark ? 1.1 : 1.0;
      scaleY = isBark ? 1.08 : 1.0;
      rotation = Math.sin(t * 4.2) * 4;
      pulse = isBark ? 1 : 0.2;

      if (isActiveInTimeline && isBark) {
        particles.push({
          x: 20 + Math.sin(t * 6) * 6,
          y: -10 + Math.cos(t * 6) * 4,
          char: "💬",
          opacity: 0.85,
          scale: 0.8,
          rotation: 0,
        });
      }
      break;
    }

    case "singing":
    case "playing_music": {
      // Pulso rítmico musical harmônico (percussão com decay exponencial suave)
      const beatCycle = (t * 2.8) % 1;
      const strike = Math.exp(-beatCycle * 5) * Math.sin(beatCycle * 22);
      const sway = Math.sin(t * 1.4) * 1.6;
      dx = sway * intensity;
      dy = strike * -2.0 * intensity;
      scaleX = 1 + strike * 0.12 * intensity;
      scaleY = 1 - strike * 0.07 * intensity;
      rotation = Math.sin(t * 1.4) * 4;
      pulse = Math.max(0, 1 - beatCycle * 1.6);

      // Notas musicais flutuando em arcos harmoniosos
      const note1 = (t * 14) % 32;
      const note2 = ((t + 0.5) * 14) % 32;
      particles.push(
        {
          x: 16 + Math.sin(t * 3) * 7,
          y: -12 - note1,
          char: "♪",
          opacity: Math.sin((note1 / 32) * Math.PI) * 0.9,
          scale: 0.85,
          rotation: Math.sin(t * 2.2) * 16,
        },
        {
          x: -14 + Math.cos(t * 2.6) * 7,
          y: -10 - note2,
          char: "♫",
          opacity: Math.sin((note2 / 32) * Math.PI) * 0.85,
          scale: 0.8,
          rotation: -Math.sin(t * 2.2) * 16,
        }
      );
      break;
    }

    case "shining": {
      // Respiração radiante multi-harmônica: pulsação quente de coroa solar e brilho natural
      const h1 = Math.sin(t * 1.6) * 0.5;
      const h2 = Math.sin(t * 3.4 + 0.8) * 0.3;
      const h3 = Math.sin(t * 6.8 + 1.5) * 0.2;
      const corona = (h1 + h2 + h3 + 1) / 2;
      scaleX = 1 + corona * 0.11 * intensity;
      scaleY = 1 + corona * 0.11 * intensity;
      rotation = Math.sin(t * 0.7) * 3.5;
      dx = Math.sin(t * 0.9) * 0.7 * intensity;
      dy = Math.cos(t * 1.1) * 0.7 * intensity;
      pulse = corona;

      particles.push(
        {
          x: 16 + Math.sin(t * 3.8) * 9,
          y: -14 + Math.cos(t * 3.8) * 9,
          char: "✨",
          opacity: corona * 0.9,
          scale: 0.8 + corona * 0.25,
          rotation: t * 40,
        },
        {
          x: -16 + Math.cos(t * 3.1) * 9,
          y: 12 + Math.sin(t * 3.1) * 9,
          char: "⭐",
          opacity: (1 - corona) * 0.8,
          scale: 0.75,
          rotation: -t * 25,
        }
      );
      break;
    }

    case "blowing": {
      // Balanço realista de vento com rajadas e micro-ondulações na copa/pétalas
      const gust = Math.sin(t * 1.3) * 0.65 + Math.sin(t * 2.8) * 0.25 + Math.sin(t * 5.6) * 0.1;
      rotation = gust * 6.5 * intensity;
      dx = gust * 2.2 * intensity;
      dy = Math.abs(gust) * 0.5 * intensity;
      scaleX = 1 + Math.abs(gust) * 0.03;
      scaleY = 1 - Math.abs(gust) * 0.02;
      pulse = Math.abs(gust);

      if (isActiveInTimeline) {
        const leafP = (t * 1.4) % 1;
        particles.push({
          x: 14 + leafP * 24,
          y: -4 + Math.sin(t * 2.8) * 10,
          char: "🍃",
          opacity: 0.85 * Math.sin(leafP * Math.PI),
          scale: 0.75 + leafP * 0.15,
          rotation: t * 45,
        });
      }
      break;
    }

    case "swimming": {
      // Cinemática aquática orbital (Trochoidal): movimento circular de onda suave e inclinação natural
      const wave = t * 1.9;
      dx = Math.cos(wave) * 2.5 * intensity;
      dy = Math.sin(wave) * 2.1 * intensity;
      rotation = Math.cos(wave) * 4.2;
      scaleX = 1 + Math.sin(t * 3.8) * 0.035;
      scaleY = 1 - Math.sin(t * 3.8) * 0.025;
      pulse = (Math.sin(wave) + 1) / 2;

      const bubbleP = (t * 1.8) % 1;
      particles.push({
        x: Math.sin(t * 2.6) * 12,
        y: 14 - bubbleP * 18,
        char: "🫧",
        opacity: 0.85 * Math.sin(bubbleP * Math.PI),
        scale: 0.7 + bubbleP * 0.2,
        rotation: 0,
      });
      break;
    }

    case "sleeping": {
      // Respiração relaxante 4-segundos: inalação suave, retenção calma, exalação longa
      const breathCycle = (t * 0.45) % 1;
      const breath = breathCycle < 0.42
        ? Math.sin((breathCycle / 0.42) * (Math.PI / 2))
        : breathCycle < 0.55
        ? 1.0
        : Math.cos(((breathCycle - 0.55) / 0.45) * (Math.PI / 2));
      scaleY = 0.94 + breath * 0.09;
      scaleX = 1.03 - breath * 0.04;
      dy = -breath * 0.7 * intensity;
      rotation = Math.sin(t * 0.8) * 1.2;
      pulse = breath;

      const zCycle = (t * 10) % 28;
      particles.push({
        x: 12 + (zCycle / 28) * 10,
        y: -10 - zCycle,
        char: "💤",
        opacity: Math.sin((zCycle / 28) * Math.PI) * 0.9,
        scale: 0.75 + (zCycle / 28) * 0.35,
        rotation: 0,
      });
      break;
    }

    case "dancing":
    case "celebrating": {
      // Dança fluida e rítmica com gingado latino/caribenho e balanço alegre
      const tempo = t * 6.5;
      const beat = Math.sin(tempo);
      dx = beat * 2.4 * intensity;
      dy = (Math.sin(tempo * 2) * 0.5 - 0.5) * 2.2 * intensity;
      rotation = beat * 9.5;
      scaleX = 1 + Math.abs(beat) * 0.06;
      scaleY = 1 - Math.abs(beat) * 0.04;
      pulse = (beat + 1) / 2;

      const confP = (t * 2.0) % 1;
      particles.push({
        x: Math.sin(t * 4) * 16,
        y: -14 + Math.cos(t * 4) * 5,
        char: "🎉",
        opacity: 0.85 * Math.sin(confP * Math.PI),
        scale: 0.8,
        rotation: t * 45,
      });
      break;
    }

    case "rowing": {
      // Remada orgânica: mergulho do remo (potência), impulso frontal e recuperação suave
      const strokeP = (t * 1.5) % 1;
      const stroke = strokeP < 0.45 ? Math.sin((strokeP / 0.45) * Math.PI) : -Math.sin(((strokeP - 0.45) / 0.55) * Math.PI) * 0.35;
      dx = stroke * 2.6 * intensity;
      dy = Math.sin(t * 3.0) * 1.4 * intensity;
      rotation = stroke * 4.5;
      scaleX = 1 + Math.abs(stroke) * 0.04;
      pulse = (stroke + 1) / 2;

      if (isActiveInTimeline && strokeP < 0.45) {
        particles.push({
          x: stroke > 0 ? 15 : -15,
          y: 10,
          char: "🌊",
          opacity: 0.85 * Math.sin((strokeP / 0.45) * Math.PI),
          scale: 0.75,
          rotation: stroke * 8,
        });
      }
      break;
    }

    case "hunting": {
      // Perseguição ágil com impulsos focados e recuperação rápida
      const huntPulse = Math.sin(t * 4.8);
      dx = (Math.cos(t * 2.4) * 3.0 + huntPulse * 1.2) * intensity;
      dy = Math.sin(t * 3.6) * 1.8 * intensity;
      rotation = huntPulse * 6.5;
      scaleX = 1.06;
      scaleY = 0.95;
      pulse = Math.abs(huntPulse);

      if (isActiveInTimeline) {
        particles.push({
          x: -16,
          y: Math.sin(t * 5) * 6,
          char: "⚡",
          opacity: 0.85,
          scale: 0.8,
          rotation: t * 35,
        });
      }
      break;
    }

    case "dining": {
      // Calor da refeição em família com gestos acolhedores e vapor suave subindo
      const dine = Math.sin(t * 2.0);
      dx = Math.cos(t * 1.5) * 1.0 * intensity;
      dy = (Math.sin(t * 2.0) * 0.5 - 0.5) * 1.2 * intensity;
      scaleY = 1 + dine * 0.03;
      scaleX = 1 - dine * 0.02;
      rotation = Math.sin(t * 1.7) * 2.5;
      pulse = (dine + 1) / 2;

      const steamP = (t * 12) % 22;
      particles.push({
        x: Math.sin(t * 2.2) * 10,
        y: -12 - steamP,
        char: "🍲",
        opacity: Math.sin((steamP / 22) * Math.PI) * 0.85,
        scale: 0.75 + (steamP / 22) * 0.2,
        rotation: 0,
      });
      break;
    }

    case "watching_movie": {
      // Encantamento diante da tela grande: atenção viva e respiração sutil
      const gaze = Math.sin(t * 1.6);
      dx = Math.sin(t * 1.2) * 1.1 * intensity;
      dy = gaze * 0.9 * intensity;
      scaleX = 1 + gaze * 0.025;
      scaleY = 1 - gaze * 0.02;
      rotation = Math.sin(t * 0.9) * 1.8;
      pulse = (gaze + 1) / 2;

      const popP = (t * 1.8) % 1;
      particles.push({
        x: 12 + Math.sin(t * 2.6) * 5,
        y: -10 + Math.cos(t * 2.6) * 5,
        char: "🍿",
        opacity: 0.85 * Math.sin(popP * Math.PI),
        scale: 0.75,
        rotation: t * 15,
      });
      break;
    }

    case "traveling": {
      // Cruzeiro aéreo suave com leve inclinação e flutuação nas correntes de ar
      const cruise = Math.sin(t * 1.8);
      dx = Math.cos(t * 1.3) * 3.2 * intensity;
      dy = cruise * 1.6 * intensity;
      rotation = cruise * 3.5;
      scaleX = 1.04;
      scaleY = 0.97;
      pulse = (cruise + 1) / 2;

      const trailP = (t * 2.0) % 1;
      particles.push({
        x: -18 - trailP * 12,
        y: cruise * 3,
        char: "✈️",
        opacity: 0.8 * Math.sin(trailP * Math.PI),
        scale: 0.8,
        rotation: cruise * 4,
      });
      break;
    }

    case "interacting": {
      // Colaboração humano e robô com amortecimento crítico: movimentos inteligentes e fluidos
      const step = (t * 1.6) % 2;
      const prog = step < 1 ? step : 2 - step;
      const smoothAct = prog * prog * (3 - 2 * prog);
      dx = (smoothAct * 2.2 - 1.1) * intensity;
      dy = Math.sin(smoothAct * Math.PI) * -1.5 * intensity;
      rotation = (smoothAct - 0.5) * 4.5;
      scaleX = 1 + Math.sin(smoothAct * Math.PI) * 0.04;
      scaleY = 1 - Math.sin(smoothAct * Math.PI) * 0.03;
      pulse = smoothAct;

      const handP = (t * 1.6) % 1;
      particles.push({
        x: Math.sin(t * 3.2) * 14,
        y: -14 + Math.cos(t * 3.2) * 5,
        char: "🤝",
        opacity: 0.85 * Math.sin(handP * Math.PI),
        scale: 0.8,
        rotation: 0,
      });
      break;
    }

    default: {
      // Comportamento ocioso vivo (idle): respiração calma, presença orgânica e micro-flutuação
      const breath = Math.sin(t * 1.8);
      scaleY = 1 + breath * 0.024;
      scaleX = 1 - breath * 0.016;
      dy = breath * 0.5 * intensity;
      rotation = Math.sin(t * 1.1) * 1.4;
      pulse = (breath + 1) / 2;
      break;
    }
  }

  return {
    entity,
    action,
    actionMeta,
    dx,
    dy,
    scaleX,
    scaleY,
    rotation,
    pulse,
    badgeEmoji: actionMeta.emoji,
    badgeText: actionMeta.label,
    particles,
  };
}

/** Renderiza os elementos vivos sobre o canvas 2D de exportação (1080x1920) */
export function measureLivingPill(
  context: CanvasRenderingContext2D,
  kreyol: string,
  portuguese: string,
  fontSize = 21
): { width: number; height: number } {
  context.save();
  context.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
  const width =
    fontSize * 1.52 +
    context.measureText(kreyol).width +
    context.measureText("  ·  ").width +
    context.measureText(portuguese).width +
    fontSize * 1.62;
  context.restore();
  return { width, height: Math.round(fontSize * 2.2) };
}

export function drawLivingElementOnCanvas(
  context: CanvasRenderingContext2D,
  params: {
    centerX: number;
    centerY: number;
    kreyol: string;
    portuguese: string;
    state: LivingElementState;
    visualOpacity: number;
    visualScale: number;
    isActive: boolean;
    fontSize?: number;
    /** Ícone do próprio elemento (ex.: 🥁 para "tambor"). Sem ele, cai no emoji da ação. */
    icon?: string;
  }
) {
  const { centerX, centerY, kreyol, portuguese, state, visualOpacity, visualScale, isActive, fontSize = 21, icon } = params;
  if (visualOpacity <= 0.01) return;

  context.save();
  context.globalAlpha = visualOpacity;

  // Posição estável de ancoragem para identificação do elemento
  const posX = centerX;
  const posY = centerY;

  context.translate(posX, posY);
  context.scale(visualScale * (isActive ? 1.05 : 1), visualScale * (isActive ? 1.05 : 1));

  // 1. Aura luminosa viva em volta do identificador se o elemento estiver ativo
  if (isActive) {
    const auraRadius = fontSize * 1.8 + state.pulse * fontSize * 0.48;
    const gradient = context.createRadialGradient(0, 0, fontSize * 0.7, 0, 0, auraRadius);
    gradient.addColorStop(0, "rgba(244, 200, 91, 0.45)");
    gradient.addColorStop(0.6, "rgba(244, 200, 91, 0.15)");
    gradient.addColorStop(1, "rgba(244, 200, 91, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, auraRadius, 0, Math.PI * 2);
    context.fill();
  }

  // 2. Pílula identificadora estável
  context.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
  const emojiWidth = fontSize * 1.52;
  const kreyolWidth = context.measureText(kreyol).width;
  const separatorWidth = context.measureText("  ·  ").width;
  const ptWidth = context.measureText(portuguese).width;

  const totalWidth = emojiWidth + kreyolWidth + separatorWidth + ptWidth + fontSize * 1.62;
  const totalHeight = Math.round(fontSize * 2.2);
  const pillX = -totalWidth / 2;
  const pillY = -totalHeight / 2;

  // Fundo da pílula
  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.45)";
  context.shadowBlur = fontSize * 0.7;
  context.shadowOffsetY = fontSize * 0.2;
  context.fillStyle = isActive ? "#f5cf72" : "rgba(18, 32, 26, 0.92)";
  context.beginPath();
  context.roundRect(pillX, pillY, totalWidth, totalHeight, totalHeight / 2.8);
  context.fill();
  context.restore();

  context.strokeStyle = isActive ? "#f8deb3" : "rgba(255, 255, 255, 0.38)";
  context.lineWidth = isActive ? 2.5 : 1.5;
  context.stroke();

  // Emoji da entidade
  context.font = `${Math.round(fontSize * 0.95)}px "Apple Color Emoji", "Segoe UI Emoji", system-ui, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(icon ?? state.badgeEmoji, pillX + fontSize * 1.05, 1);

  // Texto Kreyòl · Português (identificador limpo)
  context.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
  context.textAlign = "left";
  context.textBaseline = "middle";

  let curX = pillX + emojiWidth + fontSize * 0.66;
  context.fillStyle = isActive ? "#18241d" : "#f5cf72";
  context.fillText(kreyol, curX, 1);
  curX += kreyolWidth;

  context.fillStyle = isActive ? "rgba(24, 36, 29, 0.65)" : "rgba(255, 255, 255, 0.55)";
  context.fillText("  ·  ", curX, 1);
  curX += separatorWidth;

  context.fillStyle = isActive ? "#18241d" : "#ffffff";
  context.fillText(portuguese, curX, 1);

  context.restore();
}
