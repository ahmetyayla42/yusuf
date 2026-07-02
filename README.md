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

## Demo Giriş Bilgileri (seed sonrası)

| Rol | Adres | Bilgiler |
|-----|-------|----------|
| Ajans (admin) | `/login/admin` | Şifre: `2katadmin2026` |
| Müşteri | `/login/client` | `protezsac` / `protez2026` |
| Müşteri | `/login/client` | `erkekguzellik` / `erkek2026` |

> İlk girişten sonra admin panelindeki **“Ajans Şifresini Değiştir”** ile şifreyi
> mutlaka değiştirin.

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

## Vercel + Neon ile Yayına Alma (ücretsiz)

1. **Neon'da veritabanı aç:** neon.tech → yeni proje → bağlantı adresini (connection
   string) kopyala.
2. **Repoyu Vercel'e bağla:** vercel.com → “Add New Project” → bu GitHub reposunu seç.
3. **Ortam değişkenlerini gir** (Vercel → Project → Settings → Environment Variables):
   - `DATABASE_URL` = Neon bağlantı adresi
   - `AUTH_SECRET` = `openssl rand -base64 32` çıktısı
   - `ADMIN_PASSWORD` = ilk admin şifresi (seed için)
4. **İlk kurulum (bir kez):** repo yerel klonunda `.env`'i Neon adresiyle doldurup:
   ```bash
   npm run db:push   # tabloları Neon'a oluştur
   npm run db:seed   # admin + demo veriyi yükle
   ```
   (Alternatif: Neon SQL editöründen tabloları oluşturup admini panelden ekleyebilirsiniz.)
5. **Deploy:** Vercel otomatik derler ve yayınlar.
6. **Kendi alan adın:** Vercel → Domains → `panel.2katmedya.com` ekle, DNS'te verilen
   CNAME kaydını gir.

**Maliyet:** Vercel Hobby + Neon Free = küçük ölçekte **0 TL**.

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
