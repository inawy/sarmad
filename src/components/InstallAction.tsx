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
  const [isSamsungInternet, setIsSamsungInternet] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showSamsungInstructions, setShowSamsungInstructions] = useState(false);

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
    setIsSamsungInternet(/SamsungBrowser\//i.test(userAgent));

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowIOSInstructions(false);
      setShowSamsungInstructions(false);
      trackEvent("app_installed");
    };

    const handleDisplayModeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsInstalled(true);
        setInstallPrompt(null);
        setShowIOSInstructions(false);
        setShowSamsungInstructions(false);
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
    // Use the browser's native install prompt whenever it is available.
    if (installPrompt) {
      const promptEvent = installPrompt;
      setInstallPrompt(null);
      trackEvent("install_prompt_opened", {
        platform: isSamsungInternet ? "samsung-internet" : "browser",
      });

      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === "accepted") {
          trackEvent("install_prompt_accepted", {
            platform: isSamsungInternet ? "samsung-internet" : "browser",
          });
          setIsInstalled(true);
        }
      } catch {
        // The browser may decline to show a prompt; keep manual instructions available.
        if (isSamsungInternet) setShowSamsungInstructions(true);
      }
      return;
    }

    if (isSamsungInternet) {
      const nextVisibility = !showSamsungInstructions;
      setShowSamsungInstructions(nextVisibility);
      if (nextVisibility) {
        trackEvent("install_instructions_opened", { platform: "samsung-internet" });
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

  if (isInstalled || (!installPrompt && !isIOS && !isSamsungInternet)) {
    return null;
  }

  const instructionsExpanded =
    (isSamsungInternet && showSamsungInstructions) || (isIOS && showIOSInstructions);

  return (
    <div className="install-action">
      <button
        className="install-action-trigger"
        type="button"
        onClick={handleInstall}
        aria-expanded={instructionsExpanded}
      >
        <Download size={14} strokeWidth={1.8} aria-hidden="true" />
        <span>
          {instructionsExpanded
            ? "إخفاء التعليمات"
            : installPrompt
              ? "تثبيت سرمد"
              : isSamsungInternet
                ? "تثبيت سرمد"
                : "تثبيت سرمد"}
        </span>
      </button>

      {isSamsungInternet && showSamsungInstructions && !installPrompt && (
        <p className="install-action-instructions" role="status">
          اضغط علامة (+) في شريط العنوان ثم اختر «الشاشة الرئيسية». ولو العلامة مش ظاهرة،
          افتح قائمة المتصفح ⋮ وابحث عن «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».
        </p>
      )}

      {isIOS && showIOSInstructions && (
        <p className="install-action-instructions" role="status">
          اضغط على زر المشاركة في المتصفح، ثم اختر «إضافة إلى الشاشة الرئيسية».
        </p>
      )}
    </div>
  );
}
