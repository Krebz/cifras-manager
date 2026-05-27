export const portalStyles = (isDark: boolean) => ({
  navigation: {
    display: "flex",
    flexWrap: "wrap" as const,
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    borderRadius: "14px",
    backgroundColor: isDark ? "rgba(15,23,42,0.78)" : "rgba(255,255,255,0.78)",
    border: isDark
      ? "1px solid rgba(148,163,184,0.25)"
      : "1px solid rgba(148,163,184,0.32)",
    boxShadow: isDark
      ? "0 8px 24px rgba(0,0,0,0.18)"
      : "0 8px 24px rgba(15,23,42,0.08)",
    backdropFilter: "blur(14px)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: isDark ? "#f8fafc" : "#0f172a",
    fontWeight: 750,
    fontSize: "19px",
    letterSpacing: "0.2px",
  },
  brandMark: {
    display: "grid",
    placeItems: "center",
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    overflow: "hidden",
  },
  brandLogo: {
    width: "28px",
    height: "28px",
    objectFit: "cover" as const,
    filter: "invert(1) contrast(1.45)",
    mixBlendMode: "screen" as const,
  },
  navigationLinks: {
    display: "flex",
    flexWrap: "wrap" as const,
    alignItems: "center",
    gap: "5px",
  },
  navigationButton: {
    border: "1px solid transparent",
    borderRadius: "999px",
    padding: "8px 13px",
    background: "transparent",
    color: isDark ? "#cbd5e1" : "#475569",
    font: "inherit",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  navigationButtonActive: {
    color: isDark ? "#f8fafc" : "#1d4ed8",
    backgroundColor: isDark ? "rgba(59,130,246,0.18)" : "rgba(37,99,235,0.10)",
    border: isDark
      ? "1px solid rgba(96,165,250,0.28)"
      : "1px solid rgba(37,99,235,0.16)",
  },
  themeButton: {
    display: "grid",
    placeItems: "center",
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    border: isDark
      ? "1px solid rgba(148,163,184,0.40)"
      : "1px solid rgba(100,116,139,0.28)",
    backgroundColor: isDark ? "rgba(30,41,59,0.86)" : "#ffffff",
    color: isDark ? "#facc15" : "#334155",
    cursor: "pointer",
  },
  surface: {
    padding: "clamp(18px, 3vw, 30px)",
    borderRadius: "18px",
    backgroundColor: isDark ? "rgba(15,23,42,0.56)" : "rgba(255,255,255,0.66)",
    border: isDark
      ? "1px solid rgba(148,163,184,0.17)"
      : "1px solid rgba(148,163,184,0.24)",
  },
  hero: {
    display: "grid",
    gap: "15px",
    maxWidth: "740px",
    marginBottom: "28px",
  },
  eyebrow: {
    margin: 0,
    color: isDark ? "#93c5fd" : "#2563eb",
    fontSize: "12px",
    fontWeight: 750,
    letterSpacing: "1.4px",
    textTransform: "uppercase" as const,
  },
  title: {
    margin: 0,
    color: isDark ? "#f8fafc" : "#0f172a",
    fontSize: "clamp(28px, 5vw, 43px)",
    lineHeight: 1.12,
    letterSpacing: "-1px",
  },
  description: {
    margin: 0,
    color: isDark ? "#cbd5e1" : "#475569",
    fontSize: "16px",
    lineHeight: 1.55,
  },
  searchForm: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "9px",
    marginTop: "4px",
  },
  input: {
    flex: "1 1 280px",
    minHeight: "46px",
    padding: "0 15px",
    borderRadius: "12px",
    border: isDark
      ? "1px solid rgba(148,163,184,0.42)"
      : "1px solid rgba(100,116,139,0.32)",
    backgroundColor: isDark ? "rgba(15,23,42,0.72)" : "#fff",
    color: isDark ? "#f8fafc" : "#0f172a",
    font: "inherit",
    fontSize: "15px",
  },
  primaryButton: {
    minHeight: "46px",
    padding: "0 18px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    font: "inherit",
    fontSize: "15px",
    fontWeight: 650,
    cursor: "pointer",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexWrap: "wrap" as const,
    gap: "8px",
    marginBottom: "13px",
  },
  sectionTitle: {
    margin: 0,
    color: isDark ? "#f1f5f9" : "#0f172a",
    fontSize: "20px",
    lineHeight: 1.25,
  },
  secondaryAction: {
    border: "none",
    background: "transparent",
    color: isDark ? "#93c5fd" : "#2563eb",
    font: "inherit",
    fontSize: "14px",
    fontWeight: 650,
    cursor: "pointer",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
    gap: "12px",
  },
  rankingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: "14px",
    marginTop: "28px",
  },
  panel: {
    padding: "17px",
    borderRadius: "14px",
    backgroundColor: isDark ? "rgba(30,41,59,0.58)" : "rgba(248,250,252,0.9)",
    border: isDark
      ? "1px solid rgba(148,163,184,0.18)"
      : "1px solid rgba(148,163,184,0.20)",
  },
  rankingRow: {
    display: "grid",
    gridTemplateColumns: "26px 1fr auto",
    alignItems: "center",
    gap: "10px",
    padding: "10px 0",
    borderBottom: isDark
      ? "1px solid rgba(148,163,184,0.12)"
      : "1px solid rgba(148,163,184,0.18)",
    color: isDark ? "#e2e8f0" : "#1e293b",
  },
  rank: {
    color: isDark ? "#64748b" : "#94a3b8",
    fontSize: "13px",
    fontWeight: 700,
  },
  count: {
    color: isDark ? "#93c5fd" : "#2563eb",
    fontSize: "13px",
    fontWeight: 700,
  },
  songCard: {
    display: "grid",
    gap: "9px",
    padding: "15px",
    borderRadius: "13px",
    backgroundColor: isDark ? "rgba(30,41,59,0.60)" : "#ffffff",
    border: isDark
      ? "1px solid rgba(148,163,184,0.23)"
      : "1px solid rgba(148,163,184,0.26)",
  },
  songName: {
    margin: 0,
    color: isDark ? "#f8fafc" : "#0f172a",
    fontSize: "17px",
    fontWeight: 700,
  },
  mutedText: {
    margin: 0,
    color: isDark ? "#94a3b8" : "#64748b",
    fontSize: "14px",
  },
  metadata: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "7px",
    color: isDark ? "#cbd5e1" : "#475569",
    fontSize: "12px",
    fontWeight: 650,
  },
  badge: {
    padding: "3px 8px",
    borderRadius: "999px",
    backgroundColor: isDark ? "rgba(59,130,246,0.13)" : "rgba(37,99,235,0.08)",
  },
  cardAction: {
    justifySelf: "start",
    marginTop: "3px",
    border: "none",
    borderRadius: "9px",
    padding: "8px 12px",
    backgroundColor: isDark ? "rgba(59,130,246,0.17)" : "rgba(37,99,235,0.10)",
    color: isDark ? "#bfdbfe" : "#1d4ed8",
    font: "inherit",
    fontSize: "14px",
    fontWeight: 650,
    cursor: "pointer",
  },
  filterBar: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "10px",
    margin: "20px 0",
  },
  select: {
    minHeight: "46px",
    minWidth: "190px",
    padding: "0 12px",
    borderRadius: "12px",
    border: isDark
      ? "1px solid rgba(148,163,184,0.42)"
      : "1px solid rgba(100,116,139,0.32)",
    backgroundColor: isDark ? "#172134" : "#fff",
    color: isDark ? "#f8fafc" : "#0f172a",
    font: "inherit",
    fontSize: "14px",
  },
  empty: {
    padding: "30px 15px",
    borderRadius: "14px",
    textAlign: "center" as const,
    color: isDark ? "#94a3b8" : "#64748b",
    border: isDark
      ? "1px dashed rgba(148,163,184,0.27)"
      : "1px dashed rgba(100,116,139,0.30)",
  },
});
