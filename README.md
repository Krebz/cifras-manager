# Katando Cifras

PWA litúrgico para consulta e gestão de cifras musicais, criado para uso durante celebrações da Igreja Católica.

---

## Funcionalidades

### Cifras
- Renderização com acordes alinhados acima da letra (formato ChordPro)
- Transposição de tom em tempo real (semitom acima/abaixo)
- Blocos de seção: Verso, Refrão, Ponte, Intro, Final — com identidade visual distinta
- CRUD completo (criar, editar, excluir) — área protegida por senha

### Leitura e apresentação
- Auto-scroll com controle de velocidade
- Ajuste de tamanho de fonte (A− / A+)
- Modo tela cheia para apresentação
- Responsivo para celular e tablet

### Repertórios
- Criação e gerenciamento de repertórios (setlists)
- Adição, remoção e reordenação de músicas
- Navegação sequencial entre músicas do repertório
- Compartilhamento de repertório via link

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

> As API Routes requerem `MONGODB_URI` e `ADMIN_PASS` configurados em `.env.local`.  
> Para testar sem backend local, use a URL de Preview do Vercel.

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
  auth/verify.ts        Validação de senha
  lib/                  mongodb.ts + auth.ts
  songs/                GET (público) / POST, PUT, DELETE (admin)
  setlists/             CRUD público

src/
  app/                  Roteamento e navegação
  components/           Componentes compartilhados
  data/                 Seed estático (fallback offline)
  features/             Pages por domínio (home, song, setlist, management)
  hooks/
  services/             Repositórios (songRepository, setlistRepository, authStore)
  styles/
  types/                Song, Setlist, ParsedLine…

scripts/seed.ts         Popula o MongoDB com o catálogo inicial
docs/                   Arquitetura, Roadmap, decisões técnicas
```

---

## Variáveis de ambiente

| Variável | Onde | Descrição |
|---|---|---|
| `MONGODB_URI` | servidor | URI de conexão ao Atlas |
| `ADMIN_PASS` | servidor | Senha das rotas de escrita |
| `SEED_KEY` | servidor | Chave para autorizar o endpoint de seed |

---

## Deploy

Deploy automático no Vercel a cada push em `main`. Variáveis configuradas no painel do projeto (Production + Preview).

---

## Versão

**v2.0.0** — backend MongoDB Atlas + autenticação por senha  
Histórico completo em [docs/Roadmap.md](docs/Roadmap.md)
