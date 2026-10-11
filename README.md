# Kreyòl Ayisyen: plataforma de ensino do crioulo haitiano

Aplicação web em Next.js para ensinar Kreyòl Ayisyen. Reúne área do aluno, administração de conteúdo, lições, postagens com imagem e jogo de palavras, vídeos, **histórias narradas**, aulas ao vivo, notificações e gamificação. A interface é toda em português do Brasil.

## Sumário

- [Visão geral](#visão-geral)
- [Stack](#stack)
- [Histórias narradas](#histórias-narradas)
- [Indicador de carregamento](#indicador-de-carregamento)
- [Contraste sobre fundo azul](#contraste-sobre-fundo-azul)
- [Visibilidade das lições](#visibilidade-das-lições)
- [Imagens no Cloudflare R2](#imagens-no-cloudflare-r2)
- [Configuração das variáveis de imagens e IA](#configuração-das-variáveis-de-imagens-e-ia)
- [Geração de imagens por IA](#geração-de-imagens-por-ia)
- [Cores e legibilidade](#cores-e-legibilidade)
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
- **Histórias**: uma cena ilustrada + narração em Kreyòl (gravada, enviada ou convertida de MP4) + legendas em Kreyòl e português, com exportação de vídeo vertical, rótulos visuais dos elementos posicionados de forma clara para cada cena e legenda do player que o aluno pode arrastar pela tela.
- Aulas ao vivo com LiveKit, quando configurado.
- Fundo virtual (MediaPipe) na gravação de vídeos e nas aulas ao vivo.
- PWA com service worker, página offline e Web Push opcional.
- Gamificação com XP, moedas Goud, níveis, conquistas e títulos.
- Imagens no **Cloudflare R2** (fora do repositório) e **geração de novas imagens por IA** (limite de 5 por dia, revisão automática e aprovação no painel do administrador).

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
- **Posicionamento visual dos rótulos**: cada cena tem um layout específico para que os nomes dos elementos fiquem acima dos objetos e não escondam a imagem nem a legenda principal. A experiência foi refinada para manter a leitura clara em todas as ilustrações do banco, sem sobreposição visual.
- **Legenda móvel no player**: a caixa de legenda pode ser arrastada para qualquer ponto do quadro da cena, para que ela não esconda elementos da ilustração (detalhes em [Legenda móvel no player](#legenda-móvel-no-player)).
- **Cena**: zoom suave (de 100% a 105%) e leve deriva distribuídos por **toda** a narração, qualquer que seja a duração. A barra de progresso e o contador `mm:ss / mm:ss` usam a duração real.
- **Legendas no formulário**: ao enviar/gravar/converter a narração, se o roteiro ainda estiver vazio, os trechos são criados já dentro da duração (cerca de um por minuto, no máximo 12). O botão **Redistribuir tempos** divide os trechos existentes igualmente pela duração. Os tempos aceitam décimos de segundo.
- **Na troca da narração**, os momentos dos elementos voltam à divisão automática (eles pertenciam ao áudio anterior). As legendas são mantidas; revise os tempos com **Redistribuir tempos**.

### Legenda móvel no player

Na pré-visualização/player de **Histórias**, a caixa de legenda (Kreyòl e/ou português) pode ser movida pelo aluno, tanto no desktop quanto no celular. Esse recurso está em `src/components/StoryPlayer.tsx`.

- **Como mover**: arraste a caixa com o mouse, o dedo ou a caneta (Pointer Events). Há um ícone de "alça" no topo da caixa e o cursor muda para mão aberta/fechada. A caixa usa `touch-action: none`, então arrastá-la no celular não rola a página.
- **Teclado**: com foco na legenda (tecla `Tab`), as setas movem a caixa de 12 em 12 pixels.
- **Limites**: a legenda se move somente dentro do quadro da cena (a área da ilustração) e nunca sai dele. A posição é guardada em porcentagem do quadro, então acompanha o redimensionamento da janela ou a rotação do aparelho; e, quando a legenda muda de tamanho (a cada fala ou ao trocar o idioma **Ambas/Português/Kreyòl**), a posição é reencaixada para a caixa continuar inteira dentro do quadro.
- **Posição original**: antes de qualquer arrasto, a legenda fica no canto inferior direito. Depois de movida, aparece o botão **Reposicionar**, ao lado de **Legendas**, que devolve a caixa a essa posição.
- **Quando aparece**: a caixa só é exibida enquanto as legendas estão ativadas (botão **Legendas**) e existe uma fala ativa naquele instante da narração. Ela fica acima dos rótulos dos elementos da cena.
- **Persistência**: a posição fica apenas na memória da tela aberta. Não é salva no servidor nem no navegador e volta ao canto inferior direito ao recarregar a página ou abrir outra história.
- **Exportação**: a posição escolhida no player **não** é aplicada ao vídeo exportado; no vídeo vertical a legenda continua fixa na parte inferior do quadro.

### Exportação do vídeo vertical

No player, **Baixar vídeo vertical** gera um vídeo 9:16 (1080×1920) com a cena, o título, os elementos, as legendas e a barra de progresso.

- O vídeo é gravado **em tempo real** no navegador (canvas + `MediaRecorder`), portanto demora tanto quanto a narração. Mantenha a aba aberta e visível: se ela ficar em segundo plano, a exportação é cancelada para não gerar um vídeo fora de sincronia.
- Os rótulos dos elementos seguem o layout específico da cena durante toda a narração, preservando clareza e fluidez na experiência visual do usuário final.
- Os quadros são desenhados a partir do relógio do áudio, não do relógio de parede.
- O formato é MP4 quando o navegador consegue gravar MP4 (Chrome e Edge recentes); caso contrário, WebM, com um aviso para converter antes de publicar no Instagram.
- É necessário um navegador com `MediaRecorder` e `captureStream` (Chrome, Edge ou Firefox atuais).
- A legenda do vídeo exportado fica sempre na parte inferior do quadro, independentemente de onde o aluno a tenha arrastado no player.
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

Painel em **Admin → Imagens com IA** (`/admin/imagens`), para ampliar o conteúdo sem ficar preso ao número fixo de ilustrações.

**Fluxo**

1. O administrador cria um **pedido**: parte do app (Postagens, Histórias ou C'est quoi ?), tema (ou todos), quantidade (1 a 200) e motor.
2. O robô entrega no máximo **5 imagens por dia** (`IMAGE_GEN_DAILY_LIMIT`). A cota é um contador no MongoDB (dia de Brasília) compartilhado pelo cron diário e pelo botão "Gerar agora", então nunca passa do limite. Ex.: 10 imagens levam 2 dias.
3. Cada imagem é planejada, desenhada, **revisada automaticamente** (modelo de visão), guardada no R2 e cadastrada no MongoDB.
4. A revisão confere se os elementos obrigatórios estão visíveis, se não há texto/marca d'água e o estilo, dá uma nota de 0 a 10 e localiza cada elemento. Abaixo da nota mínima (7) a imagem fica **Rejeitada**; as demais ficam **Para aprovar**.
5. O administrador aprova na galeria (individualmente ou "Aprovar todas com nota ≥ 8,5"). Opcionalmente o pedido aprova sozinho as de nota alta. **Só imagens aprovadas aparecem para os alunos.**
6. O pedido pode ser pausado, retomado ou cancelado; erros da IA (cota, chave, modelo) aparecem no próprio pedido.

**Partes do app**

| Parte | O que é gerado | Onde aparece |
| --- | --- | --- |
| Postagens | Cena com 4 elementos em Kreyòl, legenda e desafio (10 palavras, 4 corretas) | Seletor de imagens das postagens e jogo de identificar elementos (sorteio e "próxima imagem") |
| Histórias | Cena com 4 elementos separados; as posições detectadas viram os rótulos animados | Seletor de imagens das histórias e player |
| C'est quoi ? | Um objeto novo em francês (artigo + nome, sem repetir os existentes) e a seta vermelha posicionada sobre ele | Direto no jogo `/dashboard/jogo`, junto com os itens atuais |

O vocabulário em Kreyòl **não é inventado pela IA**: os elementos saem do mesmo vocabulário revisado já usado pelo app (`imageSceneVariants.json` + dicionário de tradução). A IA só desenha e confere o desenho. As imagens antigas permanecem intactas e aparecem junto das novas (marcadas "✨ Nova · IA" no seletor).

**Motores**

- **Pintura Ghibli (Gemini, imagem):** melhor qualidade; saída em WebP 1200×800 (C'est quoi ?: 980×700, proporção 7:5 do jogo). Exige cota de imagem na sua chave do Gemini (confira no Google AI Studio). **Referência visual:** a cada geração, 2 ilustrações já existentes do mesmo tema (do banco `/ghibli` ou do C'est quoi ?) são convertidas em PNG e enviadas junto do prompt, com a instrução de imitar paleta, saturação, sombreado e simplicidade sem copiar a composição. Elas vêm de `public/` (se ainda existir) ou do bucket.
- **Vetor SVG (Gemini, texto):** o modelo de texto escreve o SVG no mesmo formato e viewBox das imagens atuais, usando uma ilustração existente do bucket como referência de estilo. O SVG passa por sanitização (sem scripts, `<image>`, `<text>`, links externos ou animações) e precisa renderizar. Qualidade mais simples; costuma ter cota gratuita.

**Execução**

- Cron diário (`vercel.json`, 09:00 UTC = 06:00 em Brasília) chama `GET /api/cron/image-gen` com `Authorization: Bearer $CRON_SECRET`.
- O botão "Gerar agora" produz uma imagem por requisição e repete até acabar a cota ou os pedidos (cada requisição fica curta).
- Erros de cota/chave/modelo/rede interrompem o lote e devolvem a chamada à cota; falhas de formato tentam de novo uma vez.

**Arquivos principais**

- `src/lib/imageGen/` — `config.ts` (seções, temas, limites), `prompts.ts` (planejamento e prompts), `gemini.ts` (cliente REST, Interactions API), `svg.ts` (sanitização), `pipeline.ts` (cota, geração, revisão, lote).
- `src/models/ImageGen.ts` — `GeneratedImage`, `ImageGenJob` e `ImageGenUsage`.
- `src/lib/generatedImages.ts` — leitura das imagens aprovadas no mesmo formato do banco estático; `src/hooks/useBankImage.ts` — resolve imagens geradas no cliente.
- `src/lib/r2.ts` — envio e remoção no R2.
- `src/app/admin/imagens/` e `src/app/api/admin/image-gen/**`, `src/app/api/cron/image-gen`, `src/app/api/generated-images`.

**Integrações em código existente:** `ImageBankPicker` (prop `section`), `PostForm` e `StoryForm`, `StoryPlayer`, `storyValidation.ts` (agora assíncrono e aceita imagens geradas aprovadas), `imageQuiz.ts` (`getQuizForImage`), `/api/image-quiz` (`image=random&exclude=`), `/dashboard/jogo` e `imageBank.ts` (aceita o prefixo `/gen/` e exporta `KREYOL_TO_PT`).

**Segurança:** as rotas do painel exigem administrador; a leitura pública exige login; SVGs gerados são sanitizados e servidos com cabeçalhos restritivos configurados em `next.config.ts` (a sanitização é a defesa principal).

## Cores e legibilidade

- Modo claro: `--text-muted` escurecido (`#a8a29e` → `#6b645e`) e `--border` reforçado, para que textos secundários e divisórias fiquem legíveis.
- Modo escuro: o azul do acento (`#280ed1`) quase desaparecia como cor de **texto** sobre o fundo preto; esses casos usam o tom claro (`--accent-hover`). Botões com fundo azul não mudam.
- O painel de imagens usa cores de alto contraste (notas em verde/âmbar/vermelho com texto branco ou preto, avisos com borda forte).

## Funcionalidades

### Aluno

- Painel com progresso, conteúdo recente e destaques.
- Catálogo de lições por categoria, busca e conteúdo em Markdown; registro de conclusão.
- Feed de postagens com imagem, resposta à legenda/pergunta e jogo de palavras na imagem.
- Vídeos com likes e comentários.
- **Histórias** narradas, com legendas em português e/ou Kreyòl (a caixa de legenda pode ser arrastada para qualquer ponto da cena), exportação em vídeo vertical e destaque dos elementos da cena em sincronia com o áudio.
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
| `src/components/StoryPlayer.tsx` | Player (incluindo a legenda arrastável) e exportação do vídeo vertical |
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
