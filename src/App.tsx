import { useEffect } from "react";
import { BrandHeader } from "./components/BrandHeader";
import { DedicationCard } from "./components/DedicationCard";
import { ReadingContent } from "./components/ReadingContent";
import { useDedicationName } from "./hooks/useDedicationName";

export default function App() {
  const { name, updateName, maxLength } = useDedicationName();
  const pageName = name.trim();

  useEffect(() => {
    document.title = pageName
      ? `إهداء إلى ${pageName} | سرمد`
      : "سرمد | صفحة إهداء";
  }, [pageName]);

  return (
    <div className="app-shell min-h-screen" dir="rtl">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="page-container">
        <BrandHeader />

        <main className="main-content">
          <div className="page-intro">
            <p className="intro-kicker">مساحة للإهداء والمحبة</p>
            <h1>اسمٌ عزيز، وأثرٌ طيّب</h1>
            <p className="intro-description">
              صفحة إهداء بسيطة تحمل اسمك أو اسم شخص تحبه.
            </p>
          </div>

          <DedicationCard
            name={name}
            maxLength={maxLength}
            onNameChange={updateName}
          />

          <p className="editing-note">
            {pageName
              ? "يمكنك الضغط على الاسم وتعديله في أي وقت."
              : "اكتب الاسم مباشرةً في البطاقة لتخصيص إهدائك."}
          </p>

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
