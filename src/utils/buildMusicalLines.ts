import type { ParsedLine } from "../types/music";
import { transposeChord } from "../services/transposeChord";

export function buildMusicalLines(line: ParsedLine, transpose: number) {
  let chordLine = "";
  let lyricLine = "";

  for (const token of line.tokens) {
    function padToPosition(text: string, position: number) {
      while (text.length < position) {
        text += " ";
      }

      return text;
    }

    if (token.type === "chord") {
      const transposedChord = transposeChord(token.value, transpose);

      const chordText = `${transposedChord.root}${transposedChord.suffix}`;

      chordLine = padToPosition(chordLine, token.position);

      chordLine += chordText;

      continue;
    }

    if (token.type === "text") {
      lyricLine = padToPosition(lyricLine, token.position);

      lyricLine += token.value;
    }
  }

  return { chordLine, lyricLine };
}
