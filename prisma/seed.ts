import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---- Admin ----
  const adminPassword = process.env.ADMIN_PASSWORD || "2katadmin2026";
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const existingAdmin = await prisma.admin.findFirst();
  if (existingAdmin) {
    await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: { passwordHash: adminHash },
    });
    console.log("✓ Admin şifresi güncellendi.");
  } else {
    await prisma.admin.create({
      data: { username: "admin", passwordHash: adminHash },
    });
    console.log("✓ Admin oluşturuldu.");
  }

  // ---- Demo müşteriler ----
  const clients = [
    {
      name: "Protez Saç",
      username: "protezsac",
      password: "protez2026",
      contactNote: "Protez saç uygulama merkezi",
    },
    {
      name: "Erkek Güzellik Salonu",
      username: "erkekguzellik",
      password: "erkek2026",
      contactNote: "Erkek güzellik ve bakım salonu",
    },
  ];

  const clientIds: Record<string, string> = {};
  for (const c of clients) {
    const passwordHash = await bcrypt.hash(c.password, 10);
    const client = await prisma.client.upsert({
      where: { username: c.username },
      update: { name: c.name, contactNote: c.contactNote },
      create: {
        name: c.name,
        username: c.username,
        contactNote: c.contactNote,
        passwordHash,
      },
    });
    clientIds[c.username] = client.id;
  }
  console.log("✓ Demo müşteriler hazır.");

  // ---- Haziran 2026 raporları ----
  // Protez Saç — kesintisiz yayın
  await upsertReport(clientIds["protezsac"], {
    year: 2026,
    month: 6,
    daysInMonth: 30,
    inactiveDays: [],
    note:
      "Protez Saç kampanyası Haziran ayı boyunca planlanan şekilde kesintisiz yayınlanmıştır. " +
      "Sektördeki rekabet nedeniyle tıklama maliyetleri yüksek seyretse de, kampanya yüksek " +
      "satın alma niyetine sahip hedef kitleye ulaşmayı sürdürmüştür.",
    campaigns: [
      {
        name: "Google Ads – Protez Saç",
        channel: "google",
        clicks: 149,
        impressions: 2032,
        spend: 8540,
      },
    ],
  });

  // Erkek Güzellik Salonu — Instagram askıya alma nedeniyle kesintili
  await upsertReport(clientIds["erkekguzellik"], {
    year: 2026,
    month: 6,
    daysInMonth: 30,
    inactiveDays: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    note:
      "Haziran ayında Instagram hesabının geçici olarak askıya alınması reklam çalışmalarını " +
      "doğrudan etkilemiş ve kampanya yalnızca hesabın aktif olduğu dönemde yayınlanabilmiştir. " +
      "Buna rağmen aktif olduğu süre boyunca güçlü bir performans sergilemiştir. Meta tarafında " +
      "Ünlü Profil Trafik Reklamı 7.560 profil ziyareti ile en başarılı kampanya olmuştur.",
    campaigns: [
      {
        name: "Google Ads – Erkek Güzellik Salonu",
        channel: "google",
        clicks: 724,
        impressions: 15200,
        spend: 8980,
      },
      {
        name: "Meta – Ünlü Profil Trafik Reklamı",
        channel: "meta",
        clicks: 0,
        impressions: 0,
        spend: 0,
        extraLabel: "Profil ziyareti",
        extraValue: 7560,
      },
    ],
  });

  console.log("✓ Haziran 2026 demo raporları eklendi.");
  console.log("\nGiriş bilgileri:");
  console.log(`  Ajans (admin) şifresi : ${adminPassword}`);
  console.log("  Müşteri: protezsac / protez2026");
  console.log("  Müşteri: erkekguzellik / erkek2026");
}

type SeedCampaign = {
  name: string;
  channel: string;
  clicks: number;
  impressions: number;
  spend: number;
  extraLabel?: string;
  extraValue?: number;
};

async function upsertReport(
  clientId: string,
  data: {
    year: number;
    month: number;
    daysInMonth: number;
    inactiveDays: number[];
    note: string;
    campaigns: SeedCampaign[];
  }
) {
  const report = await prisma.monthlyReport.upsert({
    where: {
      clientId_year_month: {
        clientId,
        year: data.year,
        month: data.month,
      },
    },
    update: {
      note: data.note,
      daysInMonth: data.daysInMonth,
      inactiveDays: data.inactiveDays,
    },
    create: {
      clientId,
      year: data.year,
      month: data.month,
      note: data.note,
      daysInMonth: data.daysInMonth,
      inactiveDays: data.inactiveDays,
    },
  });

  await prisma.campaign.deleteMany({ where: { reportId: report.id } });
  await prisma.campaign.createMany({
    data: data.campaigns.map((c, i) => ({
      reportId: report.id,
      name: c.name,
      channel: c.channel,
      clicks: c.clicks,
      impressions: c.impressions,
      spend: c.spend,
      extraLabel: c.extraLabel ?? null,
      extraValue: c.extraValue ?? null,
      order: i,
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
