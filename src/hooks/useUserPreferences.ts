import { useCallback, useState } from "react";

const STORAGE_KEY = "cifras_user_prefs";

type UserPreferences = {
  fontSize: number;
  scrollSpeed: number;
  columns: 1 | 2;
};

const DEFAULTS: UserPreferences = { fontSize: 16, scrollSpeed: 5, columns: 1 };

function load(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<UserPreferences>) };
  } catch {
    return DEFAULTS;
  }
}

function save(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors
  }
}

export function useUserPreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(load);

  const setFontSize = useCallback((fontSize: number) => {
    setPrefs((current) => {
      const next = { ...current, fontSize };
      save(next);
      return next;
    });
  }, []);

  const setScrollSpeed = useCallback((scrollSpeed: number) => {
    setPrefs((current) => {
      const next = { ...current, scrollSpeed };
      save(next);
      return next;
    });
  }, []);

  const setColumns = useCallback((columns: 1 | 2) => {
    setPrefs((current) => {
      const next = { ...current, columns };
      save(next);
      return next;
    });
  }, []);

  return {
    fontSize: prefs.fontSize,
    scrollSpeed: prefs.scrollSpeed,
    columns: prefs.columns,
    setFontSize,
    setScrollSpeed,
    setColumns,
  };
}
