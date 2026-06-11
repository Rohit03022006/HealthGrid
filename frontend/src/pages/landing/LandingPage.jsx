import Navbar from "@/components/common/landing/Navbar";
import Hero from "@/components/common/landing/Hero";
import Features from "@/components/common/landing/Features";
import HowItWorks from "@/components/common/landing/HowItWorks";
import Footer from "@/components/common/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
  
      <Footer />
    </div>
  );
};

export default LandingPage;