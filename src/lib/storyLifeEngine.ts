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
  idle: { id: "idle", label: "Atento", emoji: "🌿", description: "Comportamento natural e vivo no ambiente" },
};

/** Identifica o tipo semântico da entidade a partir do nome em português, Kreyòl ou francês. */
export function identifyEntityType(name: string): EntityType {
  const norm = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

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

  // Comportamentos padrão por tipo de entidade na ausência de verbo específico
  if (entity === "bird" || entity === "butterfly") return "flying";
  if (entity === "sun" || entity === "lantern" || entity === "fire") return "shining";
  if (entity === "drum" || entity === "music") return "playing_music";
  if (entity === "tree" || entity === "flower" || entity === "windmill") return "blowing";
  if (entity === "water" || entity === "boat") return "swimming";
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
  const intensity = isActiveInTimeline ? 1.0 : 0.65;

  let dx = 0;
  let dy = 0;
  let scaleX = 1;
  let scaleY = 1;
  let rotation = 0;
  let pulse = 0;
  const particles: Particle[] = [];

  switch (action) {
    case "flying": {
      // Voo em arco suave com batimento de asas
      const flap = Math.sin(t * 9);
      dx = Math.sin(t * 1.8) * 4.5 * intensity;
      dy = Math.cos(t * 2.2) * 3.2 * intensity - Math.abs(flap) * 0.8;
      rotation = Math.sin(t * 1.8) * 12;
      scaleY = 1 + flap * 0.12;
      scaleX = 1 - flap * 0.05;
      pulse = (Math.sin(t * 4) + 1) / 2;

      // Trilhas de vento ou plumas
      if (isActiveInTimeline) {
        particles.push({
          x: -18 + Math.sin(t * 3) * 6,
          y: 8 + Math.cos(t * 4) * 4,
          char: "🪶",
          opacity: 0.7 * (Math.sin(t * 5) * 0.5 + 0.5),
          scale: 0.8,
          rotation: Math.sin(t * 2) * 30,
        });
      }
      break;
    }

    case "running": {
      // Galope / corrida com salto e passadas enérgicas
      const stride = Math.sin(t * 11);
      const bounce = Math.abs(Math.sin(t * 11)) * -3.2 * intensity;
      dx = Math.sin(t * 1.4) * 3.5 * intensity;
      dy = bounce;
      rotation = stride * 7;
      scaleY = 1 + bounce * 0.04;
      scaleX = 1 - bounce * 0.03;
      pulse = (stride + 1) / 2;

      if (isActiveInTimeline) {
        particles.push({
          x: -16 + (t % 1) * -12,
          y: 14 + (t % 0.5) * 4,
          char: "💨",
          opacity: 0.8 * (1 - (t % 0.6)),
          scale: 0.75,
          rotation: 0,
        });
      }
      break;
    }

    case "jumping": {
      // Pulo alto com compressão no solo e estiramento no ar
      const cycle = (t * 2.2) % 1;
      const jumpY = Math.sin(cycle * Math.PI) * -6.5 * intensity;
      dx = Math.sin(t * 2.5) * 2;
      dy = jumpY;
      scaleY = cycle < 0.2 ? 0.85 : cycle > 0.8 ? 0.9 : 1.2;
      scaleX = cycle < 0.2 ? 1.18 : 0.92;
      rotation = Math.sin(t * 3) * 8;
      pulse = jumpY / -6.5;

      if (isActiveInTimeline) {
        particles.push({
          x: 0,
          y: 18,
          char: "✨",
          opacity: cycle > 0.8 ? 0.9 : 0.2,
          scale: 0.9,
          rotation: t * 40,
        });
      }
      break;
    }

    case "barking": {
      // Cabeça erguida e ondas de som pulsantes
      const barkPulse = Math.sin(t * 10) > 0.3 ? 1.15 : 1.0;
      dx = Math.sin(t * 3) * 1.5;
      dy = barkPulse > 1.05 ? -2.2 : 0;
      scaleX = barkPulse;
      scaleY = barkPulse;
      rotation = Math.sin(t * 6) * 6;
      pulse = barkPulse > 1.05 ? 1 : 0.2;

      if (isActiveInTimeline) {
        particles.push({
          x: 22 + Math.sin(t * 8) * 8,
          y: -12 + Math.cos(t * 8) * 4,
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
      // Pulso harmônico e notas musicais flutuando
      const beat = Math.abs(Math.sin(t * 7));
      scaleX = 1 + beat * 0.12 * intensity;
      scaleY = 1 + beat * 0.12 * intensity;
      rotation = Math.sin(t * 3) * 6;
      pulse = beat;

      // Notas flutuantes
      const noteOffset1 = (t * 18) % 36;
      const noteOffset2 = ((t + 0.5) * 18) % 36;
      particles.push(
        {
          x: 18 + Math.sin(t * 4) * 8,
          y: -14 - noteOffset1,
          char: "♪",
          opacity: Math.max(0, 1 - noteOffset1 / 36),
          scale: 0.9,
          rotation: Math.sin(t * 2) * 20,
        },
        {
          x: -16 + Math.cos(t * 3) * 8,
          y: -12 - noteOffset2,
          char: "♫",
          opacity: Math.max(0, 1 - noteOffset2 / 36),
          scale: 0.8,
          rotation: Math.cos(t * 2) * -20,
        }
      );
      break;
    }

    case "shining": {
      // Respiração luminosa e raios cintilantes
      const glow = (Math.sin(t * 3.5) + 1) / 2;
      scaleX = 1 + glow * 0.14 * intensity;
      scaleY = 1 + glow * 0.14 * intensity;
      rotation = t * 15;
      pulse = glow;

      particles.push(
        {
          x: 18 + Math.sin(t * 5) * 10,
          y: -16 + Math.cos(t * 5) * 10,
          char: "✨",
          opacity: glow * 0.9,
          scale: 0.85 + glow * 0.25,
          rotation: t * 45,
        },
        {
          x: -18 + Math.cos(t * 4) * 10,
          y: 14 + Math.sin(t * 4) * 10,
          char: "⭐",
          opacity: (1 - glow) * 0.8,
          scale: 0.75,
          rotation: -t * 30,
        }
      );
      break;
    }

    case "blowing": {
      // Balanço gracioso ao vento
      const sway = Math.sin(t * 2.8);
      rotation = sway * 8 * intensity;
      dx = sway * 2.2 * intensity;
      scaleX = 1 + Math.abs(sway) * 0.04;
      pulse = Math.abs(sway);

      if (isActiveInTimeline) {
        particles.push({
          x: 16 + (t % 1.5) * 20,
          y: -4 + Math.sin(t * 3) * 12,
          char: "🍃",
          opacity: 0.85 * (1 - (t % 1.5) / 1.5),
          scale: 0.8,
          rotation: t * 60,
        });
      }
      break;
    }

    case "swimming": {
      // Ondulação aquática e flutuação
      const wave = Math.sin(t * 2.2);
      dx = Math.cos(t * 1.5) * 2.5 * intensity;
      dy = wave * 2.4 * intensity;
      rotation = wave * 6;
      pulse = (wave + 1) / 2;

      particles.push({
        x: Math.sin(t * 3) * 14,
        y: 16,
        char: "🫧",
        opacity: 0.75 * (Math.sin(t * 4) * 0.5 + 0.5),
        scale: 0.8,
        rotation: 0,
      });
      break;
    }

    case "sleeping": {
      // Respiração serena e pacífica com Zzz
      const breath = (Math.sin(t * 1.8) + 1) / 2;
      scaleY = 0.92 + breath * 0.12;
      scaleX = 1.04 - breath * 0.05;
      rotation = Math.sin(t * 1.2) * 2;
      pulse = breath;

      const zOffset = (t * 12) % 30;
      particles.push({
        x: 14 + (zOffset / 30) * 12,
        y: -10 - zOffset,
        char: "💤",
        opacity: Math.max(0, 1 - zOffset / 30),
        scale: 0.8 + (zOffset / 30) * 0.4,
        rotation: 0,
      });
      break;
    }

    case "dancing":
    case "celebrating": {
      // Dança alegre com rotação alternada e passos saltitantes
      const beat = Math.sin(t * 7.5);
      dx = beat * 3 * intensity;
      dy = Math.abs(Math.sin(t * 7.5)) * -2.8 * intensity;
      rotation = beat * 14;
      scaleX = 1 + Math.abs(beat) * 0.08;
      pulse = (beat + 1) / 2;

      particles.push({
        x: Math.sin(t * 5) * 18,
        y: -16 + Math.cos(t * 5) * 6,
        char: "🎉",
        opacity: 0.85,
        scale: 0.8,
        rotation: t * 50,
      });
      break;
    }

    default: {
      // Comportamento ocioso vivo (idle): respiração suave e atenção ao ambiente
      const idleBreath = Math.sin(t * 2.2);
      scaleY = 1 + idleBreath * 0.03;
      scaleX = 1 - idleBreath * 0.02;
      dy = idleBreath * 0.6;
      rotation = Math.sin(t * 1.4) * 2;
      pulse = (idleBreath + 1) / 2;
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
  }
) {
  const { centerX, centerY, kreyol, portuguese, state, visualOpacity, visualScale, isActive, fontSize = 21 } = params;
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
    const auraRadius = 38 + state.pulse * 10;
    const gradient = context.createRadialGradient(0, 0, 15, 0, 0, auraRadius);
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
  context.fillText(state.badgeEmoji, pillX + fontSize * 1.05, 1);

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
