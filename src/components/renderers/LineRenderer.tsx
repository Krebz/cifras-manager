import type { ParsedLine, MusicalChunk } from "../../types/music";
import { transposeChord } from "../../services/transposeChord";

type Props = {
  line: ParsedLine;
  transpose: number;
  fontSize: number;
};

function buildChunks(line: ParsedLine, transpose: number): MusicalChunk[] {
  const chunks: MusicalChunk[] = [];
  let pendingChord: MusicalChunk["chord"];

  for (const token of line.tokens) {
    if (token.type === "directive") continue;
    if (token.type === "chord") {
      if (pendingChord !== undefined) chunks.push({ chord: pendingChord, lyric: "" });
      pendingChord = transposeChord(token.value, transpose);
    } else if (token.type === "text") {
      chunks.push({ chord: pendingChord, lyric: token.value });
      pendingChord = undefined;
    }
  }

  if (pendingChord !== undefined) chunks.push({ chord: pendingChord, lyric: "" });
  return chunks;
}

// Split chunks at word boundaries so flex never breaks mid-word.
// The chord stays with the first word-piece; the rest get no chord.
function expandToWordPieces(chunks: MusicalChunk[]): MusicalChunk[] {
  const result: MusicalChunk[] = [];

  for (const chunk of chunks) {
    if (!chunk.lyric) {
      result.push(chunk);
      continue;
    }

    const parts = (chunk.lyric.match(/\S*\s*/g) ?? []).filter((p) => p !== "");
    if (parts.length <= 1) {
      result.push(chunk);
      continue;
    }

    result.push({ chord: chunk.chord, lyric: parts[0] });
    for (let i = 1; i < parts.length; i++) {
      result.push({ chord: undefined, lyric: parts[i] });
    }
  }

  return result;
}

// Group consecutive pieces where the boundary falls mid-word (no trailing space).
// Each group becomes one non-breaking inline-flex unit.
function groupByWordBoundary(pieces: MusicalChunk[]): MusicalChunk[][] {
  const groups: MusicalChunk[][] = [];
  let current: MusicalChunk[] = [];

  for (const piece of pieces) {
    const prev = current[current.length - 1];
    if (prev && /\s$/.test(prev.lyric)) {
      groups.push(current);
      current = [];
    }
    current.push(piece);
  }

  if (current.length > 0) groups.push(current);
  return groups;
}

function formatChord(chord: MusicalChunk["chord"]): string {
  if (!chord) return "";
  return `${chord.root}${chord.suffix}${chord.bass ? `/${chord.bass}` : ""}`;
}

export default function LineRenderer({ line, transpose, fontSize }: Props) {
  const hasChords = line.tokens.some((t) => t.type === "chord");

  if (!hasChords) {
    const lyric = line.tokens
      .filter((t) => t.type === "text")
      .map((t) => t.value)
      .join("");
    if (!lyric.trim()) return null;
    return (
      <div style={{ fontFamily: "monospace", fontSize: `${fontSize}px`, lineHeight: 1.6 }}>
        {lyric}
      </div>
    );
  }

  const chunks = buildChunks(line, transpose);
  const isInstrumental = chunks.every((c) => !c.lyric.trim());
  const groups = groupByWordBoundary(expandToWordPieces(chunks));

  return (
    <div
      style={{
        fontFamily: "monospace",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        opacity: isInstrumental ? 0.9 : 1,
        padding: isInstrumental ? "8px 12px" : "0",
        borderRadius: isInstrumental ? "8px" : "0",
        fontStyle: isInstrumental ? "italic" : "normal",
      }}
    >
      {groups.map((group, gi) => (
        <span key={gi} style={{ display: "inline-flex", alignItems: "flex-end" }}>
          {group.map((piece, pi) => {
            const chord = formatChord(piece.chord);
            return (
              <span key={pi} style={{ display: "inline-block" }}>
                <span
                  style={{
                    display: "block",
                    color: "#90cdf4",
                    fontWeight: 700,
                    fontSize: `${fontSize}px`,
                    lineHeight: 1.2,
                    textShadow: "0 0 8px rgba(144,205,244,0.25)",
                    paddingRight: chord ? "6px" : undefined,
                  }}
                >
                  {chord}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: `${fontSize}px`,
                    lineHeight: 1.6,
                    whiteSpace: "pre",
                  }}
                >
                  {piece.lyric || (piece.chord ? " " : "")}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
