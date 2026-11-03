# Katando Cifras — Contexto para Claude Code

## O projeto

PWA litúrgico para consulta e gestão de cifras musicais (Missas Católicas).  
Stack: React 19 + TypeScript + Mantine UI + Vite + Vercel API Routes + MongoDB Atlas M0.
Drag-and-drop de músicas via `@dnd-kit`.  
Repositório: `main` é produção. Domínio: `katandocifras.com.br`.

## Desenvolvimento local

- `pnpm dev` sobe **só o front** (Vite). Não há proxy de `/api`, então as rotas
  serverless em `api/` (login, repertórios, compartilhamento) dão 404 no
  localhost — funcionam apenas mudanças de front (HMR).
- `vercel dev` sobe front **e** as funções `api/` juntas. Precisa das variáveis
  de ambiente (`vercel env pull` gera um `.env`). Use isto para testar qualquer
  coisa que dependa do backend.
- Após instalar uma dependência nova, **reinicie o dev server** (o Vite
  pré-empacota deps na inicialização).

## Estado atual — v3.0 (concluída)

Login com Google via backend próprio (sem Clerk/Firebase). Catálogo público,
setlists e gestão de cifras requerem login.

### Modelo de acesso

| Funcionalidade | Sem login | Com login |
|---|---|---|
| Consultar cifras, transpor, auto-scroll | ✓ | ✓ |
| Receber repertório via link | ✓ | ✓ |
| Criar/editar repertórios | ✗ | ✓ |
| Gestão de cifras (admin) | ✗ | ✓ (só admin) |

### Autenticação (OAuth próprio + JWT)

- `api/auth/google.ts` — redireciona para o Google OAuth (state CSRF em cookie)
- `api/auth/callback.ts` — troca code por tokens, faz upsert do usuário em `users`,
  gera JWT de sessão em cookie httpOnly. Admin = email igual a `ADMIN_EMAIL`.
- `api/auth/me.ts` — retorna usuário logado (lê cookie)
- `api/auth/logout.ts` — apaga cookie
- `api/lib/jwt.ts` — sign/verify JWT, parse/set/clear cookie de sessão
- `api/lib/auth.ts` — `requireAdmin()` e `requireUser()` por role no JWT

### Frontend

- `src/contexts/UserContext.tsx` — `UserProvider` + hook `useUser()`; busca
  `/api/auth/me` na montagem. Envolve o app em `src/main.tsx`.
- `AdminGate.tsx` — botão "Entrar com Google", libera só quando `role === "admin"`
- `SetlistListPage.tsx` — gate de login antes de listar repertórios
- `MainNavigation.tsx` — avatar + logout (ou botão "Entrar")
- `setlistRepository.ts` — `credentials: "include"` em todos os fetch

### Backend de dados

- `api/setlists/` — exige login; lista/cria filtrando por `userId` (= googleId).
  GET por id é público (compartilhamento por link). Mutações exigem dono ou admin.
  POST aceita `sourceId` (id do repertório original quando é cópia de um link).
- `api/songs/` — escrita protegida por `requireAdmin` (substituiu Bearer senha)

### Coleção `users` no Atlas

```
{ googleId, email, name, picture, role: "admin" | "user", createdAt, updatedAt }
```

### Migração executada

Os 2 setlists da v2.0 sem `userId` foram associados ao admin via
`scripts/migrate-setlists.ts` (`pnpm migrate:setlists`). O script busca o admin
por `ADMIN_EMAIL` e carimba `userId` nos órfãos. Nota: força DNS público
(`dns.setServers`) porque o c-ares do Node recusa a query SRV do Atlas em
algumas redes.

## v3.1 — compartilhamento, reordenação e ajustes de UX

### Compartilhamento por referência (não duplica mais)

O modelo antigo embutia o repertório na URL (`?importar=<base64>`) e criava uma
cópia a cada abertura. Agora o link é a **rota de detalhe por id**
(`#/repertorios/<id>`), apontando para o repertório real no servidor.

- `buildShareUrl` (em `setlistShare.ts`) devolve `#/repertorios/<id>`. As
  funções de encode/decode/pending-import foram removidas; sobraram
  `stashPendingShare`/`takePendingShare` (guardam o id na sessão para reabrir o
  link após o login, já que o OAuth sempre volta para `APP_URL`).
- `Setlist` ganhou `sourceId?` (id do original). Cópias salvas o carregam para
  **deduplicar**: se o usuário já salvou aquele link, a página oferece "abrir
  minha cópia" em vez de duplicar.
- `setlistRepository.ts`: `fetchSetlistById(id)` (GET público) + cache **em
  memória** (`adhocSetlists`) para visualizar repertórios de terceiros sem
  poluir a lista pessoal; `getSetlistById` consulta os dois caches;
  `createSetlist` aceita `sourceId`.
