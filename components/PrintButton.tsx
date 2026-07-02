"use client";

export function PrintButton({
  label = "PDF İndir / Yazdır",
}: {
  label?: string;
}) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-brand-black transition hover:brightness-105"
    >
      ⬇ {label}
    </button>
  );
}
