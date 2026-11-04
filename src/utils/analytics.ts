const MEASUREMENT_ID = "G-ZEH48Z5WQ1";
const SAFE_PAGE_TITLE = "سرمد | صفحة إهداء";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getSafePageLocation(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

export function trackEvent(
  eventName: string,
  parameters: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    ...parameters,
    // Never send the dedication name stored in the ?to= query parameter.
    page_location: getSafePageLocation(),
    page_title: SAFE_PAGE_TITLE,
  });
}

export function trackInitialPageView(): void {
  trackEvent("page_view");
}
