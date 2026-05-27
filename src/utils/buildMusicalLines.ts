import type { ParsedLine } from "../types/music";
import { transposeChord } from "../services/transposeChord";

export function buildMusicalLines(line: ParsedLine, transpose: number) {
  const chordBuffer: string[] = [];
  const lyricBuffer: string[] = [];

  function writeText(buffer: string[], text: string, position: number) {
    let safePosition = position;

    while (
      buffer[safePosition] !== undefined
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
      const chordText = `${transposedChord.root}${transposedChord.suffix}${
        transposedChord.bass ? `/${transposedChord.bass}` : ""
      }`;
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

  function toAlignedLine(buffer: string[]) {
    let result = "";

    for (let i = 0; i < buffer.length; i++) {
      result += buffer[i] ?? " ";
    }

    // Evita cauda de espaços sem perder o alinhamento útil da linha.
    return result.replace(/\s+$/g, "");
  }

  // Buffers podem ficar "sparse" (com lacunas). Precisamos transformar
  // essas lacunas em espaços reais para preservar colunas no <pre>.
  const chordLine = toAlignedLine(chordBuffer);
  const lyricLine = toAlignedLine(lyricBuffer);

  return {
    chordLine,
    lyricLine,
    isInstrumental: lyricLine.trim() === "",
  };
}
