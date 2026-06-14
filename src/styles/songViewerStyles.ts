export const songViewerStyles = (isDark: boolean) => ({
  container: {
    padding: "8px 10px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "monospace",
    fontSize: "16px",
    color: isDark ? "#e2e8f0" : "#1e293b",
    lineHeight: 1.0,
    overflowX: "hidden" as const,
  },

  sectionScroll: {
    overflowX: "hidden" as const,
  },

  section: {
    marginBottom: "10px",
    padding: "8px 10px",
    paddingBottom: "10px",
    borderBottom: isDark
      ? "1px solid rgba(255,255,255,0.06)"
      : "1px solid rgba(148,163,184,0.18)",
    background: isDark
      ? "rgba(255,255,255,0.03)"
      : "rgba(255, 255, 255, 0.58)",
    borderRadius: "8px",
  },

  header: {
    marginBottom: "10px",
  },

  metaRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px",
    marginTop: "4px",
  },

  title: {
    fontSize: "clamp(22px, 3.2vw, 28px)",
    marginBottom: "4px",
    fontWeight: "bold",
    lineHeight: 1.0,
  },

  artist: {
    fontSize: "14px",
    color: isDark ? "#94a3b8" : "#475569",
    marginTop: "-4px",
    marginBottom: "6px",
    letterSpacing: "0.6px",
    fontWeight: 500,
    opacity: 0.9,
  },

  songKey: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 10px",
    borderRadius: "999px",
    background: isDark ? "rgba(59,130,246,0.12)" : "rgba(37,99,235,0.10)",
    color: isDark ? "#90cdf4" : "#2563eb",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "1px",
    border: isDark
      ? "1px solid rgba(144,205,244,0.2)"
      : "1px solid rgba(37,99,235,0.18)",
    marginTop: "2px",
  },

  songCategory: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 10px",
    borderRadius: "999px",
    background: isDark ? "rgba(34,197,94,0.12)" : "rgba(22,163,74,0.10)",
    color: isDark ? "#86efac" : "#15803d",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.7px",
    border: isDark
      ? "1px solid rgba(134,239,172,0.2)"
      : "1px solid rgba(22,163,74,0.18)",
  },

  chorusSection: {
    background: isDark ? "#2d1b4e" : "#f3e8ff",
    borderLeft: isDark ? "4px solid #9f7aea" : "4px solid #8b5cf6",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "8px",
    marginBottom: "8px",
  },

  bridgeSection: {
    background: isDark ? "#1a2e2b" : "#f0fdf9",
    borderLeft: isDark ? "4px solid #4fd1c5" : "4px solid #0d9488",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "8px",
    marginBottom: "8px",
  },

  sectionTitle: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    marginBottom: "8px",
    borderRadius: "999px",
    background: isDark ? "rgba(168,85,247,0.14)" : "rgba(139,92,246,0.10)",
    border: isDark
      ? "1px solid rgba(168,85,247,0.22)"
      : "1px solid rgba(139,92,246,0.18)",
    color: "#d8b4fe",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1.4px",
    textTransform: "uppercase",
  },

  line: {
    marginBottom: "4px",
  },

  chord: {
    padding: "2px 6px",
    borderRadius: "6px",
    background: isDark ? "rgba(144,205,244,0.08)" : "rgba(37,99,235,0.08)",
    border: isDark
      ? "1px solid rgba(144,205,244,0.12)"
      : "1px solid rgba(37,99,235,0.12)",
    color: isDark ? "#90cdf4" : "#1d4ed8",
    fontWeight: "bold",
    textShadow: isDark ? "0 0 8px rgba(144,205,244,0.25)" : "none",
    letterSpacing: "0.5px",
  },
});
