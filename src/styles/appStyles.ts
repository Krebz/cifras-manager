export const appStyles = (isDark: boolean, presentationMode = false) => ({
  page: {
    minHeight: "100vh",
    background: isDark
      ? "linear-gradient(to bottom, #0f172a, #111827)"
      : "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
    padding: "14px 10px",
  },

  content: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  toolbar: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    alignItems: "center",
    padding: "8px 14px",
    position: presentationMode ? "fixed" as const : "sticky" as const,
    top: presentationMode ? 0 : "6px",
    ...(presentationMode ? { left: 0, right: 0, borderRadius: 0 } : {
      borderRadius: "10px",
    }),
    zIndex: 1000,
    backdropFilter: "blur(12px)",
    backgroundColor: presentationMode
      ? (isDark ? "rgba(15,23,42,0.96)" : "rgba(255,255,255,0.96)")
      : (isDark ? "rgba(15,23,42,0.42)" : "rgba(255,255,255,0.42)"),
    border: isDark
      ? "1px solid rgba(148,163,184,0.22)"
      : "1px solid rgba(148,163,184,0.32)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.22)",
  },

  toolbarGroup: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    height: "36px",
    padding: "0 10px",
    borderRadius: "999px",
    backgroundColor: isDark
      ? "rgba(51,65,85,0.72)"
      : "rgba(148,163,184,0.14)",
    border: isDark
      ? "1px solid rgba(148,163,184,0.46)"
      : "1px solid rgba(148,163,184,0.28)",
    boxShadow: isDark
      ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.24)"
      : "none",
    boxSizing: "border-box" as const,
    flexShrink: 0,
  },

  toolbarButton: {
    backgroundColor: isDark ? "rgba(15,23,42,0.68)" : undefined,
    color: isDark ? "#e2e8f0" : undefined,
    border: isDark ? "1px solid rgba(148,163,184,0.42)" : undefined,
    boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.05)" : undefined,
  },

  toolbarIconButton: {
    backgroundColor: isDark ? "rgba(15,23,42,0.68)" : undefined,
    color: isDark ? "#e2e8f0" : undefined,
    border: isDark ? "1px solid rgba(148,163,184,0.42)" : undefined,
    boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.05)" : undefined,
  },

  songContainer: {
    marginTop: "2px",
  },
});
