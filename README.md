# Kreyòl Ayisyen: plataforma de ensino do crioulo haitiano

Aplicação web em Next.js para ensinar Kreyòl Ayisyen. Reúne área do aluno, administração de conteúdo, lições, postagens com imagem e jogo de palavras, vídeos, **histórias narradas**, aulas ao vivo, notificações e gamificação. A interface é toda em português do Brasil.

## Sumário

- [Visão geral](#visão-geral)
- [Stack](#stack)
- [Histórias narradas](#histórias-narradas)
- [Visibilidade das lições](#visibilidade-das-lições)
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
- **Histórias**: uma cena ilustrada + narração em Kreyòl (gravada, enviada ou convertida de MP4) + legendas em Kreyòl e português, com exportação de vídeo vertical e rótulos visuais dos elementos posicionados de forma clara para cada cena.
- Aulas ao vivo com LiveKit, quando configurado.
- Fundo virtual (MediaPipe) na gravação de vídeos e nas aulas ao vivo.
- PWA com service worker, página offline e Web Push opcional.
- Gamificação com XP, moedas Goud, níveis, conquistas e títulos.

## Stack

- Next.js 16, React 19 e TypeScript
- MongoDB com Mongoose
- NextAuth.js (Google OAuth, sessão JWT)
- Tailwind CSS 4
- Vercel Blob (uploads de vídeo, imagem de postagem e narração das histórias)
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
- **Posicionamento visual dos rótulos**: cada cena tem um layout específico para que os nomes dos elementos fiquem acima dos objetos e não escondam a imagem nem a legenda principal. A experiência foi refinada para manter a leitura clara em todas as ilustrações do banco, sem sobreposição visual.
- **Cena**: zoom suave (de 100% a 105%) e leve deriva distribuídos por **toda** a narração, qualquer que seja a duração. A barra de progresso e o contador `mm:ss / mm:ss` usam a duração real.
- **Legendas no formulário**: ao enviar/gravar/converter a narração, se o roteiro ainda estiver vazio, os trechos são criados já dentro da duração (cerca de um por minuto, no máximo 12). O botão **Redistribuir tempos** divide os trechos existentes igualmente pela duração. Os tempos aceitam décimos de segundo.
- **Na troca da narração**, os momentos dos elementos voltam à divisão automática (eles pertenciam ao áudio anterior). As legendas são mantidas; revise os tempos com **Redistribuir tempos**.

### Exportação do vídeo vertical

No player, **Baixar vídeo vertical** gera um vídeo 9:16 (1080×1920) com a cena, o título, os elementos, as legendas e a barra de progresso.

- O vídeo é gravado **em tempo real** no navegador (canvas + `MediaRecorder`), portanto demora tanto quanto a narração. Mantenha a aba aberta e visível: se ela ficar em segundo plano, a exportação é cancelada para não gerar um vídeo fora de sincronia.
- Os rótulos dos elementos seguem o layout específico da cena durante toda a narração, preservando clareza e fluidez na experiência visual do usuário final.
- Os quadros são desenhados a partir do relógio do áudio, não do relógio de parede.
- O formato é MP4 quando o navegador consegue gravar MP4 (Chrome e Edge recentes); caso contrário, WebM, com um aviso para converter antes de publicar no Instagram.
- É necessário um navegador com `MediaRecorder` e `captureStream` (Chrome, Edge ou Firefox atuais).
- Textos longos de legenda quebram em linhas e diminuem de tamanho (com reticências em último caso) para caber no quadro.

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

## Visibilidade das lições

Lições novas são rascunhos (`isPublished: false`) por padrão. Para uma lição aparecer para alunos, ela precisa estar publicada **e** ter sido anunciada (`announcedAt` preenchido). Publicar sem anunciar não a torna visível no catálogo, na página da lição nem nas listas do aluno. O anúncio é uma ação explícita do administrador.

O mesmo critério é usado nas listagens de lições, na página individual e nos dados de progresso/novidades destinados aos alunos. Administradores podem consultar o conteúdo sem esse filtro.

## Funcionalidades

### Aluno

- Painel com progresso, conteúdo recente e destaques.
- Catálogo de lições por categoria, busca e conteúdo em Markdown; registro de conclusão.
- Feed de postagens com imagem, resposta à legenda/pergunta e jogo de palavras na imagem.
- Vídeos com likes e comentários.
- **Histórias** narradas, com legendas em português e/ou Kreyòl, exportação em vídeo vertical e destaque dos elementos da cena em sincronia com o áudio.
- Jogo de imagens (`/dashboard/jogo`).
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
- O jogo de imagens concede XP e Goud, com bônus por acertar de primeira e por sequência de vitórias.

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
│   ├── admin/        # Painel do administrador (lições, postagens, respostas, vídeos, histórias, ao vivo)
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
| `src/components/StoryPlayer.tsx` | Player e exportação do vídeo vertical |
| `src/app/api/stories/**` | Listagem, criação, edição, exclusão e upload do áudio |

### Endpoints da API

| Rota | Métodos |
| --- | --- |
| `/api/stories` | GET, POST |
| `/api/stories/[id]` | GET, PUT, DELETE |
| `/api/stories/upload` | POST |
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

## Deploy

O deploy exige as variáveis de ambiente adequadas para o ambiente de produção. Ao usar Google OAuth, configure no Google Cloud Console o callback `https://SEU-DOMINIO/api/auth/callback/google`. O Vercel Blob precisa estar configurado (`BLOB_READ_WRITE_TOKEN`) para os uploads. Para push em segundo plano, use HTTPS e configure as chaves VAPID. Para aulas ao vivo, configure as credenciais LiveKit.

## Licença

Projeto de uso interno/educacional, adaptável conforme as necessidades da equipe ou instituição responsável.
