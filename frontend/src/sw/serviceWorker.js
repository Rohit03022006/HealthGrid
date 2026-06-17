export const registerSW = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered:", reg.scope);

        // Update available?
        reg.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          newSW.addEventListener("statechange", () => {
            if (
              newSW.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("New version available  - refresh to update");
            }
          });
        });
      } catch (err) {
        console.error("Service Worker failed:", err);
      }
    });
  }
};

export const unregisterSW = async () => {
  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) await reg.unregister();
  }
};
