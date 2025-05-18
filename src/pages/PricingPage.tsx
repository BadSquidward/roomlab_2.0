
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";

const PricingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Choose the Right Plan for You
            </h1>
            <p className="text-xl text-muted-foreground">
              Flexible token packages to fit your design needs
            </p>
          </div>
        </div>
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
