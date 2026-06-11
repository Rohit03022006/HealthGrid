import { usePWAInstall } from "@/hooks/usePWAInstall";

import Navbar from "@/components/common/landing/Navbar";
import Hero from "@/components/common/landing/Hero";
import Features from "@/components/common/landing/Features";
import HowItWorks from "@/components/common/landing/HowItWorks";
import Footer from "@/components/common/landing/Footer";

const LandingPage = () => {
  const { canInstall, installed, install } = usePWAInstall();

  return (
    <div className="min-h-screen bg-background">
      <Navbar canInstall={canInstall} installed={installed} install={install} />

      <Hero />
      <Features />
      <HowItWorks />

      <Footer canInstall={canInstall} installed={installed} install={install} />
    </div>
  );
};

export default LandingPage;
