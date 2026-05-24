import type {
  ParsedLine,
  MusicalChunk,
} from "../types/music";

export function buildMusicalChunks(
  line: ParsedLine
): MusicalChunk[] {

  const chunks: MusicalChunk[] = [];

  let currentChord;

  for (const token of line.tokens) {

    if (token.type === "chord") {
      currentChord = token.value;
      continue;
    }

    if (token.type === "text") {
      chunks.push({
        chord: currentChord,
        lyric: token.value,
      });

      currentChord = undefined;
    }
  }

  return chunks;
}