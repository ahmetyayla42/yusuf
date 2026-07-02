import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { totals, formatTL, formatNumber, monthName } from "@/lib/calc";
import { ChangePasswordCard } from "./ChangePasswordCard";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      reports: {
        orderBy: [{ year: "desc" }, { month: "desc" }],
        include: { campaigns: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Müşteriler</h1>
          <p className="text-sm text-brand-gray">
            {clients.length} müşteri kayıtlı. Ekle, düzenle, veri gir.
          </p>
        </div>
        <Link
          href="/admin/clients/new"
          className="rounded-lg bg-brand-orange px-4 py-2 font-semibold text-brand-black transition hover:brightness-105"
        >
          + Yeni Müşteri
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-10 text-center">
          <p className="text-brand-gray">
            Henüz müşteri yok. İlk müşterini eklemek için “Yeni Müşteri”ye
            tıkla.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => {
            const latest = client.reports[0];
            const t = latest ? totals(latest.campaigns) : null;
            return (
              <Link
                key={client.id}
                href={`/admin/clients/${client.id}`}
                className="group rounded-2xl border border-black/10 bg-white p-5 shadow-card transition hover:border-brand-orange"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-brand-black">
                    {client.name}
                  </h2>
                  <span className="text-xs text-brand-gray">
                    @{client.username}
                  </span>
                </div>
                {latest && t ? (
                  <div className="mt-4 space-y-1 text-sm">
                    <div className="text-xs font-medium uppercase tracking-wide text-brand-gray">
                      Son rapor · {monthName(latest.month)} {latest.year}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-gray">Tıklama</span>
                      <span className="font-semibold">
                        {formatNumber(t.clicks)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-gray">Harcama</span>
                      <span className="font-semibold">{formatTL(t.spend)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-brand-gray">
                    Henüz veri girilmemiş.
                  </p>
                )}
                <div className="mt-4 text-sm font-semibold text-brand-orange-dark opacity-0 transition group-hover:opacity-100">
                  Yönet →
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <ChangePasswordCard />
    </div>
  );
}
