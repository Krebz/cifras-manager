import { useMantineColorScheme } from "@mantine/core";
import SectionRenderer from "../../../components/renderers/SectionRenderer";
import { songViewerStyles } from "../../../styles/songViewerStyles";
import type { SongDocument } from "../../../types/music";

type Props = {
  songDocument: SongDocument;
  artist: string;
  category: string;
  transpose: number;
  fontSize: number;
  ultraCompact?: boolean;
};

export default function SongViewer({
  songDocument,
  artist,
  category,
  transpose,
  fontSize,
  ultraCompact = false,
}: Props) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const styles = songViewerStyles(isDark, ultraCompact);

  return (
    <div
      style={{
        ...styles.container,
        fontSize: `${fontSize}px`,
      }}
    >
      <div style={styles.header}>
        <h1 style={styles.title}>{songDocument.title}</h1>
        <div style={styles.artist}>{artist}</div>
        <div style={styles.metaRow}>
          <div style={styles.songKey}>Tom: {songDocument.key}</div>
          <div style={styles.songCategory}>Categoria: {category}</div>
        </div>
      </div>

      {songDocument.sections.map((section, index) => (
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
