import { parseLine } from "./parseLine";
import type { SongSection, SectionType, SongDocument } from "../types/music";
import { detectSectionType } from "./detectSectionType";

export function parseSong(content: string): SongDocument {
  const lines = content.trim().split("\n");
  const sections: SongSection[] = [];

  let currentSection: SongSection = {
    type: "verse",
    lines: [],
  };

  for (const line of lines) {
    const parsedLine = parseLine(line);

    const firstToken = parsedLine.tokens[0];

    // verifica se é uma diretiva
    if (firstToken && firstToken.type === "directive") {
      // salva seção anterior
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }

      // remove colchetes
      const sectionType = firstToken.value
        .replace("[", "")
        .replace("]", "") as SectionType;

      // cria nova seção
      currentSection = {
        type: sectionType,
        lines: [],
      };

      continue;
    }

    // adiciona linha normal
    currentSection.lines.push(parsedLine);
  }

  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  return { sections };
}
