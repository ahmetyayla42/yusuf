#!/bin/bash
# 2Kat Medya Panel — Mac başlatıcı. Bu dosyaya ÇİFT TIKLAYIN.
cd "$(dirname "$0")" || exit 1

echo "======================================================"
echo "  2Kat Medya · Reklam Analiz Programı başlatılıyor"
echo "======================================================"
echo ""

# Node.js kurulu mu?
if ! command -v node >/dev/null 2>&1; then
  echo "!! Node.js bulunamadı."
  echo "   Lütfen önce https://nodejs.org adresinden 'LTS' sürümünü indirip kurun,"
  echo "   sonra bu dosyaya tekrar çift tıklayın."
  echo ""
  read -r -p "Kapatmak için Enter'a basın..."
  exit 1
fi

# İlk kurulum (bir kez)
if [ ! -d node_modules ]; then
  echo ">> İlk kurulum yapılıyor, internet hızınıza göre birkaç dakika sürebilir..."
  npm install || { echo "Kurulum hatası."; read -r -p "Enter..."; exit 1; }
fi

# Veritabanı + demo veri (bir kez)
if [ ! -f prisma/dev.db ]; then
  echo ">> Veritabanı ve demo veri hazırlanıyor..."
  npm run setup || { echo "Veritabanı hatası."; read -r -p "Enter..."; exit 1; }
fi

echo ""
echo ">> Program başlıyor. Birkaç saniye sonra tarayıcı açılacak."
echo "   (Kapatmak için bu pencereyi kapatın.)"
( sleep 5 && open "http://localhost:3000" ) &
npm run dev
