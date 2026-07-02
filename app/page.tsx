import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-black text-white">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16">
        <Logo onDark size="lg" />

        <h1 className="mt-10 max-w-2xl text-center text-3xl font-extrabold sm:text-4xl">
          Dijital Dönüşüm ve{" "}
          <span className="text-brand-orange">Reklam Analiz</span> Programı
        </h1>
        <p className="mt-4 max-w-xl text-center text-white/70">
          Reklam kampanyalarınızın performansını tek ekrandan takip edin.
          Google Ads ve Meta verileriniz, sade ve anlaşılır raporlarla.
        </p>

        <div className="mt-12 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <Link
            href="/login/client"
            className="group rounded-2xl bg-brand-orange p-6 text-brand-black transition hover:brightness-105"
          >
            <div className="text-lg font-bold">Müşteri Girişi</div>
            <p className="mt-1 text-sm text-black/70">
              Firma kullanıcı adı ve şifrenizle kendi raporlarınızı görün.
            </p>
            <div className="mt-4 text-sm font-semibold">Giriş yap →</div>
          </Link>

          <Link
            href="/login/admin"
            className="group rounded-2xl border border-white/15 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <div className="text-lg font-bold">Ajans Girişi</div>
            <p className="mt-1 text-sm text-white/60">
              2Kat Medya yönetim paneli — müşteri ve veri yönetimi.
            </p>
            <div className="mt-4 text-sm font-semibold text-brand-orange">
              Yönetici girişi →
            </div>
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-white/60">
        <span className="font-semibold text-brand-orange">
          Yusuf Serdar Yavuz
        </span>{" "}
        · Meta Uzmanı · 0541 290 07 71
      </footer>
    </div>
  );
}
