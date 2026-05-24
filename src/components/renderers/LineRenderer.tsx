import type { ParsedLine } from "../../types/music";
import { songViewerStyles } from "../../styles/songViewerStyles";
import { buildMusicalLines } from "../../utils/buildMusicalLines";

type Props = {
  line: ParsedLine;
  transpose: number;
};

export default function LineRenderer({ line, transpose }: Props) {
  const { chordLine, lyricLine } = buildMusicalLines(line, transpose);

  return (
    <div
      style={{
        ...songViewerStyles.line,
        fontFamily: "monospace",
        whiteSpace: "pre",
      }}
    >
      {/* linha de acordes */}
      <div
        style={{
          marginBottom: "8px",
          color: "#2b6cb0",
          fontWeight: "bold",
          fontSize: "18px",
          lineHeight: 1.2,
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
