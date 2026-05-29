# Arquitetura

## Visão Geral

O Cifra Manager utiliza uma arquitetura moderna baseada em tecnologias web para garantir performance, portabilidade e suporte offline.

## Stack Tecnológica

### Frontend

* React
* TypeScript
* Mantine UI
* Vite
* PWA

### Backend

* Node.js
* Express
* TypeScript

### Banco de Dados

* SQLite

### ORM

* Prisma

## Estrutura Arquitetural

```text
Cifra Manager

Frontend
├── React
├── TypeScript
├── Mantine UI
├── Vite
└── PWA

Backend
├── Node.js
├── Express
├── TypeScript
└── Prisma

Banco de Dados
└── SQLite
```

## Modelo de Domínio

### Song

* id
* title
* artist
* category
* originalKey
* lyrics
* chords
* referenceUrl
* notes
* createdAt
* updatedAt

### Playlist

* id
* name
* createdAt

### PlaylistSong

* playlistId
* songId
* position

### Favorite

* songId

## Estrutura de Pastas

```text
src/
├── features/
├── pages/
├── components/
├── contexts/
├── hooks/
├── services/
├── data/
```

## Estratégia Offline

Utilização de Service Workers e Cache Storage para garantir que a aplicação e as cifras carregadas estejam disponíveis sem internet. O banco de dados local (cache) sincroniza com o backend quando a conexão é restabelecida.

## Estratégia de Backup

O uso do SQLite facilita o backup, pois toda a base de dados reside em um único arquivo, permitindo exportações simples e snapshots periódicos.
