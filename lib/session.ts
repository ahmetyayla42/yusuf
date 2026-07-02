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
  let secret = process.env.AUTH_SECRET;
  // Yerel geliştirmede .env zorunlu olmasın: güvenli bir geliştirme yedeği kullan.
  // Üretimde (NODE_ENV=production) AUTH_SECRET mutlaka tanımlı olmalı.
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET tanımlı değil ya da çok kısa. Ortam değişkenlerine en az 32 karakterlik bir değer ekleyin."
      );
    }
    secret = "yerel-gelistirme-icin-varsayilan-anahtar-degistirilebilir";
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
