// Yayın sürekliliği şeridi: ayın günlerini gösterir, yayın olmayan günleri işaretler.
export function ContinuityStrip({
  daysInMonth,
  inactiveDays,
}: {
  daysInMonth: number;
  inactiveDays: number[];
}) {
  const inactive = new Set(inactiveDays);
  const days = Array.from({ length: Math.max(daysInMonth, 1) }, (_, i) => i + 1);
  const activeCount = days.filter((d) => !inactive.has(d)).length;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-brand-black">Yayın Sürekliliği</h3>
        <span className="text-sm text-brand-gray">
          {activeCount}/{daysInMonth} gün yayında
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {days.map((d) => {
          const off = inactive.has(d);
          return (
            <div
              key={d}
              title={`${d}. gün — ${off ? "yayın yok" : "yayında"}`}
              className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-medium ${
                off
                  ? "bg-black/10 text-brand-gray line-through"
                  : "bg-brand-orange text-brand-black"
              }`}
            >
              {d}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-brand-gray">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-brand-orange" />
          Yayında
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-black/10" />
          Yayın yok
        </span>
      </div>
    </div>
  );
}
