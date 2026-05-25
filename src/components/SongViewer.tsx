import { parseSong } from "../utils/parseSong";
import SectionRenderer from "./renderers/SectionRenderer";

// Tipagem das propriedades recebidas pelo componente
type Props = {
  title: string;
  songKey: string;
  content: string;
  transpose?: number;
};
import { songViewerStyles } from "../styles/songViewerStyles";

// Componente responsável pela renderização da música
export default function SongViewer({
  title,
  songKey,
  content,
  transpose = 2,
}: Props) {
  // Faz o parsing completo da música
  // Transforma o texto bruto em uma estrutura renderizáveis
  const parsedSong = parseSong(title, songKey, content);

  return (
    <div style={songViewerStyles.container}>
      {/* Título da música */}
      <div style={songViewerStyles.header}>
        <h1 style={songViewerStyles.title}>{title}</h1>

        <div style={songViewerStyles.songKey}>Tom: {songKey}</div>
      </div>

      {/* Percorre todas as seções da música */}
      {parsedSong.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} transpose={transpose} />
      ))}
    </div>
  );
}
