import type { Token, ParsedLine } from "../types/music";
import { parseChord } from "./parseChord";

// Marcação inline de ênfase: **negrito** e _itálico_.
// Percorre os tokens já divididos por acordes mantendo o estado de negrito/
// itálico aberto — assim a ênfase pode atravessar um acorde no meio da palavra
// (ex.: **Re[G]frão**). Os marcadores são removidos e o estado é carimbado em
// cada trecho de texto resultante. O estado é local à linha (reinicia a cada
// chamada), então marcadores não fechados só afetam a própria linha.
function applyInlineMarkup(tokens: Token[]): Token[] {
  let bold = false;
  let italic = false;
  const out: Token[] = [];

  for (const token of tokens) {
    if (token.type !== "text") {
      out.push(token);
      continue;
    }

    const text = token.value;
    let buffer = "";
    let i = 0;

    const flush = () => {
      if (!buffer) return;
      out.push({ type: "text", value: buffer, position: token.position, bold, italic });
      buffer = "";
    };

    while (i < text.length) {
      if (text[i] === "*" && text[i + 1] === "*") {
        flush();
        bold = !bold;
        i += 2;
      } else if (text[i] === "_") {
        flush();
        italic = !italic;
        i += 1;
      } else {
        buffer += text[i];
        i += 1;
      }
    }
    flush();
  }

  return out;
}

export function parseLine(line: string): ParsedLine {
  const tokens: Token[] = [];
  const normalized = line.trim().toLowerCase();

  const directives = ["[verse]", "[chorus]", "[bridge]", "[intro]", "[outro]", "[note]"];
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
  // Posição "visível" na linha (ignorando marcações de acordes tipo [G])
  let visiblePos = 0;

  for (const match of line.matchAll(regex)) {
    const chord = match[1];

    const matchIndex = match.index ?? 0;

    const textBefore = line.slice(lastIndex, matchIndex);

    if (textBefore) {
      tokens.push({
        type: "text",
        value: textBefore,
        position: visiblePos,
      });
      visiblePos += textBefore.length;
    }

    tokens.push({
      type: "chord",
      value: parseChord(chord),
      position: visiblePos,
    });

    lastIndex = matchIndex + match[0].length;
  }

  const remainingText = line.slice(lastIndex);

  if (remainingText) {
    tokens.push({
      type: "text",
      value: remainingText,
      position: visiblePos,
    });
  }

  return {
    raw: line,
    tokens: applyInlineMarkup(tokens),
  };
}
