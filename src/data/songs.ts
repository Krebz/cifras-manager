import type { Song } from "../types/music";

export const songs: Song[] = [
  {
    id: "maria-de-nazare",
    title: "Maria de Nazaré",
    artist: "Padre Marcelo Rossi",
    key: "G",
    category: "Mariana",
    accessCount: 384,
    content: `
[intro]
[G]        [D/F#]
Aleluia, aleluia
[verse]
[G]Maria de Nazaré
Tu és a [D]mãe do Senhor
[chorus]
[Em]Me ensina a viver
Com mais [Cmaj7]amor
[bridge]
[F#m7]Quero seguir
[B7]Teu coração
[outro]
[G]
Amém
`,
  },
  {
    id: "confiar",
    title: "Confiar",
    artist: "Comunidade (mock)",
    key: "D",
    category: "Adoração",
    accessCount: 156,
    content: `
[intro]
[D]          [A/C#]
Eu vou confiar

[verse]
[D]Confiar no Senhor
Com meu coração
Ele é fiel, não falha
[G]e renova o caminho

[chorus]
[Bm]Minha força é Jesus
[G]minha luz é a Tua voz
[A]Em todo tempo
[D]eu vou dizer: "Vem!"

[bridge]
[Em]Mesmo na espera
[F#m]meu passo não parará
[G]Eu permaneço
[A]e a paz me alcançará

[outro]
[D]
Amém
`,
  },
  {
    id: "e16a77a8-0617-4262-8529-1e5f09052088",
    title: "Hino São João Evangelista - Oficial.",
    artist: "Manuel Assunção",
    key: "E",
    category: "Entrada",
    accessCount: 0,
    content: `[chorus]
Jo[E]ão Evange[A]lista, Jo[B]ão, a[F#m]juda a sermos [B]todos irm[E]ãos!
Tú [A]és a nossa [B/A]luz, o nosso irm[G#m]ão prote[C#]tor;
Se[F#m]guindo a Jesus o nosso [B]Mestre e Senh[E]or!
[verse]
Dis[E]cípulo a[A]mado do Senh[B]or; sen[F#m]tiste bem de [B]perto o seu am[E]or.
Com a s[A]ua proteç[B/A]ão e sua l[G#m]uz 
Col[F#]oca-nos mais perto de [B]Jesus!`,
  },
];
