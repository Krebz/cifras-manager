import {
  routePathFor,
  routes,
  type AppRoute,
  type NavigationPage,
} from "./routes";

const songRoutePrefix = `${routes.songs}/`;

export function readRoute(hash = window.location.hash): AppRoute {
  const route = hash.replace(/^#/, "") || routes.home;
  const [path, search = ""] = route.split("?");
  const params = new URLSearchParams(search);

  if (path.startsWith(songRoutePrefix)) {
    return { page: "song", songId: path.replace(songRoutePrefix, "") };
  }

  switch (path) {
    case routes.songs:
      return { page: "songs", query: params.get("q") ?? "" };
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

export function navigate(path: string) {
  window.location.hash = hashForPath(path);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
