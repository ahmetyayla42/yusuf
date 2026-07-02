import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  SessionData,
  decryptSession,
  encryptSession,
} from "./session";

export async function getSession(): Promise<SessionData | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return decryptSession(token);
}

export async function setSession(data: SessionData): Promise<void> {
  const token = await encryptSession(data);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Admin oturumu şart; yoksa giriş sayfasına yönlendirir. */
export async function requireAdmin(): Promise<SessionData> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login/admin");
  }
  return session;
}

/** Müşteri oturumu şart; yoksa giriş sayfasına yönlendirir. */
export async function requireClient(): Promise<SessionData> {
  const session = await getSession();
  if (!session || session.role !== "client") {
    redirect("/login/client");
  }
  return session;
}
