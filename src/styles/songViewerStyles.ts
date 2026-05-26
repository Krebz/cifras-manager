export const songViewerStyles = (isDark: boolean) => ({
  container: {
    padding: "20px 28px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "monospace",
    fontSize: "20px",
    color: isDark ? "#e2e8f0" : "#1e293b",
    lineHeight: 1.0,
  },

  section: {
    marginBottom: "20px",
    padding: "12px 16px",
    paddingBottom: "16px",
    borderBottom: isDark
      ? "1px solid rgba(255,255,255,0.06)"
      : "1px solid rgba(148,163,184,0.18)",
    backgroundColor: isDark
      ? "rgba(255,255,255,0.03)"
      : "rgba(255, 255, 255, 0.58)",
    borderRadius: "12px",
  },

  header: {
    marginBottom: "20px",
  },

  title: {
    fontSize: "clamp(28px, 4vw, 32px)",
    marginBottom: "8px",
    fontWeight: "bold",
    lineHeight: 1.0,
  },

  artist: {
    fontSize: "16px",
    color: isDark ? "#94a3b8" : "#475569",
    marginTop: "-4px",
    marginBottom: "14px",
    letterSpacing: "0.6px",
    fontWeight: 500,
    opacity: 0.9,
  },

  songKey: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "999px",
    backgroundColor: isDark ? "rgba(59,130,246,0.12)" : "rgba(37,99,235,0.10)",
    color: isDark ? "#90cdf4" : "#2563eb",
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "1px",
    border: isDark
      ? "1px solid rgba(144,205,244,0.2)"
      : "1px solid rgba(37,99,235,0.18)",
    marginTop: "8px",
  },

  chorusSection: {
    backgroundColor: isDark ? "#2d1b4e" : "#f3e8ff",
    borderLeft: isDark ? "4px solid #9f7aea" : "4px solid #8b5cf6",
    padding: "16px",
    borderRadius: "8px",
    marginTop: "16px",
    marginBottom: "16px",
  },

  sectionTitle: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 14px",
    marginBottom: "18px",
    borderRadius: "999px",
    backgroundColor: isDark ? "rgba(168,85,247,0.14)" : "rgba(139,92,246,0.10)",
    border: isDark
      ? "1px solid rgba(168,85,247,0.22)"
      : "1px solid rgba(139,92,246,0.18)",
    color: "#d8b4fe",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "1.4px",
    textTransform: "uppercase",
  },

  line: {
    marginBottom: "10px",
  },

  chord: {
    padding: "2px 6px",
    borderRadius: "6px",
    backgroundColor: isDark ? "rgba(144,205,244,0.08)" : "rgba(37,99,235,0.08)",
    border: isDark
      ? "1px solid rgba(144,205,244,0.12)"
      : "1px solid rgba(37,99,235,0.12)",
    color: isDark ? "#90cdf4" : "#1d4ed8",
    fontWeight: "bold",
    textShadow: isDark ? "0 0 8px rgba(144,205,244,0.25)" : "none",
    letterSpacing: "0.5px",
  },
});
