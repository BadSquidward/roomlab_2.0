
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TokenManager from "@/components/tokens/TokenManager";

const TokensPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <TokenManager />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TokensPage;
