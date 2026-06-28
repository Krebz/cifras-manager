import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clearSessionCookie } from "../lib/jwt.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  res.setHeader("Set-Cookie", clearSessionCookie());
  return res.status(200).json({ ok: true });
}
