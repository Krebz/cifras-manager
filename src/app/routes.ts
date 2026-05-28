export type NavigationPage = "home" | "songs" | "management" | "contact";

export type AppRoute =
  | { page: "home" }
  | { page: "songs"; query: string }
  | { page: "management" }
  | { page: "contact" }
  | { page: "song"; songId: string };

export const routes = {
  home: "/",
  songs: "/musicas",
  management: "/gestao-cifras",
  contact: "/contato",
  song: (songId: string) => `/musicas/${songId}`,
} as const;

export function songsPathFor(query = "") {
  const search = query.trim();

  if (!search) {
    return routes.songs;
  }

  return `${routes.songs}?q=${encodeURIComponent(search)}`;
}

export function routePathFor(page: NavigationPage) {
  switch (page) {
    case "songs":
      return routes.songs;
    case "management":
      return routes.management;
    case "contact":
      return routes.contact;
    default:
      return routes.home;
  }
}