- `SetlistDetailPage.tsx`: decide `isOwner` (o id está na lista do usuário).
  Não-dono vê em **modo leitura** (só "Iniciar") com bloco "Salvar nos meus" /
  "Entrar para salvar"; **botões de edição só aparecem para o dono**.
- `App.tsx`: removido todo o modal/fluxo de import por payload; ao voltar do
  login reabre o link compartilhado pendente.

### Repertório: renomear + reordenar arrastando

- Ícone de lápis no cabeçalho (só dono) abre modal para editar nome/data
  (`updateSetlist`).
- As setas ↑/↓ foram substituídas por **drag** com `@dnd-kit`: toque longo no
  mobile (`TouchSensor`, delay 220ms) e clique-arraste no PC (`PointerSensor`,
  8px), `KeyboardSensor` para acessibilidade. `onDragEnd` reordena via
  `arrayMove` e persiste com `updateSetlist`. `moveSongUp/Down` removidas.

### Pinça só ajusta a fonte

`SongPage.tsx`: o `touchmove` de 2 dedos virou não-passivo com `preventDefault()`
e os eventos `gesture*` do WebKit (iOS Safari ignora `user-scalable=no`) são
barrados — some a barra de arrasto horizontal. Reforço `touch-action: pan-y` no
container. O swipe horizontal de troca de música é JS, então não é afetado.

### Grafia enarmônica preservada

`transposeChord.ts`: com `steps === 0`, respeita a grafia digitada — um acorde
`Bb` não vira mais `A#` na prévia da Gestão nem na visualização padrão. A
transposição por N semitons segue derivando a grafia pela tonalidade.

## v3.2 — duas colunas, ênfase inline e trecho instrumental compacto

### Modo duas colunas (aproveitar telas largas)

Botão 1/2 colunas na toolbar da música (`IconColumns1`/`IconColumns2`), **só
aparece em telas ≥ 1024px** (notebook/desktop). A preferência é global e fica no
`localStorage` junto de fonte/velocidade.

- `useUserPreferences.ts`: nova pref `columns: 1 | 2` (default 1) + `setColumns`.
- `SongPage.tsx`: `useMediaQuery("(min-width: 1024px)")` (do `@mantine/hooks`)
  decide `wideScreen`; `activeColumns = wideScreen ? columns : 1` (em tela
  estreita força 1 coluna e esconde o botão, mas mantém a pref salva).
- `SongViewer.tsx`: em 2 colunas, envolve as seções num container com
  `column-count: 2`, `column-gap` e `column-rule` (divisória sutil); `maxWidth`
  sobe de 1200 → 1700px.
- `songViewerStyles.ts`: `break-inside: avoid` (+ prefixo WebKit) em `.section`
  para nenhuma seção ser cortada entre as colunas. Inócuo em 1 coluna.
- A rolagem/auto-scroll continua **vertical** — as colunas são balanceadas e
  sobem juntas, como um caderno. Vale também em tela cheia (escolha antes de
  entrar). O `Toolbar` recebe `columns`, `showColumns` e `onColumnsToggle`.

### Ênfase inline: **negrito** e _itálico_

Marcação estilo Markdown, resolvida no parser (funciona em toda a música,
inclusive atravessando acorde e em linhas cantadas):

- `**texto**` → negrito · `_texto_` → itálico.
- `parseLine.ts`: `applyInlineMarkup(tokens)` percorre os tokens já divididos
  por acordes mantendo o estado de negrito/itálico aberto, remove os marcadores
  e carimba `bold`/`italic` em cada trecho de texto. Estado **local à linha**
  (reinicia por linha; marcador não fechado só afeta a própria linha).
- `TextToken` e `MusicalChunk` (`types/music.ts`) ganharam `bold?`/`italic?`;
  `LineRenderer.tsx` propaga as flags por `buildChunks`/`expandToWordPieces` e
  aplica `fontWeight`/`fontStyle` no span da letra e nas linhas de texto puro.
- Dica de sintaxe adicionada ao campo Cifra em `SongForm.tsx` (o preview usa o
  mesmo `SongViewer`, então mostra tudo).
- Cuidado: `**` e `_` passam a ser sempre interpretados; um `_` literal numa
  letra antiga viraria itálico e sumiria (raro em pt-BR).

### Trecho instrumental sem linha de letra vazia

`LineRenderer.tsx`: numa linha **100% instrumental** (só acordes, `isInstrumental`),
o span de letra vazio deixou de ser renderizado — antes abria uma linha inteira
(`lineHeight 1.6`) embaixo dos acordes (o vão da introdução). Correção central,
vale para **qualquer seção**. Em linhas mistas o placeholder `" "` continua para
manter o alinhamento acorde↔sílaba.

