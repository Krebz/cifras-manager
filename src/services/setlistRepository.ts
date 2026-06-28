import type { Setlist } from "../types/setlist";

const STORAGE_KEY = "cifras_setlists";

type RawApiSetlist = {
  _id: string;
  legacyId?: string;
  name: string;
  date?: string | null;
  songIds: string[];
};

function mapApiSetlist(raw: RawApiSetlist): Setlist {
  return {
    id: raw.legacyId ?? raw._id,
    name: raw.name,
    date: raw.date ?? undefined,
    songIds: raw.songIds ?? [],
  };
}

function persist(list: Setlist[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getSetlists(): Setlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Setlist[];
  } catch {
    // ignore
  }
  return [];
}

export function getSetlistById(id: string): Setlist | undefined {
  return getSetlists().find((s) => s.id === id);
}

async function postSetlist(name: string, date?: string, songIds: string[] = []): Promise<Setlist> {
  const response = await fetch("/api/setlists", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, date: date ?? null, songIds }),
  });
  if (!response.ok) throw new Error("Falha ao criar repertório");
  const raw: RawApiSetlist = await response.json();
  return mapApiSetlist(raw);
}

export async function fetchSetlists(): Promise<Setlist[]> {
  const response = await fetch("/api/setlists", { credentials: "include" });
  if (!response.ok) throw new Error("API indisponível");
  const raw: RawApiSetlist[] = await response.json();
  const list = raw.map(mapApiSetlist);
  persist(list);
  return list;
}

// Setlists são por usuário; limpar o cache ao trocar de conta evita
// que um usuário veja (ou herde) os repertórios cacheados de outro.
export function clearSetlistCache(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function createSetlist(name: string, date?: string, songIds: string[] = []): Promise<Setlist> {
  const setlist = await postSetlist(name, date, songIds);
  persist([...getSetlists(), setlist]);
  return setlist;
}

export async function updateSetlist(updated: Setlist): Promise<void> {
  const response = await fetch(`/api/setlists/${updated.id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: updated.name, date: updated.date ?? null, songIds: updated.songIds }),
  });
  if (!response.ok) throw new Error("Falha ao atualizar repertório");
  persist(getSetlists().map((s) => (s.id === updated.id ? updated : s)));
}

export async function deleteSetlist(id: string): Promise<void> {
  const response = await fetch(`/api/setlists/${id}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Falha ao excluir repertório");
  persist(getSetlists().filter((s) => s.id !== id));
}

export async function addSongToSetlist(setlistId: string, songId: string): Promise<void> {
  const setlist = getSetlistById(setlistId);
  if (!setlist || setlist.songIds.includes(songId)) return;
  await updateSetlist({ ...setlist, songIds: [...setlist.songIds, songId] });
}

export async function removeSongFromSetlist(setlistId: string, songId: string): Promise<void> {
  const setlist = getSetlistById(setlistId);
  if (!setlist) return;
  await updateSetlist({ ...setlist, songIds: setlist.songIds.filter((id) => id !== songId) });
}

export async function moveSongUp(setlistId: string, songId: string): Promise<void> {
  const setlist = getSetlistById(setlistId);
  if (!setlist) return;
  const idx = setlist.songIds.indexOf(songId);
  if (idx <= 0) return;
  const ids = [...setlist.songIds];
  [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
  await updateSetlist({ ...setlist, songIds: ids });
}

export async function moveSongDown(setlistId: string, songId: string): Promise<void> {
  const setlist = getSetlistById(setlistId);
  if (!setlist) return;
  const idx = setlist.songIds.indexOf(songId);
  if (idx < 0 || idx >= setlist.songIds.length - 1) return;
  const ids = [...setlist.songIds];
  [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
  await updateSetlist({ ...setlist, songIds: ids });
}
