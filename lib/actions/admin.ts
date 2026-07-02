"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export type ActionState = { error?: string; ok?: boolean } | undefined;

async function ensureAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Yetkiniz yok.");
  }
}

function parseUsername(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim().toLowerCase();
}

// ---- Müşteri oluştur ----
const clientSchema = z.object({
  name: z.string().min(1, "Firma adı gerekli."),
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter."),
  contactNote: z.string().optional(),
});

export async function createClient(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await ensureAdmin();

  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    username: parseUsername(formData.get("username")),
    contactNote: String(formData.get("contactNote") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  const password = String(formData.get("password") ?? "");
  if (password.length < 4) return { error: "Şifre en az 4 karakter olmalı." };

  const exists = await prisma.client.findUnique({
    where: { username: parsed.data.username },
  });
  if (exists) return { error: "Bu kullanıcı adı zaten kullanılıyor." };

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await prisma.client.create({
    data: {
      name: parsed.data.name,
      username: parsed.data.username,
      contactNote: parsed.data.contactNote || null,
      passwordHash,
    },
  });

  revalidatePath("/admin");
  redirect(`/admin/clients/${created.id}`);
}

// ---- Müşteri güncelle ----
export async function updateClient(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await ensureAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const username = parseUsername(formData.get("username"));
  const contactNote = String(formData.get("contactNote") ?? "");
  const newPassword = String(formData.get("password") ?? "");

  if (!id) return { error: "Müşteri bulunamadı." };
  if (!name) return { error: "Firma adı gerekli." };
  if (username.length < 3) return { error: "Kullanıcı adı en az 3 karakter." };

  const clash = await prisma.client.findFirst({
    where: { username, NOT: { id } },
  });
  if (clash) return { error: "Bu kullanıcı adı başka müşteride kullanılıyor." };

  const data: {
    name: string;
    username: string;
    contactNote: string | null;
    passwordHash?: string;
  } = { name, username, contactNote: contactNote || null };

  if (newPassword) {
    if (newPassword.length < 4)
      return { error: "Yeni şifre en az 4 karakter olmalı." };
    data.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  await prisma.client.update({ where: { id }, data });
  revalidatePath("/admin");
  revalidatePath(`/admin/clients/${id}`);
  return { ok: true };
}

// ---- Müşteri sil ----
export async function deleteClient(formData: FormData): Promise<void> {
  await ensureAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.client.delete({ where: { id } });
  }
  revalidatePath("/admin");
  redirect("/admin");
}

// ---- Aylık rapor kaydet (upsert) ----
const campaignSchema = z.object({
  name: z.string().min(1),
  channel: z.enum(["google", "meta"]),
  clicks: z.number().int().min(0),
  impressions: z.number().int().min(0),
  spend: z.number().min(0),
  extraLabel: z.string().optional().nullable(),
  extraValue: z.number().int().min(0).optional().nullable(),
});

function parseIntList(csv: string): number[] {
  return csv
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export async function saveReport(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await ensureAdmin();

  const clientId = String(formData.get("clientId") ?? "");
  const year = parseInt(String(formData.get("year") ?? ""), 10);
  const month = parseInt(String(formData.get("month") ?? ""), 10);
  const note = String(formData.get("note") ?? "");
  const daysInMonth = parseInt(String(formData.get("daysInMonth") ?? "30"), 10);
  const inactiveDays = parseIntList(String(formData.get("inactiveDays") ?? ""));

  if (!clientId) return { error: "Müşteri bulunamadı." };
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12)
    return { error: "Geçerli bir yıl ve ay girin." };

  let campaigns: z.infer<typeof campaignSchema>[];
  try {
    const raw = JSON.parse(String(formData.get("campaigns") ?? "[]"));
    campaigns = z.array(campaignSchema).parse(raw);
  } catch {
    return { error: "Kampanya verileri geçersiz. Alanları kontrol edin." };
  }
  if (campaigns.length === 0)
    return { error: "En az bir kampanya eklemelisiniz." };

  const report = await prisma.monthlyReport.upsert({
    where: { clientId_year_month: { clientId, year, month } },
    create: {
      clientId,
      year,
      month,
      note: note || null,
      daysInMonth: Number.isFinite(daysInMonth) ? daysInMonth : 30,
      inactiveDays,
    },
    update: {
      note: note || null,
      daysInMonth: Number.isFinite(daysInMonth) ? daysInMonth : 30,
      inactiveDays,
    },
  });

  // Kampanyaları tamamen yenile.
  await prisma.campaign.deleteMany({ where: { reportId: report.id } });
  await prisma.campaign.createMany({
    data: campaigns.map((c, i) => ({
      reportId: report.id,
      name: c.name,
      channel: c.channel,
      clicks: c.clicks,
      impressions: c.impressions,
      spend: c.spend,
      extraLabel: c.extraLabel || null,
      extraValue: c.extraValue ?? null,
      order: i,
    })),
  });

  revalidatePath(`/admin/clients/${clientId}`);
  return { ok: true };
}

// ---- Aylık rapor sil ----
export async function deleteReport(formData: FormData): Promise<void> {
  await ensureAdmin();
  const reportId = String(formData.get("reportId") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  if (reportId) {
    await prisma.monthlyReport.delete({ where: { id: reportId } });
  }
  if (clientId) revalidatePath(`/admin/clients/${clientId}`);
}
