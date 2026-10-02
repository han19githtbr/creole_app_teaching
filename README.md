# Kreyòl Ayisyen — Plataforma de Ensino de Crioulo Haitiano

Plataforma web completa e moderna para o ensino do crioulo haitiano (*Kreyòl Ayisyen*). Possui painel do administrador, dashboard do aluno com lições e postagens, **estúdio de gravação de vídeos curtos em alta definição (com avatares/bonequinhos, fundos virtuais por IA, presets de clareza e luz de estúdio)**, **catálogo de aulas gravadas com curtidas e comentários**, agendamento de publicações, **aulas ao vivo via WebRTC (LiveKit)** e um **sistema completo de gamificação com jogo das imagens, efeitos sonoros sintetizados via Web Audio API, recompensas em moedas Goud e loja de títulos honoríficos**.

Todo o conteúdo da apostila original (28 páginas / 26 seções) já vem pré-carregado como lições estruturadas, prontas para visualização, edição ou expansão.

---

## 🚀 Tecnologias

| Camada | Tecnologia |
|---|---|
| **Frontend & Backend** | Next.js 16 (App Router + React 19 + Turbopack) |
| **Banco de dados** | MongoDB Atlas com Mongoose 9 |
| **Autenticação** | NextAuth.js (Google OAuth + controle de papéis JWT) |
| **Gravação de Vídeo** | HTML5 Canvas + MediaStream Recording API + Web Audio API |
| **IA & Recorte em Tempo Real** | Google MediaPipe Selfie Segmentation (servido localmente) |
| **Efeitos Sonoros** | Web Audio API sintetizada com compressor de dinâmica master (latência zero, offline) |
| **Live Streaming** | LiveKit Cloud (WebRTC em tempo real com chat e vídeo) |
| **Estilização & UI** | Tailwind CSS v4 + Suporte completo a Tema Claro/Escuro (Dark Mode) + Lucide Icons |
| **Deploy** | Vercel |

---

## ✨ Funcionalidades Principais

### 1. 🎬 Estúdio de Gravação de Vídeos Curtos (Admin) com Máxima Clareza
- **Gravação direta no navegador (até 10 minutos / 600s)**: grave vídeos de dicas rápidas, pronúncia ou explicações gramaticais sem precisar de softwares externos pesados.
- **Clareza Óptica e Captura em Alta Definição**:
  - **Captura nativa Full HD (1080p a 30/60 fps)** com formato panorâmico 16:9 e ativação automática de foco e exposição contínuos de hardware (`focusMode: continuous`).
  - **Seletor de Dispositivo de Câmera**: detecta e lista todas as webcams e dispositivos de captura conectados (`getAvailableVideoDevices()`), permitindo ao professor escolher sua webcam externa Full HD ou câmera USB de alta qualidade em vez da câmera interna de baixa resolução do notebook.
  - **Presets de Nitidez e Tratamento de Imagem em Tempo Real**:
    - 💡 **Estúdio Luminoso** (Recomendado): ilumina a face de forma equilibrada e revitaliza o tom de pele natural (`brightness: 106%`, `contrast: 106%`, `saturate: 106%`).
    - ✨ **Nitidez & Contraste Pro**: realce refinado de contornos e traços faciais para nitidez óptica superior.
    - 🌅 **Calor Tropical / Haiti**: tons dourados radiantes com calor caribenho.
    - 🎬 **Clean / Cinematográfico**: visual neutro, límpido e profissional.
    - 📹 **Original da Câmera**: imagem crua sem pós-processamento.
  - **Luz Frontal Virtual de Estúdio (*Ring Light Virtual*)**: vinheta difusa suave desenhada diretamente no canvas para preencher sombras indesejadas no rosto do apresentador como uma luz de estúdio profissional.
  - **Taxa de Bits (Bitrate) Configurável**:
    - **Ultra HD Pro (12 Mbps vídeo / 256 kbps áudio)**: sem compressão visível, movimentos perfeitos em Full HD 1080p.
    - **Alta Definição (8 Mbps vídeo / 192 kbps áudio)**: excelente nitidez balanceada.
    - **Web Balanceada (4 Mbps vídeo / 128 kbps áudio)**: tamanho reduzido para conexões mais lentas.
