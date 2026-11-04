import { useEffect } from "react";
import { BrandHeader } from "./components/BrandHeader";
import { DedicationCard } from "./components/DedicationCard";
import { ReadingContent } from "./components/ReadingContent";
import { useDedicationName } from "./hooks/useDedicationName";

export default function App() {
  const { name, updateName, maxLength } = useDedicationName();
  const pageName = name.trim();

  useEffect(() => {
    document.title = pageName ? `إهداء إلى ${pageName} | سرمد` : "سرمد | صفحة إهداء";
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = pageName
        ? `صفحة إهداء إلى ${pageName} من سرمد، تضم نصوصًا من القرآن والذكر والدعاء.`
        : "سرمد — صفحة إهداء باسمك أو باسم شخص تحبه، تضم نصوصًا من القرآن والذكر والدعاء.";
    }
  }, [pageName]);

  return (
    <div className="app-shell" dir="rtl">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="page-container" id="sarmad-page">
        <BrandHeader />
        <main className="main-content">
          <DedicationCard name={name} maxLength={maxLength} onNameChange={updateName} />

          <ReadingContent />
        </main>
        <footer className="site-footer" aria-label="سرمد">
          <span className="site-footer-brand">سرمد</span>
          <span className="site-footer-tagline">أثرٌ يبقى</span>
        </footer>
      </div>
    </div>
  );
}
