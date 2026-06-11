import { useEffect, useState } from "react";

export const usePWAInstall = () => {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setInstalled(true);
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setPrompt(event);
      setInstalled(false);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!prompt) {
      console.log("Install prompt not available yet");
      return;
    }

    prompt.prompt();

    const result = await prompt.userChoice;

    if (result.outcome === "accepted") {
      setInstalled(true);
    }

    setPrompt(null);
  };

  return {
    canInstall: !!prompt && !installed,
    installed,
    install,
  };
};
