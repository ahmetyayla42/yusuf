"use client";

import { useActionState } from "react";
import { createClient } from "@/lib/actions/admin";

export function NewClientForm() {
  const [state, formAction, pending] = useActionState(createClient, undefined);

  return (
    <form
      action={formAction}
      className="max-w-lg space-y-4 rounded-2xl border border-black/10 bg-white p-6 shadow-card"
    >
      <Field label="Firma Adı" name="name" placeholder="Örn: Protez Saç" required />
      <Field
        label="Kullanıcı Adı (giriş için)"
        name="username"
        placeholder="Örn: protezsac"
        required
        hint="Küçük harf, boşluksuz. Müşteri bununla giriş yapacak."
      />
      <Field
        label="Şifre"
        name="password"
        type="text"
        placeholder="Müşteriye vereceğiniz şifre"
        required
        hint="En az 4 karakter. Müşteriye iletin."
      />
      <Field
        label="Not / Sektör (opsiyonel)"
        name="contactNote"
        placeholder="Örn: Erkek güzellik salonu"
      />

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-orange px-5 py-2.5 font-semibold text-brand-black transition hover:brightness-105 disabled:opacity-60"
      >
        {pending ? "Kaydediliyor…" : "Müşteriyi Oluştur"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  hint,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-brand-ink">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
      />
      {hint && <p className="mt-1 text-xs text-brand-gray">{hint}</p>}
    </div>
  );
}
