import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2Kat Medya · Dijital Dönüşüm ve Reklam Analiz Programı",
  description:
    "2Kat Medya müşteri reklam performans paneli — Google Ads & Meta raporlama.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
