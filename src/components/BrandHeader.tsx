import { Infinity } from "lucide-react";

export function BrandHeader() {
  return (
    <header className="brand-header" aria-label="سرمد">
      <a className="brand-lockup" href="./" aria-label="سرمد — الصفحة الرئيسية">
        <span className="brand-symbol" aria-hidden="true">
          <Infinity strokeWidth={1.8} />
        </span>
        <span className="brand-name">سرمد</span>
      </a>
      <span className="brand-divider" aria-hidden="true" />
      <span className="brand-tagline">أثرٌ يبقى</span>
    </header>
  );
}