- **Timer inteligente com barra de progresso**: contador de tempo em tempo real com alertas visuais ao se aproximar dos 10 minutos e finalização automática.
- **Personalização de Mascotes / Avatares (Bonequinhos animados)**:
  - 📹 **Câmera Real (Webcam)**: use seu vídeo ao vivo com ou sem recorte.
  - 👨🏿‍🏫 **Prof. Alex**: bonequinho de professor haitiano com terno, óculos e animação de fala reativa ao áudio do microfone.
  - 👩🏿‍🏫 **Profª. Marie**: bonequinha de professora carismática com turbante tradicional colorido (*Maré Tèt*).
  - 🌟 **Ti Kreyòl**: mascote alegre com chapéu de palha tradicional e expressões dinâmicas.
  - 🤖 **CreoleBot**: robô futurista assistente de ensino com visualizador de ondas de áudio.
  - 🎓 **Mestre Acadêmico**: personagem de professor clássico com capelo de formatura.
  - Todos os 5 bonequinhos possuem acabamento realista: pele com gradiente de luz/sombra, orelhas, sobrancelhas expressivas, brilho especular nos olhos, blush e sombra de contato.
- **Fundo Virtual em Tempo Real (Estilo Google Meet)**:
  - Recorte de fundo com MediaPipe servido localmente em `public/mediapipe/` (sem dependência de CDNs externos).
  - Opções: Sem fundo (câmera pura), Desfoque forte, Desfoque suave, Temas animados ou qualquer uma das 140 ilustrações do banco.
- **Personalização de Fundos / Temas visuais animados**:
  - Os temas são desenhados quadro a quadro no canvas (30fps), ficando gravados **diretamente dentro do próprio arquivo de vídeo exportado**.
  - **Clássicos**: 🇭🇹 Bandeira do Haiti, 🌅 Pôr do Sol no Caribe, 🧑‍🏫 Quadro de Sala de Aula, 🎙️ Estúdio Moderno, 🌴 Ilha Esmeralda, 🏰 Citadelle Laferrière.
  - **Temáticos**: 🌿 Natureza, ✈️ Turismo, 🎉 Festas, ❄️ Inverno, 🌧️ Chuva, 🏖️ Praia, 💻 Tecnologia, ✈️ Aeroporto, 🍲 Gastronomia, 🎬 Cinema, 🎭 Cultura, 🎓 Universidade.
- **Estilos de Enquadramento**:
  - Bordas arredondadas clássicas, *Picture-in-Picture (PiP)* flutuante circular, tela dividida (*split screen*), moldura *Glow* neon e faixa com o título do tópico.
- **Controles de gravação**: Iniciar, Pausar, Retomar, Concluir, Descartar e opção de **Baixar Cópia Local (.webm)**.
- **Áudio confiável na gravação e reprodução**:
  - Captura prioritária com cancelamento de eco e supressão de ruído; fallback automático para captura isolada de microfone caso a combinada falhe.
  - Trava de proteção que avisa se o microfone não for detectado, evitando gravações mudas por engano.
  - Player com desmutamento seguro e aviso contextual em gravações sem áudio.

---

### 2. 🎮 Jogo das Imagens, Gamificação & Recompensas

#### 🌟 Motor de Gamificação (`src/lib/gamification.ts`)
- **Níveis de Fluência Kreyòl (1 a 7)**:
  - 🐣 **Nivo 1: Inisyatè (Iniciante)** — 0 a 120 XP
  - 📘 **Nivo 2: Apranti (Aprendiz)** — 120 a 300 XP
  - 🧭 **Nivo 3: Eksploratè (Explorador)** — 300 a 600 XP
  - 💬 **Nivo 4: Konversatè (Conversador)** — 600 a 1.050 XP
  - 🌟 **Nivo 5: Konè Kreyòl (Conhecedor)** — 1.050 a 1.650 XP
  - 🏅 **Nivo 6: Mèt Lang (Mestre da Língua)** — 1.650 a 2.500 XP
  - 👑 **Nivo 7: Gran Mèt Kreyòl (Grão-Mestre)** — 2.500 a 4.000 XP
- **Economia de Moedas Goud**:
  - Moedas oficiais haitianas acumuladas por rodadas vencidas, bônus por vidas cheias e sequências de combos.
