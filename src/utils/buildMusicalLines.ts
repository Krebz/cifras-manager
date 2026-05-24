import type { ParsedLine } from "../types/music";
import { transposeChord } from "../services/transposeChord";

export function buildMusicalLines(line: ParsedLine, transpose: number) {
  const chordBuffer: string[] = [];
  const lyricBuffer: string[] = [];

  function writeText(buffer: string[], text: string, position: number) {
    let safePosition = position;

    while (
      buffer[safePosition] !== undefined ||
      buffer[safePosition - 1] !== undefined
    ) {
      safePosition++;
    }

    for (let i = 0; i < text.length; i++) {
      buffer[safePosition + i] = text[i];
    }
  }

  for (const token of line.tokens) {
    if (token.type === "chord") {
      const transposedChord = transposeChord(token.value, transpose);
      const chordText = `${transposedChord.root}${transposedChord.suffix}`;
      const chordLength = chordText.length;
      const lyricLength = chordText.length;

      let adjustedPosition = token.position;

      if (chordLength > lyricLength) {
        adjustedPosition -= Math.floor((chordLength - lyricLength) / 2);
      }

      writeText(chordBuffer, chordText, adjustedPosition);
      continue;
    }

    if (token.type === "text") {
      writeText(lyricBuffer, token.value, token.position);
    }
  }

  return {
    chordLine: chordBuffer.join(""),
    lyricLine: lyricBuffer.join(""),
  };
}
