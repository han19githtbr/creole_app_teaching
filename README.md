# Kreyòl Ayisyen — Plataforma de ensino do crioulo haitiano

Aplicação web em Next.js para ensinar Kreyòl Ayisyen com painel de administrador, dashboard do aluno, lições estruturadas, postagens, vídeos, aulas ao vivo e gamificação.

## Visão geral

O projeto combina:
- autenticação com Google via NextAuth
- controle de papéis (`admin` / `user`)
- cadastro de lições com fluxo de rascunho/publicação
- dashboard do aluno com progresso e notificações
- aulas gravadas com likes e comentários
- postagens com expiração e respostas dos alunos
- aulas ao vivo via LiveKit
- PWA e Web Push para avisos e badge
- jogo de imagens com recompensas e nível de fluência

## Status atual do produto

As lições agora são criadas como rascunho por padrão. Elas só ficam visíveis para os alunos quando o administrador marca a opção “Publicada” na tela de edição/criação da lição.

Esse comportamento está implementado em:
- `src/models/Lesson.ts`
- `src/app/api/lessons/route.ts`
- `src/app/admin/lessons/LessonForm.tsx`

## Stack

- Next.js 16
- React 19
- TypeScript
- MongoDB + Mongoose
- NextAuth.js
- Tailwind CSS
- LiveKit
- Web Push / Service Worker
- Google MediaPipe (para recorte de fundo em gravação)

## Funcionalidades implementadas

### Painel do aluno
- dashboard principal com resumo de progresso, lições e destaques
- catálogo de lições por categoria
- busca por título
- página individual da lição com conteúdo em Markdown
- registro de progresso da lição
- feed de postagens e respostas do aluno
- área de vídeos com listagem, likes e comentários
- aula ao vivo quando o ambiente LiveKit estiver configurado

### Painel do administrador
- CRUD de lições
- controle de `isPublished` e `announcedAt`
- criação/edição de postagens
- gestão de vídeos
- respostas dos alunos para revisão
- controle de live session

### Notificações e PWA
- contador de itens ainda não vistos
- central de notificações
- badge do aplicativo quando suportado
- Web Push para lições, postagens e vídeos
- leitura de notificações por categoria ou total

### Vídeos e gravação
- estúdio de gravação no navegador
- suporte a câmera, microfone e fundo virtual
- upload e publicação de vídeos
- agendamento de publicação por data/hora
- likes e comentários

### Gamificação
- nível de fluência
- XP e moedas Goud
- conquistas
- loja de títulos honoríficos
- jogo de imagens com feedback visual e sonoro

## Estrutura principal

```text
src/
├── app/
│   ├── admin/
│   ├── api/
│   ├── dashboard/
│   ├── live/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── hooks/
├── lib/
├── models/
├── seed/
├── types/
└── app/
```

## Requisitos de ambiente

Crie um arquivo `.env.local` na raiz do projeto com valores reais:

```env
MONGODB_URI=mongodb://localhost:27017/crioulo-app

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta

GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
ADMIN_EMAIL=admin@exemplo.com

VAPID_PUBLIC_KEY=sua_chave_publica_vapid
VAPID_PRIVATE_KEY=sua_chave_privada_vapid
VAPID_SUBJECT=mailto:admin@exemplo.com

NEXT_PUBLIC_LIVEKIT_URL=wss://seu-livekit-url
LIVEKIT_API_KEY=sua_api_key
LIVEKIT_API_SECRET=sua_api_secret
```

### Observações
- `ADMIN_EMAIL` define quem terá papel de administrador ao entrar com o Google.
- `MONGODB_URI` é obrigatório.
- LiveKit, Web Push e PWA podem ficar desabilitados gracefuly se não forem configurados, mas recursos dependentes deles só funcionarão com as variáveis corretas.

## Como rodar

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Se quiser popular o banco com conteúdo inicial:

```bash
npm run seed
```

## Como usar

