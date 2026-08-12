/**
 * Estado efêmero de navegação — filtros, paginação e posição de rolagem.
 *
 * Fica em `sessionStorage`: sobrevive a um reload (ou ao congelamento do PWA no
 * iOS, que remonta a árvore inteira) e some ao fechar a aba. Não é preferência
 * do usuário, então não vai para o `localStorage` junto de fonte/velocidade.
 */
const PREFIX = "cifras_view_";

export function loadViewState<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function saveViewState(key: string, value: unknown) {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // navegação privada ou cota estourada: seguir sem persistir
  }
}
