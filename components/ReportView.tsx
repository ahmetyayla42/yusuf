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
import {
  IconClick,
  IconEye,
  IconWallet,
  IconPercent,
  IconTag,
  IconUsers,
} from "./Icons";

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-5 w-1.5 rounded-full bg-brand-orange" />
      <h2 className="text-lg font-bold text-brand-black">{children}</h2>
    </div>
  );
}

// Kampanya satırında 0 değerleri "—" göster (boş görünmesin).
const dash = (s: string, zero: boolean) => (zero ? "—" : s);

export function ReportView({
  data,
  showCharts = true,
}: {
  data: ReportViewData;
  showCharts?: boolean;
}) {
  const t = totals(data.campaigns);
  const chartData: ChartDatum[] = data.campaigns
    .filter((c) => c.clicks > 0 || c.spend > 0)
    .map((c) => ({
      name: c.name,
      clicks: c.clicks,
      spend: c.spend,
      channel: c.channel,
    }));
  const extras = data.campaigns.filter((c) => c.extraLabel && c.extraValue);

  return (
    <div className="space-y-8">
      {/* KPI kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Toplam Tıklama"
          value={formatNumber(t.clicks)}
          icon={<IconClick />}
        />
        <KpiCard
          label="Toplam Gösterim"
          value={formatNumber(t.impressions)}
          icon={<IconEye />}
        />
        <KpiCard
          label="Toplam Harcama"
          value={formatTL(t.spend)}
          icon={<IconWallet />}
          accent
        />
        <KpiCard
          label="Ortalama CTR"
          value={formatPercent(t.ctr)}
          sub="Tıklama / Gösterim"
          icon={<IconPercent />}
        />
        <KpiCard
          label="Ortalama CPC"
          value={formatTL(t.cpc)}
          sub="Harcama / Tıklama"
          icon={<IconTag />}
        />
      </div>

      {/* Ek metrikler (örn. profil ziyareti) */}
      {extras.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {extras.map((c, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-brand-orange/30 bg-brand-orange/[0.06] p-5 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div className="text-xs font-bold uppercase tracking-wide text-brand-orange-dark">
                  {c.extraLabel}
                </div>
                <span className="rounded-lg bg-brand-orange/15 p-2 text-brand-orange-dark">
                  <IconUsers />
                </span>
              </div>
              <div className="mt-3 text-3xl font-extrabold tracking-tight text-brand-black">
                {formatNumber(c.extraValue ?? 0)}
              </div>
              <div className="mt-1 text-xs text-brand-gray">{c.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* Grafikler */}
      {showCharts && chartData.length > 0 && (
        <div className="space-y-4">
          <SectionTitle>Kampanya Karşılaştırması</SectionTitle>
          <CampaignChart data={chartData} />
        </div>
      )}

      {/* Yayın sürekliliği */}
      <div className="space-y-4">
        <SectionTitle>Yayın Takvimi</SectionTitle>
        <ContinuityStrip
          daysInMonth={data.daysInMonth}
          inactiveDays={data.inactiveDays}
        />
      </div>

      {/* Kampanya tablosu */}
      <div className="space-y-4">
        <SectionTitle>Kampanya Detayları</SectionTitle>
        <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-card">
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
                {data.campaigns.map((c, i) => {
                  const empty = c.clicks === 0 && c.impressions === 0 && c.spend === 0;
                  return (
                    <tr
                      key={i}
                      className="border-t border-black/5 transition hover:bg-brand-soft/40"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-brand-black">
                          {c.name}
                        </div>
                        {c.extraLabel && c.extraValue ? (
                          <div className="mt-0.5 text-xs text-brand-orange-dark">
                            {c.extraLabel}: {formatNumber(c.extraValue)}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5">
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
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        {dash(formatNumber(c.clicks), c.clicks === 0)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        {dash(formatNumber(c.impressions), c.impressions === 0)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        {dash(formatTL(c.spend), c.spend === 0)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        {dash(formatPercent(ctr(c.clicks, c.impressions)), empty)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        {dash(formatTL(cpc(c.spend, c.clicks)), c.clicks === 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-brand-orange bg-brand-soft font-bold">
                  <td className="px-5 py-3.5" colSpan={2}>
                    TOPLAM
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {formatNumber(t.clicks)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {formatNumber(t.impressions)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {formatTL(t.spend)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {formatPercent(t.ctr)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {formatTL(t.cpc)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Değerlendirme notu */}
      {data.note && (
        <div className="rounded-2xl border border-black/[0.06] bg-gradient-to-br from-brand-soft to-white p-6 shadow-card">
          <div className="flex items-center gap-2.5">
            <span className="h-5 w-1.5 rounded-full bg-brand-orange" />
            <h3 className="font-bold text-brand-black">Ajans Değerlendirmesi</h3>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-brand-ink">
            {data.note}
          </p>
        </div>
      )}
    </div>
  );
}
