import type { ParsedLine } from "../../types/music";
import { renderToken } from "../../renderers/renderToken";

type Props = {
  line: ParsedLine;
  transpose: number;
};

export default function LineRenderer({ line, transpose }: Props) {
  return (
    <div
      style={{
        marginBottom: "12px",
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
