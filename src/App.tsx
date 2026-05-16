import { useState } from "react"

import SongViewer from "./components/SongViewer"

import { song } from "./data/song"

function App() {
  const [transpose, setTranspose] = useState(0)

  return (
    <div>
      <h1>Projeto Cifras</h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <button
          onClick={() =>
            setTranspose(transpose - 1)
          }
        >
          -
        </button>

        <span>
          Tom: {transpose > 0 ? "+" : ""}
          {transpose}
        </span>

        <button
          onClick={() =>
            setTranspose(transpose + 1)
          }
        >
          +
        </button>
      </div>

      <SongViewer
        title={song.title}
        content={song.content}
        transpose={transpose}
      />
    </div>
  )
}

export default App