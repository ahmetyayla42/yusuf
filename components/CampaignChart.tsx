import { formatNumber, formatTL } from "@/lib/calc";

export type ChartDatum = {
  name: string;
  clicks: number;
  spend: number;
  channel: string;
};

// Grafik kütüphanesi yerine güvenilir CSS çubukları — her zaman düzgün görünür.
export function CampaignChart({ data }: { data: ChartDatum[] }) {
  const maxClicks = Math.max(...data.map((d) => d.clicks), 1);
  const maxSpend = Math.max(...data.map((d) => d.spend), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BarCard
        title="Kampanya Bazında Tıklama"
        data={data}
        pick={(d) => d.clicks}
        max={maxClicks}
        fmt={formatNumber}
      />
      <BarCard
        title="Kampanya Bazında Harcama"
        data={data}
        pick={(d) => d.spend}
        max={maxSpend}
        fmt={formatTL}
      />
    </div>
  );
}

function BarCard({
  title,
  data,
  pick,
  max,
  fmt,
}: {
  title: string;
  data: ChartDatum[];
  pick: (d: ChartDatum) => number;
  max: number;
  fmt: (v: number) => string;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-card">
      <h3 className="mb-5 font-semibold text-brand-black">{title}</h3>
      <div className="space-y-4">
        {data.map((d, i) => {
          const v = pick(d);
          const pct = Math.max((v / max) * 100, 2);
          const isMeta = d.channel === "meta";
          return (
            <div key={i} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm font-medium text-brand-ink">
                  {d.name}
                </span>
                <span className="shrink-0 text-sm font-bold tabular-nums text-brand-black">
                  {fmt(v)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: isMeta
                      ? "#111111"
                      : "linear-gradient(90deg,#F7A720,#d98f13)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center gap-4 border-t border-black/5 pt-3 text-xs text-brand-gray">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-brand-orange" />
          Google Ads
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-brand-ink" />
          Meta
        </span>
      </div>
    </div>
  );
}
