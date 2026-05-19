import { parseSong } from "../utils/parseSong";
import SectionRenderer from "./renderers/SectionRenderer";
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

      {/* Percorre todas as seções da música */}
      {parsedSong.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} transpose={transpose} />
      ))}
    </div>
  );
}
