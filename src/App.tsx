import { useEffect, useState } from "react";
import { Stack, useMantineColorScheme } from "@mantine/core";
import MainNavigation from "./components/MainNavigation";
import { navigate, readRoute } from "./app/router";
import { routePathFor, type AppRoute, type NavigationPage } from "./app/routes";
import HomePage from "./features/home/HomePage";
import InfoPage from "./features/info/InfoPage";
import ManagementPage from "./features/management/ManagementPage";
import AdminGate from "./features/management/AdminGate";
import SongListPage from "./features/song/SongListPage";
import SongPage from "./features/song/SongPage";
import SetlistListPage from "./features/setlist/SetlistListPage";
import SetlistDetailPage from "./features/setlist/SetlistDetailPage";
import { appStyles } from "./styles/appStyles";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function App() {
  const [route, setRoute] = useState<AppRoute>(readRoute);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const styles = appStyles(isDark);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleRouteChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(() => setInstallPrompt(null));
  }

  const navigationPage: NavigationPage =
    route.page === "song" ? "songs" :
    route.page === "setlist" ? "setlists" :
    route.page;

  const isPresentation = route.page === "song" && !!route.setlistId;

  return (
    <div style={{ ...styles.page, ...(isPresentation ? { paddingTop: 0 } : {}) }}>
      <Stack p="xs" gap="xs" style={{ ...styles.content, ...(isPresentation ? { paddingTop: 0 } : {}) }}>
        {!isPresentation && (
          <MainNavigation
            activePage={navigationPage}
            isDark={isDark}
            onNavigate={(page) => navigate(routePathFor(page))}
            onToggleTheme={toggleColorScheme}
            onInstall={installPrompt ? handleInstall : undefined}
          />
        )}

        {route.page === "home" && <HomePage isDark={isDark} />}

        {route.page === "songs" && (
          <SongListPage initialQuery={route.query} isDark={isDark} />
        )}

        {route.page === "setlists" && <SetlistListPage isDark={isDark} />}

        {route.page === "setlist" && (
          <SetlistDetailPage key={route.setlistId} setlistId={route.setlistId} isDark={isDark} />
        )}

        {route.page === "management" && (
          <AdminGate isDark={isDark}>
            <ManagementPage isDark={isDark} />
          </AdminGate>
        )}

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
