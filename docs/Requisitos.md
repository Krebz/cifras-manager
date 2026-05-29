# Requisitos

## Visão Geral

O Cifra Manager é uma aplicação web voltada para gerenciamento e execução de cifras musicais, com foco principal em músicos católicos durante missas, grupos de oração, encontros, retiros e apresentações ao vivo.

O sistema terá como principal objetivo oferecer uma experiência de leitura limpa, rápida e sem distrações, priorizando a execução musical em tempo real em tablets, celulares e computadores.

Além de atender uma necessidade prática do dia a dia, o projeto também servirá como laboratório de aprendizado para desenvolvimento utilizando React, TypeScript, Node.js e boas práticas de arquitetura de software.

## Objetivos

### Objetivo Principal

Disponibilizar uma biblioteca pessoal de cifras organizada, pesquisável e adaptável para execução ao vivo.

### Objetivos Secundários

* Eliminar dependência de sites com excesso de publicidade.
* Permitir rápida alteração de tom.
* Facilitar organização de repertórios.
* Possibilitar compartilhamento de listas de músicas.
* Centralizar todo o acervo pessoal de cifras.
* Fornecer experiência otimizada para tablets.
* Possibilitar uso mesmo sem acesso à internet.

## Público-Alvo

### Primário

* Músicos católicos.
* Ministérios de música.
* Instrumentistas.
* Cantores.

### Secundário

* Igrejas.
* Comunidades.
* Grupos de oração.
* Equipes de liturgia.

## Requisitos Funcionais

### RF001 - Pesquisa de Músicas

O sistema deverá permitir busca por:

* Nome da música.
* Artista.
* Categoria.
* Trechos da letra.
* Tom musical.

#### Filtros futuros

* Tempo litúrgico.
* Tipo de celebração.
* Instrumento.
* Grau de dificuldade.

Permitir busca por:

* Nome da música
* Artista
* Categoria
* Trechos da letra
* Tom musical
* Conteúdo das observações

Exemplo

Pesquisar:

pascal

Retornaria músicas contendo:

Utilizada durante o Tempo Pascal

### RF002 - Página Inicial

A Home deverá apresentar:

### Campo de Pesquisa

Busca rápida com resultado instantâneo.

### Blocos de Destaque

* 10 músicas mais acessadas.
* 10 músicas favoritas.
* 10 músicas recentemente adicionadas.
* Categorias mais utilizadas.

### Categorias

Exemplos:

* Entrada
* Ato Penitencial
* Glória
* Salmo
* Aclamação ao Evangelho
* Ofertório
* Santo
* Comunhão
* Final
* Adoração
* Mariano
* Grupo de Oração
* Encontro
* Retiro

### RF003 - Visualização da Música

Tela otimizada para execução ao vivo.

### Objetivos

* Máximo aproveitamento da área útil.
* Leitura clara da letra.
* Leitura clara das cifras.
* Navegação discreta.
* Sem distrações.

### Funcionalidades

#### Transposição de Tom

Permitir:

* Subir tom.
* Descer tom.
* Exibir tom original.
* Exibir tom atual.

#### Ajuste de Fonte

* Pequena
* Média
* Grande
* Extra Grande

#### Auto Rolagem

Configuração de velocidade:

* Muito lenta
* Lenta
* Média
* Rápida
* Muito rápida

Controles:

* Iniciar
* Pausar
* Reiniciar

#### Modo Escuro

Alternância entre:

* Claro
* Escuro

#### Modo Performance

Ocultar elementos desnecessários e exibir apenas:

* Título
* Tom
* Letra
* Cifras

Título

Artista

Categoria

Tom Original
Tom Atual

[ Ouvir Referência ]

Observações:
Utilizada durante o Tempo Pascal.

--------------------------------

Cifra e Letra

--------------------------------

### RF004 - Favoritos

Permitir:

* Adicionar aos favoritos.
* Remover dos favoritos.
* Listar músicas favoritas.

### RF005 - Playlists

Permitir criação de playlists personalizadas.

### Exemplos

* Missa Domingo 10h
* Missa 10/05/2026
* Casamento João e Maria
* Grupo de Oração Maio

### Funcionalidades

* Criar playlist.
* Editar playlist.
* Excluir playlist.
* Duplicar playlist.
* Reordenar músicas.

### Ordenação

* Arrastar e soltar.
* Mover para cima.
* Mover para baixo.

