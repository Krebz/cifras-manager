import { useEffect, useMemo, useRef, useState } from "react";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { transposeKey } from "../../services/transposeKey";
import { appStyles } from "../../styles/appStyles";
import { parseSong } from "../../utils/parseSong";
import { getAllSongs, getSongById } from "../../services/songRepository";
import { getSetlistById } from "../../services/setlistRepository";
import SongViewer from "./components/SongViewer";
import Toolbar from "./components/Toolbar/Toolbar";
import { useSongAccessCounts } from "./songAccessStore";
import { useUserPreferences } from "../../hooks/useUserPreferences";
import { navigate, setlistRouteFor, songInSetlistRouteFor } from "../../app/router";

type Props = {
  songId: string;
  setlistId?: string;
  isDark: boolean;
};

export default function SongPage({ songId, setlistId, isDark }: Props) {
  const { registerAccess } = useSongAccessCounts();
  const {
    fontSize,
    scrollSpeed: savedScrollSpeed,
    setFontSize,
    setScrollSpeed: saveScrollSpeed,
  } = useUserPreferences();
  const [transpose, setTranspose] = useState(0);
  const [ultraCompact, setUltraCompact] = useState(false);
  const countedSong = useRef<string | undefined>(undefined);
  const swipeDir = useRef<"next" | "prev" | null>(null);
  const { isScrolling, setIsScrolling, scrollSpeed, setScrollSpeed } =
    useAutoScroll(savedScrollSpeed);
  const selectedSong = getSongById(songId) ?? getAllSongs()[0];
  const currentKey = transposeKey(selectedSong.key, transpose);
  const songDocument = useMemo(
    () => parseSong(selectedSong.title, currentKey, selectedSong.content),
    [currentKey, selectedSong.content, selectedSong.title],
  );
  const styles = appStyles(isDark, ultraCompact);

  const setlist = setlistId ? getSetlistById(setlistId) : undefined;
  const setlistIndex = setlist ? setlist.songIds.indexOf(songId) : -1;
  const prevSongId = setlist && setlistIndex > 0 ? setlist.songIds[setlistIndex - 1] : undefined;
  const nextSongId = setlist && setlistIndex < setlist.songIds.length - 1 ? setlist.songIds[setlistIndex + 1] : undefined;

  useEffect(() => {
    setTranspose(0);
    setIsScrolling(false);
    swipeDir.current = null;
  }, [setIsScrolling, songId]);

  useEffect(() => {
    if (!setlistId) return;

    let startX = 0;
    let startY = 0;

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.75) return;
      if (dx < 0 && nextSongId) {
        swipeDir.current = "next";
        navigate(songInSetlistRouteFor(nextSongId, setlistId));
      } else if (dx > 0 && prevSongId) {
        swipeDir.current = "prev";
        navigate(songInSetlistRouteFor(prevSongId, setlistId));
      }
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [setlistId, prevSongId, nextSongId]);

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
        setlistId={setlistId}
        setlistName={setlist?.name}
        prevSongId={prevSongId}
        nextSongId={nextSongId}
        onTransposeDecrease={() => setTranspose((current) => current - 1)}
        onTransposeIncrease={() => setTranspose((current) => current + 1)}
        onTransposeReset={() => setTranspose(0)}
        onScrollToggle={() => setIsScrolling((current) => !current)}
        onScrollSpeedDecrease={() => {
          const next = Math.max(1, scrollSpeed - 1);
          setScrollSpeed(next);
          saveScrollSpeed(next);
        }}
        onScrollSpeedIncrease={() => {
          const next = Math.min(10, scrollSpeed + 1);
          setScrollSpeed(next);
          saveScrollSpeed(next);
        }}
        onFontDecrease={() => setFontSize(Math.max(16, fontSize - 2))}
        onFontIncrease={() => setFontSize(Math.min(40, fontSize + 2))}
        onToggleUltraCompact={() => setUltraCompact((current) => !current)}
        onNavigatePrev={prevSongId && setlistId ? () => navigate(songInSetlistRouteFor(prevSongId, setlistId)) : undefined}
        onNavigateNext={nextSongId && setlistId ? () => navigate(songInSetlistRouteFor(nextSongId, setlistId)) : undefined}
        onNavigateSetlist={setlistId ? () => navigate(setlistRouteFor(setlistId)) : undefined}
        onNavigateBack={!setlistId ? () => window.history.back() : undefined}
      />
      <div
        key={songId}
        style={{
          ...styles.songContainer,
          animation: swipeDir.current === "next"
            ? "songSlideFromRight 0.28s ease-out"
            : swipeDir.current === "prev"
            ? "songSlideFromLeft 0.28s ease-out"
            : "songFadeIn 0.2s ease-out",
        }}
      >
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
