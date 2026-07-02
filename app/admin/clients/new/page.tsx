import Link from "next/link";
import { NewClientForm } from "./ClientForm";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-brand-gray hover:text-brand-black"
        >
          ← Müşteriler
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-brand-black">
          Yeni Müşteri
        </h1>
        <p className="text-sm text-brand-gray">
          Müşteri bilgilerini girin. Oluşturduktan sonra aylık veri
          ekleyebilirsiniz.
        </p>
      </div>
      <NewClientForm />
    </div>
  );
}
