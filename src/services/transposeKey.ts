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

export function transposeKey(
  key: string,
  steps: number
) {
  const index = notes.indexOf(key)

  if (index === -1) {
    return key
  }

  const newIndex =
    (index + steps + notes.length) % notes.length

  return notes[newIndex]
}