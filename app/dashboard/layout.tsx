import { requireClient } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireClient();

  return (
    <div className="flex min-h-screen flex-col bg-brand-soft">
      <header className="no-print border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-brand-gray sm:inline">
              {session.name}
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
