"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { saveReport } from "@/lib/actions/admin";
import { MONTHS_TR, ctr, cpc, formatPercent, formatTL } from "@/lib/calc";

type CampaignRow = {
  name: string;
  channel: "google" | "meta";
  clicks: string;
  impressions: string;
  spend: string;
  extraLabel: string;
  extraValue: string;
};

export type ExistingReport = {
  year: number;
  month: number;
  note: string;
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

const emptyRow: CampaignRow = {
  name: "",
  channel: "google",
  clicks: "",
  impressions: "",
  spend: "",
  extraLabel: "",
  extraValue: "",
};

export function ReportForm({
  clientId,
  existing,
  defaultYear,
}: {
  clientId: string;
  existing: ExistingReport[];
  defaultYear: number;
}) {
  const [state, formAction, pending] = useActionState(saveReport, undefined);

  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(6);
  const [note, setNote] = useState("");
  const [daysInMonth, setDaysInMonth] = useState("30");
  const [inactiveDays, setInactiveDays] = useState("");
  const [rows, setRows] = useState<CampaignRow[]>([{ ...emptyRow }]);

  const existingMap = useMemo(() => {
    const m = new Map<string, ExistingReport>();
    for (const r of existing) m.set(`${r.year}-${r.month}`, r);
    return m;
  }, [existing]);

  // Seçilen ay/yıl kayıtlıysa forma yükle, değilse temizle.
  useEffect(() => {
    const found = existingMap.get(`${year}-${month}`);
    if (found) {
      setNote(found.note ?? "");
      setDaysInMonth(String(found.daysInMonth));
      setInactiveDays(found.inactiveDays.join(", "));
      setRows(
        found.campaigns.length
          ? found.campaigns.map((c) => ({
              name: c.name,
              channel: c.channel === "meta" ? "meta" : "google",
              clicks: String(c.clicks),
              impressions: String(c.impressions),
              spend: String(c.spend),
              extraLabel: c.extraLabel ?? "",
              extraValue: c.extraValue != null ? String(c.extraValue) : "",
            }))
          : [{ ...emptyRow }]
      );
    } else {
      setNote("");
      setDaysInMonth("30");
      setInactiveDays("");
      setRows([{ ...emptyRow }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const isEditing = existingMap.has(`${year}-${month}`);

  function updateRow(i: number, patch: Partial<CampaignRow>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, { ...emptyRow }]);
  }
  function removeRow(i: number) {
    setRows((prev) =>
      prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)
    );
  }

  const campaignsJson = JSON.stringify(
    rows
      .filter((r) => r.name.trim())
      .map((r) => ({
        name: r.name.trim(),
        channel: r.channel,
        clicks: parseInt(r.clicks || "0", 10) || 0,
        impressions: parseInt(r.impressions || "0", 10) || 0,
        spend: parseFloat(r.spend || "0") || 0,
        extraLabel: r.extraLabel.trim() || null,
        extraValue: r.extraValue ? parseInt(r.extraValue, 10) : null,
      }))
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="clientId" value={clientId} />
      <input type="hidden" name="campaigns" value={campaignsJson} />

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">
            Yıl
          </label>
          <input
            type="number"
            name="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10) || year)}
            className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">
            Ay
          </label>
          <select
            name="month"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
          >
            {MONTHS_TR.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">
            Aydaki Gün Sayısı
          </label>
          <input
            type="number"
            name="daysInMonth"
            value={daysInMonth}
            onChange={(e) => setDaysInMonth(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">
            Yayın Olmayan Günler
          </label>
          <input
            type="text"
            name="inactiveDays"
            value={inactiveDays}
            onChange={(e) => setInactiveDays(e.target.value)}
            placeholder="Örn: 12, 13, 14"
            className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-ink">
          Genel Değerlendirme / Not
        </label>
        <textarea
          name="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Örn: Instagram hesabı askıya alındığı için kampanya kesintili yayınlandı."
          className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
        />
      </div>

      {/* Kampanyalar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-brand-black">Kampanyalar</h3>
          <button
            type="button"
            onClick={addRow}
            className="rounded-md border border-brand-orange px-3 py-1 text-sm font-semibold text-brand-orange-dark transition hover:bg-brand-orange/10"
          >
            + Kampanya Ekle
          </button>
        </div>

        {rows.map((row, i) => {
          const clicks = parseInt(row.clicks || "0", 10) || 0;
          const impressions = parseInt(row.impressions || "0", 10) || 0;
          const spend = parseFloat(row.spend || "0") || 0;
          return (
            <div
              key={i}
              className="rounded-xl border border-black/10 bg-brand-soft/60 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <label className="mb-1 block text-xs font-medium text-brand-gray">
                    Kampanya Adı
                  </label>
                  <input
                    value={row.name}
                    onChange={(e) => updateRow(i, { name: e.target.value })}
                    placeholder="Örn: Google Ads – Protez Saç"
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="mb-1 block text-xs font-medium text-brand-gray">
                    Kanal
                  </label>
                  <select
                    value={row.channel}
                    onChange={(e) =>
                      updateRow(i, {
                        channel: e.target.value as "google" | "meta",
                      })
                    }
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange"
                  >
                    <option value="google">Google Ads</option>
                    <option value="meta">Meta</option>
                  </select>
                </div>
                <div className="sm:col-span-4 flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    Sil
                  </button>
                </div>

                <div className="sm:col-span-3">
                  <label className="mb-1 block text-xs font-medium text-brand-gray">
                    Tıklama
                  </label>
                  <input
                    type="number"
                    value={row.clicks}
                    onChange={(e) => updateRow(i, { clicks: e.target.value })}
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="mb-1 block text-xs font-medium text-brand-gray">
                    Gösterim
                  </label>
                  <input
                    type="number"
                    value={row.impressions}
                    onChange={(e) =>
                      updateRow(i, { impressions: e.target.value })
                    }
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="mb-1 block text-xs font-medium text-brand-gray">
                    Harcama (TL)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={row.spend}
                    onChange={(e) => updateRow(i, { spend: e.target.value })}
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange"
                  />
                </div>
                <div className="sm:col-span-3 flex flex-col justify-end">
                  <div className="rounded-lg bg-white px-3 py-2 text-xs text-brand-gray">
                    CTR{" "}
                    <span className="font-semibold text-brand-black">
                      {formatPercent(ctr(clicks, impressions))}
                    </span>{" "}
                    · CPC{" "}
                    <span className="font-semibold text-brand-black">
                      {formatTL(cpc(spend, clicks))}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="mb-1 block text-xs font-medium text-brand-gray">
                    Ek Metrik Adı (opsiyonel)
                  </label>
                  <input
                    value={row.extraLabel}
                    onChange={(e) =>
                      updateRow(i, { extraLabel: e.target.value })
                    }
                    placeholder="Örn: Profil ziyareti"
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange"
                  />
                </div>
                <div className="sm:col-span-6">
                  <label className="mb-1 block text-xs font-medium text-brand-gray">
                    Ek Metrik Değeri (opsiyonel)
                  </label>
                  <input
                    type="number"
                    value={row.extraValue}
                    onChange={(e) =>
                      updateRow(i, { extraValue: e.target.value })
                    }
                    placeholder="Örn: 7560"
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-orange px-5 py-2.5 font-semibold text-brand-black transition hover:brightness-105 disabled:opacity-60"
        >
          {pending
            ? "Kaydediliyor…"
            : isEditing
            ? "Ayı Güncelle"
            : "Ayı Kaydet"}
        </button>
        {isEditing && (
          <span className="rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-semibold text-brand-orange-dark">
            Bu ay kayıtlı — düzenliyorsunuz
          </span>
        )}
        {state?.error && (
          <span className="text-sm text-red-700">{state.error}</span>
        )}
        {state?.ok && (
          <span className="text-sm text-green-700">Kaydedildi ✓</span>
        )}
      </div>
    </form>
  );
}
