
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";

const PricingPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const returnUrl = queryParams.get('returnUrl');
  
  // If we have a returnUrl, we'll display a message explaining why the user is here
  const needTokensMessage = returnUrl ? (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
      <p className="text-amber-800">
        You need more tokens to continue. Purchase tokens below to proceed with your design.
      </p>
    </div>
  ) : null;

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
            {needTokensMessage}
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
