import { useEffect, useState } from "react";
import { Stack, useMantineColorScheme } from "@mantine/core";
import MainNavigation from "./components/MainNavigation";
import { navigate, readRoute } from "./app/router";
import { routePathFor, type AppRoute, type NavigationPage } from "./app/routes";
import HomePage from "./features/home/HomePage";
import InfoPage from "./features/info/InfoPage";
import ManagementPage from "./features/management/ManagementPage";
import SongListPage from "./features/song/SongListPage";
import SongPage from "./features/song/SongPage";
import SetlistListPage from "./features/setlist/SetlistListPage";
import SetlistDetailPage from "./features/setlist/SetlistDetailPage";
import { appStyles } from "./styles/appStyles";

function App() {
  const [route, setRoute] = useState<AppRoute>(readRoute);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const styles = appStyles(isDark);

  useEffect(() => {
    const handleRouteChange = () => setRoute(readRoute());

    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  const navigationPage: NavigationPage =
    route.page === "song" ? "songs" :
    route.page === "setlist" ? "setlists" :
    route.page;

  return (
    <div style={styles.page}>
      <Stack p="xs" gap="xs" style={styles.content}>
        <MainNavigation
          activePage={navigationPage}
          isDark={isDark}
          onNavigate={(page) => navigate(routePathFor(page))}
          onToggleTheme={toggleColorScheme}
        />

        {route.page === "home" && <HomePage isDark={isDark} />}

        {route.page === "songs" && (
          <SongListPage initialQuery={route.query} isDark={isDark} />
        )}

        {route.page === "setlists" && <SetlistListPage isDark={isDark} />}

        {route.page === "setlist" && (
          <SetlistDetailPage key={route.setlistId} setlistId={route.setlistId} isDark={isDark} />
        )}

        {route.page === "management" && <ManagementPage isDark={isDark} />}

        {route.page === "contact" && (
          <InfoPage kind="contact" isDark={isDark} />
        )}

        {route.page === "song" && (
          <SongPage key={route.songId} songId={route.songId} setlistId={route.setlistId} isDark={isDark} />
        )}
      </Stack>
    </div>
  );
}

export default App;
