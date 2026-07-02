import { Logo } from "./Logo";

// Her sayfanın altında iletişim bilgisi.
export function Footer({ onDark = false }: { onDark?: boolean }) {
  return (
    <footer
      className={`mt-10 border-t ${
        onDark ? "border-white/10" : "border-black/10"
      } py-6`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <Logo onDark={onDark} size="sm" />
        <div
          className={`text-center text-sm sm:text-right ${
            onDark ? "text-white/70" : "text-brand-gray"
          }`}
        >
          <div className="font-semibold text-brand-orange">
            Yusuf Serdar Yavuz
          </div>
          <div>Meta Uzmanı · 0541 290 07 71</div>
        </div>
      </div>
    </footer>
  );
}
