# Arquitetura

## Visão Geral

Katando Cifras é um PWA litúrgico para consulta e gestão de cifras com suporte offline. A partir da v2.0, os dados são persistidos em nuvem (MongoDB Atlas) e expostos via API serverless no Vercel, mantendo o `localStorage` como cache/fallback para uso offline. A v3.0 adicionou login com Google (OAuth próprio + JWT), tornando os repertórios pessoais por usuário.

## Stack Tecnológica

### Frontend

- React 19 + TypeScript
- Mantine UI
- Vite + vite-plugin-pwa (Workbox)
- Hospedagem: Vercel (produção em `main`)

### Backend (v2.0+)

- Vercel API Routes (serverless functions em `api/`)
- Compiladas como CommonJS via `api/tsconfig.json`
- MongoDB Atlas M0 (free tier, GCP São Paulo)
- Driver oficial `mongodb` (sem ORM)

### Autenticação (v3.0)

- Login com Google (OAuth 2.0) via backend próprio — sem Clerk/Firebase
- `api/auth/google` redireciona ao Google; `api/auth/callback` troca o code por
  tokens, faz upsert do usuário na coleção `users` e emite um JWT de sessão
- JWT guardado em cookie `httpOnly` `Secure` `SameSite=Lax` (30 dias)
- `api/lib/jwt.ts` assina/verifica o token; `api/lib/auth.ts` expõe
  `requireAdmin()` e `requireUser()`
- Papel de admin definido pela variável `ADMIN_EMAIL`
- Catálogo de cifras público; repertórios e escrita de cifras exigem login

## Estrutura Arquitetural

```text
Katando Cifras

Frontend (React PWA)
├── React + TypeScript + Mantine UI
├── Vite + vite-plugin-pwa
├── localStorage (cache offline)
└── src/services/ (repositórios: API → localStorage)

Backend (Vercel Serverless)
├── api/songs/index.ts      GET (público) / POST (admin)
├── api/songs/[id].ts       GET (público) / PUT, DELETE (admin) / PATCH (público — accessCount)
├── api/setlists/index.ts   GET, POST (login — filtra por userId)
├── api/setlists/[id].ts    GET (público) / PUT, DELETE (login — dono ou admin)
├── api/auth/google.ts      GET — redireciona ao Google OAuth
├── api/auth/callback.ts    GET — troca code, upsert user, emite JWT
├── api/auth/me.ts          GET — usuário logado (lê cookie)
├── api/auth/logout.ts      POST — apaga cookie
└── api/lib/
    ├── mongodb.ts           Singleton de conexão
    ├── jwt.ts               Sign/verify JWT + cookie de sessão
    └── auth.ts              requireAdmin() / requireUser()

Banco de Dados
└── MongoDB Atlas M0 — database: katando-cifras
    ├── collection: songs
    ├── collection: setlists
    └── collection: users
```

## Modelo de Domínio

### Song

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Gerado pelo Atlas |
| `legacyId` | string (UUID) | Presente nas cifras migradas do seed |
| `title` | string | |
| `artist` | string | |
| `key` | string | Tom original (ex: `G`, `Am`) |
| `category` | string | Categoria musical |
| `liturgy` | string? | Momento litúrgico (Entrada, Ofertório…) |
| `content` | string | Cifra com marcadores `[Acorde]` |
| `referenceUrl` | string? | Link externo de referência |
| `accessCount` | number | Incrementado a cada abertura |
| `createdAt` / `updatedAt` | Date | |

### Setlist (Repertório)

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Gerado pelo Atlas |
| `legacyId` | string (UUID) | Migrado do localStorage |
| `name` | string | |
| `date` | string? | Data da celebração (ISO 8601) |
| `songIds` | string[] | IDs na ordem definida pelo usuário |
| `userId` | string | `googleId` do dono (filtra a listagem) |
| `createdAt` / `updatedAt` | Date | |

### User

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Gerado pelo Atlas |
| `googleId` | string | `sub` do Google — chave de identificação |
| `email` | string | |
| `name` | string | Nome de exibição |
| `picture` | string | URL do avatar |
| `role` | `"admin" \| "user"` | Admin = email igual a `ADMIN_EMAIL` |
| `createdAt` / `updatedAt` | Date | |

## Estratégia Offline

- `fetchSongs()` e `fetchSetlists()` persistem o resultado no `localStorage`
- Componentes iniciam com os dados do `localStorage` (renderização instantânea) e atualizam após o fetch
- Se a API estiver indisponível, o app continua funcionando com os dados em cache
- Service Worker (Workbox) faz cache dos assets estáticos

## Identificadores: ObjectId vs UUID legado

Cifras inseridas pelo seed carregam `legacyId` (UUID v4). As rotas `[id].ts` aplicam filtro duplo:

```typescript
const filter = ObjectId.isValid(id)
  ? { _id: new ObjectId(id) }
  : { legacyId: id };
```

## Estrutura de Pastas

```text
cifras-manager/
├── api/                    Vercel serverless functions
│   ├── auth/              google, callback, me, logout
│   ├── lib/mongodb.ts + auth.ts + jwt.ts
│   ├── songs/index.ts + [id].ts
│   ├── setlists/index.ts + [id].ts
│   └── tsconfig.json       CJS, node16, ignoreDeprecations
├── src/
│   ├── app/               Router e rotas
│   ├── components/        Componentes compartilhados
│   ├── contexts/          UserContext (useUser)
│   ├── data/              Seed estático (fallback offline)
│   ├── features/          Pages por domínio
│   ├── hooks/
│   ├── services/          songRepository, setlistRepository
│   ├── styles/
│   └── types/
├── scripts/
│   ├── seed.ts            Popula o MongoDB com o catálogo inicial
│   └── migrate-setlists.ts  Associa setlists órfãos ao admin
└── docs/
```
