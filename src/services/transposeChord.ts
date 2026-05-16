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
  chord: string,
  steps: number
) {
  const index = notes.indexOf(chord)

  if (index === -1) {
    return chord
  }

  const newIndex =
    (index + steps + notes.length) % notes.length

  return notes[newIndex]
}