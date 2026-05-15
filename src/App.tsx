import SongViewer from "./components/SongViewer"
import { song } from "./data/song"

function App() {
  return (
    <div>
      <h1>Projeto Cifras</h1>

      <SongViewer
        title={song.title}
        content={song.content}
      />
    </div>
  )
}

export default App