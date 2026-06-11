import { IconMoon, IconSun } from "@tabler/icons-react";
import type { NavigationPage } from "../app/routes";
import { portalStyles } from "../styles/portalStyles";

type Props = {
  activePage: NavigationPage;
  isDark: boolean;
  onNavigate: (page: NavigationPage) => void;
  onToggleTheme: () => void;
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
}: Props) {
  const styles = portalStyles(isDark);

  return (
    <header style={styles.navigation}>
      <div style={styles.brand}>
        <span style={styles.brandMark}>
          <img
            src="/katando-cifra-logo.jpg"
            alt="Logo Katando Cifra"
            style={styles.brandLogo}
          />
        </span>
        Katando Cifra
      </div>

      <nav aria-label="Navegação principal" style={styles.navigationLinks}>
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            style={{
              ...styles.navigationButton,
              ...(activePage === link.id ? styles.navigationButtonActive : {}),
            }}
            onClick={() => onNavigate(link.id)}
          >
            {link.label}
          </button>
        ))}

        <button
          type="button"
          aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
          style={styles.themeButton}
          onClick={onToggleTheme}
        >
          {isDark ? <IconSun size={19} /> : <IconMoon size={19} />}
        </button>
      </nav>
    </header>
  );
}
