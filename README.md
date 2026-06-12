# Cifras Manager

Aplicação web para gerenciamento pessoal de cifras musicais, criada para uso durante execuções musicais em Missas Católicas.

---

## Funcionalidades

### Cifras
- Renderização de cifras com acordes alinhados acima da letra
- Parser de acordes no formato ChordPro (`[Am]`, `[G7]`, etc.)
- Transposição de tom em tempo real (semitom acima/abaixo)
- Importação de cifras no formato texto (ConvertNatural → ChordPro)
- Blocos de seção: Verso, Refrão, Ponte, Intro, Final — com identidade visual distinta
- Edição e exclusão de cifras

### Leitura e apresentação
- Auto-scroll com controle de velocidade
- Ajuste de tamanho de fonte (A− / A+)
- Modo tela cheia para apresentação
- Responsividade total para celular e tablet — sem rolagem horizontal
- Quebra de linha inteligente: acordes nunca cortam palavras ao meio

### Repertórios
- Criação e gerenciamento de repertórios (setlists)
- Adição, remoção e reordenação de músicas no repertório
- Navegação por swipe horizontal entre músicas do repertório
- Persistência local via `localStorage` com seed em arquivo

### Busca e organização
- Busca por título, artista, categoria e trecho da letra
- Filtro por categoria e artista
- Ordenação por músicas mais acessadas
- Categorização por tipo de momento litúrgico

---

## Stack

| Tecnologia | Uso |
|---|---|
| React + TypeScript | Interface e lógica |
| Vite | Build e dev server |
| Mantine UI | Componentes e tema |
| pnpm | Gerenciador de pacotes |

---

## Como executar

```bash
pnpm install
pnpm dev
```

Build para produção:

```bash
pnpm build
```

---

## Estrutura do projeto

```
src/
  app/          # roteamento e navegação
  components/   # componentes compartilhados (renderers, toolbar, etc.)
  data/         # seed de músicas e repertórios
  features/     # páginas por domínio (song, setlist, home)
  services/     # repositórios (songs, setlists, transpose)
  styles/       # estilos do visualizador de cifras
  types/        # tipos TypeScript (Song, Setlist, ParsedLine, etc.)
  utils/        # parsers e utilitários
```

---

## Deploy

Deploy automático na [Vercel](https://vercel.com) a cada push na branch principal.

---

## Status

MVP completo — v1.0
