"use client";

import { useActionState } from "react";
import { updateClient } from "@/lib/actions/admin";

type Props = {
  id: string;
  name: string;
  username: string;
  contactNote: string;
};

export function EditClientForm({ id, name, username, contactNote }: Props) {
  const [state, formAction, pending] = useActionState(updateClient, undefined);

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-card sm:grid-cols-2"
    >
      <input type="hidden" name="id" value={id} />
      <div>
        <label className="mb-1 block text-sm font-medium text-brand-ink">
          Firma Adı
        </label>
        <input
          name="name"
          defaultValue={name}
          required
          className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-brand-ink">
          Kullanıcı Adı
        </label>
        <input
          name="username"
          defaultValue={username}
          required
          className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-brand-ink">
          Yeni Şifre (boş bırakırsanız değişmez)
        </label>
        <input
          name="password"
          type="text"
          placeholder="••••••"
          className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-brand-ink">
          Not / Sektör
        </label>
        <input
          name="contactNote"
          defaultValue={contactNote}
          className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
        />
      </div>

      <div className="sm:col-span-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-ink disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : "Bilgileri Kaydet"}
        </button>
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
