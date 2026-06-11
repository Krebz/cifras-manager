---
#5 Implementar repertórios (setlists)

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

- [ ] Criar repertório
- [ ] Editar repertório
- [ ] Excluir repertório
- [ ] Adicionar músicas ao repertório
- [ ] Remover músicas do repertório
- [ ] Reordenar músicas
- [ ] Abrir música do repertório
- [ ] Navegar para próxima música
- [ ] Navegar para música anterior
- [ ] Associar data ao repertório

---
#3 Melhorar responsividade para celular

## Objetivo

Garantir boa visualização em celulares e tablets.

## Critérios de aceite

- [ ] Menu utilizável em celular
- [ ] Letras das músicas legíveis
- [ ] Sem rolagem horizontal

---
#4 Persistir músicas localmente

## Objetivo

Salvar músicas localmente para não perder dados ao atualizar a página.

## Critérios de aceite

- [ ] Dados persistidos
- [ ] Recuperação automática ao abrir aplicação

---
6# Melhorar busca de músicas

---

#7 Revisar experiência de uso durante ensaio
## Objetivo

Validar se o Cifra Manager pode ser utilizado durante cultos e ensaios sem dificuldades.

## Cenários

- Procurar uma música
- Abrir uma música
- Alterar tom
- Navegar entre músicas
- Utilizar pelo celular

## Critérios de aceite

- [ ] Fluxo considerado confortável
- [ ] Nenhum problema crítico encontrado
- [ ] Melhorias registradas em novas Issues