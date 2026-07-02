"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAdmin } from "@/lib/actions/auth";
import { Logo } from "@/components/Logo";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo onDark size="md" />
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-card">
          <h1 className="text-xl font-bold text-brand-black">Ajans Girişi</h1>
          <p className="mt-1 text-sm text-brand-gray">
            2Kat Medya yönetim paneli.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-ink">
                Yönetici Şifresi
              </label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
              />
            </div>

            {state?.error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-brand-orange py-2.5 font-semibold text-brand-black transition hover:brightness-105 disabled:opacity-60"
            >
              {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-white/60">
          <Link href="/" className="hover:text-white">
            ← Ana sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