- **14 Conquistas e Insígnias (Badges)**:
  - 🎯 *Je Klè!* (Olhar Clínico): vencer na primeira tentativa com 3 corações intactos.
  - 💎 *Mèt Presizyon!* (Mestre da Precisão): 3 rodadas perfeitas consecutivas com 3 corações.
  - 🔥 *Sou Dife!* (Em Chamas): 3 acertos consecutivos.
  - ⚡ *Enpresyonan!* (Impressionante): 5 acertos consecutivos sem errar.
  - 👑 *Endomptab!* (Imbatível): sequência épica de 10 acertos seguidos.
  - 🌱 *Premye Viktwa!* (Primeira Vitória): primeira cena dominada.
  - 🎨 *Eksploratè Imaj*: 5 cenas distintas dominadas.
  - 🏛️ *Konè Kilti*: 15 cenas distintas na galeria.
  - 🌟 *Gran Mèt Galeri*: 30 cenas com riqueza de vocabulário.
  - 🏹 *Chasè Mo*: mais de 25 palavras identificadas.
  - 📚 *Diksyonè Vivant*: mais de 100 palavras identificadas em Kreyòl.
  - 💰 *Bourjwa Kreyòl*: 100 moedas Goud acumuladas.
  - 🪙 *Trezò Nasyonal*: 500 moedas Goud acumuladas.
  - 🇭🇹 *Nanm Ayisyen*: dominar cenas de temas históricos e culturais do Haiti.
- **Loja de Títulos Honoríficos (*Magazen Kreyòl*)**:
  - Os alunos podem utilizar suas moedas Goud para adquirir e equipar títulos exclusivos no perfil:
    - 🌱 *Inisyatè Kreyòl* (Iniciante — Gratuito)
    - 🤝 *Zanmi Ayiti* (Amigo do Haiti — 50 Gouds)
    - 🔥 *Flanm Kreyòl* (Chama Kreyòl — 100 Gouds)
    - 📜 *Anbasadè Lang* (Embaixador da Língua — 200 Gouds)
    - 🏰 *Gadyen Sitadèl* (Guardião da Citadelle — 350 Gouds)
    - 👑 *Gran Mèt Sajès* (Grão-Mestre da Sabedoria — 500 Gouds)
  - O título equipado é exibido com badge colorido no Dashboard do Aluno, no cabeçalho do jogo e na galeria de honra.

#### 🔊 Efeitos Sonoros Sintetizados (`src/lib/soundEffects.ts`)
- Sintetizador puro baseado na **Web Audio API**: funciona 100% offline, sem arquivos externos MP3/WAV pesados e com latência zero.
- **Compressor de Dinâmica Master**:
  - Nó `DynamicsCompressorNode` acoplado ao `GainNode` principal para eliminar qualquer distorção harmônica ou estouro de áudio durante múltiplos cliques rápidos.
- **Paleta Sonora Acústica e Expressiva**:
  - `playTap()`: clique orgânico tipo marimba caribenha com sutil micro-variação de afinação a cada toque.
  - `playUntap()`: som suave de gota d'água ao desmarcar palavra.
  - `playRoundStart()`: chime acolhedor em terça maior ao abrir uma nova cena.
  - `playSuccess()`: arpejo caribenho triunfante em dó maior com nona e harmônicos senoidais/triangulares.
  - `playPerfectRound()`: fanfarra majestosa com brilho celestial para vitórias de primeira tentativa com 3 vidas.
  - `playError()`: som educado e suave de erro (duas notas descendentes de marimba, sem ruídos ásperos).
  - `playHeartLost()`: impacto tátil com sub-grave e ting suave de vidro quebrado ao perder uma vida.
  - `playStreak(combo)`: fanfarra progressiva cuja frequência e brilho sobem proporcionalmente ao multiplicador de combo.
  - `playLevelUp()`: fanfarra orquestral triunfante ao subir de nível.
  - `playReward()`: cascata metálica de moedas Goud caindo e tilintando ritmicamente.
  - `playWhoosh()`: som suave de transição aérea ao abrir modais e ampliar imagens.
- **Controle de Volume e Mudo**:
  - Botão de som com controle de volume deslizante integrado e persistência no `localStorage`.

#### 🎨 Animações & Interatividade Visual
- Animação de tremor tátil (`@keyframes shake`) no container do jogo ao errar uma tentativa.
- Animação de quebra de coração (`@keyframes heart-crack`) que faz o coração pulsar, quebrar e desbotar ao perder uma vida.
- Pulsação de combo (`@keyframes combo-pulse`) com aura de fogo alaranjada para sequências de acertos.
- Efeito de brilho de insígnia (`@keyframes badge-glow`) nas conquistas recém-desbloqueadas.
- Chuva de confetes com físicas realistas de gravidade, rotação e dispersão (`Confetti.tsx`).
- Modal de zoom com ampliação cristalina da cena e suporte a visualização detalhada.
- Compartilhamento nativo no celular, Facebook e texto formatado para Instagram Stories.

---

