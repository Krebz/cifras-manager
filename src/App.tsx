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
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
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
  const isNavSticky = route.page !== "song" && route.page !== "setlist";

  return (
    <div style={{ ...styles.page, ...(isPresentation ? { paddingTop: 0 } : {}) }}>
      <Stack p="xs" gap="xs" style={{ ...styles.content, ...(isPresentation ? { paddingTop: 0 } : {}) }}>
        {!isPresentation && !isFullscreen && route.page !== "song" && (
          <div style={isNavSticky ? { position: "sticky", top: "10px", zIndex: 100 } : undefined}>
            <MainNavigation
              activePage={navigationPage}
              isDark={isDark}
              onNavigate={(page) => navigate(routePathFor(page))}
              onToggleTheme={toggleColorScheme}
              onInstall={installPrompt ? handleInstall : undefined}
            />
          </div>
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

        {!isPresentation && (
          <footer style={{ textAlign: "center", padding: "8px 0 4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: isDark ? "rgba(148,163,184,0.4)" : "rgba(100,116,139,0.4)", fontSize: "11px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px", borderRadius: "5px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", overflow: "hidden", flexShrink: 0 }}>
              <img src="/katando-cifra-logo.jpg" alt="" aria-hidden="true" style={{ width: "13px", height: "13px", objectFit: "cover", filter: "invert(1) contrast(1.45)", mixBlendMode: "screen" as const }} />
            </span>
            © 2026 · Kleber Martins Alves · v1.0.0
          </footer>
        )}
      </Stack>
    </div>
  );
}

export default App;
