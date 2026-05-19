import type { SectionType } from "../types/music";

export function detectSectionType(line: string): SectionType | null {
  const normalized = line.trim().toLowerCase();

  if (normalized === "[chorus]") {
    return "chorus";
  }

  if (normalized === "[verse]") {
    return "verse";
  }

  if (normalized === "[bridge]") {
    return "bridge";
  }

  if (normalized === "[intro]") {
    return "intro";
  }

  if (normalized === "[outro]") {
    return "outro";
  }

  return null;
}
