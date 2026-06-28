import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { GOOGLE_CLIENT_ID, APP_URL } = process.env;

  if (!GOOGLE_CLIENT_ID || !APP_URL) {
    return res.status(500).json({ error: "OAuth não configurado" });
  }

  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${APP_URL}/api/auth/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  res.setHeader(
    "Set-Cookie",
    `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=300`
  );

  return res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
