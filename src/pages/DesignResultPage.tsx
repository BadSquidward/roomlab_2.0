
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DesignResult from "@/components/design/DesignResult";

const DesignResultPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="mx-auto">
          <DesignResult />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DesignResultPage;
