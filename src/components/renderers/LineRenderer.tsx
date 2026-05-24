import type { ParsedLine } from "../../types/music";
import { renderToken } from "../../renderers/renderToken";
import { songViewerStyles } from "../../styles/songViewerStyles";

type Props = {
  line: ParsedLine;
  transpose: number;
};

export default function LineRenderer({ line, transpose }: Props) {
  return (
    <div
      style={{
        ...songViewerStyles.line,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      {line.tokens.map((token, tokenIndex) => (
        <span key={tokenIndex}>
          {renderToken({
            token,
            transpose,
          })}
        </span>
      ))}
    </div>
  );
}
