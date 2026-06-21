# Backend — Katando Cifras

Documento de referência para a implementação do backend. Criado em junho/2026 para orientar o desenvolvimento a partir da v1.1.

---

## Contexto

O projeto **Katando Cifras** é um PWA litúrgico de gestão de cifras musicais. Até a v1.1 toda a persistência é local (`localStorage` + seed em `src/data/songs.ts`). O objetivo do backend é migrar essa persistência para um banco de dados real, permitindo que o catálogo seja compartilhado entre dispositivos e gerenciado sem precisar editar arquivos de código.

---

## Stack escolhida

| Camada | Tecnologia | Plano | Observações |
|---|---|---|---|
| Frontend | React + Vite + Mantine | — | Sem mudança |
| Hosting frontend | Vercel | Hobby (free) | Deploy automático via GitHub main |
| API | Vercel API Routes | Hobby (free) | Serverless functions em `api/` |
| Banco de dados | MongoDB Atlas | M0 (free forever) | Não pausa; 512 MB |

### Por que essa stack

- **Vercel API Routes**: backend serverless no mesmo projeto e mesmo deploy. Sem servidor separado, sem segundo repositório, sem custo adicional.
- **MongoDB Atlas M0**: gratuito permanente, não pausa com inatividade (diferente do Supabase free). Modelo de documento se encaixa bem na estrutura das cifras (campos opcionais como `liturgy`, `referenceUrl`).
- **Monorepo**: API Routes vivem em `api/` na raiz do projeto, o frontend em `src/`. Nada da estrutura atual muda.

---

## Estrutura de pastas

```
cifras-manager/
  api/                        ← backend (novo)
    lib/
      mongodb.ts              ← singleton de conexão (connection pooling)
    songs/
      index.ts                ← GET /api/songs, POST /api/songs
      [id].ts                 ← GET /api/songs/:id, PUT /api/songs/:id, DELETE /api/songs/:id
    setlists/
      index.ts                ← GET /api/setlists, POST /api/setlists
      [id].ts                 ← GET, PUT, DELETE /api/setlists/:id
      [id]/songs.ts           ← POST /api/setlists/:id/songs (adicionar música)
  src/                        ← frontend existente (sem mudança)
  docs/
    backend.md                ← este arquivo
```

---

## Modelo de dados

### Coleção `songs`

```json
{
  "_id": "ObjectId",
  "title": "Cordeiro de Deus",
  "artist": "Músicas Católicas",
  "key": "G",
  "category": "Adoração",
  "liturgy": "Cordeiro",
  "content": "[G]Cordeiro de [D]Deus...",
  "accessCount": 12,
  "referenceUrl": "https://cifraclub.com.br/...",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

Campos opcionais: `liturgy`, `referenceUrl`. O campo `accessCount` pode migrar para uma coleção separada futuramente se houver multi-usuário.

### Coleção `setlists`

```json
{
  "_id": "ObjectId",
  "name": "Missa de Domingo",
  "date": "2026-06-22",
  "songIds": ["ObjectId", "ObjectId"],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

`songIds` mantém a ordem de apresentação. Mesmo padrão do modelo atual em `src/types/setlist.ts`.

---

## Conexão com MongoDB (padrão serverless)

Serverless functions não mantêm estado entre invocações. Sem cuidado, cada request abre uma nova conexão — o Atlas M0 suporta até 500 simultâneas. O padrão abaixo cacheia a conexão no escopo global do container enquanto ele está quente:

```ts
// api/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let client: MongoClient;

export async function getDb() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db('katando-cifras');
}
```

### Variável de ambiente necessária

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
```

Configurar em: Vercel Dashboard → Project Settings → Environment Variables.
Para desenvolvimento local: arquivo `.env.local` na raiz (já está no `.gitignore`).

---

## Fluxo de desenvolvimento

### Branch strategy

```
main          →  v1.1 em produção na Vercel (não toca até backend estável)
  └─ backend  →  Vercel gera preview automático a cada push
                 testar preview → merge na main quando estável
```

### Desenvolvimento local

Substituir `pnpm dev` por `vercel dev` para que as API Routes funcionem localmente junto com o Vite:

```bash
npm i -g vercel
vercel dev
```

---

## Plano de migração (gradual)

A ideia é migrar por etapas sem quebrar o que já funciona:

### Etapa 1 — Songs (leitura)
- Criar `api/songs/index.ts` com `GET /api/songs`
- Criar `api/lib/mongodb.ts` com a conexão
- Popular o Atlas com o seed atual de `src/data/songs.ts`
- Atualizar `src/services/songRepository.ts` para chamar a API em vez de ler o arquivo local
- Manter fallback para `songs.ts` caso a API falhe

### Etapa 2 — Songs (escrita)
- `POST /api/songs` — criar cifra
- `PUT /api/songs/:id` — editar cifra
- `DELETE /api/songs/:id` — excluir cifra
- Atualizar `ManagementPage` e `SongForm` para usar a API

### Etapa 3 — Setlists
- `GET/POST /api/setlists`
- `GET/PUT/DELETE /api/setlists/:id`
- Migrar `src/services/setlistRepository.ts` para a API
- Setlists locais existentes: oferecer importação na primeira abertura

### Etapa 4 — Autenticação (opcional)
- Proteger as rotas de escrita (`POST`, `PUT`, `DELETE`) com uma API key simples ou JWT
- Substituir o `AdminGate` atual (senha fixa em código) por auth real

---

## Limitações conhecidas do plano free

| Item | Limite | Status para este projeto |
|---|---|---|
| Atlas M0 storage | 512 MB | ~250 mil cifras. Sobra. |
| Atlas M0 conexões | 500 simultâneas | Com pooling, sem problema. |
| Vercel compute | 100 GB-horas/mês | ~14 M requests. Sobra muito. |
| Vercel function timeout | 10 segundos | CRUD leva <200ms. OK. |
| Vercel uso comercial | Não permitido no Hobby | Monitorar se o projeto crescer. |
| Atlas pausa | **Nunca pausa** | Vantagem sobre Supabase free. |

---

## Arquivos do frontend que serão alterados na migração

| Arquivo | O que muda |
|---|---|
| `src/services/songRepository.ts` | Substituir leitura de `songs.ts` por `fetch('/api/songs')` |
| `src/services/setlistRepository.ts` | Substituir `localStorage` por `fetch('/api/setlists')` |
| `src/data/songs.ts` | Vira seed para popular o Atlas; deixa de ser fonte de dados |
| `src/features/management/ManagementPage.tsx` | Export de `songs.ts` pode ser removido quando migração concluir |

O restante do frontend (`SongViewer`, `Toolbar`, `SongCard`, etc.) não muda — eles consomem dados pelos services, não diretamente.
