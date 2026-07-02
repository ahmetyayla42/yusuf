# 2Kat Medya — Ajans Raporlama Paneli · Proje Planı

> Bu doküman, panelin nasıl kurulacağını hem **teknik olmayan biri** (Yusuf) hem de
> **kodu yazacak geliştirici/Claude Code** için anlatır. Önce "Nedir / Ne yapar"
> bölümünü oku; teknik detaylar aşağıda.

---

## 1. Tek Cümleyle

2Kat Medya'nın müşterilerine reklam performansını gösterdiği, **admin'in (sen)
arka panelden veri girdiği**, her **müşterinin kendi şifresiyle girip sadece kendi
verisini gördüğü** bir web sitesi.

---

## 2. Kimler Ne Görecek? (Roller)

| Rol | Nasıl girer | Ne yapar / görür |
|-----|-------------|------------------|
| **Admin (2Kat Medya)** | Tek bir admin şifresi | Müşteri ekler/siler/düzenler, her müşteriye **ay ay** veri girer (tıklama, gösterim, harcama, durum). Tüm müşterileri görebilir. |
| **Müşteri** | Kendi kullanıcı adı + şifresi (admin belirler) | Giriş yapınca **sadece kendi** panosunu görür: KPI kartları, grafikler, yayın sürekliliği şeridi, PDF indir. Başka müşteriyi göremez. |

---

## 3. Özellikler (Konuşmadan Çıkarılan Gereksinimler)

- [ ] Admin girişi + müşteri girişi (iki ayrı giriş ekranı)
- [ ] Admin: müşteri **ekle / düzenle / sil** (CRUD)
- [ ] Admin: her müşteri için **ay bazında** veri girişi
  - Kampanya adı (örn. "Google Ads – Protez Saç")
  - Kanal (Google Ads / Meta)
  - Tıklama, Gösterim, Harcama (TL)
  - Durum / not (örn. "Instagram askıya alındığı için kesintili")
  - (Meta için) Profil ziyareti gibi ek metrikler
- [ ] Müşteri panosu:
  - **KPI kartları**: toplam tıklama, gösterim, harcama, CTR, CPC
  - **CTR / CPC otomatik hesaplanır** (CTR = tıklama/gösterim, CPC = harcama/tıklama)
  - **Grafikler**: kampanya bazında tıklama & harcama karşılaştırması (bar)
  - **Yayın Sürekliliği şeridi**: ayın hangi günleri yayın vardı/yoktu (Instagram kesintisini görsel gösterir)
  - **Ay seçici**: geçmiş ayları da görebilme (Haziran, Temmuz, ...)
  - **PDF indir** butonu
