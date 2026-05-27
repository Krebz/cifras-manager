import { useEffect, useRef, useState } from "react";
import { Stack, useMantineColorScheme } from "@mantine/core";
import MainNavigation, {
  type NavigationPage,
} from "./components/MainNavigation";
import SongViewer from "./components/SongViewer";
import Toolbar from "./components/Toolbar/Toolbar";
import { songs } from "./data/songs";
import { useAutoScroll } from "./hooks/useAutoScroll";
import HomePage from "./pages/HomePage";
import InfoPage from "./pages/InfoPage";
import SongListPage from "./pages/SongListPage";
import { transposeKey } from "./services/transposeKey";
import { appStyles } from "./styles/appStyles";

type AppRoute =
  | { page: "home" }
  | { page: "songs" }
  | { page: "management" }
  | { page: "contact" }
  | { page: "song"; songId: string };

function readRoute(): AppRoute {
  const route = window.location.hash.replace(/^#/, "") || "/";

  if (route.startsWith("/musicas/")) {
    return { page: "song", songId: route.replace("/musicas/", "") };
  }

  switch (route) {
    case "/musicas":
      return { page: "songs" };
    case "/gestao-cifras":
      return { page: "management" };
    case "/contato":
      return { page: "contact" };
    default:
      return { page: "home" };
  }
}

function routeFor(page: NavigationPage) {
  switch (page) {
    case "songs":
      return "#/musicas";
    case "management":
      return "#/gestao-cifras";
    case "contact":
      return "#/contato";
    default:
      return "#/";
  }
}

function App() {
  const [route, setRoute] = useState<AppRoute>(readRoute);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [transpose, setTranspose] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [ultraCompact, setUltraCompact] = useState(false);
  const [accessCounts, setAccessCounts] = useState<Record<string, number>>(
    Object.fromEntries(songs.map((song) => [song.id, song.accessCount])),
  );
  const countedSong = useRef<string | undefined>(undefined);
  const { isScrolling, setIsScrolling, scrollSpeed, setScrollSpeed } =
    useAutoScroll();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const isSongPage = route.page === "song";
  const styles = appStyles(isDark, isSongPage && ultraCompact);
  const selectedSong =
    route.page === "song"
      ? songs.find((song) => song.id === route.songId) ?? songs[0]
      : undefined;
  const currentKey = selectedSong
    ? transposeKey(selectedSong.key, transpose)
    : "";

  useEffect(() => {
    const handleRouteChange = () => setRoute(readRoute());

    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  useEffect(() => {
    if (route.page !== "song") {
      countedSong.current = undefined;
      return;
    }

    if (countedSong.current === route.songId) {
      return;
    }

    countedSong.current = route.songId;
    setAccessCounts((current) => ({
      ...current,
      [route.songId]: (current[route.songId] ?? 0) + 1,
    }));
  }, [route]);

  const navigate = (nextRoute: string) => {
    window.location.hash = nextRoute;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSong = (songId: string) => {
    setTranspose(0);
    setIsScrolling(false);
    navigate(`#/musicas/${songId}`);
  };

  const navigationPage: NavigationPage =
    route.page === "song" ? "songs" : route.page;

  return (
    <div style={styles.page}>
      <Stack p="xs" gap="xs" style={styles.content}>
        <MainNavigation
          activePage={navigationPage}
          isDark={isDark}
          onNavigate={(page) => navigate(routeFor(page))}
          onToggleTheme={toggleColorScheme}
        />

        {route.page === "home" && (
          <HomePage
            songs={songs}
            accessCounts={accessCounts}
            isDark={isDark}
            onBrowse={() => navigate("#/musicas")}
            onOpenSong={openSong}
            onSearch={(query) => {
              setCatalogQuery(query);
              navigate("#/musicas");
            }}
          />
        )}

        {route.page === "songs" && (
          <SongListPage
            key={catalogQuery}
            songs={songs}
            accessCounts={accessCounts}
            initialQuery={catalogQuery}
            isDark={isDark}
            onOpenSong={openSong}
          />
        )}

        {(route.page === "management" || route.page === "contact") && (
          <InfoPage kind={route.page} isDark={isDark} />
        )}

        {route.page === "song" && selectedSong && (
          <>
            <Toolbar
              transpose={transpose}
              currentKey={currentKey}
              isScrolling={isScrolling}
              scrollSpeed={scrollSpeed}
              fontSize={fontSize}
              isDark={isDark}
              ultraCompact={ultraCompact}
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
              onToggleUltraCompact={() =>
                setUltraCompact((current) => !current)
              }
            />
            <div style={styles.songContainer}>
              <SongViewer
                title={selectedSong.title}
                artist={selectedSong.artist}
                category={selectedSong.category}
                songKey={currentKey}
                content={selectedSong.content}
                transpose={transpose}
                fontSize={fontSize}
                ultraCompact={ultraCompact}
              />
            </div>
          </>
        )}
      </Stack>
    </div>
  );
}

export default App;
