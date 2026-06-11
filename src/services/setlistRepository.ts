import type { Setlist } from "../types/setlist";

const STORAGE_KEY = "cifras_setlists";

function generateId(): string {
  return `sl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function getSetlists(): Setlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Setlist[]) : [];
  } catch {
    return [];
  }
}

function saveSetlists(setlists: Setlist[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(setlists));
}

export function getSetlistById(id: string): Setlist | undefined {
  return getSetlists().find((s) => s.id === id);
}

export function createSetlist(name: string, date?: string): Setlist {
  const setlist: Setlist = { id: generateId(), name, date, songIds: [] };
  saveSetlists([...getSetlists(), setlist]);
  return setlist;
}

export function updateSetlist(updated: Setlist): void {
  saveSetlists(getSetlists().map((s) => (s.id === updated.id ? updated : s)));
}

export function deleteSetlist(id: string): void {
  saveSetlists(getSetlists().filter((s) => s.id !== id));
}

export function addSongToSetlist(setlistId: string, songId: string): void {
  const setlist = getSetlistById(setlistId);
  if (!setlist || setlist.songIds.includes(songId)) return;
  updateSetlist({ ...setlist, songIds: [...setlist.songIds, songId] });
}

export function removeSongFromSetlist(setlistId: string, songId: string): void {
  const setlist = getSetlistById(setlistId);
  if (!setlist) return;
  updateSetlist({ ...setlist, songIds: setlist.songIds.filter((id) => id !== songId) });
}

export function moveSongUp(setlistId: string, songId: string): void {
  const setlist = getSetlistById(setlistId);
  if (!setlist) return;
  const idx = setlist.songIds.indexOf(songId);
  if (idx <= 0) return;
  const ids = [...setlist.songIds];
  [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
  updateSetlist({ ...setlist, songIds: ids });
}

export function moveSongDown(setlistId: string, songId: string): void {
  const setlist = getSetlistById(setlistId);
  if (!setlist) return;
  const idx = setlist.songIds.indexOf(songId);
  if (idx < 0 || idx >= setlist.songIds.length - 1) return;
  const ids = [...setlist.songIds];
  [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
  updateSetlist({ ...setlist, songIds: ids });
}
