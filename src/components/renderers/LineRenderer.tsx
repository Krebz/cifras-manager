import type { ParsedLine } from "../../types/music";
import { songViewerStyles } from "../../styles/songViewerStyles";
import { buildMusicalChunks } from "../../utils/buildMusicalChunks";
import ChordToken from "../tokens/ChordToken";
import TextToken from "../tokens/TextToken";

import { transposeChord }
from "../../services/transposeChord";

type Props = {
  line: ParsedLine;
  transpose: number;
};

export default function LineRenderer({ line, transpose }: Props) {

  const chunks =  buildMusicalChunks(line);

  return (
    <div
      style={{
        ...songViewerStyles.line,
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
      }}
    >
      {chunks.map((chunk, index) => (
        <div
          key={index}
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "flex-start",
            whiteSpace: "pre",
            fontFamily: "monospace",
            minWidth: `${chunk.lyric.length}ch`,
          }}
        >

          {/* acorde */}
          <div>
            {chunk.chord && (
              <ChordToken
                chord={transposeChord(
                  chunk.chord,
                  transpose
                )}
              />
            )}
          </div>

          {/* letra */}
          <TextToken text={chunk.lyric} />

        </div>
      ))}
    </div>
  );
}
