export const appStyles = (isDark: boolean, ultraCompact = false) => ({
  page: {
    minHeight: "100vh",
    background: isDark
      ? "linear-gradient(to bottom, #0f172a, #111827)"
      : "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
    padding: ultraCompact ? "8px 6px" : "14px 10px",
  },

  content: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  toolbar: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: ultraCompact ? "6px" : "8px",
    alignItems: "center",
    padding: ultraCompact ? "6px" : "8px",
    position: "sticky" as const,
    top: ultraCompact ? "4px" : "6px",
    zIndex: 1000,
    backdropFilter: "blur(12px)",
    backgroundColor: isDark ? "rgba(15,23,42,0.42)" : "rgba(255,255,255,0.42)",
    borderRadius: ultraCompact ? "8px" : "10px",
    border: isDark
      ? "1px solid rgba(148,163,184,0.22)"
      : "1px solid rgba(148,163,184,0.32)",
    boxShadow: ultraCompact
      ? "0 3px 8px rgba(0,0,0,0.2)"
      : "0 4px 10px rgba(0,0,0,0.22)",
  },

  // Chip neutro — height fixa = todos os grupos têm o mesmo "respiro"
  // superior e inferior, independente do conteúdo interno.
  toolbarGroup: {
    display: "inline-flex",
    alignItems: "center",
    gap: ultraCompact ? "4px" : "6px",
    height: ultraCompact ? "32px" : "36px",
    padding: ultraCompact ? "0 8px" : "0 10px",
    borderRadius: "999px",
    backgroundColor: isDark
      ? "rgba(148,163,184,0.12)"
      : "rgba(148,163,184,0.14)",
    border: isDark
      ? "1px solid rgba(148,163,184,0.24)"
      : "1px solid rgba(148,163,184,0.28)",
    boxSizing: "border-box" as const,
    flexShrink: 0,
  },

  songContainer: {
    marginTop: ultraCompact ? "0" : "2px",
  },
});
