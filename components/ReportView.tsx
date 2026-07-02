import {
  totals,
  ctr,
  cpc,
  formatTL,
  formatNumber,
  formatPercent,
  channelLabel,
} from "@/lib/calc";
import { KpiCard } from "./KpiCard";
import { ContinuityStrip } from "./ContinuityStrip";
import { CampaignChart, ChartDatum } from "./CampaignChart";

export type ReportViewData = {
  clientName: string;
  periodLabel: string;
  note: string | null;
  daysInMonth: number;
  inactiveDays: number[];
  campaigns: {
    name: string;
    channel: string;
    clicks: number;
    impressions: number;
    spend: number;
    extraLabel: string | null;
    extraValue: number | null;
  }[];
};

export function ReportView({
  data,
  showCharts = true,
}: {
  data: ReportViewData;
  showCharts?: boolean;
}) {
  const t = totals(data.campaigns);
  const chartData: ChartDatum[] = data.campaigns.map((c) => ({
    name: c.name,
    clicks: c.clicks,
    spend: c.spend,
    channel: c.channel,
  }));

  const extras = data.campaigns.filter((c) => c.extraLabel && c.extraValue);

  return (
    <div className="space-y-6">
      {/* KPI kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Toplam Tıklama" value={formatNumber(t.clicks)} />
        <KpiCard label="Toplam Gösterim" value={formatNumber(t.impressions)} />
        <KpiCard
          label="Toplam Harcama"
          value={formatTL(t.spend)}
          accent
        />
        <KpiCard
          label="Ortalama CTR"
          value={formatPercent(t.ctr)}
          sub="Tıklama / Gösterim"
        />
        <KpiCard
          label="Ortalama CPC"
          value={formatTL(t.cpc)}
          sub="Harcama / Tıklama"
        />
      </div>

      {/* Ek metrikler (örn. profil ziyareti) */}
      {extras.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {extras.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-card"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-gray">
                {c.extraLabel}
              </div>
              <div className="mt-2 text-2xl font-extrabold text-brand-black">
                {formatNumber(c.extraValue ?? 0)}
              </div>
              <div className="mt-1 text-xs text-brand-gray">{c.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* Grafikler */}
      {showCharts && chartData.length > 0 && (
        <CampaignChart data={chartData} />
      )}

      {/* Yayın sürekliliği */}
      <ContinuityStrip
        daysInMonth={data.daysInMonth}
        inactiveDays={data.inactiveDays}
      />

      {/* Kampanya tablosu */}
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-card">
        <div className="border-b border-black/5 px-5 py-3">
          <h3 className="font-semibold text-brand-black">Kampanya Detayları</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-soft text-left text-xs uppercase tracking-wide text-brand-gray">
              <tr>
                <th className="px-5 py-3">Kampanya</th>
                <th className="px-5 py-3">Kanal</th>
                <th className="px-5 py-3 text-right">Tıklama</th>
                <th className="px-5 py-3 text-right">Gösterim</th>
                <th className="px-5 py-3 text-right">Harcama</th>
                <th className="px-5 py-3 text-right">CTR</th>
                <th className="px-5 py-3 text-right">CPC</th>
              </tr>
            </thead>
            <tbody>
              {data.campaigns.map((c, i) => (
                <tr key={i} className="border-t border-black/5">
                  <td className="px-5 py-3 font-medium text-brand-black">
                    {c.name}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        c.channel === "meta"
                          ? "bg-black/10 text-brand-ink"
                          : "bg-brand-orange/20 text-brand-orange-dark"
                      }`}
                    >
                      {channelLabel(c.channel)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {formatNumber(c.clicks)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {formatNumber(c.impressions)}
                  </td>
                  <td className="px-5 py-3 text-right">{formatTL(c.spend)}</td>
                  <td className="px-5 py-3 text-right">
                    {formatPercent(ctr(c.clicks, c.impressions))}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {formatTL(cpc(c.spend, c.clicks))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-brand-orange bg-brand-soft font-bold">
                <td className="px-5 py-3" colSpan={2}>
                  TOPLAM
                </td>
                <td className="px-5 py-3 text-right">
                  {formatNumber(t.clicks)}
                </td>
                <td className="px-5 py-3 text-right">
                  {formatNumber(t.impressions)}
                </td>
                <td className="px-5 py-3 text-right">{formatTL(t.spend)}</td>
                <td className="px-5 py-3 text-right">{formatPercent(t.ctr)}</td>
                <td className="px-5 py-3 text-right">{formatTL(t.cpc)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Değerlendirme notu */}
      {data.note && (
        <div className="rounded-2xl border-l-4 border-brand-orange bg-white p-5 shadow-card">
          <h3 className="font-semibold text-brand-black">
            Ajans Değerlendirmesi
          </h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-brand-ink">
            {data.note}
          </p>
        </div>
      )}
    </div>
  );
}
