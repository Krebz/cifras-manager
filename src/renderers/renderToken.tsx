import type { Token } from "../types/music";

import ChordToken from "../components/tokens/ChordToken";
import TextToken from "../components/tokens/TextToken";
import { transposeChord } from "../services/transposeChord";

type Props = {
  token: Token;
  transpose: number;
};

export function renderToken({
  token,
  transpose,
}: Props) {

  if (token.type === "chord") {
    return (
      <ChordToken
        chord={transposeChord(
          token.value,
          transpose
        )}
      />
    );
  }

  if (token.type === "directive") {
    return null;
  }

  return (
    <TextToken text={token.value} />
  );
}