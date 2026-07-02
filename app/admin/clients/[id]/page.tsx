import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteClient, deleteReport } from "@/lib/actions/admin";
import {
  totals,
  formatTL,
  formatNumber,
  monthName,
  parseDaysCsv,
} from "@/lib/calc";
import { EditClientForm } from "./EditClientForm";
import { ReportForm, ExistingReport } from "./ReportForm";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      reports: {
        orderBy: [{ year: "desc" }, { month: "desc" }],
        include: { campaigns: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!client) notFound();

  const existing: ExistingReport[] = client.reports.map((r) => ({
    year: r.year,
    month: r.month,
    note: r.note ?? "",
    daysInMonth: r.daysInMonth,
    inactiveDays: parseDaysCsv(r.inactiveDays),
    campaigns: r.campaigns.map((c) => ({
      name: c.name,
      channel: c.channel,
      clicks: c.clicks,
      impressions: c.impressions,
      spend: c.spend,
      extraLabel: c.extraLabel,
      extraValue: c.extraValue,
    })),
  }));

  const defaultYear = client.reports[0]?.year ?? 2026;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin"
          className="text-sm text-brand-gray hover:text-brand-black"
        >
          ← Müşteriler
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-brand-black">
          {client.name}
        </h1>
        <p className="text-sm text-brand-gray">
          Giriş kullanıcı adı: <span className="font-mono">@{client.username}</span>
        </p>
      </div>

      {/* Müşteri bilgileri */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-black">
          Müşteri Bilgileri
        </h2>
        <EditClientForm
          id={client.id}
          name={client.name}
          username={client.username}
          contactNote={client.contactNote ?? ""}
        />
      </section>

      {/* Aylık veri girişi */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-black">
          Aylık Veri Girişi
        </h2>
        <p className="text-sm text-brand-gray">
          Ay/yıl seçin, kampanyaları girin ve kaydedin. Kayıtlı bir ayı
          seçtiğinizde bilgiler otomatik yüklenir; üzerine yazıp
          güncelleyebilirsiniz.
        </p>
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-card">
          <ReportForm
            clientId={client.id}
            existing={existing}
            defaultYear={defaultYear}
          />
        </div>
      </section>

      {/* Kayıtlı raporlar */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-black">
          Kayıtlı Raporlar
        </h2>
        {client.reports.length === 0 ? (
          <p className="text-sm text-brand-gray">Henüz kayıtlı ay yok.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-brand-soft text-left text-xs uppercase tracking-wide text-brand-gray">
                <tr>
                  <th className="px-4 py-3">Dönem</th>
                  <th className="px-4 py-3">Kampanya</th>
                  <th className="px-4 py-3 text-right">Tıklama</th>
                  <th className="px-4 py-3 text-right">Harcama</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {client.reports.map((r) => {
                  const t = totals(r.campaigns);
                  return (
                    <tr key={r.id} className="border-t border-black/5">
                      <td className="px-4 py-3 font-medium">
                        {monthName(r.month)} {r.year}
                      </td>
                      <td className="px-4 py-3 text-brand-gray">
                        {r.campaigns.length} kampanya
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatNumber(t.clicks)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatTL(t.spend)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <form action={deleteReport} className="inline">
                          <input type="hidden" name="reportId" value={r.id} />
                          <input
                            type="hidden"
                            name="clientId"
                            value={client.id}
                          />
                          <button
                            type="submit"
                            className="text-red-600 hover:underline"
                          >
                            Sil
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Tehlikeli bölge */}
      <section className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
        <h2 className="text-base font-semibold text-red-700">Müşteriyi Sil</h2>
        <p className="mt-1 text-sm text-red-600/80">
          Bu işlem müşteriyi ve tüm raporlarını kalıcı olarak siler.
        </p>
        <form action={deleteClient} className="mt-3">
          <input type="hidden" name="id" value={client.id} />
          <button
            type="submit"
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            Müşteriyi Kalıcı Olarak Sil
          </button>
        </form>
      </section>
    </div>
  );
}
