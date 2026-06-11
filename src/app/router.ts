import {
  routePathFor,
  routes,
  songInSetlistPathFor,
  type AppRoute,
  type NavigationPage,
} from "./routes";

const songRoutePrefix = `${routes.songs}/`;
const setlistRoutePrefix = `${routes.setlists}/`;

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
  window.location.hash = hashForPath(path);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