1. Faça login com sua conta Google.
2. Se o email estiver em `ADMIN_EMAIL`, o usuário entra como administrador.
3. No painel de administração, cadastre ou edite lições.
4. Marque a lição como `Publicada` para que ela apareça para os alunos.
5. Opcionalmente, marque `Anunciar aos alunos` para gerar o aviso de nova lição.

## Importante sobre publicação de lições

A publicação não é automática. A regra atual é:
- nova lição = rascunho
- admin publica = visível para usuários
- admin anuncia = dispara o aviso de novidade

Isso foi feito para evitar que conteúdo seja exibido antes da aprovação do professor.

## Licença

Este projeto é de uso interno/educacional e pode ser adaptado conforme a necessidade da equipe ou instituição responsável.
│   ├── VideoPlayer.tsx                # Player com moldura e temas personalizados
│   └── ui/                            # Botões, Cards, Badges, Inputs, Selects, Textareas
├── hooks/                             # Custom React Hooks
│   ├── useNotifications.ts            # Gerenciamento de notificações não lidas e Badging API
│   └── useGamification.ts             # Hook reativo com estado de XP, Badges, Gouds e Títulos
├── lib/                               # Motores e utilitários da aplicação
│   ├── badgeManager.ts                # Badging API nativa, Service Worker e Favicon dinâmico
│   ├── cameraEnhancer.ts              # Clareza óptica, detecção de câmeras, ring light e bitrates
│   ├── gamification.ts                # Níveis (1 a 7), 14 badges, economia de Gouds e títulos
│   ├── soundEffects.ts                # Web Audio API com compressor master e sintetizadores
│   ├── virtualBackground.ts           # Segmentação por IA MediaPipe com filtros de imagem
│   ├── videoThemes.ts                 # Definição de fundos animados, avatares e molduras
│   ├── imageBank.ts                   # Banco com 140 ilustrações em 14 temas
│   ├── imageQuiz.ts                   # Gabaritos e conferência segura no servidor
│   ├── mongodb.ts                     # Conexão otimizada com cache no Mongoose
│   ├── auth.ts                        # Configuração do NextAuth
│   ├── pushNotifications.ts           # Envio VAPID e cálculo de badge por usuário
│   └── livekit.ts                     # Geração de tokens LiveKit WebRTC
├── models/                            # Modelos Mongoose (MongoDB)
│   ├── User.ts                        # Usuários, papéis e timestamps de visualização
│   ├── AppPushSubscription.ts          # Assinaturas Web Push por usuário/dispositivo
│   ├── Lesson.ts                      # Lições da apostila com controle de publicação e anúncio
│   ├── Post.ts                        # Postagens do professor com expiração e quiz
│   ├── PostAnswer.ts                  # Respostas enviadas pelos alunos às postagens
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

# Web Push (opcional; gere com: npx web-push generate-vapid-keys)
VAPID_PUBLIC_KEY="chave-publica-gerada"
VAPID_PRIVATE_KEY="chave-privada-gerada"
VAPID_SUBJECT="mailto:seu-email@dominio.com"

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

## 📱 Notificações no Celular (Android / PWA)

1. Gere um par de chaves uma vez com `npx web-push generate-vapid-keys`. Configure `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` e `VAPID_SUBJECT` no servidor; mantenha a chave privada somente no servidor.
2. Publique em HTTPS e instale o app pelo Chrome/Edge no Android usando **Adicionar à tela inicial** ou **Instalar aplicativo**.
3. No sino da aplicação, escolha **Ativar notificações neste celular** e aceite a permissão do navegador. Cada dispositivo precisa fazer essa ativação uma vez.
4. Conteúdos publicados são exibidos na central e enviados como push. A Badging API mostra a contagem no ícone quando navegador e launcher oferecem suporte; ao abrir um aviso ou usar **Ler todas**, o badge é recalculado.
5. Sem as chaves ou a permissão, o sino e a consulta periódica continuam funcionando enquanto o app está aberto, mas não há push em segundo plano. A exibição numérica no ícone depende do navegador, da instalação como PWA e do launcher Android.

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
