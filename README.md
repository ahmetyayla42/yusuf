# 2Kat Medya · Dijital Dönüşüm ve Reklam Analiz Programı

Müşterilere reklam performansını gösteren, çok kullanıcılı bir web uygulaması.
**Ajans (admin)** arka panelden müşteri ekler ve ay ay veri girer; her **müşteri**
kendi kullanıcı adı/şifresiyle girip yalnızca kendi raporlarını görür.

- **Marka:** turuncu `#F7A720` + siyah `#000000`
- **İletişim:** Yusuf Serdar Yavuz · Meta Uzmanı · 0541 290 07 71
- **Teknoloji:** Next.js 15 · TypeScript · Tailwind · Prisma · SQLite (yerel) / PostgreSQL (yayın) · Auth (bcrypt + imzalı çerez)

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

`npm run setup` sonrası hazır gelen hesaplar:

| Rol | Adres | Bilgiler |
|-----|-------|----------|
| Ajans (admin) | `/login/admin` | `2katadmin2026` |
| Müşteri | `/login/client` | `protezsac` / `protez2026` |
| Müşteri | `/login/client` | `erkekguzellik` / `erkek2026` |

> İlk girişten sonra admin panelindeki **“Ajans Şifresini Değiştir”** ile şifreyi
> güncelleyin. Yeni müşterileri ve verilerini admin panelinden siz eklersiniz.

---

## Yerelde Çalıştırma (kolay yol · ek veritabanı GEREKMEZ)

Yerelde **SQLite** (dosya tabanlı veritabanı) kullanılır — ayrı bir veritabanı
kurmanız veya `.env` doldurmanız gerekmez. Tek gereken: **Node.js 18+**.

```bash
# 1) Bağımlılıkları kur (bir kez)
npm install

# 2) Veritabanını oluştur + demo veriyi yükle (bir kez)
npm run setup

# 3) Uygulamayı başlat
npm run dev
# → http://localhost:3000
```

Tarayıcıda `http://localhost:3000` açın. Giriş bilgileri aşağıda.

> Veritabanı `prisma/dev.db` dosyasında tutulur (git'e gönderilmez). Sıfırlamak
> için bu dosyayı silip `npm run setup` komutunu tekrar çalıştırın.

---

## İnternette Yayına Alma (müşterilerin erişmesi için)

> **Not:** Yerel sürüm SQLite kullanır (tek makinede, dosya tabanlı). Birden çok
> müşterinin internetten erişeceği kalıcı bir site için **PostgreSQL**'e geçmek
> gerekir — bu, `prisma/schema.prisma` içinde tek satırlık bir değişikliktir
> (`provider = "postgresql"` + `url = env("DATABASE_URL")`). Hazır olduğunuzda bu
> geçişi yapıp aşağıdaki adımları izleyebilirsiniz.

### Vercel + Neon (ücretsiz · terminal GEREKMEZ)

> Postgres'e geçtikten sonra tablolar deploy sırasında **otomatik** oluşur
> (`vercel-build` içinde `prisma db push`), admin hesabı **ilk girişte otomatik**
> kurulur.

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

## Logoyu Ekleme

Uygulama otomatik olarak **`public/logo.png`** dosyasını logo olarak kullanır.
Dosya yoksa marka renkli bir yazı logosuna (yedek) düşer — hiçbir yer bozulmaz.

Kendi logonu eklemek için (kod bilmeden, GitHub üzerinden):
1. GitHub'da repo → `public` klasörü → **Add file → Upload files**
2. Şeffaf arka planlı logonu sürükle, adı **`logo.png`** olsun
3. **Commit changes** → site otomatik günceller

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
