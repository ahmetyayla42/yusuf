"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ChartDatum = {
  name: string;
  clicks: number;
  spend: number;
  channel: string;
};

const ORANGE = "#F7A720";
const BLACK = "#111111";

function shortName(name: string): string {
  return name.length > 22 ? name.slice(0, 20) + "…" : name;
}

export function CampaignChart({ data }: { data: ChartDatum[] }) {
  const chartData = data.map((d) => ({ ...d, short: shortName(d.name) }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Kampanya Bazında Tıklama">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
            <XAxis
              dataKey="short"
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v: number) => [v.toLocaleString("tr-TR"), "Tıklama"]}
              labelFormatter={(_, p) => p?.[0]?.payload?.name ?? ""}
            />
            <Bar dataKey="clicks" radius={[6, 6, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.channel === "meta" ? BLACK : ORANGE} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Kampanya Bazında Harcama (TL)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
            <XAxis
              dataKey="short"
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v: number) => [
                v.toLocaleString("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                }),
                "Harcama",
              ]}
              labelFormatter={(_, p) => p?.[0]?.payload?.name ?? ""}
            />
            <Bar dataKey="spend" radius={[6, 6, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.channel === "meta" ? BLACK : ORANGE} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-card">
      <h3 className="mb-3 font-semibold text-brand-black">{title}</h3>
      {children}
      <div className="mt-3 flex items-center gap-4 text-xs text-brand-gray">
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
