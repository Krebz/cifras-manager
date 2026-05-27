import { useState } from "react";
import { Stack, useMantineColorScheme } from "@mantine/core";
import SongViewer from "./components/SongViewer";
import Toolbar from "./components/Toolbar/Toolbar";
import { defaultSong } from "./data/songs";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { transposeKey } from "./services/transposeKey";
import { appStyles } from "./styles/appStyles";

function App() {
  const [transpose, setTranspose] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [ultraCompact, setUltraCompact] = useState(false);
  const { isScrolling, setIsScrolling, scrollSpeed, setScrollSpeed } =
    useAutoScroll();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const styles = appStyles(isDark, ultraCompact);
  const currentKey = transposeKey(defaultSong.key, transpose);

  return (
    <div style={styles.page}>
      <Stack p="xs" gap="xs" style={styles.content}>
        <Toolbar
          transpose={transpose}
          currentKey={currentKey}
          isScrolling={isScrolling}
          scrollSpeed={scrollSpeed}
          fontSize={fontSize}
          isDark={isDark}
          ultraCompact={ultraCompact}
          onTransposeDecrease={() => setTranspose((prev) => prev - 1)}
          onTransposeIncrease={() => setTranspose((prev) => prev + 1)}
          onScrollToggle={() => setIsScrolling((prev) => !prev)}
          onScrollSpeedDecrease={() =>
            setScrollSpeed((prev) => Math.max(1, prev - 1))
          }
          onScrollSpeedIncrease={() =>
            setScrollSpeed((prev) => Math.min(10, prev + 1))
          }
          onFontDecrease={() => setFontSize((prev) => Math.max(16, prev - 2))}
          onFontIncrease={() => setFontSize((prev) => Math.min(40, prev + 2))}
          onToggleTheme={toggleColorScheme}
          onToggleUltraCompact={() => setUltraCompact((prev) => !prev)}
        />

        <div style={styles.songContainer}>
          <SongViewer
            title={defaultSong.title}
            artist={defaultSong.artist}
            category={defaultSong.category}
            songKey={currentKey}
            content={defaultSong.content}
            transpose={transpose}
            fontSize={fontSize}
            ultraCompact={ultraCompact}
          />
        </div>
      </Stack>
    </div>
  );
}

export default App;
