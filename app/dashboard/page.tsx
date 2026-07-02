import Link from "next/link";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { monthName, parseDaysCsv } from "@/lib/calc";
import { ReportView, ReportViewData } from "@/components/ReportView";
import { PrintButton } from "@/components/PrintButton";
import { Logo } from "@/components/Logo";
import { IconCalendar } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>;
}) {
  const session = await requireClient();
  const sp = await searchParams;

  const client = await prisma.client.findUnique({
    where: { id: session.id },
    include: {
      reports: {
        orderBy: [{ year: "desc" }, { month: "desc" }],
        include: { campaigns: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!client || client.reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/15 bg-white p-10 text-center">
        <h1 className="text-xl font-bold text-brand-black">
          Merhaba {session.name}
        </h1>
        <p className="mt-2 text-brand-gray">
          Henüz raporunuz hazırlanmadı. Verileriniz eklendiğinde burada
          göreceksiniz.
        </p>
      </div>
    );
  }

  const y = sp.y ? parseInt(sp.y, 10) : undefined;
  const m = sp.m ? parseInt(sp.m, 10) : undefined;
  const selected =
    client.reports.find((r) => r.year === y && r.month === m) ??
    client.reports[0];

  const data: ReportViewData = {
    clientName: client.name,
    periodLabel: `${monthName(selected.month)} ${selected.year}`,
    note: selected.note,
    daysInMonth: selected.daysInMonth,
    inactiveDays: parseDaysCsv(selected.inactiveDays),
    campaigns: selected.campaigns.map((c) => ({
      name: c.name,
      channel: c.channel,
      clicks: c.clicks,
      impressions: c.impressions,
      spend: c.spend,
      extraLabel: c.extraLabel,
      extraValue: c.extraValue,
    })),
  };

  return (
    <div className="space-y-6">
      {/* Sadece yazdırmada (PDF) görünen markalı başlık */}
      <div className="hidden print:block">
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <Logo size="md" />
          <div className="text-right text-xs text-brand-gray">
            <div className="font-semibold text-brand-orange-dark">
              Yusuf Serdar Yavuz
            </div>
            <div>Meta Uzmanı · 0541 290 07 71</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-brand-orange-dark">
            Reklam Performans Raporu
          </div>
          <h1 className="text-2xl font-extrabold text-brand-black">
            {client.name}
          </h1>
          <div className="text-sm text-brand-gray">{data.periodLabel}</div>
        </div>
      </div>

      {/* Hero başlık (ekran) */}
      <div className="no-print relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-[#1b1b1b] to-[#2a2012] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-orange/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              Reklam Performans Raporu
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {client.name}
            </h1>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
              <IconCalendar className="h-4 w-4" />
              {data.periodLabel}
            </div>
          </div>
          <PrintButton />
        </div>
      </div>

      {/* Ay seçici */}
      {client.reports.length > 1 && (
        <div className="no-print flex flex-wrap gap-2">
          {client.reports.map((r) => {
            const active =
              r.year === selected.year && r.month === selected.month;
            return (
              <Link
                key={r.id}
                href={`/dashboard?y=${r.year}&m=${r.month}`}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-brand-black text-white"
                    : "border border-black/10 bg-white text-brand-ink hover:border-brand-orange"
                }`}
              >
                {monthName(r.month)} {r.year}
              </Link>
            );
          })}
        </div>
      )}

      <ReportView data={data} />
    </div>
  );
}
