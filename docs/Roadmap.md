# Roadmap

## v1.0 — MVP (concluído)

- Cadastro de músicas
- Pesquisa por título, artista e letra
- Visualização de cifras com marcadores de acorde
- Transposição de tom
- Ajuste de tamanho de fonte
- Referência musical (link externo)

## v1.1 — Repertórios e apresentação (concluído)

- Repertórios (setlists) com reordenação de músicas
- Navegação sequencial entre músicas do repertório
- Compartilhamento de repertório via link (codificado na URL)
- Auto-scroll com controle de velocidade
- Filtro por categoria musical e uso litúrgico separados
- Paginação no catálogo
- Página de contato

## v2.0 — Backend em nuvem (concluído)

- API serverless no Vercel (API Routes)
- MongoDB Atlas M0 como banco de dados permanente
- CRUD de cifras via API com autenticação por senha (`Authorization: Bearer`)
- Repertórios sincronizados com Atlas; migração automática do `localStorage`
- `accessCount` persistido no banco a cada abertura de cifra
- Senha nunca exposta no bundle — validação server-side via `ADMIN_PASS`

## v3.0 — Login com Google (concluído)

- Autenticação com Google OAuth 2.0 via backend próprio (sem Clerk/Firebase)
- Sessão por JWT em cookie `httpOnly`; substitui a senha simples da v2.0
- Coleção `users` no Atlas (googleId, email, name, picture, role)
- Repertórios pessoais por usuário (`userId`); GET por link continua público
- Gestão de cifras restrita ao administrador (papel definido por `ADMIN_EMAIL`)
- Catálogo de cifras permanece público (consulta, transposição, auto-scroll)
- Migração dos setlists órfãos da v2.0 para o admin (`pnpm migrate:setlists`)
- Remoção do legado de senha (`api/auth/verify.ts`, `authStore`, `requireAuth`)

## Melhorias técnicas (backlog)

Itens de robustez/infra mantendo tudo no plano gratuito. Os três primeiros
(índices, pool de conexões, backup) já foram implementados.

- **Open Graph nos links compartilhados** — preview com título/imagem ao colar
  link de cifra no WhatsApp. Exige um endpoint de prerender (function que
  devolve HTML com meta tags por música), já que é SPA em host estático.
- **Service Worker mais offline** — pré-cachear o app shell + ícones (hoje só
  `/` e `index.html`), melhorando o primeiro uso sem rede.
- **Monitoramento de erros** — Sentry (free tier) para capturar erros de JS no
  cliente que não aparecem nos logs efêmeros da Vercel.
- **Latência EUA↔Brasil** — co-localizar função e banco em São Paulo (`gru1`)
  reduz o round-trip; exige Vercel Pro. Hoje a estratégia offline-first
  (localStorage) já mascara bem.

## Futuro

- Estatísticas de uso mais detalhadas
- Importação de cifras via texto formatado
- Política de privacidade e adequações à LGPD