### 3. 📅 Agendamento e Gestão de Vídeos
- **Publicação Imediata**: o vídeo fica disponível no catálogo assim que é salvo.
- **Agendamento de Publicação**: defina uma data e horário futuro (`publishAt`) para liberação automática. O vídeo só aparece para os alunos após o momento agendado.
- **Rascunho**: salve sem publicar para revisar ou editar mais tarde.
- **CRUD Completo de Vídeos**: o administrador pode criar (gravando no estúdio ou enviando arquivo MP4/WebM / informando link externo), editar título, descrição, enquadramento e excluir postagens.
- **Integração com Aulas Ao Vivo**: transforme gravações de lives em aulas gravadas no catálogo com um clique.

---

### 4. 📺 Área de Aulas Gravadas & Interação (Alunos)
- **Catálogo de Vídeos (`/dashboard/videos`)**:
  - Filtros interativos: *Todos*, *Dicas Rápidas (≤ 5 min)*, *Aulas Completas* e *Mais Curtidos*.
  - Busca instantânea por título e descrição.
  - Cards visuais com duração, contagem de curtidas, comentários, visualizações e avatar do tema.
- **Player de Vídeo Exclusivo (`/dashboard/videos/[id]`)**:
  - Player responsivo ambientado no tema de fundo e avatar selecionados pelo professor.
  - **Sistema de Curtidas (Likes)**: os alunos podem curtir e descurtir vídeos com animação e atualização em tempo real.
  - **Sistema de Comentários**: seção de comentários com foto de perfil, nome, data relativa (*"há 5 min"*, *"ontem"*), suporte a formatação e opção de exclusão pelo autor ou admin.
  - **Recomendações**: sugestões de outras aulas gravadas na barra lateral.

---

### 5. 📚 Lições e Conteúdo da Apostila
- **26 lições completas** divididas por categorias: *Gramática*, *Vocabulário*, *Diálogos*, *Exercícios*, *Cultura* e *Referência*.
- Editor Markdown com pré-visualização em tempo real.
- Sistema de anúncio de lições para notificar novos conteúdos aos alunos.

---

### 6. 📢 Avisos e Postagens do Professor
- Postagens permanentes ou com **data de expiração programada** (avisos expirados somem do feed dos alunos).
- Editor rico em Markdown, banco de imagens por tema e envio de imagens próprias.
- O banco reúne **14 temas com dez cenas SVG distintas por tema (140 imagens)**, produzidas localmente e estilizadas com iluminação quente e traços cinematográficos.
- Cada postagem com imagem pode oferecer um desafio de vocabulário em Kreyòl. Imagens do banco recebem opções e gabarito por tema; imagens próprias recebem dez palavras com marcação de gabarito pelo administrador.

---

### 7. 🔴 Aulas Ao Vivo (Live Streaming WebRTC)
- Transmissão ao vivo em tempo real via **LiveKit Cloud**.
- Vídeo, chat integrado, badges de status (*Online/Offline*) e controle de gravação.

---

