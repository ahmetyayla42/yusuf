"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearSession, getSession, setSession } from "@/lib/auth";

export type AuthState = { error?: string; ok?: boolean } | undefined;

export async function loginAdmin(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Şifre gerekli." };

  let admin = await prisma.admin.findFirst();

  // İlk kurulum: hiç admin yoksa ilk giriş admini oluşturur.
  // ADMIN_PASSWORD tanımlıysa girilen şifre ona eşit olmalı; değilse
  // ilk girişte yazılan şifre admin şifresi olur.
  if (!admin) {
    const configured = process.env.ADMIN_PASSWORD;
    if (configured && password !== configured) {
      return { error: "İlk kurulum şifresi hatalı." };
    }
    const passwordHash = await bcrypt.hash(password, 10);
    admin = await prisma.admin.create({ data: { passwordHash } });
    await setSession({ role: "admin", id: admin.id, name: "2Kat Medya" });
    redirect("/admin");
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return { error: "Şifre hatalı." };

  await setSession({ role: "admin", id: admin.id, name: "2Kat Medya" });
  redirect("/admin");
}

export async function loginClient(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!username || !password)
    return { error: "Kullanıcı adı ve şifre gerekli." };

  const client = await prisma.client.findUnique({ where: { username } });
  if (!client) return { error: "Kullanıcı adı veya şifre hatalı." };

  const ok = await bcrypt.compare(password, client.passwordHash);
  if (!ok) return { error: "Kullanıcı adı veya şifre hatalı." };

  await setSession({ role: "client", id: client.id, name: client.name });
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/");
}

export async function changeAdminPassword(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return { error: "Yetkiniz yok." };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 6)
    return { error: "Yeni şifre en az 6 karakter olmalı." };

  const admin = await prisma.admin.findUnique({ where: { id: session.id } });
  if (!admin) return { error: "Admin bulunamadı." };

  const ok = await bcrypt.compare(current, admin.passwordHash);
  if (!ok) return { error: "Mevcut şifre hatalı." };

  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash },
  });
  return { ok: true };
}