- [ ] Veriler **kalıcı** (veritabanı — sayfa/tarayıcı kapansa da durur)
- [ ] **Marka kimliği**: turuncu `#F7A720` + siyah `#000000`, 2Kat Medya logosu
- [ ] İletişim bilgisi her yerde: **Meta Uzmanı Yusuf Serdar Yavuz — 0541 290 07 71**
- [ ] Kendi domaine yüklenebilir (2katmedya.com / panel.2katmedya.com)
- [ ] **Gerçek şifre güvenliği** (şifreler hash'lenerek saklanır — düz metin değil)

---

## 4. Teknoloji Seçimi (Next.js + Vercel)

| Katman | Seçim | Neden |
|--------|-------|-------|
| Framework | **Next.js 15 (App Router) + TypeScript** | Prototipteki React koduna en yakın; Vercel'e tek tıkla deploy; hem sayfa hem API tek projede. |
| Stil | **Tailwind CSS** | Hızlı, marka renklerini merkezi yönetiriz. |
| Veritabanı | **PostgreSQL** (Neon / Vercel Postgres — ücretsiz katman) | Kalıcı, ücretsiz başlanır, büyümeye uygun. |
| ORM | **Prisma** | Veritabanı şemasını kod olarak yönetir, güvenli sorgular. |
| Kimlik doğrulama | **Auth.js (NextAuth v5) — Credentials** + **bcrypt** | Oturum yönetimi + şifre hash'leme (gerçek güvenlik). |
| Grafikler | **Recharts** | React tabanlı, prototiple uyumlu, interaktif. |
| PDF | **Yazdırma-tabanlı PDF** (özel print CSS) → v2'de server-side PDF | Basit başlar, "PDF indir" tarayıcının yazdır → PDF'ine bağlanır; ileride sunucuda üretiriz. |
| Deploy | **Vercel** | Ücretsiz, otomatik HTTPS, domain bağlama kolay. |

---

## 5. Sayfa / Rota Haritası

```
/                     → Karşılama / giriş seçimi (Admin mı Müşteri mi)
/login/admin          → Admin giriş
/login/client         → Müşteri giriş
/admin                → (korumalı) Admin özet: müşteri listesi
/admin/clients/new    → Yeni müşteri ekle
/admin/clients/[id]   → Müşteri düzenle + aylık veri gir
/dashboard            → (korumalı) Müşterinin kendi panosu
/dashboard/print      → PDF için sade yazdırma görünümü
/api/auth/*           → Auth.js oturum uçları
```

Koruma kuralı: `/admin*` sadece admin oturumu; `/dashboard*` sadece ilgili müşteri
oturumu. Middleware ile kontrol edilir.

---

## 6. Veri Modeli (Prisma Şeması — taslak)

```prisma
model Admin {
  id           String @id @default(cuid())
  passwordHash String            // bcrypt
}

model Client {
  id           String   @id @default(cuid())
  name         String              // "Protez Saç"
  username     String   @unique    // müşteri giriş adı
  passwordHash String              // bcrypt
  createdAt    DateTime @default(now())
  reports      MonthlyReport[]
}

model MonthlyReport {
  id        String   @id @default(cuid())
  client    Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
  clientId  String
  year      Int                  // 2026
  month     Int                  // 6 = Haziran
  note      String?              // "Instagram askıya alındı" gibi
  campaigns Campaign[]
  activeDays Int[]               // yayın olan gün numaraları (sürekliliği şeridi için)
  @@unique([clientId, year, month])
}

model Campaign {
  id          String @id @default(cuid())
  report      MonthlyReport @relation(fields: [reportId], references: [id], onDelete: Cascade)
  reportId    String
  name        String            // "Google Ads – Protez Saç"
  channel     String            // "google" | "meta"
  clicks      Int
  impressions Int
  spend       Float             // TL
  extraLabel  String?           // "Profil ziyareti" gibi ek metrik adı
  extraValue  Int?              // ek metrik değeri
}
```

> CTR ve CPC **saklanmaz**, gösterim anında hesaplanır (yanlış veri riskini azaltır).

---

## 7. Dosya Yapısı (kurulunca oluşacak)

```
yusuf/
├─ app/
│  ├─ page.tsx                 # karşılama
│  ├─ login/admin/page.tsx
│  ├─ login/client/page.tsx
│  ├─ admin/…                  # admin ekranları
│  ├─ dashboard/…              # müşteri panosu
│  └─ api/…
├─ components/                 # KpiCard, CampaignChart, ContinuityStrip, Header, Logo…
├─ lib/                        # auth, prisma client, hesaplamalar (ctr/cpc)
├─ prisma/schema.prisma
├─ public/logo.png            # 2Kat Medya logosu (şeffaf PNG)
├─ styles / tailwind config   # marka renkleri #F7A720 / #000000
├─ .env.example               # DATABASE_URL, AUTH_SECRET (örnek)
└─ README.md
```

---

## 8. Marka Sistemi

- **Turuncu (vurgu):** `#F7A720` — butonlar, KPI çizgileri, grafik barları, aktif durumlar
- **Siyah (zemin/başlık):** `#000000`
- **Logo:** şeffaf arka planlı PNG (`public/logo.png`) — çerçevesiz kullanılacak
- **Yazı tipi:** temiz bir sans-serif (Inter / system-ui)
- Footer'da her sayfada: logo + "Yusuf Serdar Yavuz · Meta Uzmanı · 0541 290 07 71"

---

## 9. Kurulum Adımları (Build Sırası — geliştirici için)

1. **İskele:** Next.js + TS + Tailwind projesi, marka renkleri tailwind config'e.
2. **Veritabanı:** Prisma şeması + Neon Postgres bağlantısı + ilk migration.
3. **Auth:** Auth.js Credentials (admin + client), bcrypt, middleware ile rota koruması.
4. **Admin paneli:** müşteri CRUD + aylık veri giriş formu.
5. **Müşteri panosu:** KPI kartları, CTR/CPC hesap, Recharts grafikleri, süreklilik şeridi, ay seçici.
6. **PDF:** `/dashboard/print` sade görünüm + "PDF indir" (yazdır) butonu.
7. **Marka cilası:** logo, footer, boş durumlar, mobil uyum.
8. **Seed:** demo veri (Haziran 2026 — Protez Saç & Erkek Güzellik Salonu rakamları) test için.
9. **Deploy:** Vercel'e bağla, env değişkenleri gir, domain ekle.

---

## 10. Yayına Alma (Vercel + Domain)

1. Repo Vercel'e bağlanır (GitHub ile otomatik deploy).
2. Ortam değişkenleri Vercel'e girilir: `DATABASE_URL`, `AUTH_SECRET`.
3. Neon'da ücretsiz Postgres açılır, bağlantı adresi Vercel'e eklenir.
4. `panel.2katmedya.com` gibi bir alt alan adı Vercel'e yönlendirilir (DNS kaydı).
5. İlk admin şifresi bir kez `seed` ile veya bir kurulum ekranından belirlenir.

**Yaklaşık maliyet:** Vercel Hobby + Neon Free = **0 TL** (küçük ölçekte). Domain zaten
sende (2katmedya.com). Trafik/veri büyürse ücretli katmana geçilir.

---

## 11. Güvenlik Notları

- Şifreler **bcrypt** ile hash'lenir, veritabanında düz metin tutulmaz.
- Oturumlar imzalı çerezle (Auth.js) yönetilir.
- Müşteri A, müşteri B'nin verisine **hiçbir şekilde** erişemez (server-side yetki kontrolü).
- `AUTH_SECRET` ve `DATABASE_URL` gizli tutulur (repoya girmez, sadece `.env.example` örnek).

---

## 12. Sürüm Planı

- **v1 (bu plan):** Admin veri girer, müşteri görür, PDF yazdır, tek dilde (TR).
- **v2 (sonraki):** Sunucu-tarafı PDF üretimi (birebir eski rapordaki gibi), e-posta ile
  otomatik aylık rapor gönderimi, çoklu ay karşılaştırma grafikleri.
- **v3 (opsiyonel):** Google Ads API + Meta API entegrasyonu → veri otomatik çekilir,
  elle giriş gerekmez.

---

## 13. Onay & Sonraki Adım

Bu planı beğenirsen buraya **"kur"** yaz; iskeleden başlayıp (Bölüm 9 sırasıyla)
çalışan paneli kodlar, commit'ler ve deploy talimatlarını veririm.

Değiştirmek istediğin bir şey varsa (renk, alan, akış, teknoloji) söyle — planı
güncelleyip öyle başlarım.
