import type { Token, ParsedLine } from "../types/music";
import { parseChord } from "./parseChord";

export function parseLine(line: string): ParsedLine {
  const tokens: Token[] = [];
  const normalized = line.trim().toLowerCase();

  const directives = ["[verse]", "[chorus]", "[bridge]", "[intro]", "[outro]"];
  const regex = /\[(.*?)\]/g;

  if (directives.includes(normalized)) {
    tokens.push({
      type: "directive",
      value: normalized,
      position: 0,
    });

    return {
      raw: line,
      tokens,
    };
  }

  let lastIndex = 0;

  for (const match of line.matchAll(regex)) {
    const chord = match[1];

    const matchIndex = match.index ?? 0;

    const textBefore = line.slice(lastIndex, matchIndex);

    if (textBefore) {
      tokens.push({
        type: "text",
        value: textBefore,
        position: matchIndex,
      });
    }

    tokens.push({
      type: "chord",
      value: parseChord(chord),
      position: matchIndex,
    });

    lastIndex = matchIndex + match[0].length;
  }

  const remainingText = line.slice(lastIndex);

  if (remainingText) {
    tokens.push({
      type: "text",
      value: remainingText,
      position: lastIndex,
    });
  }

  return {
    raw: line,
    tokens,
  };
}
