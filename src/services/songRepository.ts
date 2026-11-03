import type { Song } from "../types/music";
import { songs as seedSongs } from "../data/songs";

type RawApiSong = {
  _id: string;
  legacyId?: string;
  title: string;
  artist: string;
  key: string;
  category: string;
  liturgy?: string;
  capo?: number;
  content: string;
  accessCount: number;
  referenceUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

function mapApiSong(raw: RawApiSong): Song {
  return {
    id: raw.legacyId ?? raw._id,
    title: raw.title,
    artist: raw.artist,
    key: raw.key,
    category: raw.category,
    liturgy: raw.liturgy,
    capo: raw.capo,
    content: raw.content,
    accessCount: raw.accessCount ?? 0,
    referenceUrl: raw.referenceUrl,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

/**
 * 404 confirmado pela API. Distingue "a cifra não existe" de "não deu para
 * carregar agora" — as duas situações pedem telas (e saídas) diferentes.
 */
export class SongNotFoundError extends Error {
  constructor(id: string) {
    super(`Cifra ${id} não encontrada`);
    this.name = "SongNotFoundError";
  }
}

/**
 * Busca uma cifra por id direto na API, alimentando o cache local com o
 * resultado. É o que faz um link compartilhado abrir num aparelho cujo cache
 * não tem aquela música — antes a página caía silenciosamente na primeira
 * cifra do catálogo.
 */
export async function fetchSongById(id: string): Promise<Song> {
  const response = await fetch(`/api/songs/${id}`);
  if (response.status === 404) throw new SongNotFoundError(id);
  if (!response.ok) throw new Error("API indisponível");
  return upsertCached(mapApiSong(await response.json()));
}

/** `updatedAt` resolve o caso normal; o stringify cobre entradas sem o campo. */
function isSameSong(cached: Song, fresh: Song): boolean {
  if (cached.updatedAt && fresh.updatedAt) return cached.updatedAt === fresh.updatedAt;
  return JSON.stringify(cached) === JSON.stringify(fresh);
}

/**
 * Confere no servidor se a cifra mudou. Devolve a versão nova (já gravada no
 * cache) ou `null` quando nada mudou — e também quando a rede falha ou a cifra
 * sumiu: revalidação é oportunista e nunca pode virar erro na cara de quem está
 * tocando. Devolver `null` no caso "igual" é o que evita reescrever os ~186 KB
 * do cache a cada checagem.
 */
export async function revalidateSong(id: string): Promise<Song | null> {
  let fresh: Song;
  try {
    const response = await fetch(`/api/songs/${id}`);
    if (!response.ok) return null;
    fresh = mapApiSong(await response.json());
  } catch {
    return null;
  }

  const cached = getSongById(fresh.id);
  if (cached && isSameSong(cached, fresh)) return null;

  return upsertCached(fresh);
}

export async function fetchSongs(): Promise<Song[]> {
  const response = await fetch("/api/songs");
  if (!response.ok) throw new Error("API indisponível");
  const raw: RawApiSong[] = await response.json();
  const list = raw.map(mapApiSong);
  persist(list);
  return list;
}

const STORAGE_KEY = "cifras_songs";

function load(): Song[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Song[];
      const storedIds = new Set(stored.map((s) => s.id));
      const newFromSeed = seedSongs.filter((s) => !storedIds.has(s.id));
      if (newFromSeed.length > 0) {
        const merged = [...stored, ...newFromSeed];
        persist(merged);
        return merged;
      }
      return stored;
    }
  } catch {
    // ignore
  }
  persist(seedSongs);
  return seedSongs;
}

function persist(list: Song[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/** Grava uma música no cache, substituindo a versão antiga se já houver. */
function upsertCached(song: Song): Song {
  const list = load();
  const index = list.findIndex((item) => item.id === song.id);
  if (index === -1) {
    persist([...list, song]);
    return song;
  }
  const next = [...list];
  next[index] = song;
  persist(next);
  return song;
}

export function getAllSongs(): Song[] {
  return load();
}

export function getSongById(id: string): Song | undefined {
  return load().find((song) => song.id === id);
}

export function getSongAccessCounts(): Record<string, number> {
  return Object.fromEntries(load().map((song) => [song.id, song.accessCount]));
}

export async function createSong(data: Omit<Song, "id" | "accessCount">): Promise<Song> {
  const response = await fetch("/api/songs", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Falha ao criar cifra");
  const raw = await response.json();
  return upsertCached(mapApiSong(raw));
}

export async function updateSong(id: string, data: Partial<Omit<Song, "id">>): Promise<Song> {
  // Campos opcionais undefined viram null para sobreviver ao JSON.stringify
  // O handler da API usa $unset para removê-los do documento
  const body = {
    ...data,
    liturgy: data.liturgy === undefined ? null : data.liturgy,
    capo: data.capo === undefined ? null : data.capo,
    referenceUrl: data.referenceUrl === undefined ? null : data.referenceUrl,
  };
  const response = await fetch(`/api/songs/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Falha ao atualizar cifra");
  const raw = await response.json();
  return upsertCached(mapApiSong(raw));
}

export async function deleteSong(id: string): Promise<void> {
  const response = await fetch(`/api/songs/${id}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Falha ao excluir cifra");
  persist(load().filter((s) => s.id !== id));
}

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// Strip [ChordName] markers from song content, keeping only lyric text
const extractLyrics = (content: string) =>
  content.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();

export function getSongCategories(songsList: Song[]): string[] {
  return [...new Set(songsList.map((song) => song.category).filter(Boolean))].sort();
}

export function getSongLiturgies(songsList: Song[]): string[] {
  return [...new Set(songsList.map((song) => song.liturgy).filter(Boolean) as string[])].sort();
}

export function getSongArtists(songsList: Song[]): string[] {
  return [...new Set(songsList.map((song) => song.artist))].sort();
}

export function searchSongs(songsList: Song[], query: string): Song[] {
  const search = normalize(query.trim());

  if (!search) {
    return songsList;
  }

  return songsList.filter((song) => {
    const lyrics = extractLyrics(song.content);
    const searchable = normalize(
      `${song.title} ${song.artist} ${song.category} ${song.liturgy ?? ""} ${song.key} ${lyrics}`,
    );

    return searchable.includes(search);
  });
}

export function filterSongs(
  songsList: Song[],
  category: string,
  artist: string,
  liturgy: string = "",
): Song[] {
  return songsList.filter(
    (song) =>
      (!category || song.category === category) &&
      (!artist || song.artist === artist) &&
      (!liturgy || song.liturgy === liturgy),
  );
}

export function getCatalogSongs(
  songsList: Song[],
  accessCounts: Record<string, number>,
  query: string,
  category: string,
  artist: string,
  liturgy: string = "",
): Song[] {
  const searchedSongs = searchSongs(songsList, query);
  const filteredSongs = filterSongs(searchedSongs, category, artist, liturgy);

  return [...filteredSongs].sort(
    (left, right) =>
      (accessCounts[right.id] ?? 0) - (accessCounts[left.id] ?? 0),
  );
}

type RankingItem = {
  label: string;
  count: number;
};

export function getTopSongs(
  songsList: Song[],
  accessCounts: Record<string, number>,
  limit = 3,
): Song[] {
  return [...songsList]
    .sort(
      (left, right) =>
        (accessCounts[right.id] ?? 0) - (accessCounts[left.id] ?? 0),
    )
    .slice(0, limit);
}

export function getSongRankingByField(
  songsList: Song[],
  accessCounts: Record<string, number>,
  field: "category" | "artist",
  limit = 10,
): RankingItem[] {
  const totals = songsList.reduce<Record<string, number>>((result, song) => {
    result[song[field]] =
      (result[song[field]] ?? 0) + (accessCounts[song.id] ?? 0);
    return result;
  }, {});

  return Object.entries(totals)
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, limit);
}
