# Katando Cifras

PWA litúrgico para consulta e gestão de cifras musicais, criado para uso durante celebrações da Igreja Católica.

---

## Funcionalidades

### Cifras
- Renderização com acordes alinhados acima da letra (formato ChordPro)
- Transposição de tom em tempo real (semitom acima/abaixo)
- Blocos de seção: Verso, Refrão, Ponte, Intro, Final — com identidade visual distinta
- CRUD completo (criar, editar, excluir) — área restrita a administrador (login Google)

### Leitura e apresentação
- Auto-scroll com controle de velocidade
- Ajuste de tamanho de fonte (A− / A+)
- Modo tela cheia para apresentação
- Responsivo para celular e tablet

### Repertórios
- Criação e gerenciamento de repertórios (setlists) — requer login com Google
- Cada usuário vê e edita apenas os próprios repertórios
- Adição, remoção e reordenação de músicas
- Navegação sequencial entre músicas do repertório
- Compartilhamento de repertório via link (recebimento é público)

### Autenticação
- Login com Google (OAuth 2.0) via backend próprio + JWT em cookie httpOnly
- Catálogo de cifras é público; repertórios e gestão exigem login
- Papel de administrador definido pela variável `ADMIN_EMAIL`

### Busca e organização
- Busca por título, artista, categoria e trecho da letra
- Filtro por categoria musical e uso litúrgico
- Ordenação por músicas mais acessadas (`accessCount`)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Mantine UI |
| Build | Vite + vite-plugin-pwa |
| Backend | Vercel API Routes (serverless) |
| Banco de dados | MongoDB Atlas M0 (GCP São Paulo) |
| Pacotes | pnpm |
| Deploy | Vercel (push em `main`) |

---

## Como executar localmente

```bash
pnpm install
pnpm dev
```

> As API Routes requerem `MONGODB_URI` em `.env.local` (e as variáveis de OAuth
> para testar login — ver tabela abaixo).  
> O login Google só funciona no domínio de produção cadastrado no Google Cloud;
> em Preview o catálogo público funciona, mas o login não.

Build para produção:

```bash
pnpm build
```

Seed inicial do banco (rodar uma vez após configurar `.env.local`):

```bash
pnpm seed
```

---

## Estrutura do projeto

```
api/                    Vercel serverless functions
  auth/                 google, callback, me, logout (OAuth Google + JWT)
  lib/                  mongodb.ts + auth.ts + jwt.ts
  songs/                GET (público) / POST, PUT, DELETE (admin)
  setlists/             GET por id (público) / lista e escrita (login)

src/
  app/                  Roteamento e navegação
  components/           Componentes compartilhados
  contexts/             UserContext (useUser)
  data/                 Seed estático (fallback offline)
  features/             Pages por domínio (home, song, setlist, management)
  hooks/
  services/             Repositórios (songRepository, setlistRepository)
  styles/
  types/                Song, Setlist, ParsedLine…

scripts/
  seed.ts               Popula o MongoDB com o catálogo inicial
  migrate-setlists.ts   Associa setlists órfãos ao admin
docs/                   Arquitetura, Roadmap, decisões técnicas
```

---

## Variáveis de ambiente

| Variável | Onde | Descrição |
|---|---|---|
| `MONGODB_URI` | servidor | URI de conexão ao Atlas |
| `JWT_SECRET` | servidor | Assina o JWT de sessão |
| `GOOGLE_CLIENT_ID` | servidor | OAuth Google |
| `GOOGLE_CLIENT_SECRET` | servidor | OAuth Google |
| `APP_URL` | servidor | URL de produção (monta o `redirect_uri`) |
| `ADMIN_EMAIL` | servidor | Email que recebe papel de admin no login |

---

## Deploy

Deploy automático no Vercel a cada push em `main`. Variáveis configuradas no painel do projeto (Production + Preview).

---

## Versão

**v3.0.0** — login com Google (OAuth próprio + JWT), repertórios por usuário  
Histórico completo em [docs/Roadmap.md](docs/Roadmap.md)