### RF006 - Navegação de Repertório

Ao abrir uma playlist:

### Navegação Horizontal

Inspirada em leitores digitais (Kindle).

### Objetivos

* Evitar rolagens acidentais.
* Facilitar troca entre músicas.
* Melhor experiência em tablets.

### Comportamento

* Deslizar para esquerda → próxima música.
* Deslizar para direita → música anterior.
* Transição suave entre páginas.
* Preservar estado da navegação.

### RF007 - Compartilhamento de Playlist

Permitir compartilhamento através de link.

### Requisitos

* Link público.
* Modo somente leitura.
* Sem necessidade de login.
* Possibilidade de desativar compartilhamento.

### RF008 - Administração de Cifras

Área restrita ao administrador.

### CRUD Completo

Permitir:

* Cadastrar música.
* Editar música.
* Excluir música.
* Consultar música.

### Campos

* Título
* Artista
* Categoria
* Letra
* Cifra
* Tom Original
* Link de Referência
* Observações

### RF009 - Editor de Cifras

Ferramenta amigável para cadastro.

### Recursos

* Pré-visualização em tempo real.
* Destaque visual das cifras.
* Validação de formatação.
* Identificação do tom.

### RF010 - Importação de Arquivos

Permitir importação de:

* PDF
* DOC
* DOCX
* TXT

### Fluxo

1. Upload do arquivo.
2. Extração do conteúdo.
3. Pré-visualização.
4. Ajustes manuais.
5. Confirmação.
6. Salvamento.

### RF011 - Contato

Formulário contendo:

* Nome
* E-mail
* Assunto
* Mensagem

Objetivo:

* Receber sugestões.
* Receber correções.
* Receber relatos de erro.

### RF012 - Aplicativo Instalável (PWA)

O sistema deverá funcionar como aplicativo instalável.

### Plataformas

* Android
* iPadOS
* Windows
* Linux

### Funcionalidades

* Instalação pelo navegador.
* Ícone próprio.
* Execução em tela cheia.
* Experiência semelhante a aplicativo nativo.

### RF013 - Funcionamento Offline

O sistema deverá continuar funcionando sem internet.

### Funcionalidades Offline

* Busca de músicas.
* Visualização de cifras.
* Favoritos.
* Playlists.
* Configurações pessoais.

### RF014 - Cache Local de Cifras

Todas as cifras deverão permanecer disponíveis localmente após sincronização.

### Objetivos

* Uso durante missas.
* Uso em retiros.
* Uso em locais sem sinal.
* Carregamento instantâneo.

### RF015 - Referência Musical

O sistema deverá permitir associar um link de referência a cada música.

### Objetivo

Permitir que o músico relembre rapidamente:

- Melodia
- Arranjo
- Introdução
- Ritmo
- Execução original

### Plataformas suportadas

- YouTube
- Spotify
- Deezer
- Apple Music

### Regras

- Não reproduzir conteúdo dentro do sistema.
- Abrir link externamente.
- Utilizar apenas como referência musical.

### Objetivos

Armazenar informações que auxiliem:

- Execução musical
- Organização litúrgica
- Preparação do repertório

### Exemplos

- Utilizada durante o Tempo Pascal.
- Executar somente o refrão após a procissão.
- Introdução em violão.
- Tom ajustado para voz feminina.

### Regras

- Campo opcional.
- Texto livre.
- Visível durante a execução.
- Editável pelo administrador.

## Requisitos Não Funcionais

### RNF001 - Responsividade

Compatibilidade com:

* Desktop
* Tablet
* Smartphone

Prioridade máxima para tablets.

### RNF002 - Performance

Tempo médio de carregamento inferior a 2 segundos.

### RNF003 - Usabilidade

Operação com poucos toques.

Interface adequada para uso durante execução musical.

### RNF004 - Persistência

Salvar:

* Favoritos.
* Playlists.
* Tema.
* Preferências do usuário.

### RNF005 - Segurança

Área administrativa protegida por autenticação.

### RNF006 - Backup

Permitir exportação futura da base de cifras para recuperação em caso de perda de dados.

### RNF007 - Privacidade e LGPD

O sistema deverá observar os princípios da Lei Geral de Proteção de Dados (LGPD), coletando apenas os dados necessários para suas funcionalidades e adotando medidas adequadas de segurança para proteção das informações armazenadas.
