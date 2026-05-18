import { transposeChord } from "../services/transposeChord";
import { parseSong } from "../utils/parseSong";

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
      {parsedSong.lines.map((parsedLine, lineIndex) => {
        return (
          <div
            key={lineIndex}
            style={{
              marginBottom: "12px",
            }}
          >
            {/* Percorre os tokens da linha */}
            {parsedLine.tokens.map((token, tokenIndex) => {
              // Se o token for um acorde
              if (token.type === "chord") {
                // Aplica a transposição do acorde
                const transposedChord = transposeChord(token.value, transpose);

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
                );
              }

              // Renderiza texto normal da música
              return <span key={tokenIndex}>{token.value}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}
