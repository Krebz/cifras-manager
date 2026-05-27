import type { Song } from "../types/music";
import { song as song1 } from "./song";

export const songs: Song[] = [
  song1,
  {
    title: "Confiar",
    artist: "Comunidade (mock)",
    key: "D",
    category: "Adoração",
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
];

export const defaultSong = songs[0];

