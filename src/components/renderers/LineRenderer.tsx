import type { ParsedLine } from "../../types/music";
import { songViewerStyles } from "../../styles/songViewerStyles";
import { buildMusicalLines } from "../../utils/buildMusicalLines";

type Props = {
  line: ParsedLine;
  transpose: number;
};

export default function LineRenderer({ line, transpose }: Props) {
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
        opacity: isInstrumental ? 0.7 : 1,

        backgroundColor: isInstrumental
          ? "rgba(255,255,255,0.03)"
          : "transparent",

        padding: isInstrumental ? "8px 12px" : "0",

        borderRadius: isInstrumental ? "8px" : "0",
        fontStyle: isInstrumental ? "italic" : "normal",
      }}
    >
      {/* linha de acordes */}
      <div
        style={{
          marginBottom: "8px",
          color: "#90cdf4",
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: 1.2,
          letterSpacing: "0.5px",
        }}
      >
        {chordLine}
      </div>

      {/* linha da letra */}
      <div
        style={{
          fontSize: "22px",
          lineHeight: 1.6,
        }}
      >
        {lyricLine}
      </div>
    </div>
  );
}
