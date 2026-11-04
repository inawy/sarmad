import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export function InstallAction() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const isStandalone =
      displayMode.matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    setIsInstalled(isStandalone);

    const userAgent = navigator.userAgent;
    const isAppleMobile =
      /iPhone|iPad|iPod/i.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    setIsIOS(isAppleMobile);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowIOSInstructions(false);
    };

    const handleDisplayModeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsInstalled(true);
        setInstallPrompt(null);
        setShowIOSInstructions(false);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    displayMode.addEventListener("change", handleDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      displayMode.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      const promptEvent = installPrompt;
      // Consume this browser prompt once; a dismissal should not trigger another prompt.
      setInstallPrompt(null);

      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
        }
      } catch {
        // Keep the action hidden after an unsuccessful prompt attempt.
      }
      return;
    }

    if (isIOS) {
      setShowIOSInstructions((visible) => !visible);
    }
  };

  if (isInstalled || (!installPrompt && !isIOS)) {
    return null;
  }

  return (
    <div className="install-action">
      <button
        className="install-action-trigger"
        type="button"
        onClick={handleInstall}
        aria-expanded={isIOS ? showIOSInstructions : undefined}
      >
        <Download size={14} strokeWidth={1.8} aria-hidden="true" />
        <span>{showIOSInstructions ? "إخفاء التعليمات" : "تثبيت سرمد"}</span>
      </button>

      {isIOS && showIOSInstructions && (
        <p className="install-action-instructions">
          اضغط على زر المشاركة في المتصفح، ثم اختر «إضافة إلى الشاشة الرئيسية».
        </p>
      )}
    </div>
  );
}
