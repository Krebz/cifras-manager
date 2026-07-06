import { useEffect, useMemo, useRef, useState } from "react";
import { IconMinimize, IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { transposeKey } from "../../services/transposeKey";
import { appStyles } from "../../styles/appStyles";
import { parseSong } from "../../utils/parseSong";
import { getAllSongs, getSongById } from "../../services/songRepository";
import { fetchSetlistById, getSetlistById } from "../../services/setlistRepository";
import SongViewer from "./components/SongViewer";
import Toolbar from "./components/Toolbar/Toolbar";
import { useSongAccessCounts } from "./songAccessStore";
import { useUserPreferences } from "../../hooks/useUserPreferences";
import { navigate, setlistRouteFor, songInSetlistRouteFor } from "../../app/router";
import { loadSetlistTranspose, saveSetlistTranspose } from "../../services/setlistTransposeStore";

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
  const [transpose, setTranspose] = useState(() =>
    setlistId ? loadSetlistTranspose(setlistId, songId) : 0
  );
  const [capoActive, setCapoActive] = useState(true);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [, forceUpdate] = useState(0);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const countedSong = useRef<string | undefined>(undefined);
  const swipeDir = useRef<"next" | "prev" | null>(null);
  const restoreFullscreen = useRef(false);
  const fontSizeRef = useRef(fontSize);
  useEffect(() => { fontSizeRef.current = fontSize; }, [fontSize]);
  const pinch = useRef({ active: false, initialDist: 0, baseSize: 0 });
  const { isScrolling, setIsScrolling, scrollSpeed, setScrollSpeed } =
    useAutoScroll(savedScrollSpeed);
  const selectedSong = getSongById(songId) ?? getAllSongs()[0];
  const songCapo = selectedSong.capo ?? 0;
  const effectiveTranspose = transpose + (capoActive ? 0 : songCapo);
  const currentKey = transposeKey(selectedSong.key, transpose);
  // quando capo ativo: a tonalidade tocada é a sounding key menos o capo
  const playedKey = capoActive ? transposeKey(selectedSong.key, transpose - songCapo) : currentKey;
  const songDocument = useMemo(
    () => parseSong(selectedSong.title, currentKey, selectedSong.content),
    [currentKey, selectedSong.content, selectedSong.title],
  );
  const presentationMode = !!setlistId;
  const styles = appStyles(isDark, presentationMode);

  const setlist = setlistId ? getSetlistById(setlistId) : undefined;
  const setlistIndex = setlist ? setlist.songIds.indexOf(songId) : -1;

  // Repertório compartilhado aberto por deep-link: busca por id (GET público)
  // para que prev/next e o nome apareçam mesmo fora do cache local.
  useEffect(() => {
    if (setlistId && !getSetlistById(setlistId)) {
      fetchSetlistById(setlistId)
        .then(() => forceUpdate((n) => n + 1))
        .catch(() => {});
    }
  }, [setlistId]);

  const prevSongId = setlist && setlistIndex > 0 ? setlist.songIds[setlistIndex - 1] : undefined;
  const nextSongId = setlist && setlistIndex < setlist.songIds.length - 1 ? setlist.songIds[setlistIndex + 1] : undefined;

  useEffect(() => {
    setTranspose(setlistId ? loadSetlistTranspose(setlistId, songId) : 0);
    setCapoActive(true);
    setIsScrolling(false);
    swipeDir.current = null;
    if (restoreFullscreen.current) {
      restoreFullscreen.current = false;
      document.documentElement.requestFullscreen().catch(() => {});
    }
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
        restoreFullscreen.current = !!document.fullscreenElement;
        navigate(songInSetlistRouteFor(nextSongId, setlistId));
      } else if (dx > 0 && prevSongId && setlistId) {
        swipeDir.current = "prev";
        restoreFullscreen.current = !!document.fullscreenElement;
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

  // Pinch-to-font-size — a pinça mexe SÓ na fonte; o zoom nativo do navegador
  // (que gera a barra de arrasto horizontal) é bloqueado.
  useEffect(() => {
    function dist(t: TouchList) {
      return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    }
    function onStart(e: TouchEvent) {
      if (e.touches.length !== 2) return;
      pinch.current = { active: true, initialDist: dist(e.touches), baseSize: fontSizeRef.current };
    }
    function onMove(e: TouchEvent) {
      const p = pinch.current;
      if (!p.active || e.touches.length !== 2) return;
      // touchmove não-passivo: barra o pinch-zoom nativo enquanto ajusta a fonte
      e.preventDefault();
      const scale = dist(e.touches) / p.initialDist;
      const next = Math.round(p.baseSize * scale);
      setFontSize(Math.min(40, Math.max(10, next)));
    }
    function onEnd(e: TouchEvent) {
      if (e.touches.length === 0) pinch.current.active = false;
    }
    // iOS Safari ignora user-scalable=no; o zoom de página só é barrado pelos
    // eventos gesture* (não-padrão, mas necessários no WebKit).
    function onGesture(e: Event) {
      e.preventDefault();
    }
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("gesturestart", onGesture as EventListener);
    document.addEventListener("gesturechange", onGesture as EventListener);
    document.addEventListener("gestureend", onGesture as EventListener);
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("gesturestart", onGesture as EventListener);
      document.removeEventListener("gesturechange", onGesture as EventListener);
      document.removeEventListener("gestureend", onGesture as EventListener);
    };
  }, [setFontSize]);

  // Persiste transpose por música dentro do repertório
  useEffect(() => {
    if (!setlistId) return;
    saveSetlistTranspose(setlistId, songId, transpose);
  }, [setlistId, songId, transpose]);

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

  const floatingBtnBase: React.CSSProperties = {
    position: "fixed",
    zIndex: 1001,
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  };

  return (
    <>
      {isFullscreen && (
        <>
          <button
            aria-label="Sair de tela cheia"
            onClick={toggleFullscreen}
            style={{
              ...floatingBtnBase,
              top: "16px",
              right: "16px",
              width: "40px",
              height: "40px",
              background: isDark ? "rgba(30,41,59,0.75)" : "rgba(255,255,255,0.75)",
              color: isDark ? "#e2e8f0" : "#1e293b",
              boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
            }}
          >
            <IconMinimize size={18} />
          </button>
          <button
            aria-label={isScrolling ? "Parar rolagem" : "Iniciar rolagem"}
            onClick={() => setIsScrolling((c) => !c)}
            style={{
              ...floatingBtnBase,
              bottom: "28px",
              right: "16px",
              width: "52px",
              height: "52px",
              background: isScrolling ? "rgba(239,68,68,0.9)" : "rgba(37,99,235,0.9)",
              color: "#ffffff",
              boxShadow: isScrolling ? "0 0 18px rgba(239,68,68,0.5)" : "0 2px 14px rgba(0,0,0,0.3)",
            }}
          >
            {isScrolling ? <IconPlayerStop size={22} /> : <IconPlayerPlay size={22} />}
          </button>
        </>
      )}

      {!isFullscreen && (
        <Toolbar
          ref={presentationMode ? toolbarRef : undefined}
          songId={songId}
          transpose={transpose}
          currentKey={currentKey}
          capo={songCapo}
          capoActive={capoActive}
          onCapoToggle={() => setCapoActive((c) => !c)}
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
          onAddedToSetlist={(targetSetlistId) => {
            if (transpose !== 0) saveSetlistTranspose(targetSetlistId, songId, transpose);
          }}
        />
      )}
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
          liturgy={selectedSong.liturgy}
          capo={capoActive ? songCapo : 0}
          playedKey={playedKey}
          transpose={effectiveTranspose}
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
