import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-brand-soft">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-semibold text-brand-orange-dark sm:inline">
              Yönetim Paneli
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
