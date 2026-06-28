import jwt from "jsonwebtoken";
import type { VercelRequest } from "@vercel/node";

export interface SessionUser {
  sub: string;
  email: string;
  name: string;
  picture: string;
  role: "admin" | "user";
}

const COOKIE_NAME = "session";

export function signJwt(payload: SessionUser): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "30d" });
}

export function verifyJwt(token: string): SessionUser | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as SessionUser;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: VercelRequest): SessionUser | null {
  const cookies = parseCookies(req.headers.cookie ?? "");
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyJwt(token);
}

export function setSessionCookie(token: string): string {
  const maxAge = 30 * 24 * 60 * 60;
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
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
