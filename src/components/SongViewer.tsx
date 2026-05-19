import { parseSong } from "../utils/parseSong";
import LineRenderer from "./renderers/LineRenderer";
// Tipagem das propriedades recebidas pelo componente
type Props = {
  title: string;
  content: string;
  transpose?: number;
};

// Componente responsável pela renderização da música
export default function SongViewer({ title, content, transpose = 2 }: Props) {
  // Faz o parsing completo da música
  // Transforma o texto bruto em uma estrutura renderizáveis
  const parsedSong = parseSong(content);

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "monospace",
        fontSize: "20px",
        lineHeight: 1.8,
      }}
    >
      {/* Título da música */}
      <h1>{title}</h1>

      {/* Percorre todas as linhas já parseadas */}
      {parsedSong.sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {section.lines.map((line, lineIndex) => (
            <LineRenderer key={lineIndex} line={line} transpose={transpose} />
          ))}
        </div>
      ))}
    </div>
  );
}
