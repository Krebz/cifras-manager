import type { ChordData } from "../types/music";

const notes = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

// Enarmônicos: converte bemóis para o sustenido equivalente antes de transpositar
const FLAT_TO_SHARP: Record<string, string> = {
  Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#", Cb: "B", Fb: "E",
};

function transposeNote(note: string, steps: number): string {
  const normalized = FLAT_TO_SHARP[note] ?? note;
  const idx = notes.indexOf(normalized);
  if (idx === -1) return note; // nota desconhecida: mantém
  return notes[(idx + steps + notes.length) % notes.length];
}

export function transposeChord(chord: ChordData, steps: number): ChordData {
  return {
    ...chord,
    root: transposeNote(chord.root, steps),
    bass: chord.bass ? transposeNote(chord.bass, steps) : chord.bass,
  };
}
