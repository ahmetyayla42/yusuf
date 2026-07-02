// Metrik hesaplamaları ve biçimlendirme yardımcıları.

export type CampaignLike = {
  clicks: number;
  impressions: number;
  spend: number;
};

/** CTR = tıklama / gösterim (%) */
export function ctr(clicks: number, impressions: number): number {
  if (!impressions) return 0;
  return (clicks / impressions) * 100;
}

/** CPC = harcama / tıklama (TL) */
export function cpc(spend: number, clicks: number): number {
  if (!clicks) return 0;
  return spend / clicks;
}

export function sum<T>(items: T[], pick: (x: T) => number): number {
  return items.reduce((acc, x) => acc + (pick(x) || 0), 0);
}

export function totals(campaigns: CampaignLike[]) {
  const clicks = sum(campaigns, (c) => c.clicks);
  const impressions = sum(campaigns, (c) => c.impressions);
  const spend = sum(campaigns, (c) => c.spend);
  return {
    clicks,
    impressions,
    spend,
    ctr: ctr(clicks, impressions),
    cpc: cpc(spend, clicks),
  };
}

const TL = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

const NUM = new Intl.NumberFormat("tr-TR");

export function formatTL(v: number): string {
  return TL.format(v || 0);
}

export function formatNumber(v: number): string {
  return NUM.format(v || 0);
}

export function formatPercent(v: number): string {
  return `%${(v || 0).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ---- Reklam performans değerlendirmesi ----
// Elimizdeki veriye (tıklama/gösterim) göre otomatik puanlama.
// Ölçüt: tıklama oranı (CTR). %4+ Yüksek, %1,5–4 Orta, altı Geliştirilmeli.
export type PerfLevel = "high" | "mid" | "low";
export type Rating = { level: PerfLevel; label: string; comment: string };

export const PERF_CRITERIA =
  "Değerlendirme, tıklama oranına (CTR) göre otomatik hesaplanır: %4 ve üzeri “Yüksek”, %1,5–4 “Orta”, %1,5 altı “Geliştirilmeli”.";

export function ratePerformance(
  clicks: number,
  impressions: number
): Rating | null {
  if (impressions <= 0) return null; // CTR hesaplanamaz (ör. yalnızca profil ziyareti)
  const c = ctr(clicks, impressions);
  const p = formatPercent(c);
  if (c >= 4)
    return {
      level: "high",
      label: "Yüksek Performans",
      comment: `Güçlü tıklama oranı (CTR ${p}). Reklam ilgi çekici ve hedef kitleyle uyumlu.`,
    };
  if (c >= 1.5)
    return {
      level: "mid",
      label: "Orta Performans",
      comment: `Makul tıklama oranı (CTR ${p}). Görsel ve metin denemeleriyle daha da yükseltilebilir.`,
    };
  return {
    level: "low",
    label: "Geliştirilmeli",
    comment: `Düşük tıklama oranı (CTR ${p}). Hedefleme ve reklam metni gözden geçirilmeli.`,
  };
}

/** "18, 19, 20" gibi bir metni [18,19,20] sayı dizisine çevirir. */
export function parseDaysCsv(v: string | number[] | null | undefined): number[] {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  return v
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
}

/** [18,19,20] dizisini "18,19,20" metnine çevirir. */
export function daysToCsv(days: number[]): string {
  return days.join(",");
}

export const MONTHS_TR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

export function monthName(month: number): string {
  return MONTHS_TR[month - 1] ?? String(month);
}

export const CHANNEL_LABELS: Record<string, string> = {
  google: "Google Ads",
  meta: "Meta",
};

export function channelLabel(channel: string): string {
  return CHANNEL_LABELS[channel] ?? channel;
}
