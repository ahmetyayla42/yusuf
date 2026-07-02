import { logout } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-brand-ink transition hover:bg-brand-soft"
      >
        Çıkış
      </button>
    </form>
  );
}
