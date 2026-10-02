import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "perfectfit_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

function getAdminConfiguration() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !secret || secret.length < 32) {
    return null;
  }

  return { username, password, secret };
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminCredentials(username: string, password: string) {
  const config = getAdminConfiguration();

  if (!config) {
    return "unconfigured" as const;
  }

  return safeEqual(username, config.username) && safeEqual(password, config.password)
    ? "valid" as const
    : "invalid" as const;
}

function createSessionToken(username: string, expiresAt: number, secret: string) {
  const payload = Buffer.from(JSON.stringify({ username, expiresAt })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifySessionToken(token: string, username: string, secret: string) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(payload).digest();
  const provided = Buffer.from(signature, "base64url");

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      expiresAt?: number;
    };

    return session.username === username && typeof session.expiresAt === "number" && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const config = getAdminConfiguration();
  if (!config) return false;

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionValue) {
    return false;
  }

  return verifySessionToken(sessionValue, config.username, config.secret);
}

export function getConfiguredAdminUsername() {
  return getAdminConfiguration()?.username ?? "Admin";
}

export async function setAdminSession() {
  const config = getAdminConfiguration();
  if (!config) throw new Error("Admin authentication is not configured.");

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(config.username, Date.now() + SESSION_MAX_AGE * 1000, config.secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
