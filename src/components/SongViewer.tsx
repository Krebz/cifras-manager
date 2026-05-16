import { parseLine } from "../utils/parseLine"
import { transposeChord } from "../services/transposeChord"

type Props = {
  title: string
  content: string
  transpose?: number
}

export default function SongViewer({
  title,
  content,
  transpose = 2,
}: Props) {
  const lines = content.trim().split("\n")

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "monospace",
        fontSize: "20px",
        lineHeight: 1.8,
      }}
    >
      <h1>{title}</h1>

      {lines.map((line, lineIndex) => {
        const tokens = parseLine(line)

        return (
          <div
            key={lineIndex}
            style={{
              marginBottom: "12px",
            }}
          >
            {tokens.map((token, tokenIndex) => {
if (token.type === "chord") {
  const transposedChord = transposeChord(
    token.value,
    transpose
  )

  return (
    <span
      key={tokenIndex}
      style={{
        color: "#2b6cb0",
        fontWeight: "bold",
        marginRight: "4px",
      }}
    >
      {transposedChord}
    </span>
  )
}

              return (
                <span key={tokenIndex}>
                  {token.value}
                </span>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}