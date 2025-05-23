
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DesignResult from "@/components/design/DesignResult";
import FurnitureRecommendations from "@/components/design/FurnitureRecommendations";

const DesignResultPage = () => {
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  
  // This will be passed to DesignResult component to handle regeneration with selected furniture
  const handleFurnitureSelected = (furniture) => {
    setSelectedFurniture(furniture);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="mx-auto">
          <DesignResult selectedFurniture={selectedFurniture} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DesignResultPage;
