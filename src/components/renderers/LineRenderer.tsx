import type { ParsedLine } from "../../types/music";
import { songViewerStyles } from "../../styles/songViewerStyles";
import { buildMusicalLines } from "../../utils/buildMusicalLines";

type Props = {
  line: ParsedLine;
  transpose: number;
  fontSize: number;
};

export default function LineRenderer({ line, transpose, fontSize }: Props) {
  const { chordLine, lyricLine, isInstrumental } = buildMusicalLines(
    line,
    transpose,
  );

  return (
    <div
      style={{
        ...songViewerStyles.line,
        fontFamily: "monospace",
        whiteSpace: "pre",
        opacity: isInstrumental ? 0.9 : 1,
        padding: isInstrumental ? "8px 12px" : "0",
        borderRadius: isInstrumental ? "8px" : "0",
        fontStyle: isInstrumental ? "italic" : "normal",
      }}
    >
      {/* linha de acordes */}
      <div
        style={{
          marginBottom: "2px",
          color: "#90cdf4",
          fontWeight: 700,
          fontSize: `${fontSize}px`,
          lineHeight: 1.2,
          letterSpacing: "0.8px",
          textShadow: "0 0 8px rgba(144,205,244,0.25)",
        }}
      >
        {chordLine}
      </div>

      {/* linha da letra */}
      <div
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.6,
        }}
      >
        {lyricLine}
      </div>
    </div>
  );
}
