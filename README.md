# Kreyòl Ayisyen — Plataforma de Ensino de Crioulo Haitiano

Plataforma web completa e moderna para o ensino do crioulo haitiano (*Kreyòl Ayisyen*). Possui painel do administrador, dashboard do aluno com lições e postagens, **estúdio de gravação de vídeos curtos (com avatares/bonequinhos e fundos personalizados)**, **catálogo de aulas gravadas com curtidas e comentários**, agendamento de publicações e **aulas ao vivo via WebRTC (LiveKit)**.

Todo o conteúdo da apostila original (28 páginas / 26 seções) já vem pré-carregado como lições estruturadas, prontas para visualização, edição ou expansão.

---

## 🚀 Tecnologias

| Camada | Tecnologia |
|---|---|
| **Frontend & Backend** | Next.js 16 (App Router + React 19) |
| **Banco de dados** | MongoDB Atlas com Mongoose |
| **Autenticação** | NextAuth.js (Google OAuth + controle de papéis JWT) |
| **Gravação de Vídeo** | HTML5 Canvas + MediaStream Recording API + Web Audio API |
| **Live Streaming** | LiveKit Cloud (WebRTC em tempo real com chat e vídeo) |
| **Estilização & UI** | Tailwind CSS v4 + Suporte completo a Tema Claro/Escuro (Dark Mode) + Lucide Icons |
| **Deploy** | Vercel |

---

## ✨ Funcionalidades Principais

### 1. 🎬 Estúdio de Gravação de Vídeos Curtos (Admin)
- **Gravação direta no navegador (até 10 minutos / 600s)**: grave vídeos de dicas rápidas, pronúncia ou explicações de gramática sem precisar de programas externos.
- **Timer inteligente com barra de progresso**: contador de tempo em tempo real com alertas visuais ao se aproximar dos 10 minutos e finalização automática.
- **Personalização de Mascotes / Avatares (Bonequinhos animados)**:
  - 📹 **Câmera Real (Webcam)**: use seu vídeo ao vivo.
  - 👨🏿‍🏫 **Prof. Alex**: bonequinho de professor haitiano com terno, óculos e animação de fala reativa ao áudio do microfone.
  - 👩🏿‍🏫 **Profª. Marie**: bonequinha de professora carismática com turbante tradicional colorido (*Maré Tèt*).
  - 🌟 **Ti Kreyòl**: mascote alegre com chapéu de palha tradicional e expressões dinâmicas.
  - 🤖 **CreoleBot**: robô futurista assistente de ensino com visualizador de ondas de áudio.
  - 🎓 **Mestre Acadêmico**: personagem de professor clássico com capelo de formatura.
- **Personalização de Fundos / Temas visuais**:
  - 🇭🇹 **Bandeira do Haiti**: gradiente azul e vermelho com padrão sutil.
  - 🌅 **Pôr do Sol no Caribe**: cores tropicais vibrantes.
  - 🧑‍🏫 **Quadro de Sala de Aula**: quadro negro clássico com moldura de madeira.
  - 🎙️ **Estúdio Moderno**: iluminação neon e estética de estúdio.
  - 🌴 **Ilha Esmeralda**: tons verdes tropicais caribenhos.
  - 🏰 **Citadelle Laferrière**: estética histórica em tons dourados e âmbar.
- **Estilos de Enquadramento**:
  - Bordas arredondadas clássicas, *Picture-in-Picture (PiP)* flutuante circular, tela dividida (*split screen*), moldura *Glow* neon e faixa com o título do tópico.
- **Controles de gravação**: Iniciar, Pausar, Retomar, Concluir, Descartar e opção de **Baixar Cópia Local (.webm)**.

---

### 2. 📅 Agendamento e Gestão de Vídeos
- **Publicação Imediata**: o vídeo fica disponível no catálogo assim que é salvo.
- **Agendamento de Publicação**: defina uma data e horário futuro (`publishAt`) para liberação automática. O vídeo só aparece para os alunos após o momento agendado.
- **Rascunho**: salve sem publicar para revisar ou editar mais tarde.
- **CRUD Completo de Vídeos**: o administrador pode criar (gravando no estúdio ou enviando arquivo MP4/WebM / informando link externo), editar título, descrição, enquadramento e excluir postagens.
- **Integração com Aulas Ao Vivo**: transforme gravações de lives em aulas gravadas no catálogo com um clique.

---

### 3. 📺 Área de Aulas Gravadas & Interação (Alunos)
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

### 4. 📚 Lições e Conteúdo da Apostila
- **26 lições completas** divididas por categorias: *Gramática*, *Vocabulário*, *Diálogos*, *Exercícios*, *Cultura* e *Referência*.
- Editor Markdown com pré-visualização em tempo real.
- Sistema de anúncio de lições para notificar novos conteúdos aos alunos.

---

### 5. 📢 Avisos e Postagens do Professor
- Postagens permanentes ou com **data de expiração programada** (avisos expirados somem do feed dos alunos).
- Editor rico em Markdown.

---

