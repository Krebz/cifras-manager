const STORAGE_KEY = "cifras_setlist_transposes";

type TransposeMap = Record<string, number>;

function load(): TransposeMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TransposeMap) : {};
  } catch {
    return {};
  }
}

function persist(map: TransposeMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

function storeKey(setlistId: string, songId: string): string {
  return `${setlistId}:${songId}`;
}

export function loadSetlistTranspose(setlistId: string, songId: string): number {
  return load()[storeKey(setlistId, songId)] ?? 0;
}

export function saveSetlistTranspose(setlistId: string, songId: string, transpose: number): void {
  const map = load();
  const k = storeKey(setlistId, songId);
  if (transpose === 0) {
    delete map[k];
  } else {
    map[k] = transpose;
  }
  persist(map);
}
