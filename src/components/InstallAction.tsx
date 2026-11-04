import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { trackEvent } from "../utils/analytics";

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
      trackEvent("app_installed");
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
      setInstallPrompt(null);
      trackEvent("install_prompt_opened", { platform: "browser" });

      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === "accepted") {
          trackEvent("install_prompt_accepted", { platform: "browser" });
          setIsInstalled(true);
        }
      } catch {
        // Do not show automatic or repeated install prompts.
      }
      return;
    }

    if (isIOS) {
      const nextVisibility = !showIOSInstructions;
      setShowIOSInstructions(nextVisibility);
      if (nextVisibility) {
        trackEvent("install_instructions_opened", { platform: "ios" });
      }
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
