import type { SectionType } from "../types/music";

export function getSectionLabel(type: SectionType) {
  const labels = {
    verse: "Verso",
    chorus: "Refrão",
    bridge: "Ponte",
    intro: "Introdução",
    outro: "Final",
  };

  return labels[type] || type;
}
