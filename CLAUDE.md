# Katando Cifras — Contexto para Claude Code

## O projeto

PWA litúrgico para consulta e gestão de cifras musicais (Missas Católicas).  
Stack: React 19 + TypeScript + Mantine UI + Vite + Vercel API Routes + MongoDB Atlas M0.  
Repositório: `main` é produção. Domínio: `katandocifras.com.br`.

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
  (`requireAuth()` legado por senha mantido só para `api/auth/verify.ts`)

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

## Variáveis de ambiente no Vercel

| Variável | Uso |
|---|---|
| `MONGODB_URI` | Conexão ao Atlas |
| `JWT_SECRET` | Assina o JWT de sessão |
| `GOOGLE_CLIENT_ID` | OAuth Google |
| `GOOGLE_CLIENT_SECRET` | OAuth Google |
| `APP_URL` | `https://katandocifras.com.br` (monta o redirect_uri) |
| `ADMIN_EMAIL` | `krasuz@gmail.com` — recebe role admin no login |
| `SEED_KEY` | Autoriza o endpoint de seed |
| `ADMIN_PASS` | Legado v2.0 — só usado por `api/auth/verify.ts` (pode remover) |
| `VITE_ADMIN_PASS` | Legado — não utilizada |

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

## Pendências / legado a limpar

- `api/auth/verify.ts` e `src/services/authStore.ts` — sobras da v2.0, sem uso
  no fluxo atual; podem ser removidos
- `ADMIN_PASS` / `VITE_ADMIN_PASS` no Vercel — removíveis após apagar `verify.ts`

## Estrutura de pastas relevante

```
api/
  auth/  google.ts callback.ts me.ts logout.ts  verify.ts(legado)
  lib/   jwt.ts auth.ts mongodb.ts
  songs/ index.ts + [id].ts
  setlists/ index.ts + [id].ts
src/
  contexts/UserContext.tsx
  features/management/AdminGate.tsx
  features/setlist/SetlistListPage.tsx
  components/MainNavigation.tsx
scripts/ seed.ts migrate-setlists.ts
```
