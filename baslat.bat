@echo off
chcp 65001 >nul
REM 2Kat Medya Panel - Windows baslatici. Bu dosyaya CIFT TIKLAYIN.
cd /d "%~dp0"

echo ======================================================
echo   2Kat Medya - Reklam Analiz Programi baslatiliyor
echo ======================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo !! Node.js bulunamadi.
  echo    Lutfen once https://nodejs.org adresinden "LTS" surumunu kurun,
  echo    sonra bu dosyaya tekrar cift tiklayin.
  echo.
  pause
  exit /b
)

if not exist node_modules (
  echo ^>^> Ilk kurulum yapiliyor, birkac dakika surebilir...
  call npm install || (echo Kurulum hatasi. & pause & exit /b)
)

if not exist prisma\dev.db (
  echo ^>^> Veritabani ve demo veri hazirlaniyor...
  call npm run setup || (echo Veritabani hatasi. & pause & exit /b)
)

echo.
echo ^>^> Program basliyor. Birkac saniye sonra tarayici acilacak.
echo    (Kapatmak icin bu pencereyi kapatin.)
start "" http://localhost:3000
call npm run dev
pause
