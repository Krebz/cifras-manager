import { IconBrandGoogle, IconDownload, IconLogout, IconMoon, IconSun, IconMenu2, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useMediaQuery } from "@mantine/hooks";
import type { NavigationPage } from "../app/routes";
import { portalStyles } from "../styles/portalStyles";
import { useUser } from "../contexts/UserContext";

type Props = {
  activePage: NavigationPage;
  isDark: boolean;
  onNavigate: (page: NavigationPage) => void;
  onToggleTheme: () => void;
  onInstall?: () => void;
};

const links: Array<{ id: NavigationPage; label: string }> = [
  { id: "home", label: "Home" },
  { id: "songs", label: "Lista" },
  { id: "setlists", label: "Repertórios" },
  { id: "management", label: "Gestão de cifra" },
  { id: "contact", label: "Contato" },
];

export default function MainNavigation({
  activePage,
  isDark,
  onNavigate,
  onToggleTheme,
  onInstall,
}: Props) {
  const styles = portalStyles(isDark);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [menuOpen, { toggle: toggleMenu, close: closeMenu }] = useDisclosure(false);
  const { user, logout } = useUser();

  function handleLogout() {
    logout().catch(() => {});
    closeMenu();
  }

  function handleNavigate(page: NavigationPage) {
    onNavigate(page);
    closeMenu();
  }

  const menuBg = isDark ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.98)";
  const menuBorder = isDark ? "1px solid rgba(148,163,184,0.25)" : "1px solid rgba(148,163,184,0.32)";
  const installStyle: React.CSSProperties = {
    ...styles.navigationButton,
    color: isDark ? "#60a5fa" : "#2563eb",
    background: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.08)",
    display: "flex",
    alignItems: "center",
    gap: 4,
  };

  return (
    <div style={{ position: "relative" }}>
      <header style={styles.navigation}>
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          style={{ ...styles.brand, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <span style={styles.brandMark}>
            <img
              src="/katando-cifra-logo.jpg"
              alt="Logo Katando Cifra"
              style={styles.brandLogo}
            />
          </span>
          Katando Cifras
        </button>

        {isMobile ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
              style={styles.themeButton}
              onClick={onToggleTheme}
            >
              {isDark ? <IconSun size={19} /> : <IconMoon size={19} />}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              style={{ ...styles.themeButton }}
              onClick={toggleMenu}
            >
              {menuOpen ? <IconX size={19} /> : <IconMenu2 size={19} />}
            </button>
          </div>
        ) : (
          <nav aria-label="Navegação principal" style={styles.navigationLinks}>
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                className={`nav-btn${activePage === link.id ? " nav-btn--active" : ""}`}
                style={styles.navigationButton}
                onClick={() => handleNavigate(link.id)}
              >
                {link.label}
              </button>
            ))}

            {onInstall && (
              <button type="button" style={installStyle} onClick={onInstall}>
                <IconDownload size={14} />
                Instalar
              </button>
            )}

            <button
              type="button"
              aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
              style={styles.themeButton}
              onClick={onToggleTheme}
            >
              {isDark ? <IconSun size={19} /> : <IconMoon size={19} />}
            </button>

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 2 }}>
                <img
                  src={user.picture}
                  alt={user.name}
                  title={user.name}
                  style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: isDark ? "1px solid rgba(148,163,184,0.3)" : "1px solid rgba(148,163,184,0.4)" }}
                />
                <button
                  type="button"
                  aria-label="Sair"
                  style={{ ...styles.themeButton, color: isDark ? "#94a3b8" : "#64748b" }}
                  onClick={handleLogout}
                >
                  <IconLogout size={17} />
                </button>
              </div>
            ) : (
              <a
                href="/api/auth/google"
                style={{
                  ...styles.navigationButton,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  textDecoration: "none",
                  color: isDark ? "#60a5fa" : "#2563eb",
                  background: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.08)",
                }}
              >
                <IconBrandGoogle size={14} />
                Entrar
              </a>
            )}
          </nav>
        )}
      </header>

      {isMobile && menuOpen && (
        <nav
          aria-label="Navegação principal"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 200,
            background: menuBg,
            border: menuBorder,
            borderRadius: "14px",
            boxShadow: isDark
              ? "0 12px 32px rgba(0,0,0,0.4)"
              : "0 12px 32px rgba(15,23,42,0.12)",
            backdropFilter: "blur(16px)",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              className={`nav-btn${activePage === link.id ? " nav-btn--active" : ""}`}
              style={{
                ...styles.navigationButton,
                width: "100%",
                textAlign: "left",
                borderRadius: "10px",
                padding: "12px 16px",
              }}
              onClick={() => handleNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}

          {onInstall && (
            <button
              type="button"
              style={{
                ...installStyle,
                width: "100%",
                textAlign: "left",
                borderRadius: "10px",
                padding: "12px 16px",
              }}
              onClick={() => { onInstall(); closeMenu(); }}
            >
              <IconDownload size={14} />
              Instalar App
            </button>
          )}

          {user ? (
            <button
              type="button"
              style={{
                ...styles.navigationButton,
                width: "100%",
                textAlign: "left",
                borderRadius: "10px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: isDark ? "#94a3b8" : "#64748b",
              }}
              onClick={handleLogout}
            >
              <img
                src={user.picture}
                alt=""
                style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }}
              />
              Sair ({user.name.split(" ")[0]})
            </button>
          ) : (
            <a
              href="/api/auth/google"
              style={{
                ...styles.navigationButton,
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                textDecoration: "none",
                borderRadius: "10px",
                padding: "12px 16px",
                color: isDark ? "#60a5fa" : "#2563eb",
              }}
            >
              <IconBrandGoogle size={16} />
              Entrar com Google
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
