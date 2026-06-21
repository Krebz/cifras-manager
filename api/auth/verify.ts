import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const password = req.headers.authorization?.replace("Bearer ", "");
  if (password && password === process.env.ADMIN_PASS) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false });
}