### 8. 🌓 Dark Mode, Layout & Acessibilidade
- Seletor de tema **Claro / Escuro** integrado na barra de navegação com persistência local e inicialização sem *flash*.
- Card de Gamificação moderno inserido no topo do Dashboard do Aluno com barra de XP, moedas Gouds, combo, títulos e atalhos rápidos.
- Respeito integral a `prefers-reduced-motion` em todas as animações CSS e partículas do canvas.
- Componentes com contraste calibrado e suporte a navegação por teclado (`focus-visible`).

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                       # Landing page pública
│   ├── layout.tsx                     # Layout raiz com ThemeProvider, Navbar e PWA
│   ├── globals.css                    # Temas, variáveis CSS e keyframes de animação
│   ├── dashboard/                     # Área do Aluno
│   │   ├── page.tsx                   # Feed principal + GamificationCard + vídeos + lições
│   │   ├── jogo/page.tsx              # Jogo de identificação de vocabulário em imagens
│   │   ├── lessons/                   # Catálogo e visualização de lições
│   │   └── videos/                    # Catálogo e player de aulas gravadas
│   ├── admin/                         # Painel do Administrador (Protegido)
│   │   ├── page.tsx                   # Métricas gerais e atalhos rápidos
│   │   ├── lessons/                   # CRUD de lições
│   │   ├── posts/                     # CRUD de postagens de avisos
│   │   ├── live/                      # Controle da transmissão ao vivo
│   │   └── videos/                    # Gestão de vídeos e gravações
│   │       ├── record/page.tsx        # Estúdio de gravação com Full HD e clareza óptica
│   │       ├── new/page.tsx           # Upload de arquivo ou link de vídeo
│   │       └── [id]/edit/page.tsx     # Edição de metadados e agendamento
│   ├── live/                          # Sala de aula ao vivo para os alunos
│   └── api/                           # Endpoints REST (Next.js App Router)
├── components/                        # Componentes reutilizáveis
│   ├── AchievementsModal.tsx          # Modal de Conquistas e Loja de Títulos Honoríficos
│   ├── Confetti.tsx                   # Efeito festivo de confetes com físicas no canvas
│   ├── GamificationCard.tsx           # Card do Aluno (XP, Nível, Título, Gouds, Combo)
│   ├── ImageQuizGame.tsx              # Jogo das Imagens, vidas, sons, zoom e recompensas
│   ├── RewardUnlockModal.tsx          # Modal de celebração para novos Níveis e Badges
│   ├── StudioVideoRecorder.tsx        # Estúdio com Clareza Óptica, Câmeras, Ring Light e IA
│   ├── Navbar.tsx                     # Barra de navegação com links e ThemeToggle
│   ├── VideoCard.tsx                  # Card de vídeo com tema e estatísticas
│   ├── VideoPlayer.tsx                # Player com moldura e temas personalizados
│   └── ui/                            # Botões, Cards, Badges, Inputs, Selects, Textareas
├── hooks/                             # Custom React Hooks
│   └── useGamification.ts             # Hook reativo com estado de XP, Badges, Gouds e Títulos
├── lib/                               # Motores e utilitários da aplicação
│   ├── cameraEnhancer.ts              # Clareza óptica, detecção de câmeras, ring light e bitrates
│   ├── gamification.ts                # Níveis (1 a 7), 14 badges, economia de Gouds e títulos
│   ├── soundEffects.ts                # Web Audio API com compressor master e sintetizadores
│   ├── virtualBackground.ts           # Segmentação por IA MediaPipe com filtros de imagem
│   ├── videoThemes.ts                 # Definição de fundos animados, avatares e molduras
│   ├── imageBank.ts                   # Banco com 140 ilustrações em 14 temas
│   ├── imageQuiz.ts                   # Gabaritos e conferência segura no servidor
│   ├── mongodb.ts                     # Conexão otimizada com cache no Mongoose
│   ├── auth.ts                        # Configuração do NextAuth
│   └── livekit.ts                     # Geração de tokens LiveKit WebRTC
├── models/                            # Modelos Mongoose (MongoDB)
│   ├── User.ts                        # Usuários e papéis (admin / user)
│   ├── Lesson.ts                      # Lições da apostila
│   ├── Post.ts                        # Postagens do professor
│   ├── LiveSession.ts                 # Sessões de live
│   └── VideoLesson.ts                 # Aulas gravadas, curtidas, comentários e agendamento
└── seed/                              # Script para popular o banco de dados
    ├── lessons.ts                     # 26 lições extraídas da apostila
    └── run.ts                         # Script de execução do seed
```

---

## 🛠️ Configuração e Execução Local

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente (`.env.local`)
Crie o arquivo `.env.local` na raiz do projeto com base no modelo abaixo:

```env
# Banco de dados MongoDB Atlas
MONGODB_URI="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/crioulo_app?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aleatoria-base64"

# Google OAuth (Google Cloud Console)
GOOGLE_CLIENT_ID="seu-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# E-mail do Administrador (terá acesso a /admin)
ADMIN_EMAIL="seu-email@gmail.com"

# LiveKit Cloud (Opcional para aulas ao vivo)
LIVEKIT_API_KEY="sua-livekit-api-key"
LIVEKIT_API_SECRET="sua-livekit-api-secret"
NEXT_PUBLIC_LIVEKIT_URL="wss://seu-projeto.livekit.cloud"
```

### 3. Popular o banco com as lições e vídeos iniciais
```bash
npm run seed
```

### 4. Executar em modo de desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento Next.js com Turbopack.
- `npm run build`: Cria a build de produção otimizada com verificação estática de tipos.
- `npm run start`: Inicia o servidor de produção após o build.
- `npm run lint`: Executa a verificação de código com ESLint.
- `npm run seed`: Popula o MongoDB com as 26 lições da apostila e exemplos de vídeos.

---

## 🌐 Deploy na Vercel

1. Suba o código para o GitHub / GitLab.
2. No painel da Vercel, crie um novo projeto importando o repositório.
3. Em **Settings > Environment Variables**, cadastre todas as variáveis de ambiente do seu `.env.local` (ajustando `NEXTAUTH_URL` para a URL final na Vercel).
4. No Google Cloud Console, adicione `https://SEU-DOMINIO.vercel.app/api/auth/callback/google` às **Authorized redirect URIs**.
5. Conclua o deploy e execute `npm run seed` apontando para o seu MongoDB de produção.
