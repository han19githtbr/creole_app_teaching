# Kreyòl Ayisyen: Plataforma de ensino do crioulo haitiano

Aplicação web em Next.js para ensinar Kreyòl Ayisyen. Inclui área do aluno, administração de conteúdo, lições, postagens, vídeos, aulas ao vivo, notificações e recursos de gamificação.

## Visão geral

- Autenticação Google com NextAuth e papéis `admin` e `user`.
- Lições em rascunho, com publicação e anúncio controlados pelo administrador.
- Dashboard do aluno com progresso, feed e central de notificações.
- Postagens com expiração, quizzes/respostas e revisão pelo administrador.
- Vídeos com likes, comentários, gravação no navegador e agendamento de publicação.
- Aulas ao vivo com LiveKit quando configurado.
- PWA com service worker, suporte offline básico e Web Push opcional.
- Gamificação com XP, moedas Goud, níveis, conquistas, títulos e jogo de imagens.
- Fundo virtual em gravações com MediaPipe.

## Stack

- Next.js 16, React 19 e TypeScript
- MongoDB com Mongoose
- NextAuth.js e Google OAuth
- Tailwind CSS
- LiveKit para aulas ao vivo
- Web Push, Service Worker e Badging API
- MediaPipe Selfie Segmentation

## Visibilidade das lições

Lições novas são rascunhos (`isPublished: false`) por padrão. Para uma lição aparecer para alunos, ela precisa estar publicada **e** ter sido anunciada (`announcedAt` preenchido). Publicar sem anunciar não a torna visível no catálogo, na página da lição nem nas listas do aluno. O anúncio é uma ação explícita do administrador.

O mesmo critério é usado nas listagens de lições, na página individual e nos dados de progresso/novidades destinados aos alunos. Administradores podem consultar o conteúdo sem esse filtro.

## Funcionalidades

### Aluno

- Dashboard com progresso, conteúdo recente e destaques.
- Catálogo de lições por categoria, busca e conteúdo em Markdown.
- Registro de conclusão/progresso das lições.
- Feed de postagens, envio de respostas e consulta de vídeos.
- Likes e comentários em vídeos.
- Central de notificações não lidas para lições, postagens e vídeos.
- Sala ao vivo se as credenciais LiveKit estiverem configuradas.

### Administrador

- Criar e editar lições, controlar publicação e anunciar conteúdo.
- Criar e gerenciar postagens e vídeos, incluindo expiração/agendamento disponíveis.
- Configurar o jogo de palavras por imagem: adicionar, corrigir ou remover opções (de 2 a 20 palavras únicas) e definir quais são respostas corretas.
- Revisar respostas dos alunos.
- Controlar sessões ao vivo.

### Notificações, PWA e badge

- O sino mostra itens não lidos dentro do app; a contagem é consultada ao abrir/retornar ao app e periodicamente enquanto ele está aberto.
- Web Push pode entregar notificações em segundo plano. É necessário configurar VAPID e cada usuário/dispositivo precisa ativar as notificações no sino e conceder permissão ao navegador.
- O service worker tenta atualizar o badge do ícone com a Badging API ao receber push; com o app aberto, o app também sincroniza o badge usando a contagem da central.
- O número ou ponto no ícone depende do suporte do navegador, da instalação como PWA e do launcher Android. Não é garantido que todo aparelho mostre um número.
- Há também fallback de favicon e título com contagem enquanto a página está aberta; esses fallbacks não substituem o badge do ícone da tela inicial.
- Observação da implementação atual: o cálculo do contador enviado junto ao push não exige `announcedAt` para lições, enquanto a central de notificações exige. Por isso, em alguns casos, o badge recebido em segundo plano pode divergir da contagem mostrada dentro do app.

### Vídeos e gamificação

- Estúdio de gravação com câmera, microfone e opções de fundo virtual.
- Publicação e agendamento de vídeos, likes e comentários.
- XP, moedas Goud, níveis, conquistas e títulos honoríficos.
- A evolução da gamificação é salva por conta e sincronizada entre dispositivos autenticados; mudanças feitas offline são mantidas no navegador e reenviadas quando a conexão volta.
- Quiz de imagens com feedback visual e sonoro.
- Nas postagens com imagem, as palavras e o gabarito podem ser ajustados no editor; corrigir a grafia de uma resposta marcada mantém essa palavra como correta.

## Estrutura principal

```text
src/
├── app/          # Rotas, páginas e endpoints da API
├── components/   # Componentes da interface
├── hooks/        # Hooks React
├── lib/          # Autenticação, banco, push, gamificação e utilitários
├── models/       # Modelos Mongoose
├── seed/         # Dados e execução do seed
└── types/        # Tipos compartilhados
public/
├── icons/        # Ícones PWA
├── mediapipe/    # Arquivos do modelo de segmentação
└── sw.js         # Service worker
```

## Configuração local

Requisitos: Node.js compatível com Next.js 16 e uma instância MongoDB. Crie `.env.local` na raiz:

```env
MONGODB_URI=mongodb://localhost:27017/crioulo-app
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=uma-chave-secreta
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
ADMIN_EMAIL=admin@exemplo.com

# Opcionais: Web Push (gerar com npx web-push generate-vapid-keys)
VAPID_PUBLIC_KEY=sua-chave-publica
VAPID_PRIVATE_KEY=sua-chave-privada
VAPID_SUBJECT=mailto:admin@exemplo.com

# Opcionais: aulas ao vivo via LiveKit
NEXT_PUBLIC_LIVEKIT_URL=wss://seu-projeto.livekit.cloud
LIVEKIT_API_KEY=sua-api-key
LIVEKIT_API_SECRET=sua-api-secret
```

`MONGODB_URI`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` e as credenciais OAuth do Google são necessários para executar o fluxo principal de autenticação e dados. `ADMIN_EMAIL` identifica a conta administradora. As chaves VAPID são necessárias para push em segundo plano; as credenciais LiveKit são necessárias para aulas ao vivo. Mantenha `VAPID_PRIVATE_KEY` e `LIVEKIT_API_SECRET` apenas no servidor.

Instale dependências, opcionalmente carregue os dados iniciais e inicie o servidor:

```bash
npm install
npm run seed
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O seed não substitui a ação administrativa de publicar e anunciar conteúdo.

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

## Deploy

O deploy exige as variáveis de ambiente adequadas para o ambiente de produção. Ao usar Google OAuth, configure no Google Cloud Console o callback `https://SEU-DOMINIO/api/auth/callback/google`. Para push em segundo plano, use HTTPS e configure as chaves VAPID. Para aulas ao vivo, configure as credenciais LiveKit.

## Licença

Projeto de uso interno/educacional, adaptável conforme as necessidades da equipe ou instituição responsável.