## v3.3 — link de música resolvido por id, contador de usuários, ordem por data

### Link compartilhado abria a música errada (corrigido)

Um link `#/musicas/<id>` aberto num aparelho sem aquela cifra em cache exibia
**outra música**, sem aviso. A causa era um fallback silencioso na `SongPage`:

```ts
const selectedSong = getSongById(songId) ?? getAllSongs()[0];  // removido
```

`getSongById` lê só o `localStorage` (`cifras_songs`) e a `SongPage` nunca
chamava `fetchSongs` — quem busca da API é o `useSongCatalog`, usado apenas no
catálogo/home. Num cache ausente ou velho, o `?? getAllSongs()[0]` entregava a
primeira cifra da lista (a do seed: "Compadesse-te"). Pior: a contagem de
acesso era registrada com o id **da URL**, então a música certa somava acesso
enquanto a tela mostrava outra.

Resolução agora é **cache → rede → erro**:

- `songRepository.ts`: `fetchSongById(id)` usa o `GET /api/songs/[id]` (público,
  aceita ObjectId e UUID legado) e grava o resultado no cache via o novo
  `upsertCached` — o deep link conserta o cache sozinho. `createSong`/
  `updateSong` passaram a usar o mesmo helper.
- `SongNotFoundError` separa **404 confirmado** de **falha de rede**. São telas
  diferentes: "Cifra não encontrada" (saída: Ver catálogo) e "Não foi possível
  carregar" (saída: Tentar novamente, que também dispara `fetchSongs()` para
  revalidar o catálogo inteiro).
- `SongPage.tsx`: o cache é lido no render (`useMemo`), não espelhado em estado
  — trocar de música não passa por um frame "carregando" quando a cifra já é
  local. O estado `RemoteSong` carrega o `songId` junto, para um resultado nunca
  ser lido como se fosse de outra música; voltar para `idle` é o próprio
  gatilho do retry. `SongStatusScreen` (no fim do arquivo) desenha os três
  estados — a navegação principal fica escondida nessa rota, então cada estado
  oferece a própria saída.
- A contagem de acesso só dispara com a cifra resolvida.

### Quantidade de usuários na Gestão

`api/users/count.ts` (`GET`, `requireAdmin`) devolve `{ total }` — só o número,
nenhum dado pessoal (LGPD). `src/services/userRepository.ts` expõe
`fetchUserCount()`; a `ManagementPage` mostra o total ao lado de "N músicas
cadastradas", e esconde o contador se a chamada falhar.

### Catálogo ordenado por "Mais recentes" (novo padrão)

`Song` ganhou `createdAt?: string` (ISO 8601), mapeado em `mapApiSong` — as 177
cifras do Atlas já tinham o campo, sem migração. `SortOrder` ganhou
`"recentes"` e ele virou o default de `emptyFilters` no `useSongCatalog`
(o filtro salvo ainda manda no "voltar"). Datas ISO comparam lexicograficamente
na ordem cronológica; as 38 cifras do seed compartilham o timestamp da carga
inicial, então o **título desempata** para a ordem ser estável. O export
`songs.ts` da Gestão passou a incluir `createdAt` para o bundle offline não
perder a ordenação.

## v3.4 — a cifra aberta se revalida sozinha

### O problema

Corrigir uma cifra durante a missa, de outro aparelho, não chegava ao tablet que
estava sendo lido. A única saída era **limpar o cache do navegador** no tablet —
uma marreta que apaga todo o `localStorage`: repertórios, preferências de
fonte/rolagem/colunas e, pior, **todos os tons ajustados por música dentro do
repertório** (`cifras_setlist_transposes`).

Causa: só existia uma forma de atualizar o catálogo — `fetchSongs()`, que baixa
as 177 músicas (203 KB; 71 KB gzipado) e só dispara ao montar catálogo, Gestão ou
detalhe de repertório. **Nada revalidava a cifra aberta.** O `fetchSongById` da
v3.3 cobre a cifra *ausente* do cache, não a *desatualizada* — são caminhos
diferentes.

### Revalidação barata

- `api/songs/index.ts` e `api/songs/[id].ts`: `Cache-Control` passou de
  `no-store` para `no-cache`. `no-store` proibia guardar, o que anulava o ETag
  que a Vercel já emite; `no-cache` manda guardar e sempre revalidar, então o
  browser envia `If-None-Match` sozinho e recebe **304 sem corpo** quando nada
  mudou. Não se mexeu em `api/users/count.ts` nem em `api/auth/` — ali
  `no-store` é o correto.
