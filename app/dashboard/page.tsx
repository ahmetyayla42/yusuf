import Link from "next/link";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { monthName } from "@/lib/calc";
import { ReportView, ReportViewData } from "@/components/ReportView";
import { PrintButton } from "@/components/PrintButton";
import { Logo } from "@/components/Logo";

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
    inactiveDays: selected.inactiveDays,
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
      <div className="mb-2 hidden items-center justify-between border-b border-black/10 pb-4 print:flex">
        <Logo size="md" />
        <div className="text-right text-xs text-brand-gray">
          <div className="font-semibold text-brand-orange-dark">
            Yusuf Serdar Yavuz
          </div>
          <div>Meta Uzmanı · 0541 290 07 71</div>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">{client.name}</h1>
          <p className="text-sm text-brand-gray">
            Reklam performans raporu · {data.periodLabel}
          </p>
        </div>
        <PrintButton />
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
