---
#5 Implementar repertórios (setlists) ✅

## Objetivo

Permitir criar repertórios contendo uma lista ordenada de músicas para utilização em missas e ensaios.

## Exemplos

- Missa Sábado 17h - SC
- Missa Sábado 19h - SJE
- Missa Domingo 09h - SE
- Missa Domingo 19h - SJB
- Ensaio

## Siglas

- SC  = Capela Santa Clara
- SJE = Paróquia São João Evangelista
- SE  = Santuário Santo Expedito
- SJB = Paróquia São João Batista

## Funcionalidades

- Criar repertório
- Editar repertório
- Excluir repertório
- Adicionar músicas
- Remover músicas
- Reordenar músicas
- Abrir música do repertório
- Navegar para próxima música
- Navegar para música anterior

## Regras de Negócio

- Uma música pode pertencer a vários repertórios.
- A ordem das músicas no repertório deve ser preservada.
- O repertório pode possuir data associada.
- A data é opcional.
- O usuário deve poder navegar entre músicas consecutivas do repertório.
- A navegação deve funcionar adequadamente em dispositivos móveis.

## Critérios de aceite

- [x] Criar repertório
- [ ] Editar repertório (nome e data)
- [x] Excluir repertório
- [x] Adicionar músicas ao repertório
- [x] Remover músicas do repertório
- [x] Reordenar músicas
- [x] Abrir música do repertório
- [x] Navegar para próxima música
- [x] Navegar para música anterior
- [x] Associar data ao repertório

---
#3 Melhorar responsividade para celular ✅

## Objetivo

Garantir boa visualização em celulares e tablets.

## Critérios de aceite

- [x] Menu utilizável em celular
- [x] Letras das músicas legíveis
- [x] Sem rolagem horizontal

---
#4 Persistir músicas localmente ✅

## Objetivo

Salvar músicas localmente para não perder dados ao atualizar a página.

## Critérios de aceite

- [x] Dados persistidos
- [x] Recuperação automática ao abrir aplicação

---
#6 Melhorar busca de músicas ✅

## Critérios de aceite

- [x] Busca por tom musical
- [x] Busca por trechos da letra
- [x] Botão para limpar busca

---
#7 Revisar experiência de uso durante ensaio ✅

## Objetivo

Validar se o Cifra Manager pode ser utilizado durante cultos e ensaios sem dificuldades.

## Cenários

- Procurar uma música
- Abrir uma música
- Alterar tom
- Navegar entre músicas
- Utilizar pelo celular

## Critérios de aceite

- [x] Fluxo considerado confortável
- [x] Nenhum problema crítico encontrado
- [x] Melhorias registradas em novas Issues

## Melhorias identificadas

- [x] Reset rápido de transposição (clique no tom volta ao original)
- [x] Botão voltar ao catálogo preservando histórico de navegação
- [x] Modo performance com ícone intuitivo (substituiu "UC")

---
#8 Implementar favoritos

## Objetivo

Permitir marcar músicas como favoritas para acesso rápido.

## Motivação

Músicos retornam frequentemente às mesmas músicas. Favoritos evitam a necessidade de buscar toda vez.

## Funcionalidades

- Marcar/desmarcar música como favorita
- Listar músicas favoritas
- Exibir favoritas na Home

## Critérios de aceite

- [ ] Botão de favorito na tela da música
- [ ] Músicas favoritas persistidas localmente
- [ ] Seção de favoritos na Home
- [ ] Indicador visual de favorito no catálogo

---
#9 Editar nome e data do repertório

## Objetivo

Permitir editar o nome e a data de um repertório existente.

## Critérios de aceite

- [ ] Botão de edição no cabeçalho do repertório
- [ ] Salvar alterações de nome e data

---
#10 Duplicar repertório

## Objetivo

Permitir duplicar um repertório existente para facilitar a criação de repertórios similares.

## Motivação

Missas recorrentes têm repertórios parecidos (ex: todas as missas das 10h usam músicas semelhantes).

## Critérios de aceite

- [ ] Botão de duplicar na lista de repertórios
- [ ] Novo repertório criado com o mesmo conjunto de músicas

---
#11 Navegação horizontal entre músicas do repertório (swipe)

## Objetivo

Permitir navegar entre músicas do repertório deslizando o dedo horizontalmente, inspirado em leitores digitais (Kindle).

## Motivação

Durante a celebração, deslizar é mais natural e discreto do que tocar botões.

## Critérios de aceite

- [ ] Swipe para esquerda → próxima música
- [ ] Swipe para direita → música anterior
- [ ] Transição suave entre páginas
- [ ] Funciona em tablets e celulares
