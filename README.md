# Kreyòl Ayisyen — Plataforma de Ensino

Plataforma web completa para ensino do crioulo haitiano (Kreyòl Ayisyen): painel do
administrador, dashboard do aluno, gestão de conteúdos (lições e postagens) e aulas
ao vivo via WebRTC. Todo o conteúdo da apostila (28 páginas / 26 seções) já vem
pré-carregado como lições, prontas para editar, publicar ou remover pelo admin.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend + Backend | Next.js 16 (App Router) |
| Banco de dados | MongoDB Atlas (Mongoose) |
| Autenticação | NextAuth.js com Google OAuth |
| UI | Tailwind CSS v4 + componentes próprios (estilo shadcn/ui) |
| Live streaming | LiveKit (WebRTC) |
| Deploy | Vercel |

## Funcionalidades

- **Login com Google** — qualquer pessoa pode entrar; apenas o e-mail definido em
  `ADMIN_EMAIL` tem acesso ao painel de administrador.
- **26 lições completas**, extraídas da apostila e organizadas por categoria
  (Gramática, Vocabulário, Diálogos, Exercícios, Cultura, Referência), com
  navegação anterior/próxima e busca/filtro por categoria.
- **CRUD completo de lições e postagens** pelo admin, com editor Markdown +
  pré-visualização.
- **Postagens com expiração** — o admin escolhe se um aviso é permanente ou
  expira em uma data específica; postagens expiradas somem do feed dos alunos.
- **Aulas ao vivo (LiveKit/WebRTC)** — o admin liga a transmissão, escolhe
  gravar ou não, e os alunos entram automaticamente na sala quando ela está no ar.
  Inclui vídeo, chat de texto e controles de câmera/microfone integrados.
- **Painel administrativo** com métricas (lições, postagens ativas, usuários).

## Configuração passo a passo

### 1. Instalar dependências

```bash
npm install
```

### 2. MongoDB Atlas

