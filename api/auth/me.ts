import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSessionFromRequest } from "../lib/jwt.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const user = getSessionFromRequest(req);
  if (!user) return res.status(401).json({ user: null });

  return res.status(200).json({ user });
}
