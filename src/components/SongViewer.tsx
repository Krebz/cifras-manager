import { useMantineColorScheme } from "@mantine/core";
import { parseSong } from "../utils/parseSong";
import SectionRenderer from "./renderers/SectionRenderer";

// Tipagem das propriedades recebidas pelo componente
type Props = {
  title: string;
  artist: string;
  songKey: string;
  content: string;
  transpose?: number;
  fontSize: number;
};
import { songViewerStyles } from "../styles/songViewerStyles";

// Componente responsável pela renderização da música
export default function SongViewer({
  title,
  artist,
  songKey,
  content,
  transpose = 2,
  fontSize,
}: Props) {
  // Faz o parsing completo da música
  // Transforma o texto bruto em uma estrutura renderizáveis
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const styles = songViewerStyles(isDark);
  const parsedSong = parseSong(title, songKey, content);

  return (
    <div
      style={{
        ...styles.container,
        fontSize: `${fontSize}px`,
      }}
    >
      {/* Título da música */}
      <div style={styles.header}>
        <h1 style={styles.title}>{title}</h1>
        <div style={styles.artist}>{artist}</div>
        <div style={styles.songKey}>Tom: {songKey}</div>
      </div>

      {/* Percorre todas as seções da música */}
      {parsedSong.sections.map((section, index) => (
        <SectionRenderer
          key={index}
          section={section}
          transpose={transpose}
          fontSize={fontSize}
          styles={styles}
        />
      ))}
    </div>
  );
}
