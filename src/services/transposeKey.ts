import { keyPrefersFlat } from "./transposeChord";

const sharpNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const flatNotes  = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const FLAT_TO_SHARP: Record<string, string> = {
  Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#", Cb: "B", Fb: "E",
};

export function transposeKey(key: string, steps: number): string {
  const match = key.trim().match(/^([A-G][#b]?)(.*)$/);
  if (!match) return key;

  const root   = match[1]; // ex: "D", "F#", "Bb"
  const suffix = match[2]; // ex: "m", "maj7", ""

  const normalized = FLAT_TO_SHARP[root] ?? root;
  const idx = sharpNotes.indexOf(normalized);
  if (idx === -1) return key;

  const resultIdx = (idx + steps + sharpNotes.length * 2) % sharpNotes.length;
  const preferFlat = keyPrefersFlat(key);
  const newRoot = (preferFlat ? flatNotes : sharpNotes)[resultIdx];

  return newRoot + suffix;
}
