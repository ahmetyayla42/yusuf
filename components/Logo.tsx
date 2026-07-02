"use client";

import { useState } from "react";

type LogoProps = {
  onDark?: boolean; // koyu zemin üzerinde mi? (yedek wordmark rengi için)
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
};

// 2Kat Medya logosu.
// Öncelik: public/logo.png (gerçek logo). Dosya yoksa/yüklenmezse
// otomatik olarak marka renkli yazı (wordmark) yedeğine düşer.
export function Logo({
  onDark = false,
  showSubtitle = true,
  size = "md",
}: LogoProps) {
  const [imgOk, setImgOk] = useState(true);

  const imgHeight =
    size === "lg" ? "h-14" : size === "sm" ? "h-7" : "h-9";

  if (imgOk) {
    return (
      <div className="flex flex-col">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="2Kat Medya"
          className={`${imgHeight} w-auto`}
          onError={() => setImgOk(false)}
        />
        {showSubtitle && (
          <span
            className={`mt-1 text-[11px] font-medium ${
              onDark ? "text-white/70" : "text-brand-gray"
            }`}
          >
            Dijital Dönüşüm &amp; Reklam Analizi
          </span>
        )}
      </div>
    );
  }

  // ---- Yedek: logo.png yoksa marka renkli yazı ----
  const textColor = onDark ? "text-white" : "text-brand-black";
  const badge =
    size === "lg"
      ? "h-12 w-12 text-xl"
      : size === "sm"
      ? "h-8 w-8 text-sm"
      : "h-10 w-10 text-base";
  const title =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex ${badge} items-center justify-center rounded-lg bg-brand-orange font-black text-brand-black`}
      >
        2K
      </div>
      <div className="leading-tight">
        <div className={`font-extrabold tracking-tight ${title} ${textColor}`}>
          2KAT <span className="text-brand-orange">MEDYA</span>
        </div>
        {showSubtitle && (
          <div
            className={`text-[11px] font-medium ${
              onDark ? "text-white/70" : "text-brand-gray"
            }`}
          >
            Dijital Dönüşüm &amp; Reklam Analizi
          </div>
        )}
      </div>
    </div>
  );
}
