import { useEffect, useMemo, useRef, useState } from "react";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { transposeKey } from "../../services/transposeKey";
import { appStyles } from "../../styles/appStyles";
import { parseSong } from "../../utils/parseSong";
import { getAllSongs, getSongById } from "../../services/songRepository";
import SongViewer from "./components/SongViewer";
import Toolbar from "./components/Toolbar/Toolbar";
import { useSongAccessCounts } from "./songAccessStore";

type Props = {
  songId: string;
  isDark: boolean;
};

export default function SongPage({ songId, isDark }: Props) {
  const { registerAccess } = useSongAccessCounts();
  const [transpose, setTranspose] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [ultraCompact, setUltraCompact] = useState(false);
  const countedSong = useRef<string | undefined>(undefined);
  const { isScrolling, setIsScrolling, scrollSpeed, setScrollSpeed } =
    useAutoScroll();
  const selectedSong = getSongById(songId) ?? getAllSongs()[0];
  const currentKey = transposeKey(selectedSong.key, transpose);
  const songDocument = useMemo(
    () => parseSong(selectedSong.title, currentKey, selectedSong.content),
    [currentKey, selectedSong.content, selectedSong.title],
  );
  const styles = appStyles(isDark, ultraCompact);

  useEffect(() => {
    setTranspose(0);
    setIsScrolling(false);
  }, [setIsScrolling, songId]);

  useEffect(() => {
    if (countedSong.current === songId) {
      return;
    }

    countedSong.current = songId;
    registerAccess(songId);
  }, [registerAccess, songId]);

  return (
    <>
      <Toolbar
        transpose={transpose}
        currentKey={currentKey}
        isScrolling={isScrolling}
        scrollSpeed={scrollSpeed}
        fontSize={fontSize}
        isDark={isDark}
        ultraCompact={ultraCompact}
        toolbarStyles={styles}
        onTransposeDecrease={() => setTranspose((current) => current - 1)}
        onTransposeIncrease={() => setTranspose((current) => current + 1)}
        onScrollToggle={() => setIsScrolling((current) => !current)}
        onScrollSpeedDecrease={() =>
          setScrollSpeed((current) => Math.max(1, current - 1))
        }
        onScrollSpeedIncrease={() =>
          setScrollSpeed((current) => Math.min(10, current + 1))
        }
        onFontDecrease={() =>
          setFontSize((current) => Math.max(16, current - 2))
        }
        onFontIncrease={() =>
          setFontSize((current) => Math.min(40, current + 2))
        }
        onToggleUltraCompact={() => setUltraCompact((current) => !current)}
      />
      <div style={styles.songContainer}>
        <SongViewer
          songDocument={songDocument}
          artist={selectedSong.artist}
          category={selectedSong.category}
          transpose={transpose}
          fontSize={fontSize}
          ultraCompact={ultraCompact}
        />
      </div>
    </>
  );
}
