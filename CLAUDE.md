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
src/
  contexts/UserContext.tsx
  features/management/AdminGate.tsx
  features/setlist/ SetlistListPage.tsx SetlistDetailPage.tsx
  services/ setlistRepository.ts setlistShare.ts transposeChord.ts
  components/MainNavigation.tsx
scripts/ seed.ts migrate-setlists.ts
```
