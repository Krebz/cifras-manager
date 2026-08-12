import { loadViewState, saveViewState } from "../services/viewStateStore";
import {
  routePathFor,
  routes,
  songInSetlistPathFor,
  type AppRoute,
  type NavigationPage,
} from "./routes";

const songRoutePrefix = `${routes.songs}/`;
const setlistRoutePrefix = `${routes.setlists}/`;

/**
 * "push" = o usuário pediu uma página nova (clicou num card, no menu…).
 * "pop"  = voltar/avançar do navegador (ou `history.back()` da toolbar).
 *
 * A distinção é o que permite restaurar filtros e rolagem só no "voltar" —
 * clicar em "Lista" no menu continua abrindo o catálogo limpo.
 */
export type NavigationKind = "push" | "pop";

let programmaticNavigation = false;
let navigationKind: NavigationKind = "push";

// Registrado na carga do módulo, antes dos listeners que o App cria em efeito,
// para que a origem da navegação já esteja resolvida quando as páginas montam.
window.addEventListener("hashchange", () => {
  navigationKind = programmaticNavigation ? "push" : "pop";
  programmaticNavigation = false;
});

// Nós mesmos cuidamos da rolagem (topo no "push", posição salva no "pop"); sem
// isto o navegador ainda tentaria restaurar por conta, brigando com o nosso.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

export function getNavigationKind(): NavigationKind {
  return navigationKind;
}

/** Chave da rolagem por página — a query string não muda de tela. */
export function scrollKeyFor(hash = window.location.hash) {
  const path = hash.replace(/^#/, "").split("?")[0];
  return `scroll:${path || routes.home}`;
}

export function saveScrollPosition(hash = window.location.hash) {
  saveViewState(scrollKeyFor(hash), window.scrollY);
}

export function loadScrollPosition(hash = window.location.hash) {
  return loadViewState(scrollKeyFor(hash), 0);
}

export function readRoute(hash = window.location.hash): AppRoute {
  const route = hash.replace(/^#/, "") || routes.home;
  const [path, search = ""] = route.split("?");
  const params = new URLSearchParams(search);

  if (path.startsWith(songRoutePrefix)) {
    return {
      page: "song",
      songId: path.replace(songRoutePrefix, ""),
      setlistId: params.get("repertorio") ?? undefined,
    };
  }

  if (path.startsWith(setlistRoutePrefix)) {
    return { page: "setlist", setlistId: path.replace(setlistRoutePrefix, "") };
  }

  switch (path) {
    case routes.songs:
      return { page: "songs", query: params.get("q") ?? "" };
    case routes.setlists:
      return { page: "setlists" };
    case routes.management:
      return { page: "management" };
    case routes.contact:
      return { page: "contact" };
    default:
      return { page: "home" };
  }
}

export function hashForPath(path: string) {
  return `#${path}`;
}

export function routeFor(page: NavigationPage) {
  return routePathFor(page);
}

export function songRouteFor(songId: string) {
  return routes.song(songId);
}

export function songInSetlistRouteFor(songId: string, setlistId: string) {
  return songInSetlistPathFor(songId, setlistId);
}

export function setlistRouteFor(setlistId: string) {
  return routes.setlist(setlistId);
}

export function navigate(path: string) {
  // Guarda onde a página atual parou antes de sair — é o que o "voltar"
  // restaura depois. Precisa ser aqui: o `scrollTo` abaixo já move a página.
  saveScrollPosition();
  programmaticNavigation = true;
  window.location.hash = hashForPath(path);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
