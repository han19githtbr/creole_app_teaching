# Kreyòl Ayisyen: plataforma de ensino do crioulo haitiano

Aplicação web em Next.js para ensinar Kreyòl Ayisyen. Reúne área do aluno, administração de conteúdo, lições, postagens com imagem e jogo de palavras, vídeos, **histórias narradas**, aulas ao vivo, notificações e gamificação. A interface é toda em português do Brasil.

## Sumário

- [Visão geral](#visão-geral)
- [Stack](#stack)
- [Histórias narradas com Elementos com Vida, Transcrição Automática e Publicação Social](#histórias-narradas)
- [Jogo C'est quoi ?](#jogo-cest-quoi-)
- [Indicador de carregamento](#indicador-de-carregamento)
- [Contraste sobre fundo azul](#contraste-sobre-fundo-azul)
- [Visibilidade das lições](#visibilidade-das-lições)
- [Imagens no Cloudflare R2](#imagens-no-cloudflare-r2)
- [Configuração das variáveis de imagens e IA](#configuração-das-variáveis-de-imagens-e-ia)
- [Geração de imagens por IA (Controle Exato de Quantidade)](#geração-de-imagens-por-ia)
- [Cores, Animações e Legibilidade](#cores-e-legibilidade)
- [Funcionalidades](#funcionalidades)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Configuração local](#configuração-local)
- [Notificações no Android](#notificações-no-android)
- [Scripts](#scripts)
- [Deploy](#deploy)
- [Licença](#licença)

## Visão geral

- Login com Google (NextAuth) e dois papéis: `admin` (o e-mail definido em `ADMIN_EMAIL`) e `user`.
- Lições em rascunho, com publicação e anúncio controlados pelo administrador.
- Painel do aluno com progresso, conteúdo recente e central de notificações.
- Postagens com texto e/ou imagem (banco de ilustrações ou upload), respostas dos alunos revisadas pelo administrador e jogo de identificação de palavras na imagem.
- Vídeos com likes, comentários, gravação no navegador e agendamento.
- **Histórias narradas com Elementos com Vida**: uma cena ilustrada + narração em Kreyòl + legendas bilíngues, onde cada elemento da cena ganha vida e se comporta realisticamente (pássaros voam, cachorros correm/latem, árvores balançam ao vento, etc.) de acordo com as ações descritas na fala ou na legenda. Acompanha exportação de vídeo vertical 9:16 com as mesmas animações gravadas, rótulos inteligentes e legenda móvel arrastável.
- **Jogo "C'est quoi ?"** (painel em francês): 5 níveis, incluindo o **Nativo** (20 imagens, com os sub-níveis *Palavra* e *Frase*), botão **Dica** que congela o tempo, **arena online** com jogadores online, ranking e duelos.
- Aulas ao vivo com LiveKit, quando configurado.
- Fundo virtual (MediaPipe) na gravação de vídeos e nas aulas ao vivo.
- PWA com service worker, página offline e Web Push opcional.
- Gamificação com XP, moedas Goud, níveis, conquistas e títulos.
- Imagens no **Cloudflare R2** (fora do repositório) e **geração de novas imagens por IA** com controle rigoroso de quantidade (gera exatamente 1, 2 ou a quantidade solicitada, respeitando a cota diária, com revisão automática e aprovação no painel do administrador).


## Stack

- Next.js 16, React 19 e TypeScript
- MongoDB com Mongoose
- NextAuth.js (Google OAuth, sessão JWT)
- Tailwind CSS 4
- Vercel Blob (uploads de vídeo, imagem de postagem e narração das histórias)
- Cloudflare R2 (ilustrações do app e imagens geradas por IA) via `@aws-sdk/client-s3`; `sharp` para converter e validar imagens
- Gemini API (geração e revisão de imagens) por REST
- LiveKit (aulas ao vivo)
- Web Push (`web-push`), Service Worker e Badging API
- MediaPipe Selfie Segmentation (fundo virtual)
- `@breezystack/lamejs` (codificador MP3 que roda no navegador)

## Histórias narradas

Uma história é um registro de `VideoLesson` com o campo `story`. Ela é criada em **Admin → Histórias → Nova história** e assistida em **Histórias** (menu do aluno).

### Conteúdo de uma história

- **Título** e **apresentação** (opcional).
- **Cena**: uma das ilustrações do banco Ghibli (`/public/ghibli`, 14 temas × 20 cenas). Cada cena tem 4 elementos (por exemplo, `òdinatè · computador`).
- **Narração em Kreyòl**: áudio de **5 segundos a 10 minutos**. Não existe mais a exigência de 5 minutos: o vídeo dura exatamente o que a narração durar.
- **Legendas**: trechos com início, fim, texto em Kreyòl e texto em português.
- **Momentos dos elementos** (opcional): o segundo em que cada elemento da cena entra em destaque.
- **Publicação**: publicar agora, agendar ou salvar como rascunho.

### Três formas de adicionar a narração

O bloco **Narração em Kreyòl** do formulário tem três abas:

1. **Enviar arquivo**: MP3, WAV, M4A, OGG ou WebM, até 30 MB. Se o arquivo escolhido for um MP4, ele é convertido para MP3 automaticamente.
2. **Gravar agora**: grava pelo microfone do navegador, com pausar/continuar, medidor de volume, cronômetro (só conta o tempo gravado, não o das pausas), parada automática em 10 minutos e opção de descartar. Mínimo de 5 segundos. Ao parar, a gravação é convertida em MP3 e fica disponível para ouvir antes de salvar.
3. **Converter MP4 → MP3**: extrai a trilha de áudio de um MP4 (ou M4A) e a codifica em MP3 mono de 128 kbps. Aceita arquivos de até 250 MB e vídeos de até 10 minutos.

A conversão acontece **inteiramente no navegador** (Web Audio + lamejs): o MP4 original nunca é enviado ao servidor. Só o MP3 final é enviado ao Vercel Blob quando a história é salva. O MP3 convertido ou gravado também pode ser baixado pelo formulário.

O formulário mede a duração real do áudio (inclusive de gravações WebM, que não trazem duração no cabeçalho) e valida limite de tamanho, formato e duração antes de aceitar o arquivo.

### Como áudio, elementos e legendas ficam sincronizados

Toda a animação depende somente do **tempo atual do áudio** e da **duração real da narração**. A mesma lógica (`src/lib/storyTimeline.ts`) é usada pela pré-visualização no player e pelo exportador de vídeo, portanto o vídeo exportado se comporta como o player.

- **Legendas**: aparecem entre o início e o fim definidos, lidos do relógio do áudio.
- **Elementos da cena**: cada elemento fica oculto até o seu momento, entra com fade e zoom em 0,6 s, fica em destaque (cor dourada) até o início do próximo e depois permanece visível, discreto. Sem marcação manual, os 4 elementos se dividem igualmente ao longo da narração (em 60 s: 0, 15, 30 e 45 s). Os momentos podem ser ajustados no formulário (campo **Elementos da cena**) para coincidir com o instante em que você fala cada palavra; o botão **Distribuir automaticamente** volta à divisão igual.
- **Rótulos que apontam para o objeto**: cada nome tem uma seta cuja ponta cai **dentro do objeto que ele descreve**, nas 280 ilustrações do banco (detalhes em [Rótulos que apontam para o objeto certo](#rótulos-que-apontam-para-o-objeto-certo)). O elemento que não está desenhado numa ilustração não recebe rótulo.
- **Legenda móvel no player**: a caixa de legenda pode ser arrastada para qualquer ponto do quadro da cena, para que ela não esconda elementos da ilustração (detalhes em [Legenda móvel no player](#legenda-móvel-no-player)).
- **Cena**: zoom suave (de 100% a 105%) e leve deriva distribuídos por **toda** a narração, qualquer que seja a duração. A barra de progresso e o contador `mm:ss / mm:ss` usam a duração real.
- **Legendas no formulário**: ao enviar/gravar/converter a narração, se o roteiro ainda estiver vazio, os trechos são criados já dentro da duração (cerca de um por minuto, no máximo 12). O botão **Redistribuir tempos** divide os trechos existentes igualmente pela duração. Os tempos aceitam décimos de segundo.
- **Na troca da narração**, os momentos dos elementos voltam à divisão automática (eles pertenciam ao áudio anterior). As legendas são mantidas; revise os tempos com **Redistribuir tempos**.

### Elementos com Vida (Living Elements Engine)

Desenvolvido em `src/lib/storyLifeEngine.ts` para dar vida autêntica aos elementos das ilustrações. Em vez de mover os títulos ou rótulos, quem se movimenta realisticamente são **os próprios elementos gráficos da imagem** (a borboleta bate asas e traça voos orgânicos, o pássaro respira e mexe a cauda, árvores e flores balançam ao vento), enquanto os títulos funcionam como rótulos identificadores estáveis e ancorados sobre cada elemento:

- **Movimentação real dos elementos da cena:** As animações acontecem diretamente sobre as formas visuais da ilustração (ex.: batimento de asas de 0,18 s com trajetórias 3D suaves para borboletas, pulsação torácica e oscilação de cauda para pássaros, curvatura e balanço do dossel para árvores).
- **Rótulos identificadores estáveis:** As pílulas com os nomes em Kreyòl e Português (`òdinatè · computador`) mantêm posição de ancoragem estável sobre os elementos correspondentes, com aura luminosa dourada quando em destaque na fala, sem trepidações mecânicas.
- **Identificação semântica de entidades:** O motor reconhece automaticamente a natureza do elemento a partir do seu nome em português e Kreyòl:
  - Animais: `cachorro/chen` (dog), `pássaro/zwazo` (bird), `cavalo/chwal` (horse), `gato/chat` (cat), `borboleta/papiyon` (butterfly).
  - Natureza: `árvore/pyebwa` (tree), `flores/flè` (flower), `sol/solèy` (sun), `nuvem/nyaj` (cloud), `rio/mar/rivyè` (water).
  - Cultura e som: `tambor/tanbou` (drum), `música/violão/mizik` (music), `lanterna/lanp` (lantern), `casa/kay` (house).
  - Veículos e tecnologia: `carro/machin` (car), `barco/bato` (boat), `drone/dròn` (drone), `robô/robo` (robot), `moinho/moulen` (windmill).
- **Detecção de ações por processamento de linguagem natural (Kreyòl + Português):**
  - **Voar / Bater asas (`voa`, `sobrevoa`, `plana`, `vole`, `ap vole`):** pássaros, borboletas e drones traçam arcos suaves de voo pelo céu com oscilação física de asas e flutuação.
  - **Correr / Galopar (`corre`, `dispara`, `veloz`, `kouri`, `ap kouri`):** cachorros e cavalos realizam ciclos enérgicos de passadas, saltos e deslocamento horizontal acompanhados de partículas de movimento.
  - **Pular / Saltar (`pula`, `salta`, `sote`, `ap sote`):** impulsão em arco com compressão (*squash*) no solo e estiramento (*stretch*) no ar.
  - **Latir / Emitir som (`late`, `uiva`, `jape`, `ap jape`):** pulsação enérgica com ondas sonoras expansivas.
  - **Cantar / Tocar música (`canta`, `gorjeia`, `toca`, `ritmo`, `chante`, `tanbouye`, `jwe mizik`):** vibração harmônica rítmica e notas musicais (`♪ ♫`) flutuando no ar.
  - **Brilhar / Iluminar (`brilha`, `reluz`, `radiante`, `ekla`, `klere`):** pulso de respiração luminosa, raios solares em rotação e partículas de brilho (`✨ ⭐`).
  - **Vento / Balançar (`vento`, `sopra`, `balança`, `van`, `soufle`, `balanse`):** balanço oscilatório suave em árvores e plantas, com folhas desprendendo e flutuando na direção do vento.
  - **Navegar / Ondas (`navega`, `flutua`, `onda`, `naje`, `flote`):** ondulação aquática com flutuação de barcos e respingos.
  - **Dormir / Descansar (`dorme`, `descansa`, `sono`, `dòmi`, `repoze`):** respiração lenta e pacífica com partículas `💤`.
  - **Comportamento ocioso vivo (Idle):** mesmo quando nenhuma ação verbal específica está ativa, os elementos possuem micro-movimentos orgânicos (respiração, atenção ao ambiente, farfalhar suave).
- **Paridade total entre Player Web e Exportação de Vídeo:**
  - No player web (`StoryPlayer.tsx`), os elementos exibem a aura viva de destaque, partículas animadas em órbita e selos com a ação em tempo real (`🦅 Voando`, `🐾 Correndo`, `🎶 Cantando`, `✨ Brilhando`).
  - No exportador Canvas 2D (`drawLivingElementOnCanvas`), todas as animações, físicas, partículas e auras são gravadas quadro a quadro em alta definição (1080×1920) sincronizadas ao relógio do áudio (`currentTime`), gerando um vídeo vertical MP4/WebM idêntico ao assistido na tela.
- **Prévia e auxílio na criação da história (`StoryForm.tsx`):**
  - No bloco **Elementos da cena**, cada elemento exibe sua categoria identificada e indicação de animação.
  - No bloco **Roteiro e legendas**, ao digitar as falas em Kreyòl e português, etiquetas dinâmicas indicam imediatamente quais ações foram ativadas naquele trecho (ex.: `⚡ Ações ativadas: 🦅 Pássaro: Voando · 🐾 Cachorro: Correndo`).

### Legendas Sincronizadas com Detecção de Voz (VAD) e Efeito de Digitação

No player de **Histórias** (`src/components/StoryPlayer.tsx`) e no módulo de análise de voz (`src/lib/audioVoiceActivity.ts`), a exibição das legendas oferece sincronia realista com a fala da narração:

- **Digitação estritamente sincronizada com o áudio (VAD - Voice Activity Detection):** A legenda em português é digitada **somente enquanto houver fala ativa no áudio**. A análise acústica decodifica a faixa com a Web Audio API (`AudioContext`), calculando a energia RMS em janelas de 20 ms com passo de 10 ms (100 quadros por segundo) com limiares adaptativos de ruído e histerese.
- **Parada absoluta durante pausas de áudio:** Se a narração dá uma pausa (respiração, vírgula, quebra de frase ou silêncio entre palavras), **nada é digitado**: o progresso congela imediatamente e nenhuma nova letra aparece até a voz recomeçar, garantindo uma cadência autêntica e realista.
- **Alinhamento palavra por palavra:** O texto em português é mapeado para os blocos ativos de fala da narração; as palavras aparecem na exata proporção e momento em que são pronunciadas no áudio.
- **Cursor inteligente de digitação:** Durante a fala ativa, um cursor dourado pulsa dinamicamente (`#f5cf72` com brilho); durante as pausas da fala, ele repousa suave e estático, indicando o silêncio momentâneo da narração; ao término da frase, o cursor desaparece para manter a leitura limpa.
- **Design compacto e posição inferior:** A legenda possui formato fino em vidro fosco (*frosted glass* escuro com borda dourada delicada) e fica posicionada na base do vídeo (`bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2`), garantindo leitura confortável sem cobrir a arte nem os elementos da cena.
- **Sumiço automático ao final do vídeo:** Assim que a narração ou o vídeo termina (`ended`, término de buffer ou fim da duração), a legenda desaparece suavemente por completo (`opacity-0`), liberando totalmente a imagem e os elementos da cena.
- **Sem saltos visuais (Layout Shift Zero):** O trecho ainda não digitado é renderizado com opacidade zero no mesmo fluxo tipográfico, mantendo largura, quebras de linha e altura estáveis desde a primeira letra.
- **Arrasto livre e reposicionamento:** O aluno pode arrastar a legenda para qualquer ponto da tela com mouse/toque ou via teclado (`Tab` + setas), com botão para redefinir a posição padrão.
- **Paridade na exportação de vídeo 9:16:** Na gravação vertical em Canvas 2D (`drawCaptionBox`), a legenda utiliza o mesmo motor de atividade de voz, pausando durante silêncios e sumindo nos quadros finais do vídeo exportado.

### Rótulos que apontam para o objeto certo

Antes, as posições dos rótulos eram fixas por tema (4 pontos para as 20 ilustrações de cada tema), então o nome muitas vezes caía longe do objeto. Agora **cada elemento de cada ilustração tem a sua posição medida**:

- **Dados:** `src/lib/storyElementAnchors.json` guarda, para cada imagem do banco (`id`) e cada elemento (na ordem de `elements`), o ponto `[x, y]` em % da imagem 1200×800, ou `null` quando o elemento **não está desenhado** naquela ilustração.
- **Como o ponto é calculado:** cada objeto do SVG é renderizado isolado, o que fica escondido por objetos desenhados à frente é descontado, e o ponto escolhido é o mais interno da parte visível do objeto (nunca na borda nem fora dele).
- **Quais objetos são quais:** a ligação elemento → objeto do SVG foi conferida visualmente nas 280 imagens e está em `scripts/ghibli/anchors/element-map.txt` (uma linha por imagem, 4 itens na ordem dos elementos: número do objeto, `a+b` para vários, `x,y` para ponto manual em px da imagem, `-` para ausente).
- **Elementos ausentes:** `imageBank.ts` expõe `storyElements` (só os elementos desenhados) e `labelLayout.anchors` alinhado a essa lista. O player e a exportação usam `storyElements`; o jogo e as lições continuam usando `elements`. Dos 1120 elementos, 944 recebem rótulo e 176 não estão desenhados.
- **Seta:** fio dourado com contorno escuro (legível sobre qualquer fundo) e **ponta de seta exatamente sobre o ponto do objeto**, tanto no player (SVG) quanto no vídeo exportado (canvas). O texto fica acima do objeto e, quando dois rótulos colidem, só o texto se afasta: a ponta continua no objeto.
- **Âncoras dos elementos animados:** em `tecnologia`, `natureza`, `turismo` e `gastronomia` (cenas principais com animação CSS dentro do SVG), objetos que se movem pela cena (drone, barco, balão) não têm posição fixa e ficam sem rótulo.

Para refazer as âncoras depois de mudar uma ilustração:

```bash
npm i                                   # inclui @resvg/resvg-js (devDependency)
cd scripts/ghibli/anchors
node measure.mjs 0 1                    # renderiza cada objeto dos SVGs (gera nodes.json, ignorado pelo git)
# ajuste a linha da imagem em element-map.txt se o objeto mudou de número
python3 build-anchors.py                # requer numpy e scipy; reescreve src/lib/storyElementAnchors.json
```

`bank-elements.json` é a lista de elementos por imagem usada pelo script (gerada a partir de `imageBank.ts`; atualize-a se o banco mudar).

### Cenas Vivas: todas as imagens ganham vida (`src/lib/storySceneLife.ts`)

> **Cena limpa (atual):** para o vídeo ficar claro e cada elemento fácil de identificar, a camada de vida agora mostra apenas animações **ambientes discretas**: ondas e brilho na água, no máximo 2 aves (gaivotas, pássaros, pombas, águia) e 1 borboleta. Pessoas, animais, barcos, tubarão e cardume, confete, brilhos e folhas **não são mais desenhados**, porque cobriam os objetos rotulados e não pertenciam à ilustração. O filtro está no final de `createSceneLife` (`keep`/`AMBIENT_BIRDS`); os atores descritos abaixo continuam no código, mas só os ambientes passam. Para trazer de volta algum ator, inclua o nome dele nesse filtro.

Antes, só as cenas principais traziam animação dentro do próprio SVG; as outras ~270 variações e as imagens geradas por IA eram estáticas. Agora **toda cena** (as 280 do banco, as de IA vetoriais e as de IA rasterizadas) recebe uma **camada de vida** desenhada por cima da imagem, imitando o mundo real:

- **Mar, rio e lago:** ondas e brilhos na água, veleiros com esteira, barco a remo com remadores, peixes saltando, **tubarão caçando um cardume** (os peixes se espalham) e gaivotas.
- **Natureza:** coelho fugindo de uma raposa, cervos pastando, borboletas e pássaros.
- **Tecnologia:** humanos digitando/apontando e **interagindo com robôs**, drone patrulhando.
- **Turismo:** turistas apontando e fotografando, pessoas caminhando, avião cruzando o céu, balão subindo.
- **Gastronomia:** **família jantando** à mesa (comendo, conversando, vapor da comida).
- **Cinema:** **plateia** assistindo (a tela tremeluz nos rostos), feixe do projetor com poeira, pipoca.
- **Cultura, Dança, Música:** dançarinos girando, tamborista, banda, notas musicais, confete.
- **Vida no interior, Lazeres, História, Geografia, Estoicismo, Religião:** galinhas, vacas, cão, pipas, bola, ciclista, cavaleiro, exploradores, filósofos conversando, fiéis, pombas, velas.

**Como funciona**

1. `analyzeSceneZones` lê a própria imagem (transparência e cor) e descobre **onde há água e onde fica o chão**, para pôr barcos no mar e pessoas no chão. Funciona com qualquer imagem; se não conseguir ler (ex.: CORS), usa posições padrão.
2. `createSceneLife` escolhe o elenco pelo **tema** e pelas palavras dos **elementos/título** da cena (barco, robô, avião, mesa, etc.).
3. `render(t)` é uma **função pura do tempo**: devolve o SVG do instante `t`. O player usa o tempo do áudio e a exportação usa o tempo de cada quadro. Por isso **o vídeo baixado é idêntico ao assistido** (Stories 9:16 e Feed 1:1).
4. As cenas `tecnologia`, `natureza`, `turismo` e `gastronomia` principais já têm seus personagens no SVG e **não recebem camada extra** (evita duplicar).
5. **Imagens geradas por IA** seguem o mesmo caminho: não exigem nada além do tema da imagem; a camada é aplicada na hora de tocar/exportar a história.

Desempenho medido: ~8 ms por quadro e ~17 KB de SVG por quadro; o resultado é determinístico (mesma entrada, mesmo quadro). Para adicionar um ator novo, crie a função de desenho em `storySceneLife.ts` e inclua-a no `case` do tema.

### Correções de estabilidade (tela "This page couldn't load")

- **`public/ghibli/gastronomia.svg`:** o filtro `softGlow` estava sem a tag de fechamento `</filter>`, o que tornava o SVG inválido (a imagem principal de gastronomia não carregava). Corrigido.

- **Erros de sintaxe** que impediam compilar: `default:` faltando no `switch` de `calculateLivingElementState` (`storyLifeEngine.ts`) e `}` faltando no bloco de exportação offline (`StoryPlayer.tsx`).
- **Telas de erro amigáveis:** `src/app/error.tsx` e `src/app/global-error.tsx` com "Tentar de novo" e "Voltar", no lugar da página genérica.
- **Página da história** (`dashboard/stories/[id]`): se o banco falhar, tenta uma segunda vez antes de exibir o erro.

### MongoDB Atlas: alerta de conexões acima do limite (cluster M0)

O M0 permite **500 conexões** somando todas as instâncias. O `connectDB` antigo zerava o cache no evento `disconnected`; como o driver já se reconecta sozinho, a requisição seguinte abria **outro pool sem fechar o anterior**, e cada instância serverless ainda mantinha pool grande. Correções em `src/lib/mongodb.ts`:

- cache único em `global` e a promessa só é descartada se a conexão **falhar**;
- `maxPoolSize: 2`, `minPoolSize: 0`, `maxIdleTimeMS: 5000`, `maxConnecting: 1`;
- `serverMonitoringMode: "poll"` e `heartbeatFrequencyMS: 30000` (menos conexões de monitoramento);
- tempos limite definidos (`serverSelectionTimeoutMS`, `connectTimeoutMS`, `socketTimeoutMS`, `waitQueueTimeoutMS`).

Além disso, o batimento da arena no lobby (`useCquoiArena.ts`) passou de 8 s para 20 s. **Depois de publicar:** abra o alerta no Atlas, confira em *Metrics > Connections* que a curva caiu e, se quiser mais folga, considere um plano acima do M0.

### Paridade entre o Ensino de Crioulo e Francês

A funcionalidade de **Histórias** está integrada com **total paridade de recursos** tanto na plataforma de **Kreyòl Ayisyen** quanto na de **Français** (`/admin/stories` e `/dashboard/stories`):

- **Interface adaptada ao idioma:** Todos os textos, títulos, banners informativos, instruções, colunas de legendas e placeholders alternam dinamicamente com base no idioma ativo (`useAppLanguage()`):
  - Em Crioulo: `Narração em Kreyòl`, coluna `KREYÒL`, exemplos em Kreyòl (`Ex.: Zwazo a ap vole...`).
  - Em Francês: `Narração em Francês`, coluna `FRANÇAIS`, exemplos em Francês (`Ex.: L'oiseau vole dans le ciel...`).
- **Elementos da cena no idioma selecionado:** As 280 ilustrações do banco Ghibli trazem nomes e categorias nativas para cada idioma através de `getElementLabel(element, language)` e do dicionário `PT_TO_FR` (`src/lib/imageBank.ts`). No painel em francês, os elementos são exibidos exclusivamente em francês e português (ex.: `chien · cachorro`, `oiseau · pássaro`, `arbre · árvore`, `fleur · flor`), eliminando qualquer termo em crioulo da interface de francês.
- **Motor de Vida multilíngue:** O motor `Living Elements Engine` (`src/lib/storyLifeEngine.ts`) reconhece entidades e verbos de ação em **Francês**, **Crioulo** e **Português** (`voler/vole/voa`, `courir/kouri/corre`, `sauter/sote/pula`, `chanter/chante/canta`, `aboyer/jape/late`, `briller/klere/brilha`, `vent/van/vento`, etc.).

### Preenchimento Automático do Roteiro e Legendas

O preenchimento do roteiro e das legendas bilíngues (idioma-alvo + português) agora conta com automação inteligente em duas frentes:

1. **Gravação ao vivo com transcrição em tempo real (Speech-to-Text):**
   - Ao gravar pelo microfone na aba **Gravar agora**, o navegador ativa o reconhecimento de voz contínuo (`webkitSpeechRecognition` / `SpeechRecognition`), preenchendo o roteiro de legendas automaticamente conforme as palavras são pronunciadas.
   - Um indicador visual (`Gravando e transcrevendo...`) confirma o reconhecimento de fala em tempo real.
2. **Upload de áudio e conversão com IA (Gemini Multimodal):**
   - Ao enviar um arquivo de áudio ou converter um vídeo MP4, a rota `/api/stories/transcribe` aciona inteligência artificial multimodal (Google Gemini) para transcrever a narração diretamente no idioma-alvo (Crioulo ou Francês) e gerar a respectiva tradução sincronizada em português.
   - O áudio é dividido em trechos com tempos de início e fim calculados para coincidir com a duração da narração.
3. **Edição e correção manual a qualquer momento:**
   - Mesmo com o preenchimento automático, o administrador pode editar livremente qualquer trecho, ajustar uma palavra incorreta, pontuar e alterar os segundos de início e término (`start` e `end`), tanto no campo em português quanto no campo no idioma-alvo (Crioulo/Francês).

### Exportação e Publicação em Redes Sociais (Instagram, WhatsApp e Facebook)

No player da história (`StoryPlayer.tsx`), o bloco **Publicar e Baixar** permite gerar e publicar os vídeos das histórias animadas nas principais redes sociais:

- **Dois formatos de exportação sob medida:**
  - 📱 **Stories & Status (9:16 - 1080×1920):** Formato vertical ideal para Instagram Stories, Facebook Stories e Status do WhatsApp, com composição vertical de cena, tipografia expandida e legendas posicionadas na base.
  - 🖼️ **Feed & Posts (1:1 - 1080×1080):** Formato quadrado perfeito para o Feed do Instagram, Feed do Facebook e conversas/grupos do WhatsApp, com enquadramento adaptativo de imagem e texto conciso.
- **Botão de Download direto:** Grava o vídeo com animações quadro a quadro e áudio sincronizado e faz o download instantâneo no formato compatível do navegador (MP4 ou WebM).
- **Publicação direta nas redes sociais:**
  - **WhatsApp (Status e Grupos):** Compartilha o arquivo de vídeo e a legenda diretamente via Web Share API em dispositivos compatíveis, ou baixa o arquivo e abre o WhatsApp com o texto pré-formatado.
  - **Instagram (Stories e Feed):** Aciona o compartilhamento mobile com o vídeo e a legenda ou copia o texto formatado (com hashtags temáticas e citação da história) e abre o Instagram para publicação.
  - **Facebook (Feed e Stories):** Permite compartilhamento direto ou cópia rápida da legenda com redirecionamento para o Facebook.
- **Botão "Copiar texto da postagem":** Copia para a área de transferência um texto atrativo com o título, tema, citação da primeira fala com tradução e hashtags relevantes (`#frances`, `#kreyol`, `#idiomas`, etc.).

### Histórias criadas antes desta versão

Histórias antigas não têm duração gravada. O player usa a duração do próprio áudio e, na falta dela, o fim da última legenda; os momentos dos elementos seguem a divisão automática. Ao editar e salvar uma história antiga, a duração passa a ser registrada. Se o áudio dela tiver menos de 5 segundos ou mais de 10 minutos, será preciso trocá-lo para salvar.

### Regras validadas no servidor

`POST /api/stories` e `PUT /api/stories/[id]` usam a mesma validação (`src/lib/storyValidation.ts`):

- imagem existente no banco Ghibli (o tema é derivado dela);
- URL de áudio HTTPS em `*.public.blob.vercel-storage.com`;
- `audioDuration` entre 5 e 10 minutos (tolerância de 0,5 s);
- legendas em ordem, sem sobreposição, preenchidas e terminando dentro da duração do áudio (tolerância de 0,5 s);
- momentos dos elementos apenas para elementos da cena escolhida e dentro da duração.

O upload do áudio passa por `/api/stories/upload` (somente administrador; MP3, MP4/M4A, AAC, WAV, OGG e WebM; até 30 MB). A duração em segundos também é salva no campo `duration` do registro.

## Jogo C'est quoi ?

Jogo de vocabulário em francês do painel em **Français** (`/dashboard/jogo`). A seta vermelha aponta um objeto e o jogador responde antes que o tempo acabe. São 2 tentativas por imagem, combo, pontos por rapidez, XP e écus (gamificação do Français) e pronúncia em francês ao final de cada imagem.

### Níveis

Cada nível exige passar no anterior (o progresso fica no navegador, em `cquoi:progress:v1`). Para passar é preciso acertar **70%** das imagens.

| Nível | Imagens | Tempo | Pontos | Como se joga |
| --- | --- | --- | --- | --- |
| 🌱 Fácil | 10 | 15 s | x1 | Escolher o nome do objeto (4 alternativas) |
| ⚡ Intermediário | 10 | 10 s | x1,5 | Escolher o nome do objeto |
| 🔥 Master | 10 | 5 s | x2 | Escolher o nome do objeto |
| 👑 **Nativo · Palavra** | **20** | 4 s | x2,5 | Escolher o nome do objeto; as 3 alternativas erradas são do **mesmo tema** (bem parecidas). Libera após passar no Master |
| 💎 **Nativo · Frase** | **20** | 9 s | x3 | Escolher, entre 4 frases em francês, a que **descreve a imagem**. Libera após passar no Nativo · Palavra |

- Se o tema escolhido tiver menos de 20 imagens, o Nativo completa com imagens de outros temas (aviso na tela inicial).
- No **Nativo · Frase** só entram imagens que têm frase escrita (as 199 imagens atuais têm; imagens novas geradas por IA também, veja [Conteúdo das dicas e das frases](#conteúdo-das-dicas-e-das-frases)). Ao revelar a resposta, a frase aparece no balão e é lida em voz alta.
- As alternativas erradas nunca são "também corretas": objetos parecidos (ex.: chave / cadeado / chave de sol, chapéu / chapéu de palha, bola de futebol / de basquete) e nomes com palavra em comum nunca aparecem juntos (`isConfusable` em `src/lib/cquoiContent.ts`).
- A tela inicial mostra o bloco **Nativo** com borda animada e os dois sub-níveis lado a lado.

### Dica (todos os níveis)

Na tela de jogo, o botão **💡 Dica** (ou a tecla **H**) abre um painel por cima do jogo:

- **O tempo congela** (a barra fica azul/gelada). Ao tocar em *Voltar ao jogo*, o tempo parado é devolvido ao relógio, então a dica nunca consome segundos.
- **💬 Explicação**: texto em português dizendo *como o objeto é* (sem dizer o nome) e *para que serve*, com botão **Ouvir a dica** (voz em pt-BR).
- **🎬 Vídeo**: mini-filme animado na mesma ilustração do jogo (a câmera se aproxima do objeto da seta, holofote amarelo, legendas em 3 etapas com narração em português, pausar/rever). Se o item tiver um MP4 cadastrado (campo `v`, veja abaixo), o MP4 real é tocado no lugar do mini-filme.
- **🔤 Pista**: mostra o artigo e a primeira letra de cada palavra do nome em francês (ex.: `Un o•••••••••  p•••••••`).
- **Custo em pontos**: usar a dica reduz os pontos *daquela imagem* em **40%**; pedir também a pista da letra reduz em **55%** (`HINT_PENALTY` e `HINT_LETTER_PENALTY`, em `src/lib/cquoiLevels.ts`). O bônus de "acertou de primeira sem erros" da gamificação não é dado quando a dica foi usada. A dica pode ser revista na mesma imagem sem novo desconto. O resultado final mostra quantas dicas foram usadas.

### Arena online: jogadores online, ranking e duelos

Painel **Arena online** (`CestQuoiArena`), exibido abaixo do jogo na tela inicial e na tela de resultado. Não há WebSocket (o app roda em serverless na Vercel): o jogo envia um **batimento** ao servidor (a cada 8 s no lobby e 15 s durante a partida) que marca o jogador como online e devolve o painel atualizado.

- **Online**: quem deu sinal de vida nos últimos 45 s aparece como online, com status **No lobby** ou **Jogando** (nível, pontos ao vivo e imagem atual, ex.: `120 pts · 4/10`). Ao sair da página, o jogador some da lista na hora (`sendBeacon`).
- **Invisível**: o botão *Aparecendo / Invisível* do cabeçalho esconde o jogador da lista de online e impede convites. A escolha fica no navegador (`cquoi:visible:v1`). O jogador invisível continua no ranking.
- **Ranking**: top 20 com medalhas, foto, nome, bolinha de online e pontos, mais a posição do próprio jogador quando ele está fora do top 20. Três visões: **Semana** (pontos somados, reinicia toda segunda-feira, fuso de Brasília), **Geral** (total de pontos) e **Melhor partida por nível**. A pontuação é enviada ao fim de cada partida.
- **Duelos**: na aba *Online*, **Desafiar** convida um jogador que esteja no lobby. Os dois jogam **exatamente as mesmas imagens**, na mesma ordem, no nível e tema escolhidos por quem desafiou; vence quem fizer mais pontos. Quem desafia já começa a jogar; o convidado recebe o convite no painel (válido por 10 minutos), pode **Aceitar** ou **Recusar** e, ao aceitar, joga mesmo que ainda não tenha desbloqueado aquele nível. Resultado (vitória, derrota ou empate) e vitórias em duelo aparecem na aba *Duelos* e no ranking. O adversário vê a pontuação a superar assim que o desafiante termina.
- **Limites e segurança**: só aparecem nome e foto da conta Google já cadastrada no app. O servidor recusa pontuações impossíveis para o nível (`maxScoreFor`), limita o envio de pontuação a 1 a cada 8 s por jogador e valida os ids das imagens do duelo. Como o jogo roda no navegador, o ranking não é à prova de fraude determinada.

### Layout, cores e animações

- Fundo com degradê animado e bolhas de cor flutuando (versão própria para o tema escuro).
- Cada nível tem sua paleta (verde, âmbar, vermelho, violeta e magenta); o **Nativo** usa um cartão com borda de galáxia animada e coroa balançando.
- Alternativas com letrinhas coloridas **A-D** (teclas **1-4** continuam funcionando), elevação ao passar o mouse e frases em coluna única no Nativo · Frase.
- **Combo de fogo**: com 3 acertos seguidos a moldura da cena pega fogo; o contador de combo vira degradê laranja.
- **Tempo congelado**: ao abrir a dica, a barra de tempo e o relógio ficam azul-gelo com brilho pulsante; o botão de dica pulsa quando metade do tempo já passou.
- Painel da dica com entrada deslizante, abas animadas e mini-filme com zoom de câmera; convites de duelo e linhas do ranking entram em cascata.
- Todas as animações respeitam `prefers-reduced-motion`.

### Conteúdo das dicas e das frases

- `src/lib/cquoiHints.json`: um registro por imagem da coleção, indexado pelo `id` do item:

```json
"tecnologia-drone": {
  "d": "Máquina com hélices que voa sem ninguém dentro, controlada a distância.",
  "u": "Serve para filmar e fotografar de cima e até entregar pequenos objetos.",
  "f": "Il vole grâce à ses hélices et on le pilote à distance.",
  "v": "/c-quoi/dicas/tecnologia-drone.mp4"
}
```

  `d` = como é (PT, sem dizer o nome) · `u` = para que serve (PT) · `f` = frase em francês do Nativo · Frase · `v` = **opcional**, MP4 da dica. Para usar vídeos reais, envie os MP4 para o bucket em `c-quoi/dicas/` (o caminho `/c-quoi/...` já é repassado ao R2) e preencha `v`; se o arquivo falhar, o mini-filme animado assume.
- **Imagens geradas por IA**: o mesmo pedido que escolhe o objeto novo (`cquoiProposalPrompt`) já devolve `dica`, `uso` e `frase`, sem gastar cota extra. Eles são guardados em `cquoi.hint` (`GeneratedImage`) e entram no jogo via `listApprovedCquoiItems`. A frase só é aceita se tiver tamanho razoável e não citar o nome do objeto; sem ela a imagem funciona normalmente, só não aparece no Nativo · Frase. Sem dica escrita, o painel mostra uma dica genérica (tema, forma e cores) e continua com a pista da letra.

### Arquivos do jogo

| Arquivo | Função |
| --- | --- |
| `src/components/CestQuoiGame.tsx` | Jogo: níveis, tempo, dica, pontuação, duelos e telas (início, contagem, jogo, resultado) |
| `src/components/CestQuoiGame.css` | Animações e cores (fundo, Nativo, fogo, gelo, dica, arena) |
| `src/components/CestQuoiHint.tsx` | Painel da dica (explicação, mini-vídeo, pista da letra) |
| `src/components/CestQuoiArena.tsx` | Painel Arena online (ranking, online, duelos, convites) |
| `src/hooks/useCquoiArena.ts` | Batimento de presença, ranking, desafios e envio de pontuação |
| `src/lib/cquoiLevels.ts` | Regras dos 5 níveis (tempo, pontos, imagens, modo) e das dicas; compartilhado com a API |
| `src/lib/cquoiContent.ts` | Dicas, frases, máscara da pista e montagem das alternativas "justas" |
| `src/lib/cquoiHints.json` | Dica, uso, frase e vídeo opcional de cada imagem |
| `src/app/api/cquoi/arena/route.ts` | API do ranking, presença e duelos |
| `src/models/CquoiPlayer.ts` | Presença e placar de cada jogador (uma linha por usuário) |
| `src/models/CquoiChallenge.ts` | Duelos (somem sozinhos após 14 dias) |

`POST /api/cquoi/arena` aceita as ações `heartbeat`, `leave`, `score`, `challenge` e `respond`; `GET /api/cquoi/arena?board=week|all|<nível>` devolve o painel. Todas exigem login. Não há variável de ambiente nova: o ranking usa o mesmo MongoDB do app.

## Indicador de carregamento

Todas as telas que esperam por dados ou processamento mostram o mesmo indicador, o componente `src/components/LoadingSpinner.tsx`: um **círculo verde girando** (anel externo com degradê), um **anel interno que se enche conforme a porcentagem** e o número `NN%` no centro, com texto explicativo e brilho suave ao fundo.

### Porcentagem

- **Progresso real**: quando a operação informa o andamento, ele é usado diretamente (`progress={0..100}`). É o caso do envio de vídeo (`onUploadProgress` do Vercel Blob), da conversão/extração de áudio em MP3 e da gravação do vídeo vertical das histórias (tempo da narração).
- **Progresso estimado**: quando não há como medir (carregamento de páginas e dados), a porcentagem sobe rápido no início, desacelera e para em 94% até o carregamento terminar. Ela nunca marca 100% antes da hora.

### Variações (`layout` e `size`)

| Opção | Uso |
| --- | --- |
| `layout="screen"` | Ocupa a área da página (usado nos `loading.tsx`) |
| `layout="block"` | Centralizado dentro de um cartão ou lista |
| `layout="inline"` | Linha com barra de progresso: formulários e uploads |
| `layout="compact"` | Só o círculo e um texto curto (barra de navegação) |
| `size` | `xs`, `sm`, `md` e `lg` (a porcentagem fica dentro do círculo em `md` e `lg`) |

### Onde é aplicado

- Navegação entre páginas, via `loading.tsx` (com mensagem específica): raiz, `dashboard`, `dashboard/lessons`, `dashboard/videos`, `dashboard/stories`, `dashboard/jogo`, `admin` e `live`.
- Sala ao vivo do aluno (`LiveClient`) e controle da aula no admin (`AdminLiveControl`).
- Verificação do login na barra de navegação.
- Admin: envio de vídeo (`VideoUploadForm`), envio da imagem da postagem (`PostForm`), conversão do áudio das histórias (`StoryForm` e `StoryAudioRecorder`).
- Estúdio de gravação: carregamento do recorte da pessoa (fundo virtual).
- Player de histórias: gravação do vídeo vertical, com progresso real.

### Acessibilidade

O indicador usa `role="status"` e `aria-live="polite"`; a barra tem `role="progressbar"` com `aria-valuenow`. Para quem prefere menos movimento, o círculo continua girando, só que mais devagar. As cores vêm das variáveis `--loader*` em `globals.css`, com versão para o tema escuro.

## Contraste sobre fundo azul

Elementos com fundo azul sólido (`bg-[var(--accent)]` e `bg-[var(--accent-soft)]`), como o item ativo do menu mobile, selos, cartões selecionados e ícones circulares, usam **texto e ícones brancos em negrito** (ícones com traço mais grosso). Além das classes de cada componente, uma regra em `globals.css` garante isso para o próprio elemento e seus filhos diretos, mesmo que sobre uma classe de cor pálida. Variações translúcidas (`bg-.../50`) e estados `hover:` não são afetadas; nos `hover:bg-[var(--accent-soft)]` o texto passa a branco com `hover:text-white`.

## Visibilidade das lições

Lições novas são rascunhos (`isPublished: false`) por padrão. Para uma lição aparecer para alunos, ela precisa estar publicada **e** ter sido anunciada (`announcedAt` preenchido). Publicar sem anunciar não a torna visível no catálogo, na página da lição nem nas listas do aluno. O anúncio é uma ação explícita do administrador.

O mesmo critério é usado nas listagens de lições, na página individual e nos dados de progresso/novidades destinados aos alunos. Administradores podem consultar o conteúdo sem esse filtro.

## Imagens no Cloudflare R2

As ilustrações deixaram de ficar nas pastas do projeto. `public/ghibli` (280 SVGs) e `public/c-quoi` (jogo C'est quoi ?) foram para um bucket do **Cloudflare R2** (plano gratuito: 10 GB, sem custo de saída; as imagens atuais somam ~9 MB).

- **Mesmos caminhos.** O código continua usando `/ghibli/...`, `/c-quoi/...` e `/gen/...` (imagens geradas). O `next.config.ts` reescreve essas rotas para `ASSETS_BASE_URL`, então o navegador, o `<canvas>` (exportação de vídeo das histórias, cartão de conquista) e o service worker não percebem a diferença e não precisam de CORS.
- **Transição segura.** O Next procura primeiro em `public/` e só depois no bucket. Sem `ASSETS_BASE_URL` nada é reescrito e o app usa os arquivos locais.
- **Migração.** `node scripts/storage/migrate-to-r2.mjs --dry-run` lista o que seria enviado; sem `--dry-run` envia (com `Cache-Control: immutable` e o `Content-Type` correto) e ignora arquivos já presentes. Depois de conferir o site, apague `public/ghibli` e `public/c-quoi`. **Não apague `scripts/ghibli/manifest.json`**, que o banco de imagens (`src/lib/imageBank.ts`) lê.
- **Configuração do R2.** Crie o bucket, ative o acesso público (domínio próprio em produção; a URL `r2.dev` serve para testes) e um token "Object Read & Write". Preencha as variáveis `R2_*` e `ASSETS_BASE_URL`. O Cloudflare pode pedir um cartão para ativar o R2; dentro do plano gratuito não há cobrança.
- Mídias enviadas por usuários (vídeos, narrações, imagens de postagem) continuam no Vercel Blob.

## Configuração das variáveis de imagens e IA

Preencha as variáveis abaixo em dois lugares: no `.env.local` (para rodar no seu computador) e em **Vercel → Projeto → Settings → Environment Variables** (para produção). Depois de alterar na Vercel, faça um novo deploy. Os nomes dos menus dos serviços mudam de vez em quando; se algo estiver em outro lugar, procure pelo nome do item.

```env
# Imagens fora do projeto: Cloudflare R2 (plano gratuito)
R2_ACCOUNT_ID=seu-account-id
R2_ACCESS_KEY_ID=sua-access-key
R2_SECRET_ACCESS_KEY=sua-secret-key
R2_BUCKET=crioulo-imagens
ASSETS_BASE_URL=https://imagens.seudominio.com

# Geração de imagens por IA (painel /admin/imagens)
GEMINI_API_KEY=sua-chave-do-ai-studio
GEMINI_IMAGE_MODEL=gemini-nano-banana-2.1
GEMINI_TEXT_MODEL=gemini-3.8-flash
GEMINI_REVIEW_MODEL=gemini-3.5-flash-lite
IMAGE_GEN_DAILY_LIMIT=5
CRON_SECRET=segredo-do-cron
```

### 1. Cloudflare R2: `R2_BUCKET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`

1. Crie uma conta em <https://dash.cloudflare.com> (gratuita) e abra **R2 Object Storage**. Na primeira vez o Cloudflare pode pedir para ativar o R2 e informar um cartão; dentro do plano gratuito (10 GB) não há cobrança.
2. **`R2_BUCKET`:** clique em **Create bucket**, dê um nome (ex.: `crioulo-imagens`) e crie. O nome que você escolheu é o valor da variável.
3. **`R2_ACCOUNT_ID`:** na página inicial do R2 (**Overview**) o *Account ID* aparece no painel lateral direito. Ele também é a parte hexadecimal do endereço do painel (`dash.cloudflare.com/<account-id>/...`).
4. **`R2_ACCESS_KEY_ID` e `R2_SECRET_ACCESS_KEY`:** na página inicial do R2, clique em **Manage API Tokens** (ou *API*) → **Create API token**.
   - Permissão: **Object Read & Write**.
   - Escopo: aplique somente ao bucket criado (mais seguro).
   - Ao criar, o Cloudflare mostra o *Access Key ID* e o *Secret Access Key*. **O segredo aparece uma única vez**: copie agora. Se perder, crie outro token. Ignore o campo "Token value" e o "endpoint"; o app monta o endereço sozinho a partir do Account ID.
5. Nunca coloque essas chaves no Git nem em variáveis `NEXT_PUBLIC_*`.

### 2. Endereço público das imagens: `ASSETS_BASE_URL`

É a URL pela qual o bucket é lido na internet, **sem barra no final**. O app usa esse endereço para repassar `/ghibli/...`, `/c-quoi/...` e `/gen/...` ao bucket. Escolha uma das opções:

- **Domínio próprio (recomendado para produção).** No bucket, abra **Settings → Custom Domains → Add**, informe um subdomínio (ex.: `imagens.seudominio.com`) e confirme. O domínio precisa estar usando o DNS do Cloudflare. Valor: `ASSETS_BASE_URL=https://imagens.seudominio.com`.
- **URL `r2.dev` (para testar).** No bucket, em **Settings → Public access / Public Development URL**, clique em **Enable** e confirme. O Cloudflare mostra um endereço parecido com `https://pub-xxxxxxxx.r2.dev`. Valor: `ASSETS_BASE_URL=https://pub-xxxxxxxx.r2.dev`. Esse endereço tem limite de uso e não é indicado para produção.

Teste: envie as imagens (`node scripts/storage/migrate-to-r2.mjs`) e abra no navegador `<ASSETS_BASE_URL>/ghibli/natureza.svg`; se a imagem aparecer, está certo. O script também faz essa verificação no final.

### 3. Gemini: `GEMINI_API_KEY`

1. Entre em <https://aistudio.google.com/apikey> com uma conta Google.
2. Clique em **Create API key** (escolha ou crie um projeto) e copie a chave.
3. Confira nas informações de limites do AI Studio (*Rate limits*) se a sua chave tem cota para **geração de imagens**. Se não tiver, a geração com o motor "Pintura Ghibli" retorna erro de cota (429). Nesse caso use o motor **"Vetor SVG"** no painel, que usa o modelo de texto.
4. Guarde a chave só no servidor (nunca em `NEXT_PUBLIC_*`).

### 4. Modelos: `GEMINI_IMAGE_MODEL`, `GEMINI_TEXT_MODEL` e `GEMINI_REVIEW_MODEL`

São opcionais: se você não definir, o app usa os valores do exemplo. Servem para trocar de modelo sem mexer no código.

- `GEMINI_IMAGE_MODEL`: modelo que desenha as imagens (motor "Pintura").
- `GEMINI_TEXT_MODEL`: modelo que escreve os SVGs (motor "Vetor SVG"). Quanto melhor o modelo, melhor o desenho.
- `GEMINI_REVIEW_MODEL`: modelo **leve** usado nas tarefas curtas: revisar cada imagem (nota, elementos e posições) e escolher o objeto novo do C'est quoi ?. Separar os dois poupa a cota do modelo principal. Se você não definir, o app usa o `GEMINI_TEXT_MODEL` para tudo. Escolha um modelo de texto que aceite imagem e tenha cota diária alta (na lista de limites do AI Studio, um modelo "Flash Lite" costuma ter 500 pedidos por dia).

**Contas de cota por dia (motor SVG):** cada imagem usa 1 pedido do `GEMINI_TEXT_MODEL` (desenhar) e 1 do `GEMINI_REVIEW_MODEL` (revisar); no C'est quoi ? há mais 1 do modelo leve para escolher o objeto. Com 5 imagens por dia, são só 5 pedidos por dia no modelo principal, o que cabe até em modelos com cota de 20 por dia.

Os nomes dos modelos mudam com frequência. Confira a lista atual na documentação do Gemini API (<https://ai.google.dev/gemini-api/docs/models>) e use exatamente o identificador mostrado. Se o nome estiver errado ou indisponível para a sua chave, o painel **Admin → Imagens com IA** mostra a mensagem "Modelo indisponível para esta chave" no pedido.

### 5. Limite diário: `IMAGE_GEN_DAILY_LIMIT`

Número de imagens que o robô pode gerar por dia, somando a geração automática e o botão "Gerar agora". O padrão é `5`. Se não definir, vale 5. A contagem zera à meia-noite no horário de Brasília. Diminua o valor se quiser economizar a cota da IA.

### 6. Segredo do cron: `CRON_SECRET`

É uma senha que protege a rota `/api/cron/image-gen`, que a Vercel chama uma vez por dia (06h de Brasília) para gerar as imagens dos pedidos ativos. Sem ela, a geração automática diária não roda (o botão "Gerar agora" continua funcionando).

1. Gere um valor aleatório e longo:
   - Linux/macOS/WSL: `openssl rand -base64 32`
   - Qualquer sistema com Node: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
2. Cadastre o valor como `CRON_SECRET` na Vercel (ambiente **Production**) e faça um novo deploy. A Vercel envia esse valor no cabeçalho `Authorization: Bearer ...` ao chamar o cron.
3. Confira em **Vercel → Projeto → Settings → Cron Jobs** se o job `/api/cron/image-gen` aparece. No plano Hobby cada cron pode rodar no máximo uma vez por dia, que é o que está configurado em `vercel.json`.
4. Para testar manualmente: `curl -H "Authorization: Bearer SEU_SEGREDO" https://seu-site.vercel.app/api/cron/image-gen`.

### Checklist final

1. Bucket criado e token com *Object Read & Write*.
2. Acesso público ativado (domínio próprio ou `r2.dev`) e `ASSETS_BASE_URL` preenchida.
3. Variáveis cadastradas no `.env.local` e na Vercel; novo deploy feito.
4. `node scripts/storage/migrate-to-r2.mjs --dry-run`, depois sem `--dry-run`.
5. Site conferido; só então apagar `public/ghibli` e `public/c-quoi`.
6. Em **Admin → Imagens com IA**, o aviso amarelo de configuração não deve aparecer; faça um pedido pequeno (5 imagens) para testar.

## Geração de imagens por IA

Painel em **Admin → Imagens com IA** (`/admin/imagens`), para ampliar o conteúdo do aplicativo gerando ilustrações novas sob demanda com controle rigoroso de quantidade e revisão de qualidade.

### Controle rigoroso de quantidade de imagens

Anteriormente, ao clicar em gerar, o sistema executava um loop que consumia toda a cota diária (5 imagens), mesmo quando se desejava apenas 1 ou 2 imagens para teste. O sistema foi totalmente reformulado para respeitar estritamente a quantidade solicitada:

- **Pipeline com parada imediata (`src/lib/imageGen/pipeline.ts`):** `runImageGenBatch` aceita os parâmetros `maxItems?: number` e `jobId?: string`. O processamento para imediatamente no momento exato em que o número de imagens requisitado for concluído com sucesso.
- **Endpoint dedicado (`/api/admin/image-gen/run`):** O método `POST` recebe `{ count?: number, jobId?: string }` via JSON e repassa ao pipeline de geração.
- **Seletor de quantidade na cota diária:** No bloco "Cota de hoje" do painel, há botões rápidos (`1`, `2`, `3` ou `Restante`) ao lado de "Gerar agora". Ao clicar em `1`, exatamente uma única imagem é gerada.
- **Criação e execução imediata no "Novo pedido":** O formulário de pedidos conta com atalhos de quantidade (`1`, `2`, `3`, `5`) e o botão de ação primária **"Criar e gerar agora (X imagem/ns)"**, que cria o pedido e executa na hora apenas a quantidade definida sem gastar a cota restante.
- **Ações diretas por pedido:** Em "Pedidos em andamento", cada cartão de pedido possui botões individuais **"Gerar 1 agora"** e **"Gerar X restantes"** (respeitando o saldo da cota do dia), direcionando a geração exclusivamente para o ID daquele pedido (`jobId`).
- **Modal interativo de inspeção (Zoom) na Galeria:** Ao clicar sobre qualquer miniatura de imagem na galeria, abre-se um modal de alta resolução com:
  - Visualização completa da imagem (pintura WebP em alta definição ou vetor SVG renderizado).
  - Ficha técnica completa de avaliação de QA: nota geral (0 a 10), notas por critério (estilo, fidelidade ao tema, ausência de marcas/textos) e parecer detalhado da IA revisora.
  - Lista de elementos identificados na cena com porcentagens e coordenadas de posição.
  - Ações diretas de **Aprovar** e **Rejeitar** dentro do próprio modal.

### Fluxo de geração e revisão

1. O administrador cria um **pedido**: parte do app (Postagens, Histórias ou C'est quoi ?), tema (ou todos), quantidade (1 a 200) e motor.
2. O robô entrega no máximo **5 imagens por dia** (`IMAGE_GEN_DAILY_LIMIT`). A cota é um contador no MongoDB (dia de Brasília) compartilhado pelo cron diário e pelos botões de execução manual.
3. Cada imagem é planejada, desenhada, **revisada automaticamente** (modelo de visão), guardada no R2 e cadastrada no MongoDB.
4. A revisão confere se os elementos obrigatórios estão visíveis, se não há texto/marca d'água e o estilo, dá uma nota de 0 a 10 e localiza cada elemento. Abaixo da nota mínima (7) a imagem fica **Rejeitada**; as demais ficam **Para aprovar**.
5. O administrador aprova na galeria (individualmente, no modal de zoom ou com "Aprovar todas com nota ≥ 8,5"). Opcionalmente o pedido aprova sozinho as de nota alta. **Só imagens aprovadas aparecem para os alunos.**
6. O pedido pode ser pausado, retomado ou cancelado; erros da IA (cota, chave, modelo) aparecem com tratamento amigável no próprio pedido.

### Partes do app

| Parte | O que é gerado | Onde aparece |
| --- | --- | --- |
| Postagens | Cena com 4 elementos em Kreyòl, legenda e desafio (10 palavras, 4 corretas) | Seletor de imagens das postagens e jogo de identificar elementos (sorteio e "próxima imagem") |
| Histórias | Cena com 4 elementos separados; as posições detectadas viram os rótulos animados com suporte ao motor de vida | Seletor de imagens das histórias, editor e player |
| C'est quoi ? | Um objeto novo em francês (artigo + nome, sem repetir os existentes), a seta vermelha posicionada sobre ele e a dica em português, o uso e a frase em francês do jogo | Direto no jogo `/dashboard/jogo`, junto com os itens atuais (todos os níveis, inclusive Nativo · Frase) |

O vocabulário em Kreyòl **não é inventado pela IA**: os elementos saem do mesmo vocabulário revisado já usado pelo app (`imageSceneVariants.json` + dicionário de tradução). A IA só desenha e confere o desenho. As imagens antigas permanecem intactas e aparecem junto das novas (marcadas "✨ Nova · IA" no seletor).

### Motores

- **Pintura Ghibli (Gemini, imagem):** melhor qualidade; saída em WebP 1200×800 (C'est quoi ?: 980×700, proporção 7:5 do jogo). Exige cota de imagem na sua chave do Gemini (confira no Google AI Studio). **Referência visual:** a cada geração, 2 ilustrações já existentes do mesmo tema (do banco `/ghibli` ou do C'est quoi ?) são convertidas em PNG e enviadas junto do prompt, com a instrução de imitar paleta, saturação, sombreado e simplicidade sem copiar a composição. Elas vêm de `public/` (se ainda existir) ou do bucket.
- **Vetor SVG (Gemini, texto):** o modelo de texto escreve o SVG no mesmo formato e viewBox das imagens atuais, usando uma ilustração existente do bucket como referência de estilo. O SVG passa por sanitização (sem scripts, `<image>`, `<text>`, links externos ou animações) e precisa renderizar. Qualidade mais simples; costuma ter cota gratuita.

### Execução

- Cron diário (`vercel.json`, 09:00 UTC = 06:00 em Brasília) chama `GET /api/cron/image-gen` com `Authorization: Bearer $CRON_SECRET`.
- Execução manual: `POST /api/admin/image-gen/run` aceita `{ count, jobId }` gerando a quantidade exata sob demanda.
- Erros de cota/chave/modelo/rede interrompem o lote e devolvem a chamada à cota; falhas de formato tentam de novo uma vez.

### Arquivos principais

- `src/lib/imageGen/` — `config.ts` (seções, temas, limites), `prompts.ts` (planejamento e prompts), `gemini.ts` (cliente REST, Interactions API), `svg.ts` (sanitização), `pipeline.ts` (cota, geração com `maxItems` e `jobId`, revisão, lote).
- `src/models/ImageGen.ts` — `GeneratedImage`, `ImageGenJob` e `ImageGenUsage`.
- `src/lib/generatedImages.ts` — leitura das imagens aprovadas no mesmo formato do banco estático; `src/hooks/useBankImage.ts` — resolve imagens geradas no cliente.
- `src/lib/r2.ts` — envio e remoção no R2.
- `src/app/admin/imagens/` e `src/app/api/admin/image-gen/**`, `src/app/api/cron/image-gen`, `src/app/api/generated-images`.

**Segurança:** as rotas do painel exigem administrador; a leitura pública exige login; SVGs gerados são sanitizados e servidos com cabeçalhos restritivos configurados em `next.config.ts` (a sanitização é a defesa principal).

## Cores, Animações e Legibilidade

O sistema visual e de estilos (`src/app/globals.css`) foi atualizado para proporcionar máxima legibilidade, contraste WCAG AAA e dinamismo visual:

- **Sistema de Cores Refinado:**
  - **Tom de Acento (Royal Indigo):** modo claro com `--accent: #2e1ff0` (indigo vibrante com contraste nítido sobre fundos claros), `--accent-hover: #4338ca` e `--accent-subtle: #eef2ff`. No modo escuro, utiliza `--accent: #6366f1`, `--accent-hover: #818cf8` e `--accent-subtle: #1e1b4b`, eliminando problemas de leitura de textos azuis sobre fundo escuro.
  - **Hierarquia de Superfícies:** camadas de elevação (`--card`, `--surface`, `--surface-hover`) e bordas suaves (`--border-subtle`, `--border-strong`) que aumentam a nitidez entre cartões, modais e fundos.
  - **Textos Secundários:** `--text-muted` calibrado para legibilidade perfeita tanto em temas claros quanto escuros, sem parecer desbotado.
  - **Painel de Imagens:** badges com contraste acessível para notas (verde para aprovadas, âmbar para revisão, vermelho para rejeitadas com texto nítido).
- **Animações e Físicas Vivas:**
  - `@keyframes living-pulse`: respiração e auras orgânicas de elementos em destaque.
  - `@keyframes living-fly`: trajetórias de voo, ondulações e bater de asas para pássaros, borboletas e drones.
  - `@keyframes living-run`: galopes e corridas rítmicas para animais terrestres e veículos.
  - `@keyframes living-bounce`: saltos elásticos com física de compressão (*squash*) e estiramento (*stretch*).
  - `@keyframes living-sway`: balanço oscilatório natural para árvores, folhagens e flores ao vento.
  - `@keyframes living-float`: flutuação aquática e aérea suave para nuvens, barcos e lanternas.
  - `@keyframes particle-rise` e `particle-twinkle`: partículas reativas (brilhos, notas musicais, folhas, zzz) emanando dos elementos vivos.
  - Classes utilitárias Tailwind complementares (`.animate-living-pulse`, `.animate-living-fly`, etc.) para uso imediato em componentes React.

## Funcionalidades

### Aluno

- Painel com progresso, conteúdo recente e destaques.
- Catálogo de lições por categoria, busca e conteúdo em Markdown; registro de conclusão.
- Feed de postagens com imagem, resposta à legenda/pergunta e jogo de palavras na imagem.
- Vídeos com likes e comentários.
- **Histórias** narradas, com legendas em português e/ou Kreyòl (a caixa de legenda pode ser arrastada para qualquer ponto da cena), exportação em vídeo vertical e destaque dos elementos da cena em sincronia com o áudio.
- Jogo de imagens (`/dashboard/jogo`). No painel em francês é o **C'est quoi ?** (5 níveis, com o Nativo, dica que congela o tempo e arena online); veja [Jogo C'est quoi ?](#jogo-cest-quoi-).
- Sala ao vivo (`/live`), se as credenciais LiveKit estiverem configuradas.
- Central de notificações com itens não lidos de lições, postagens e vídeos.
- Compartilhamento de conquistas (lição finalizada e vitória no jogo) no Facebook e no Instagram.

### Administrador

- Lições: criar e editar, controlar publicação e anunciar.
- Postagens: texto e/ou imagem (banco Ghibli ou upload de JPEG, PNG, WebP ou GIF até 8 MB), permanentes ou com expiração, com opção de aceitar ou não respostas.
- Jogo de palavras por imagem: adicionar, corrigir ou remover opções (de 2 a 20 palavras únicas) e definir quais são respostas corretas.
- Respostas: revisar as respostas dos alunos (em análise, correta ou incorreta, com texto do professor).
- Vídeos: enviar (até 500 MB), gravar no estúdio, editar, publicar e agendar.
- **Histórias**: criar, editar, pré-visualizar, publicar, agendar e excluir, com posicionamento visual refinado dos elementos da cena para leitura clara e sem sobreposição.
- Aula ao vivo: iniciar e encerrar sessões, com fundo virtual.
- Painel geral com estatísticas.

### Postagens e respostas dos alunos

O aluno envia uma resposta à legenda/pergunta de uma postagem. Ela fica **Em análise** até o administrador marcá-la como correta ou incorreta, com um texto opcional de retorno (até 1000 caracteres). Cada aluno tem uma resposta por postagem; depois de **incorreta**, pode enviar outra (o número de tentativas é contado). Uma resposta já **correta** não pode mais ser alterada.

### Jogo de palavras na imagem

- Nas postagens com imagem, o aluno escolhe, entre as opções em Kreyòl, as palavras que descrevem os elementos da imagem.
- São 3 tentativas, com som de vitória ou de derrota e a opção de tentar novamente.
- As opções e o gabarito vêm do banco de imagens ou são ajustados pelo administrador no editor da postagem; corrigir a grafia de uma resposta marcada mantém a palavra como correta.
- A vitória pode ser compartilhada no Facebook ou no Instagram.

### Vídeos, estúdio e fundo virtual

- Estúdio de gravação no navegador com câmera e microfone, de até 10 minutos.
- Fundo virtual estilo Google Meet: sem efeito, desfoque leve, desfoque, tema animado do estúdio ou ilustração do banco de imagens. A pessoa é recortada pelo MediaPipe Selfie Segmentation, cujos arquivos ficam em `public/mediapipe`.
- O mesmo motor de fundo virtual é usado nas aulas ao vivo.
- Publicação imediata ou agendada, likes e comentários.

### Gamificação

- XP, moedas Goud, 7 níveis, conquistas e títulos honoríficos (comprados com Goud).
- O estado é salvo por conta e sincronizado entre dispositivos autenticados; mudanças feitas offline ficam no navegador e são reenviadas quando a conexão volta.
- O jogo de imagens concede XP e Goud, com bônus por acertar de primeira e por sequência de vitórias. No C'est quoi ?, usar a dica tira o bônus de "primeira sem erros" e reduz os pontos da partida (que valem para o ranking).

### Notificações, PWA e badge

- O sino mostra itens não lidos dentro do app; a contagem é consultada ao abrir/retornar ao app e periodicamente enquanto ele está aberto.
- Web Push pode entregar notificações em segundo plano. É necessário configurar VAPID, e cada usuário/dispositivo precisa ativar as notificações no sino e conceder permissão ao navegador.
- Publicar ou anunciar lição, postagem, vídeo ou história dispara push para quem ativou as notificações.
- Ao ativar push em um dispositivo, se já houver novidades não lidas, o servidor envia um alerta de recuperação para esse aparelho; dispositivos já ativados podem usar **Enviar alerta de novidades** no sino.
- Cada push cria uma notificação do sistema. No Android, o ponto no ícone é controlado pelo sistema/launcher e depende das permissões de notificação; o Chrome Android não oferece a Badging API para forçar um número no ícone.
- Em navegadores que suportam a Badging API, o app também tenta sincronizar a contagem numérica; a aparência final depende do navegador, da instalação como PWA e do launcher.
- Há também fallback de favicon e título com contagem enquanto a página está aberta; esses fallbacks não substituem o badge do ícone da tela inicial.
- O service worker nunca guarda em cache rotas de API e de autenticação, usa cache para arquivos estáticos e, sem conexão, mostra a página `/offline`.

## Estrutura do projeto

```text
src/
├── app/
│   ├── admin/        # Painel do administrador (lições, postagens, respostas, vídeos, histórias, ao vivo, imagens com IA)
│   ├── dashboard/    # Área do aluno (lições, vídeos, histórias, jogo)
│   ├── live/         # Sala de aula ao vivo
│   ├── offline/      # Página exibida sem conexão
│   └── api/          # Endpoints da API
├── components/       # Componentes da interface (StoryPlayer, StoryAudioRecorder, ...)
├── hooks/            # Hooks React
├── lib/              # Autenticação, banco, push, gamificação, histórias e utilitários
├── models/           # Modelos Mongoose
├── seed/             # Dados e execução do seed
└── types/            # Tipos compartilhados
public/
├── ghibli/           # Banco de ilustrações (SVG)
├── avatars/          # Avatares do estúdio
├── icons/            # Ícones do PWA
├── mediapipe/        # Arquivos do modelo de segmentação
├── manifest.webmanifest
└── sw.js             # Service worker
scripts/
└── ghibli/           # Geradores das ilustrações do banco
```

Arquivos principais das histórias:

| Arquivo | Função |
| --- | --- |
| `src/app/admin/stories/StoryForm.tsx` | Formulário: imagem, narração (enviar/gravar/converter), momentos dos elementos, legendas e publicação |
| `src/components/StoryAudioRecorder.tsx` | Gravador de narração pelo microfone |
| `src/lib/audioToMp3.ts` | Decodificação e conversão para MP3 no navegador; leitura de duração |
| `src/lib/storyAudio.ts` | Limites (5 s a 10 min, 30 MB, 250 MB), formatos aceitos e utilitários de tempo |
| `src/lib/storyTimeline.ts` | Linha do tempo única (cena, elementos, legendas) usada pelo player e pelo exportador |
| `src/lib/storyValidation.ts` | Validação das histórias no servidor |
| `src/lib/audioVoiceActivity.ts` | Detecção de voz (VAD via Web Audio API) e sincronização estrita da digitação da legenda com as falas e pausas do áudio |
| `src/lib/storyLifeEngine.ts` | Motor de vida dos elementos da imagem (animações de borboleta voando, asas, farfalhar, etc.) |
| `src/components/StoryPlayer.tsx` | Player (incluindo a legenda arrastável), setas dos rótulos e exportação do vídeo vertical |
| `src/lib/storyElementAnchors.json` | Posição medida de cada elemento em cada ilustração (`null` = não desenhado) |
| `scripts/ghibli/anchors/` | Medição e mapeamento que geram `storyElementAnchors.json` |
| `src/components/LoadingSpinner.tsx` | Indicador de carregamento (círculo verde girando + porcentagem) usado em todo o app |
| `src/app/api/stories/**` | Listagem, criação, edição, exclusão e upload do áudio |

### Endpoints da API

| Rota | Métodos |
| --- | --- |
| `/api/stories` | GET, POST |
| `/api/stories/[id]` | GET, PUT, DELETE |
| `/api/stories/upload` | POST |
| `/api/generated-images` | GET (`?section=` lista aprovadas; `?src=` uma imagem) |
| `/api/admin/image-gen` | GET (estado, cota, pedidos, galeria), POST (novo pedido) |
| `/api/admin/image-gen/jobs/[id]` | PATCH (pausar, retomar, cancelar) |
| `/api/admin/image-gen/images/[id]` | PATCH (aprovar, rejeitar, restaurar), DELETE |
| `/api/admin/image-gen/run` | POST (gera uma imagem usando a cota do dia) |
| `/api/admin/image-gen/bulk` | POST (aprova pendentes com nota alta) |
| `/api/cron/image-gen` | GET (cron diário, exige `CRON_SECRET`) |
| `/api/videos` | GET, POST |
| `/api/videos/[id]` | GET, PUT, DELETE |
| `/api/videos/upload` | POST |
| `/api/videos/[id]/like` | POST |
| `/api/videos/[id]/comments` | POST |
| `/api/videos/[id]/comments/[commentId]` | DELETE |
| `/api/lessons`, `/api/lessons/[id]` | GET, POST / GET, PUT, DELETE |
| `/api/posts`, `/api/posts/[id]` | GET, POST / PUT, DELETE |
| `/api/posts/image-upload` | POST |
| `/api/posts/[id]/answers` | GET, POST |
| `/api/answers/[answerId]` | PATCH |
| `/api/image-quiz` | GET, POST |
| `/api/cquoi/arena` | GET (ranking, online, convites e duelos), POST (`heartbeat`, `leave`, `score`, `challenge`, `respond`) |
| `/api/progress` | GET, POST |
| `/api/gamification` | GET, PUT |
| `/api/live` | GET, POST |
| `/api/notifications/unread` | GET, POST |
| `/api/push/subscribe` | POST, DELETE |
| `/api/push/vapid-public-key` | GET |
| `/api/admin/stats` | GET |
| `/api/auth/[...nextauth]` | NextAuth |

## Configuração local

Requisitos: Node.js compatível com Next.js 16, uma instância MongoDB e uma conta Google Cloud com credenciais OAuth. Crie `.env.local` na raiz:

```env
MONGODB_URI=mongodb://localhost:27017/crioulo-app
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=uma-chave-secreta
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
ADMIN_EMAIL=admin@exemplo.com

# Uploads (vídeos, imagens de postagem e narração das histórias): Vercel Blob
BLOB_READ_WRITE_TOKEN=seu-token-do-vercel-blob

# Opcionais: Web Push (gerar com npx web-push generate-vapid-keys)
VAPID_PUBLIC_KEY=sua-chave-publica
VAPID_PRIVATE_KEY=sua-chave-privada
VAPID_SUBJECT=mailto:admin@exemplo.com

# Opcionais: aulas ao vivo via LiveKit
NEXT_PUBLIC_LIVEKIT_URL=wss://seu-projeto.livekit.cloud
LIVEKIT_API_KEY=sua-api-key
LIVEKIT_API_SECRET=sua-api-secret

# Imagens fora do projeto: Cloudflare R2 (plano gratuito)
R2_ACCOUNT_ID=seu-account-id
R2_ACCESS_KEY_ID=sua-access-key
R2_SECRET_ACCESS_KEY=sua-secret-key
R2_BUCKET=crioulo-imagens
ASSETS_BASE_URL=https://imagens.seudominio.com

# Geração de imagens por IA (painel /admin/imagens)
GEMINI_API_KEY=sua-chave-do-ai-studio
GEMINI_IMAGE_MODEL=gemini-nano-banana-2.1
GEMINI_TEXT_MODEL=gemini-3.8-flash
GEMINI_REVIEW_MODEL=gemini-3.5-flash-lite
IMAGE_GEN_DAILY_LIMIT=5
CRON_SECRET=segredo-do-cron
```

| Variável | Para que serve |
| --- | --- |
| `MONGODB_URI` | Conexão com o MongoDB (obrigatória) |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET` | NextAuth (obrigatórias) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Login com Google (obrigatórias) |
| `ADMIN_EMAIL` | E-mail da conta administradora |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob; necessário para enviar vídeos, imagens de postagem e a narração das histórias (lido automaticamente pelo SDK `@vercel/blob`) |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Push em segundo plano |
| `NEXT_PUBLIC_LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | Aulas ao vivo |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | Acesso ao bucket do Cloudflare R2 (envio das imagens geradas e migração) |
| `ASSETS_BASE_URL` | URL pública do bucket, sem barra final; ativa o repasse de `/ghibli`, `/c-quoi` e `/gen` para o R2 (vazio = usa `public/`) |
| `GEMINI_API_KEY` | Chave do Gemini para gerar e revisar imagens |
| `GEMINI_IMAGE_MODEL`, `GEMINI_TEXT_MODEL`, `GEMINI_REVIEW_MODEL` | Modelos de imagem, de texto (escreve o SVG) e leve (revisa a imagem e escolhe o objeto do C'est quoi ?). Opcionais; sem o último, usa o de texto |
| `IMAGE_GEN_DAILY_LIMIT` | Imagens por dia (padrão 5) |
| `CRON_SECRET` | Segredo do cron diário de geração (a Vercel o envia como Bearer) |

Mantenha `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, `BLOB_READ_WRITE_TOKEN`, `VAPID_PRIVATE_KEY` e `LIVEKIT_API_SECRET` apenas no servidor e fora do controle de versão.

Instale as dependências, opcionalmente carregue os dados iniciais e inicie o servidor:

```bash
npm install
npm run seed
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O seed cria/atualiza as lições (sempre como rascunho) e, se não houver nenhum vídeo, dois vídeos de exemplo; ele não substitui a ação administrativa de publicar e anunciar conteúdo.

### Requisitos do navegador

- **Gravar narração e estúdio de vídeo**: precisam de microfone/câmera, permissão do usuário e página em HTTPS (ou `localhost`).
- **Converter MP4 → MP3 e medir duração**: Web Audio API (Chrome, Edge, Firefox e Safari atuais). Arquivos grandes consomem memória: o áudio inteiro é decodificado antes de ser codificado em MP3. Se o navegador não conseguir, a tela informa o erro.
- **Exportar vídeo vertical**: `MediaRecorder` e `captureStream` (Chrome, Edge ou Firefox atuais).

## Notificações no Android

1. Configure as três variáveis VAPID no servidor e publique a aplicação em HTTPS.
2. Instale a aplicação pelo navegador Android compatível, por exemplo, Chrome, usando a opção de instalar/adicionar à tela inicial.
3. Entre na conta, abra o sino e selecione **Ativar notificações neste celular**; aceite a permissão. A inscrição é feita por dispositivo.
4. O push aparece como notificação do sistema quando o navegador entrega a mensagem. O badge do ícone é uma capacidade separada e depende do suporte do navegador e do launcher do aparelho.

Sem VAPID ou sem permissão, as notificações da central continuam disponíveis durante o uso do app, mas não há entrega push em segundo plano. O service worker registra notificações push e tenta definir/limpar o badge; tocar na notificação abre o app e limpa o badge.

## Scripts

- `npm run dev`: inicia o Next.js em desenvolvimento.
- `npm run build`: cria a build de produção.
- `npm run start`: inicia a build de produção.
- `npm run lint`: executa o ESLint.
- `npm run seed`: executa `src/seed/run.ts` para carregar os dados iniciais.
- `node scripts/storage/migrate-to-r2.mjs [--dry-run]`: envia `public/ghibli` e `public/c-quoi` para o R2, mantendo os caminhos.

## Deploy

O deploy exige as variáveis de ambiente adequadas para o ambiente de produção. Ao usar Google OAuth, configure no Google Cloud Console o callback `https://SEU-DOMINIO/api/auth/callback/google`. O Vercel Blob precisa estar configurado (`BLOB_READ_WRITE_TOKEN`) para os uploads. Para push em segundo plano, use HTTPS e configure as chaves VAPID. Para aulas ao vivo, configure as credenciais LiveKit. Para as imagens, configure as variáveis `R2_*` e `ASSETS_BASE_URL` (e rode a migração uma vez); para a geração por IA, defina `GEMINI_API_KEY` e `CRON_SECRET`, que habilita o cron diário do `vercel.json`.

## Licença

Projeto de uso interno/educacional, adaptável conforme as necessidades da equipe ou instituição responsável.
