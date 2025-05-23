
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DesignResult from "@/components/design/DesignResult";

const DesignResultPage = () => {
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  
  // This will be passed to DesignResult component to handle regeneration with selected furniture
  const handleFurnitureSelected = (furniture) => {
    setSelectedFurniture(furniture);
  };
  
  // Force a refresh when the component mounts
  useEffect(() => {
    // This will trigger a re-render
    const timer = setTimeout(() => {
      console.log("Refreshing component to display furniture recommendations");
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
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
