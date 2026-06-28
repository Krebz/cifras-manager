# Katando Cifras — Contexto para Claude Code

## O projeto

PWA litúrgico para consulta e gestão de cifras musicais (Missas Católicas).  
Stack: React 19 + TypeScript + Mantine UI + Vite + Vercel API Routes + MongoDB Atlas M0.  
Repositório: `main` é produção. Branch `backend` foi mesclada como v2.0.

## Estado atual — v2.0 (concluída)

- Cifras e repertórios persistidos no MongoDB Atlas (GCP São Paulo)
- CRUD de cifras protegido por senha via `Authorization: Bearer` (variável `ADMIN_PASS` server-side)
- Repertórios públicos — qualquer visitante pode criar/editar
- `accessCount` incrementado no banco a cada abertura de cifra
- localStorage como cache/fallback para uso offline
- `api/auth/verify.ts` — valida senha do admin
- `src/services/authStore.ts` — guarda token em `sessionStorage`

## Próximo passo — v3.0: Login com Google

### Decisão de modelo de acesso (já tomada)

**Opção C** — catálogo público, setlists requerem login:

| Funcionalidade | Sem login | Com login |
|---|---|---|
| Consultar cifras | ✓ | ✓ |
| Transpor, auto-scroll | ✓ | ✓ |
| Gestão de cifras (admin) | ✗ | ✓ (só admin) |
| Criar/editar repertórios | ✗ | ✓ |
| Compartilhar repertório via link | ✓ (receber) | ✓ (criar e receber) |

### Decisão de implementação (já tomada)

**Próprio backend com MongoDB** — sem Clerk, sem Firebase Auth.

Motivos:
- Dados (nome, email, Google ID) ficam no Atlas GCP São Paulo — mais limpo para LGPD
- Sem dependência de serviço externo
- Sem risco de mudança de preço
- A complexidade é administrável para um único provedor OAuth (Google)

### Fluxo técnico planejado

```
1. Google Cloud Console
   → Registrar app OAuth 2.0
   → client_id + client_secret → variáveis GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET no Vercel

2. api/auth/google.ts       → redireciona para Google (OAuth authorize URL)
3. api/auth/callback.ts     → recebe code, troca por tokens, busca/cria usuário no MongoDB
                            → gera JWT de sessão → cookie httpOnly
4. api/auth/me.ts           → retorna usuário logado (lê cookie)
5. api/auth/logout.ts       → apaga cookie

6. MongoDB — nova coleção: users
   { googleId, email, name, picture, role: "admin" | "user", createdAt }

7. api/setlists/ → filtrar por userId do JWT (usuário só vê/edita seus próprios)
8. api/songs/ escrita → trocar Bearer senha por verificação de role: "admin" no JWT
```

### Dados recebidos do Google (mínimo necessário)

| Campo | Uso |
|---|---|
| `sub` | Google ID — chave de identificação |
| `email` | Exibição e identificação |
| `name` | Nome de exibição (opcional) |
| `picture` | Avatar (opcional) |

Sem CPF, sem telefone. Só perfil básico do Google.

### Impacto sobre o código v2.0

| Arquivo | O que muda |
|---|---|
| `api/setlists/index.ts` + `[id].ts` | Filtrar por `userId` extraído do JWT |
| `api/songs/index.ts` + `[id].ts` | Trocar `requireAuth` (senha) por verificação de `role: admin` no JWT |
| `src/services/setlistRepository.ts` | Passar cookie de sessão automaticamente (credenciais fetch) |
| `AdminGate.tsx` | Verificar role do usuário logado em vez de senha |
| `src/services/authStore.ts` | Substituir por contexto de usuário (hook `useUser`) |

### Setlists existentes no Atlas (sem userId)

Os setlists criados na v2.0 não têm `userId`. Decisão a tomar:
- Descartar (limpar o banco antes do go-live)
- Associar ao admin (migração simples via script)

### LGPD

- Dados de usuário ficam no Atlas (São Paulo) — sem transferência internacional de armazenamento
- A autenticação em si passa pelo Google (EU/EUA) — isso precisa estar na política de privacidade
- Mínimo de dados coletados — apenas o necessário para identificação

## Variáveis de ambiente existentes no Vercel

| Variável | Uso |
|---|---|
| `MONGODB_URI` | Conexão ao Atlas |
| `ADMIN_PASS` | Senha atual do admin (será substituída na v3.0) |
| `SEED_KEY` | Autoriza o endpoint de seed |
| `VITE_ADMIN_PASS` | Legado — não mais utilizada |

## Estrutura de pastas relevante

```
api/
  auth/verify.ts          Validação de senha (v2.0 — será substituído)
  lib/auth.ts             requireAuth() — será atualizado para JWT
  lib/mongodb.ts          Singleton de conexão (reutilizar)
  songs/index.ts + [id].ts
  setlists/index.ts + [id].ts
src/
  services/authStore.ts   Token sessionStorage (v2.0 — será substituído)
  features/management/AdminGate.tsx
```