- `Song` ganhou `updatedAt?` (ISO 8601), já presente nos 177 documentos.
- `revalidateSong(id)` em `songRepository.ts`: devolve a cifra nova (já no
  cache) ou `null` quando nada mudou — e também quando a rede falha ou dá 404,
  porque revalidação é oportunista e não pode virar erro na cara de quem está
  tocando. O `null` no caso "igual" é o que evita reescrever os ~186 KB do
  cache a cada checagem.

### Na SongPage

- A versão vinda da rede agora **vence** o cache lido na montagem (antes o
  `??` tinha a ordem inversa, e uma revalidação seria ignorada).
- Efeito novo revalida ao abrir a música e a cada `visibilitychange` para
  visível — que é o gesto do tablet voltando ao suporte. Como `revalidateSong`
  devolve `null` quando nada mudou, não há re-render nem risco de laço.
- A revalidação inicial só roda quando **há** cache: sem ele, o efeito de busca
  por ausência já está buscando a mesma cifra, e checar aqui seria uma segunda
  requisição. O listener de volta-ao-primeiro-plano vale nos dois casos.

**Risco aceito:** se o conteúdo trocar com o auto-scroll rodando, a altura muda e
a rolagem dá um salto. Foi escolha explícita (atualizar sem avisar). A
alternativa registrada é avisar antes de trocar.

### Dívidas conhecidas (mapeadas, não corrigidas)

- `SetlistDetailPage.tsx:128-131` descarta em silêncio `songIds` fora do cache
  (repertório de 6 mostra 2, renumerado); `handleStart` usa `songIds[0]` cru.
- `SongPage.tsx`: `indexOf` dando `-1` faz a seta ">" voltar para a primeira.
- `load()` (`songRepository.ts`) ressuscita música deletada que ainda está em
  `src/data/songs.ts` — latente enquanto as 38 do seed existirem no servidor.
- Botão "Atualizar agora" é inerte: `public/sw.js:8` chama `skipWaiting()` no
  `install`, então `reg.waiting` é sempre `null`.
- `tsconfig.app.json` sem `strict`/`strictNullChecks`/`noUncheckedIndexedAccess`
  — é o que deixa toda essa família de bug compilar limpo.

## Variáveis de ambiente no Vercel

| Variável | Uso |
|---|---|
| `MONGODB_URI` | Conexão ao Atlas |
| `JWT_SECRET` | Assina o JWT de sessão |
| `GOOGLE_CLIENT_ID` | OAuth Google |
| `GOOGLE_CLIENT_SECRET` | OAuth Google |
| `APP_URL` | `https://katandocifras.com.br` (monta o redirect_uri) |
| `ADMIN_EMAIL` | `krasuz@gmail.com` — recebe role admin no login |
| `SEED_KEY` | Legado — nenhum endpoint usa hoje (seed roda local por `pnpm seed`) |
| `ADMIN_PASS` | Legado v2.0 — código que a usava foi removido; removível do Vercel |
| `VITE_ADMIN_PASS` | Legado — não utilizada; removível do Vercel |

## Google Cloud (OAuth)

- Google Auth Platform → app "Externo" (publicado ou com usuários de teste)
- Cliente Web "Katando Web":
  - Origens JS: `https://katandocifras.com.br`, `https://www.katandocifras.com.br`
  - Redirect: `https://katandocifras.com.br/api/auth/callback`
- `www` deve redirecionar para o domínio raiz (o cookie de sessão é por domínio)

## LGPD

- Dados de usuário (googleId, email, name, picture) ficam no Atlas (São Paulo)
- A autenticação passa pelo Google (EUA) — mencionar na política de privacidade
- Coleta mínima — sem CPF, sem telefone

## Legado já removido

Limpeza pós-v3.0: apagados `api/auth/verify.ts`, `src/services/authStore.ts`,
`src/data/setlists.ts` (array vazio órfão) e a função `requireAuth` de
`api/lib/auth.ts`. O `songRepository.ts` passou a usar `credentials: "include"`
em vez de `authHeaders()`.

Pode-se remover do Vercel (sem impacto no código): `ADMIN_PASS`,
`VITE_ADMIN_PASS`, `SEED_KEY`.

## Estrutura de pastas relevante

```
api/
  auth/  google.ts callback.ts me.ts logout.ts
  lib/   jwt.ts auth.ts mongodb.ts
  songs/ index.ts + [id].ts
  setlists/ index.ts + [id].ts
  users/ count.ts
src/
  contexts/UserContext.tsx
  features/management/AdminGate.tsx
  features/setlist/ SetlistListPage.tsx SetlistDetailPage.tsx
  services/ setlistRepository.ts setlistShare.ts transposeChord.ts
            songRepository.ts userRepository.ts
  components/MainNavigation.tsx
scripts/ seed.ts migrate-setlists.ts
```
