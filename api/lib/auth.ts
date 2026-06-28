import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSessionFromRequest } from "./jwt.js";
import type { SessionUser } from "./jwt.js";

// Legado v2.0 — mantido só para o endpoint verify enquanto transição não termina
export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  const password = req.headers.authorization?.replace("Bearer ", "");
  if (!password || password !== process.env.ADMIN_PASS) {
    res.status(401).json({ error: "Não autorizado" });
    return false;
  }
  return true;
}

// v3.0 — requer role "admin" no JWT de sessão
export function requireAdmin(req: VercelRequest, res: VercelResponse): SessionUser | null {
  const user = getSessionFromRequest(req);
  if (!user || user.role !== "admin") {
    res.status(401).json({ error: "Não autorizado" });
    return null;
  }
  return user;
}

// v3.0 — qualquer usuário autenticado
export function requireUser(req: VercelRequest, res: VercelResponse): SessionUser | null {
  const user = getSessionFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Login necessário" });
    return null;
  }
  return user;
}
