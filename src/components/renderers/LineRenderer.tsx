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
      <div>{chordLine}</div>

      {/* linha da letra */}
      <div>{lyricLine}</div>
    </div>
  );
}
