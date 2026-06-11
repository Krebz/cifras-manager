// Regex que reconhece um token de acorde válido
// Ex: G, Am, F#m, Bb, C#maj7, D/F#
const CHORD_TOKEN =
  /^[A-G](#|b)?(m|maj|min|dim|aug|sus[24]?|add\d?|M)?\d*(\/[A-G](#|b)?m?)?$/;

function isChordToken(token: string): boolean {
  return CHORD_TOKEN.test(token);
}

// Linha composta só de acordes e espaços
function isChordLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const tokens = trimmed.split(/\s+/);
  return tokens.length > 0 && tokens.every(isChordToken);
}

// Funde uma linha de acordes posicionais com a linha de letra correspondente
function mergeIntoLyric(chordLine: string, lyricLine: string): string {
  const chords: Array<{ pos: number; chord: string }> = [];
  const re = /\S+/g;
  let match;
  while ((match = re.exec(chordLine)) !== null) {
    chords.push({ pos: match.index, chord: match[0] });
  }

  let result = lyricLine;
  // Inserir da direita para a esquerda para não deslocar posições anteriores
  for (let i = chords.length - 1; i >= 0; i--) {
    const { pos, chord } = chords[i];
    const at = Math.min(pos, result.length);
    result = `${result.slice(0, at)}[${chord}]${result.slice(at)}`;
  }

  return result;
}

// Mapa de nomes de seção em português → diretiva ChordPro
const SECTION_MAP: Record<string, string> = {
  refrão: "chorus",
  refrao: "chorus",
  refrão2: "chorus",
  refrao2: "chorus",
  verso: "verse",
  verso1: "verse",
  verso2: "verse",
  estrofe: "verse",
  estrofe1: "verse",
  estrofe2: "verse",
  ponte: "bridge",
  "pré-refrão": "bridge",
  prerefrão: "bridge",
  intro: "intro",
  introdução: "intro",
  introducao: "intro",
  outro: "outro",
  final: "outro",
  coda: "outro",
};

function normalizeSection(raw: string): string {
  const key = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-záéíóúâêîôûãõç\d-]/g, "");
  return SECTION_MAP[key] ?? raw.trim().toLowerCase();
}

// Detecta linha de marcador de seção: "[Refrão]", "Refrão:", "VERSO 1" etc.
function parseSectionMarker(line: string): string | null {
  const trimmed = line.trim();

  // Formato entre colchetes: [Refrão], [chorus], etc.
  const bracketMatch = trimmed.match(/^\[([^\]]+)\]$/);
  if (bracketMatch) {
    return `[${normalizeSection(bracketMatch[1])}]`;
  }

  // Formato com dois-pontos no final: "Refrão:", "Verso 1:"
  const colonMatch = trimmed.match(/^([^:[\n]{2,30}):$/);
  if (colonMatch) {
    const section = normalizeSection(colonMatch[1]);
    if (SECTION_MAP[section] || ["verse","chorus","bridge","intro","outro"].includes(section)) {
      return `[${section}]`;
    }
  }

  return null;
}

/**
 * Converte cifra no formato tradicional (acordes acima das letras)
 * para o formato ChordPro interno ([Acorde]letra).
 *
 * Suporta:
 *  - Acordes posicionais acima das letras
 *  - Marcadores de seção em português e inglês
 *  - Linhas em branco entre seções
 *  - Linhas de acordes sem letra (instrumental)
 */
export function convertNaturalToChordPro(input: string): string {
  const lines = input.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Linha de marcador de seção
    const sectionMarker = parseSectionMarker(line);
    if (sectionMarker) {
      out.push(sectionMarker);
      i++;
      continue;
    }

    // Linha de acordes
    if (isChordLine(line)) {
      const next = lines[i + 1];

      if (next !== undefined && next.trim() !== "" && !isChordLine(next) && !parseSectionMarker(next)) {
        // Par: acordes + letra → fundir
        out.push(mergeIntoLyric(line, next));
        i += 2;
      } else {
        // Linha instrumental (sem letra): emite acordes entre colchetes
        const chordTokens = line.trim().split(/\s+/).map((c) => `[${c}]`).join(" ");
        out.push(chordTokens);
        i++;
      }
      continue;
    }

    // Tudo o mais (linha de letra pura, linha vazia, texto)
    out.push(line);
    i++;
  }

  return out.join("\n").trim();
}
