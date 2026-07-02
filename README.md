# 2Kat Medya · Dijital Dönüşüm ve Reklam Analiz Programı

Müşterilere reklam performansını gösteren, çok kullanıcılı bir web uygulaması.
**Ajans (admin)** arka panelden müşteri ekler ve ay ay veri girer; her **müşteri**
kendi kullanıcı adı/şifresiyle girip yalnızca kendi raporlarını görür.

- **Marka:** turuncu `#F7A720` + siyah `#000000`
- **İletişim:** Yusuf Serdar Yavuz · Meta Uzmanı · 0541 290 07 71
- **Teknoloji:** Next.js 15 · TypeScript · Tailwind · Prisma · PostgreSQL · Auth (bcrypt + imzalı çerez)

> Ürünün mimari planı için ayrıca [`PLAN.md`](./PLAN.md) dosyasına bakabilirsiniz.

---

## Özellikler

- İki ayrı giriş: **Ajans Girişi** (admin) ve **Müşteri Girişi**
- Admin: müşteri **ekle / düzenle / sil**, her müşteriye **aylık** veri girişi
  (kampanya adı, kanal, tıklama, gösterim, harcama, ek metrik, not, kesintili günler)
- Müşteri panosu: KPI kartları, **otomatik CTR/CPC**, kampanya grafikleri,
  **Yayın Sürekliliği** şeridi, ay seçici, **PDF indir / yazdır**
- Şifreler **bcrypt** ile hash'lenir; oturumlar imzalı çerezle korunur
- Rota koruması (middleware): müşteri başkasının verisine erişemez

---

## Giriş Bilgileri

- **Ajans (admin):** `/login/admin` → `ADMIN_PASSWORD` olarak belirlediğiniz şifre.
  (İlk girişte admin hesabı otomatik oluşur.)
- **Müşteri:** `/login/client` → kullanıcı adı/şifresini admin panelinden siz belirlersiniz.

Demo veri (`npm run db:seed`) yüklerseniz hazır gelen hesaplar:

| Rol | Bilgiler |
|-----|----------|
| Müşteri | `protezsac` / `protez2026` |
| Müşteri | `erkekguzellik` / `erkek2026` |

> İlk girişten sonra admin panelindeki **“Ajans Şifresini Değiştir”** ile şifreyi
> güncelleyebilirsiniz.

---

## Yerelde Çalıştırma

Gereken: Node.js 18+ ve bir PostgreSQL veritabanı (ücretsiz için
[Neon](https://neon.tech) önerilir).

```bash
# 1) Bağımlılıkları kur
npm install

# 2) Ortam değişkenlerini ayarla
cp .env.example .env
#   .env içine DATABASE_URL ve AUTH_SECRET yaz
#   AUTH_SECRET üretmek için:  openssl rand -base64 32

# 3) Veritabanı tablolarını oluştur
npm run db:push

# 4) Demo veriyi ve admini yükle
npm run db:seed

# 5) Geliştirme sunucusunu başlat
npm run dev
# → http://localhost:3000
```

---

## Vercel + Neon ile Yayına Alma (ücretsiz · terminal GEREKMEZ)

> Tablolar deploy sırasında **otomatik** oluşur (`vercel-build` içinde `prisma db push`),
> admin hesabı **ilk girişte otomatik** kurulur. Yani komut satırıyla uğraşmanız gerekmez.

**Adım 1 — Veritabanı (Neon):**
[neon.tech](https://neon.tech) → GitHub ile giriş → “New Project” → verilen
**Connection String**'i (`postgresql://...`) kopyalayın.

**Adım 2 — Yayınla (Vercel):**
[vercel.com](https://vercel.com) → GitHub ile giriş → “Add New → Project” → bu repoyu
seçin. Deploy'a basmadan **Environment Variables**'a şunları girin:

| Değişken | Değer |
|----------|-------|
| `DATABASE_URL` | Neon bağlantı adresi |
| `AUTH_SECRET` | Uzun rastgele bir anahtar (örn. `openssl rand -base64 32`) |
| `ADMIN_PASSWORD` | Belirlemek istediğiniz ilk ajans şifresi |

**Deploy**'a basın. Bittiğinde site yayında (örn. `proje.vercel.app`).

**Adım 3 — İlk giriş:** `/login/admin` → `ADMIN_PASSWORD` olarak girdiğiniz şifreyle
girin. Admin hesabı ilk girişte otomatik oluşturulur. Sonra panelden müşterilerinizi
ekleyin.

**Adım 4 — Kendi alan adınız:** Vercel → Settings → Domains → `panel.2katmedya.com`
ekleyin, DNS'te verilen CNAME kaydını girin.

**Maliyet:** Vercel Hobby + Neon Free = küçük ölçekte **0 TL**.

> Demo müşteri verisiyle (Protez Saç / Erkek Güzellik Salonu) görmek isterseniz, yerel
> klonda bir kez `npm run db:seed` çalıştırabilirsiniz — üretimde şart değildir.

---

## Logoyu Kendi Logonla Değiştirme

Şu an logo, `components/Logo.tsx` içinde marka renkleriyle çizilen bir “wordmark”tır
(hem koyu hem açık zeminde temiz durur, ekstra dosya gerektirmez).

Kendi PNG logonu kullanmak istersen:
1. Şeffaf arka planlı PNG'yi `public/logo.png` olarak ekle.
2. `components/Logo.tsx` içindeki wordmark bloğunu şununla değiştir:
   ```tsx
   <img src="/logo.png" alt="2Kat Medya" className="h-10 w-auto" />
   ```

---

## Kullanım Akışı

1. **Ajans girişi** yap → **Yeni Müşteri** ekle (firma adı, giriş kullanıcı adı, şifre).
2. Müşteri kartına gir → **Aylık Veri Girişi**: yıl/ay seç, kampanyaları ve notu gir,
   kaydet. (Kayıtlı bir ayı tekrar seçince bilgiler otomatik gelir, güncelleyebilirsin.)
3. Müşteriye kullanıcı adı/şifresini ilet.
4. **Müşteri girişi** yaptığında yalnızca kendi panosunu görür; istediğinde **PDF indir**.

---

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi (prisma generate dahil) |
| `npm start` | Üretim sunucusu |
| `npm run db:push` | Şemayı veritabanına uygula |
| `npm run db:seed` | Admin + demo veri yükle |
| `npm run db:studio` | Prisma Studio (veriyi görsel yönet) |

---

## Güvenlik

- Şifreler düz metin tutulmaz (bcrypt hash).
- `DATABASE_URL` ve `AUTH_SECRET` gizlidir; `.env` repoya yüklenmez.
- Yetkilendirme sunucu tarafında yapılır; müşteriler birbirinin verisine erişemez.
