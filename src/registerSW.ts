const WORKER_FILE = "sw.js";
const UPDATE_INTERVAL_MS = 30 * 60 * 1000;

/**
 * Registers the Workbox service worker with HTTP caching disabled for worker
 * updates, then checks for a fresh deployment on startup and when the app
 * returns to the foreground.
 */
export function registerSarmadServiceWorker(): void {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  const hadControllerOnLoad = Boolean(navigator.serviceWorker.controller);
  let isReloadingForUpdate = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Do not reload a first-time visit. Reload existing app windows only when
    // an updated worker takes control so old JavaScript cannot linger.
    if (!hadControllerOnLoad || isReloadingForUpdate) return;
    isReloadingForUpdate = true;
    window.location.reload();
  });

  const appBaseUrl = new URL(import.meta.env.BASE_URL, window.location.href);
  const workerUrl = new URL(WORKER_FILE, appBaseUrl);

  void navigator.serviceWorker
    .register(workerUrl, {
      scope: appBaseUrl.pathname,
      updateViaCache: "none",
    })
    .then((registration) => {
      const checkForUpdate = () => {
        void registration.update().catch(() => {
          // A temporary offline/network error should not interrupt the app.
        });
      };

      // Check immediately, then whenever the user returns to the app.
      checkForUpdate();
      window.setInterval(checkForUpdate, UPDATE_INTERVAL_MS);
      window.addEventListener("focus", checkForUpdate);
      window.addEventListener("pageshow", checkForUpdate);
      window.addEventListener("online", checkForUpdate);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") checkForUpdate();
      });
    })
    .catch(() => {
      // Keep the site usable even if service-worker registration is unavailable.
    });
}