### 6. 🔴 Aulas Ao Vivo (Live Streaming WebRTC)
- Transmissão ao vivo em tempo real via **LiveKit Cloud**.
- Vídeo, chat integrado, badges de status (*Online/Offline*) e controle de gravação.

---

### 7. 🌓 Dark Mode & Acessibilidade
- Seletor de tema **Claro / Escuro** integrado na barra de navegação com persistência local e inicialização sem *flash*.
- Componentes estilizados com variáveis CSS para contraste e legibilidade ideais.

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                       # Landing page pública
│   ├── layout.tsx                     # Layout raiz com ThemeProvider, Navbar e PWA
│   ├── globals.css                    # Configuração de temas (Dark/Light) e Tailwind
│   ├── dashboard/                     # Área do Aluno
│   │   ├── page.tsx                   # Feed principal + vídeos recentes + lições
│   │   ├── lessons/                   # Catálogo e visualização de lições
│   │   └── videos/                    # Catálogo e player de aulas gravadas
│   │       ├── page.tsx               # Catálogo de vídeos gravados
│   │       ├── VideosGrid.tsx         # Grid interativo com filtros e busca
│   │       └── [id]/page.tsx          # Página da aula com player, likes e comentários
│   ├── admin/                         # Painel do Administrador (Protegido)
│   │   ├── page.tsx                   # Métricas gerais e ações rápidas
│   │   ├── lessons/                   # CRUD de lições
│   │   ├── posts/                     # CRUD de postagens de avisos
│   │   ├── live/                      # Controle da transmissão ao vivo
│   │   └── videos/                    # Gestão de vídeos e gravações
│   │       ├── page.tsx               # Tabela de vídeos (publicados, agendados, rascunhos)
│   │       ├── VideoTable.tsx         # Tabela de gerenciamento com ações
│   │       ├── record/page.tsx        # Estúdio de gravação de vídeos (até 10 min)
│   │       ├── new/page.tsx           # Upload de arquivo ou link de vídeo
│   │       └── [id]/edit/page.tsx     # Edição de metadados e agendamento
│   ├── live/                          # Sala de aula ao vivo para os alunos
│   └── api/                           # Endpoints REST (Next.js App Router)
│       ├── auth/[...nextauth]/        # Autenticação Google OAuth
│       ├── admin/stats/               # Estatísticas (lições, vídeos, posts, usuários)
│       ├── lessons/                   # API de lições
│       ├── posts/                     # API de postagens
│       ├── live/                      # API de status e tokens LiveKit
│       └── videos/                    # API de vídeos gravados
│           ├── route.ts               # Listagem e criação de vídeos
│           ├── upload/route.ts        # Upload de arquivos de gravação (.webm/.mp4)
│           └── [id]/
│               ├── route.ts           # Detalhe, edição e exclusão de vídeo
│               ├── like/route.ts      # Curtir / descurtir vídeo
│               └── comments/          # Adicionar e remover comentários
├── components/                        # Componentes reutilizáveis
│   ├── Navbar.tsx                     # Barra de navegação com links e ThemeToggle
│   ├── ThemeToggle.tsx                # Botão para alternar Modo Claro / Modo Escuro
│   ├── VideoCard.tsx                  # Card de vídeo com tema e estatísticas
│   ├── VideoPlayer.tsx                # Player com moldura e temas personalizados
│   ├── VideoLikeButton.tsx            # Botão de curtir com contagem e animação
│   ├── VideoCommentSection.tsx        # Lista e formulário de comentários
│   ├── StudioVideoRecorder.tsx        # Estúdio de gravação (Canvas, Avatares, Áudio)
│   ├── Markdown.tsx                   # Renderizador Markdown
│   └── ui/                            # Botões, Cards, Badges, Inputs, Selects, Textareas
├── lib/                               # Utilitários, conexões e configurações
│   ├── auth.ts                        # Configuração do NextAuth
│   ├── mongodb.ts                     # Conexão Mongoose com cache
│   ├── livekit.ts                     # Geração de tokens LiveKit
│   ├── videoThemes.ts                 # Definição dos fundos, avatares e molduras
│   └── lessonCategories.ts            # Categorias das lições
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

- `npm run dev`: Inicia o servidor de desenvolvimento Next.js.
- `npm run build`: Cria a build otimizada de produção.
- `npm run start`: Inicia o servidor de produção após a build.
- `npm run lint`: Executa a verificação estática com ESLint.
- `npm run seed`: Popula o MongoDB com as 26 lições da apostila e exemplos de vídeos.

---

## 🌐 Deploy na Vercel

1. Suba o código para o GitHub / GitLab.
2. No painel da Vercel, crie um novo projeto importando o repositório.
3. Em **Settings > Environment Variables**, cadastre todas as variáveis de ambiente do seu `.env.local` (ajustando `NEXTAUTH_URL` para a URL final na Vercel).
4. No Google Cloud Console, adicione `https://SEU-DOMINIO.vercel.app/api/auth/callback/google` às **Authorized redirect URIs**.
5. Conclua o deploy e execute `npm run seed` apontando para o seu MongoDB de produção.
