"use client";

import { useActionState } from "react";
import { changeAdminPassword } from "@/lib/actions/auth";

export function ChangePasswordCard() {
  const [state, formAction, pending] = useActionState(
    changeAdminPassword,
    undefined
  );

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-card">
      <h2 className="text-base font-bold text-brand-black">
        Ajans Şifresini Değiştir
      </h2>
      <p className="mt-1 text-sm text-brand-gray">
        Güvenlik için varsayılan şifreyi ilk girişte değiştirin.
      </p>
      <form
        action={formAction}
        className="mt-4 grid gap-3 sm:max-w-md sm:grid-cols-2"
      >
        <input
          type="password"
          name="current"
          placeholder="Mevcut şifre"
          required
          className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
        />
        <input
          type="password"
          name="next"
          placeholder="Yeni şifre (min 6)"
          required
          className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
        />
        <div className="sm:col-span-2">
          {state?.error && (
            <p className="mb-2 text-sm text-red-700">{state.error}</p>
          )}
          {state?.ok && (
            <p className="mb-2 text-sm text-green-700">Şifre güncellendi. ✓</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-brand-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-ink disabled:opacity-60"
          >
            {pending ? "Kaydediliyor…" : "Şifreyi Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
