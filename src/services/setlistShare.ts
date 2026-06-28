import type { Setlist } from "../types/setlist";

type SharePayload = { name: string; date?: string; songIds: string[] };

function toBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

function fromBase64(str: string): string {
  return decodeURIComponent(
    atob(str).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
  );
}

export function encodeSetlist(setlist: Setlist): string {
  const payload: SharePayload = { name: setlist.name, date: setlist.date, songIds: setlist.songIds };
  return toBase64(JSON.stringify(payload));
}

export function decodeSetlist(encoded: string): SharePayload | null {
  try {
    return JSON.parse(fromBase64(encoded)) as SharePayload;
  } catch {
    return null;
  }
}

export function buildShareUrl(setlist: Setlist): string {
  return `${window.location.origin}${window.location.pathname}#/repertorios?importar=${encodeSetlist(setlist)}`;
}

export function extractImportParam(): string | null {
  const match = window.location.hash.match(/[?&]importar=([^&]+)/);
  return match ? match[1] : null;
}

// Import pendente: guardado antes do redirect do OAuth para ser salvo
// automaticamente quando o usuário voltar logado (sessionStorage sobrevive
// à navegação para o Google e de volta, na mesma aba).
const PENDING_KEY = "pending_setlist_import";

export function stashPendingImport(payload: SharePayload): void {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function readPendingImport(): SharePayload | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as SharePayload) : null;
  } catch {
    return null;
  }
}

export function clearPendingImport(): void {
  sessionStorage.removeItem(PENDING_KEY);
}
