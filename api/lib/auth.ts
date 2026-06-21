import type { VercelRequest, VercelResponse } from "@vercel/node";

export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  const password = req.headers.authorization?.replace("Bearer ", "");
  if (!password || password !== process.env.ADMIN_PASS) {
    res.status(401).json({ error: "Não autorizado" });
    return false;
  }
  return true;
}
