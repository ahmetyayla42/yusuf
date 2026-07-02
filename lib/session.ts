import { SignJWT, jwtVerify } from "jose";

// Oturum verisi çerezde imzalı JWT olarak tutulur.
export type SessionData = {
  role: "admin" | "client";
  id: string;
  name: string;
};

export const SESSION_COOKIE = "km_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET tanımlı değil ya da çok kısa. .env dosyasına en az 32 karakterlik bir değer ekle."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function encryptSession(data: SessionData): Promise<string> {
  return new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function decryptSession(
  token: string | undefined
): Promise<SessionData | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      (payload.role === "admin" || payload.role === "client") &&
      typeof payload.id === "string" &&
      typeof payload.name === "string"
    ) {
      return { role: payload.role, id: payload.id, name: payload.name };
    }
    return null;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = MAX_AGE;
