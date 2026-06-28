import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../lib/mongodb.js";
import { signJwt, setSessionCookie } from "../lib/jwt.js";
import type { SessionUser } from "../lib/jwt.js";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
      .filter(([k]) => k)
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_URL, ADMIN_EMAIL } = process.env;

  const { code, state, error } = req.query as Record<string, string>;

  if (error) {
    return res.redirect(302, `${APP_URL}/?auth_error=${encodeURIComponent(error)}`);
  }

  // Verifica state CSRF
  const cookies = parseCookies(req.headers.cookie ?? "");
  if (!state || state !== cookies.oauth_state) {
    return res.status(400).json({ error: "State inválido" });
  }

  // Troca code por tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${APP_URL}/api/auth/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return res.status(502).json({ error: "Falha ao obter tokens do Google" });
  }

  const tokens = (await tokenRes.json()) as GoogleTokenResponse;

  // Busca dados do usuário
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userRes.ok) {
    return res.status(502).json({ error: "Falha ao buscar dados do usuário" });
  }

  const googleUser = (await userRes.json()) as GoogleUserInfo;

  // Upsert no MongoDB
  const db = await getDb();
  const isAdmin = ADMIN_EMAIL ? googleUser.email === ADMIN_EMAIL : false;

  await db.collection("users").updateOne(
    { googleId: googleUser.sub },
    {
      $set: {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        googleId: googleUser.sub,
        role: isAdmin ? "admin" : "user",
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  // Busca role salvo (não sobrescreve se já era admin)
  const savedUser = await db.collection("users").findOne({ googleId: googleUser.sub });
  const role = (savedUser?.role as "admin" | "user") ?? (isAdmin ? "admin" : "user");

  const sessionPayload: SessionUser = {
    sub: googleUser.sub,
    email: googleUser.email,
    name: googleUser.name,
    picture: googleUser.picture,
    role,
  };

  const token = signJwt(sessionPayload);

  res.setHeader("Set-Cookie", [
    setSessionCookie(token),
    `oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  ]);

  return res.redirect(302, APP_URL!);
}