1. Crie uma conta gratuita em [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Crie um **cluster gratuito (M0)**.
3. Em **Database Access**, crie um usuário de banco com senha.
4. Em **Network Access**, adicione `0.0.0.0/0` (ou o IP do seu servidor) à whitelist.
5. Em **Database > Connect > Drivers**, copie a *connection string* (formato
   `mongodb+srv://usuario:senha@cluster.mongodb.net/...`).
6. Cole essa string em `MONGODB_URI` no seu `.env.local` (crie o arquivo a partir
   de `.env.example`), incluindo o nome do banco, por exemplo
   `.../crioulo_app?retryWrites=true&w=majority`.

### 3. Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um projeto (ou use um existente).
3. Vá em **APIs & Services > OAuth consent screen** e configure a tela de
   consentimento (tipo "Externo" funciona para testes).
4. Vá em **APIs & Services > Credentials > Create Credentials > OAuth client ID**.
   - Tipo de aplicativo: **Web application**.
   - **Authorized redirect URIs**:
     - Local: `http://localhost:3000/api/auth/callback/google`
     - Produção: `https://SEU-DOMINIO.vercel.app/api/auth/callback/google`
5. Copie o **Client ID** e o **Client Secret** para `GOOGLE_CLIENT_ID` e
   `GOOGLE_CLIENT_SECRET` no `.env.local`.

### 4. Definir o administrador

No `.env.local`, defina:

```
ADMIN_EMAIL="seu-email@gmail.com"
```

Apenas esta conta Google terá acesso a `/admin`. Se quiser trocar o admin depois,
basta atualizar a variável — o próximo login com esse e-mail é promovido
automaticamente.

### 5. NextAuth secret

Gere um valor aleatório e coloque em `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Em desenvolvimento, `NEXTAUTH_URL="http://localhost:3000"`. Em produção, use a URL
pública do site.

### 6. LiveKit (aulas ao vivo)

> As aulas ao vivo usam LiveKit Cloud (WebRTC), que tem um **plano gratuito**
> suficiente para testes e turmas pequenas.

1. Crie uma conta em [livekit.io](https://livekit.io) (LiveKit Cloud).
2. Crie um projeto e copie:
   - **API Key** → `LIVEKIT_API_KEY`
   - **API Secret** → `LIVEKIT_API_SECRET`
   - **WebSocket URL** (algo como `wss://seu-projeto.livekit.cloud`) →
     `NEXT_PUBLIC_LIVEKIT_URL`
3. Sem essas variáveis configuradas, o app funciona normalmente (login, lições,
   postagens, painel admin) — apenas a sala de vídeo ao vivo fica indisponível
   e mostra um aviso explicando o que falta configurar.

> **Gravação de aulas:** o toggle "Gravar esta aula" já existe na interface do
> admin e fica salvo no banco de dados. A gravação real dos arquivos de vídeo
> requer um destino de armazenamento (ex.: Amazon S3 ou Google Cloud Storage)
> integrado ao LiveKit Egress, o que não está configurado nesta v1 — é a próxima
> etapa natural quando você tiver uma conta de armazenamento em nuvem.

### 7. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 8. Popular o banco com as 26 lições da apostila

Com `MONGODB_URI` já configurado no `.env.local`:

```bash
npm run seed
```

Isso cria (ou atualiza, se já existirem) as 26 lições da apostila, uma por seção,
já publicadas e na ordem correta. Rodar de novo é seguro — o script identifica
as lições pelo número da seção e atualiza o conteúdo em vez de duplicar.

### 9. Deploy na Vercel

1. Suba o projeto para um repositório Git (GitHub, GitLab, etc.) — `node_modules`,
   `.next` e `.env*` já estão no `.gitignore`.
2. Em [vercel.com](https://vercel.com), importe o repositório.
3. Em **Settings > Environment Variables**, adicione todas as variáveis do
   `.env.example` com os valores reais (inclusive `NEXTAUTH_URL` apontando para o
   domínio da Vercel).
4. Atualize o **Authorized redirect URI** no Google Cloud Console para incluir o
   domínio de produção (veja passo 3 acima).
5. Faça o deploy. Depois do primeiro deploy, rode `npm run seed` uma vez
   apontando `MONGODB_URI` para o banco de produção (pode ser feito localmente,
   já que o Atlas é acessível pela internet).

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                # Landing page
│   ├── dashboard/               # Área do aluno
│   │   ├── page.tsx             # Feed de postagens + status da live
│   │   └── lessons/             # Lista e detalhe das lições
│   ├── admin/                   # Área do administrador (protegida)
│   │   ├── page.tsx             # Métricas + ações rápidas
│   │   ├── lessons/             # CRUD de lições
│   │   ├── posts/                # CRUD de postagens
│   │   └── live/                 # Painel de controle da live
│   ├── live/                    # Sala de aula ao vivo (aluno)
│   └── api/                     # Rotas de API (lessons, posts, live, auth, stats)
├── components/                  # Componentes de UI reutilizáveis
├── lib/                         # auth.ts, mongodb.ts, livekit.ts, utils.ts
├── models/                      # Schemas Mongoose (User, Lesson, Post, LiveSession)
└── seed/                        # Conteúdo das 26 lições + script de seed
```

## Papéis de usuário

- **Aluno** (qualquer login Google): acessa `/dashboard`, lê lições e postagens,
  entra na aula ao vivo quando ela está no ar (apenas assiste — câmera e
  microfone ficam desligados por padrão para os alunos).
- **Administrador** (e-mail em `ADMIN_EMAIL`): tudo o que o aluno vê, mais acesso
  a `/admin` para criar, editar e excluir lições e postagens, e controlar a
  transmissão ao vivo (é quem publica vídeo/áudio na sala).

## Cobertura do conteúdo da apostila

As 26 seções da *Apostila Completa de Kreyòl Ayisyen* foram todas migradas para
lições estruturadas em Markdown (tabelas, notas de aula, exercícios e gabarito
inclusos):

1. O que é o Kreyòl Ayisyen · 2. "Crioulo" não é uma língua só · 3. Gramática
comparada · 4. Pronúncia, alfabeto e ortografia · 5. Pronomes pessoais em frases
· 6. Determinantes, plural e demonstrativos · 7. Possessivos · 8. Verbos, tempo
e aspecto · 9. Negação, perguntas e conectores · 10. Adjetivos, advérbios e
comparações · 11. Números, horas e calendário · 12. Família e vida cotidiana ·
13. Alimentação, compras e mercado · 14. Hotel e hospedagem · 15. Aeroporto,
transporte e direções · 16. Turismo e atendimento ao visitante · 17. Saúde e
emergência · 18. Cumprimentos e conversas completas · 19. Cultura, etiqueta e
provérbios · 20. Cristianismo e vocabulário bíblico · 21. Banco de exercícios
(8 estilos) · 22. Plano de 20 aulas · 23. Avaliação final da estudante · 24.
Gabarito completo · 25. Guia rápido — 60 frases essenciais · 26. Referências
para aprofundamento.

Depois de rodar `npm run seed`, confira em `/admin/lessons` que as 26 lições
aparecem e, se quiser, ajuste formatação, divida seções muito longas (a 21 é a
maior, com os 16 exercícios) ou adicione imagens pelo editor Markdown.

## Scripts disponíveis

```bash
npm run dev     # ambiente de desenvolvimento
npm run build   # build de produção
npm run start   # servidor de produção (após build)
npm run lint    # ESLint
npm run seed    # popula/atualiza as 26 lições no MongoDB
```
