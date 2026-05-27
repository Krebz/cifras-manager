import { useMantineColorScheme } from "@mantine/core";
import { songViewerStyles } from "../../styles/songViewerStyles";
import type { ChordData } from "../../types/music";

type Props = {
  chord: ChordData;
};

export default function ChordToken({ chord }: Props) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const styles = songViewerStyles(isDark);

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        marginRight: "6px",
      }}
    >
      <span style={styles.chord}>
        {chord.root}
        {chord.suffix}

        {chord.bass && `/${chord.bass}`}
      </span>
    </div>
  );
}
