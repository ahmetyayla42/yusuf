export function KpiCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-card ${
        accent
          ? "border-brand-orange bg-brand-orange text-brand-black"
          : "border-black/10 bg-white"
      }`}
    >
      <div
        className={`text-xs font-semibold uppercase tracking-wide ${
          accent ? "text-brand-black/70" : "text-brand-gray"
        }`}
      >
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold">{value}</div>
      {sub && (
        <div
          className={`mt-1 text-xs ${
            accent ? "text-brand-black/70" : "text-brand-gray"
          }`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
