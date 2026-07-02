export function KpiCard({
  label,
  value,
  sub,
  accent = false,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  if (accent) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange-dark p-5 text-brand-black shadow-[0_8px_24px_-8px_rgba(247,167,32,0.6)]">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15" />
        <div className="relative flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-black/70">
            {label}
          </span>
          {icon && (
            <span className="rounded-lg bg-black/10 p-2 text-brand-black">
              {icon}
            </span>
          )}
        </div>
        <div className="relative mt-3 text-3xl font-extrabold tracking-tight">
          {value}
        </div>
        {sub && (
          <div className="relative mt-1 text-xs font-medium text-brand-black/70">
            {sub}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-brand-orange/70" />
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-brand-gray">
          {label}
        </span>
        {icon && (
          <span className="rounded-lg bg-brand-orange/10 p-2 text-brand-orange-dark">
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 text-3xl font-extrabold tracking-tight text-brand-black">
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-brand-gray">{sub}</div>}
    </div>
  );
}
