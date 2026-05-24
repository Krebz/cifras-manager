import type { ChordData }
from "../types/music";

export function parseChord(
  chord: string
): ChordData {

  const slashParts =
    chord.split("/");

  const mainChord =
    slashParts[0];

  const bass =
    slashParts[1];

  const match =
    mainChord.match(
      /^([A-G][#b]?)(.*)$/
    );

  return {
    root: match?.[1] ?? chord,
    suffix: match?.[2] ?? "",
    bass,
  };
}