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
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const toolbarRef = useRef<HTMLDivElement>(null);
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
  const presentationMode = !!setlistId;
  const styles = appStyles(isDark, presentationMode);

  const setlist = setlistId ? getSetlistById(setlistId) : undefined;
  const setlistIndex = setlist ? setlist.songIds.indexOf(songId) : -1;
  const prevSongId = setlist && setlistIndex > 0 ? setlist.songIds[setlistIndex - 1] : undefined;
  const nextSongId = setlist && setlistIndex < setlist.songIds.length - 1 ? setlist.songIds[setlistIndex + 1] : undefined;

  useEffect(() => {
    setTranspose(0);
    setIsScrolling(false);
    swipeDir.current = null;
  }, [setIsScrolling, songId]);

  // Swipe between songs in setlist mode
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
      if (dx < 0 && nextSongId && setlistId) {
        swipeDir.current = "next";
        navigate(songInSetlistRouteFor(nextSongId, setlistId));
      } else if (dx > 0 && prevSongId && setlistId) {
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

  // Access count
  useEffect(() => {
    if (countedSong.current === songId) return;
    countedSong.current = songId;
    registerAccess(songId);
  }, [registerAccess, songId]);

  // Toolbar height observer (presentation mode)
  useEffect(() => {
    if (!presentationMode) return;
    const el = toolbarRef.current;
    if (!el) return;
    const update = () => setToolbarHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [presentationMode]);

  // Fullscreen state sync
  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  // Scroll progress bar
  useEffect(() => {
    if (!isScrolling) {
      setScrollProgress(0);
      return;
    }
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isScrolling]);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  return (
    <>
      <Toolbar
        ref={presentationMode ? toolbarRef : undefined}
        transpose={transpose}
        currentKey={currentKey}
        isScrolling={isScrolling}
        scrollSpeed={scrollSpeed}
        fontSize={fontSize}
        isDark={isDark}
        toolbarStyles={styles}
        setlistId={setlistId}
        setlistName={setlist?.name}
        prevSongId={prevSongId}
        nextSongId={nextSongId}
        isFullscreen={isFullscreen}
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
        onFontDecrease={() => setFontSize(Math.max(10, fontSize - 2))}
        onFontIncrease={() => setFontSize(Math.min(40, fontSize + 2))}
        onNavigatePrev={prevSongId && setlistId ? () => navigate(songInSetlistRouteFor(prevSongId, setlistId)) : undefined}
        onNavigateNext={nextSongId && setlistId ? () => navigate(songInSetlistRouteFor(nextSongId, setlistId)) : undefined}
        onNavigateSetlist={setlistId ? () => navigate(setlistRouteFor(setlistId)) : undefined}
        onNavigateBack={!setlistId ? () => window.history.back() : undefined}
        onToggleFullscreen={toggleFullscreen}
      />
      {presentationMode && <div style={{ height: toolbarHeight }} />}
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
          referenceUrl={selectedSong.referenceUrl}
        />
      </div>

      {/* Scroll progress bar */}
      {isScrolling && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: `${scrollProgress * 100}%`,
            height: 3,
            background: "linear-gradient(90deg, #2563eb, #10b981)",
            zIndex: 1002,
            transition: "width 0.08s linear",
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
}
