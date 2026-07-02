type LogoProps = {
  onDark?: boolean; // koyu zemin üzerinde mi? (kapak/kapanış)
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
};

// 2Kat Medya logosu (çerçevesiz, hem koyu hem açık zeminde çalışır).
// NOT: Kendi PNG logonu kullanmak istersen: public/logo.png ekle ve
// aşağıdaki wordmark yerine <img src="/logo.png" ... /> koy.
export function Logo({
  onDark = false,
  showSubtitle = true,
  size = "md",
}: LogoProps) {
  const textColor = onDark ? "text-white" : "text-brand-black";
  const badge =
    size === "lg" ? "h-12 w-12 text-xl" : size === "sm" ? "h-8 w-8 text-sm" : "h-10 w-10 text-base";
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
            Dijital Dönüşüm & Reklam Analizi
          </div>
        )}
      </div>
    </div>
  );
}
