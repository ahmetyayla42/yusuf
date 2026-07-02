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
