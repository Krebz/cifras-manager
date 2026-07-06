import type { Setlist } from "../types/setlist";
import { routes } from "../app/routes";

// Compartilhamento por referência: o link aponta para o repertório real no
// servidor (rota de detalhe por id). Quem abre pode visualizar sem login e,
// se quiser, salvar uma cópia — sem duplicar a cada abertura.
export function buildShareUrl(setlist: Setlist): string {
  return `${window.location.origin}${window.location.pathname}#${routes.setlist(setlist.id)}`;
}

// O OAuth do Google sempre volta para a raiz (APP_URL). Para que um usuário
// deslogado que clicou em "Entrar para salvar" retorne ao repertório
// compartilhado, guardamos o id na sessão (sobrevive ao redirect na mesma aba)
// e reabrimos o link ao voltar logado.
const PENDING_SHARE_KEY = "pending_share_setlist";

export function stashPendingShare(id: string): void {
  try {
    sessionStorage.setItem(PENDING_SHARE_KEY, id);
  } catch {
    // ignore
  }
}

export function takePendingShare(): string | null {
  try {
    const id = sessionStorage.getItem(PENDING_SHARE_KEY);
    if (id) sessionStorage.removeItem(PENDING_SHARE_KEY);
    return id;
  } catch {
    return null;
  }
}
