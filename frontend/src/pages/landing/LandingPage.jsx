import { usePWAInstall } from "@/hooks/usePWAInstall";

import Navbar from "@/components/common/landing/Navbar";
import Hero from "@/components/common/landing/Hero";
import Features from "@/components/common/landing/Features";
import HowItWorks from "@/components/common/landing/HowItWorks";
import Footer from "@/components/common/landing/Footer";

const LandingPage = () => {
  const pwaInstall = usePWAInstall();

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <Navbar
        canInstall={pwaInstall.canInstall}
        installed={pwaInstall.installed}
        install={pwaInstall.install}
      />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>

      <Footer
        canInstall={pwaInstall.canInstall}
        installed={pwaInstall.installed}
        install={pwaInstall.install}
      />
    </div>
  );
};

export default LandingPage;