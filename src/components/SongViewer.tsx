type Props = {
  title: string
  content: string
}

export default function SongViewer({ title, content }: Props) {
  const lines = content.trim().split("\n")

  return (
    <div>
      <h1>{title}</h1>

      {lines.map((line, index) => {
        const match = line.match(/\[(.*?)\](.*)/)

        if (!match) {
          return <p key={index}>{line}</p>
        }

        const chord = match[1]
        const lyric = match[2]

        return (
          <div key={index} style={{ marginBottom: "16px" }}>
            <div style={{ fontWeight: "bold", color: "#2b6cb0" }}>
              {chord}
            </div>

            <div>{lyric}</div>
          </div>
        )
      })}
    </div>
  )
}