import type { ChordData } from "../types/music";

const sharpNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const flatNotes  = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const FLAT_TO_SHARP: Record<string, string> = {
  Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#", Cb: "B", Fb: "E",
};

// Tonalidades que usam bemóis na armadura de clave
const FLAT_KEYS = new Set([
  "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb",
  "Dm", "Gm", "Cm", "Fm", "Bbm", "Ebm", "Abm",
]);

export function keyPrefersFlat(key: string): boolean {
  const root = key.trim().replace(/\s*(m|min|menor)$/i, "m").replace(/\s+.*/,"");
  return FLAT_KEYS.has(root);
}

function transposeNote(note: string, steps: number, preferFlat: boolean): string {
  // Sem transposição, respeita a grafia exatamente como foi digitada
  // (ex.: Bb continua Bb em vez de virar A#).
  if (steps === 0) return note;
  const normalized = FLAT_TO_SHARP[note] ?? note;
  const idx = sharpNotes.indexOf(normalized);
  if (idx === -1) return note;
  const result = (idx + steps + sharpNotes.length * 2) % sharpNotes.length;
  return (preferFlat ? flatNotes : sharpNotes)[result];
}

export function transposeChord(chord: ChordData, steps: number, preferFlat = false): ChordData {
  return {
    ...chord,
    root: transposeNote(chord.root, steps, preferFlat),
    bass: chord.bass ? transposeNote(chord.bass, steps, preferFlat) : chord.bass,
  };
}
