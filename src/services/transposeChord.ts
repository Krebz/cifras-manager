import type { ChordData } from "../types/music";

const notes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
]

export function transposeChord(
  chord: ChordData,
  steps: number
): ChordData {
  const index = notes.indexOf(chord.root)

  if (index === -1) {
    return chord
  }

  const newIndex =
    (index + steps + notes.length) % notes.length

  const transposedRoot = notes[newIndex]

  return {
    ...chord,
    root: transposedRoot,
  };
}