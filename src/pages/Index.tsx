
import HomeHero from "@/components/HomeHero";
import HowItWorks from "@/components/HowItWorks";
import PopularDesigns from "@/components/PopularDesigns";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HomeHero />
        <HowItWorks />
        <PopularDesigns />
        <PricingSection />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
