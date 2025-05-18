
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DesignPreferencesForm from "@/components/design/DesignPreferencesForm";
import PopularDesignsCarousel from "@/components/design/PopularDesignsCarousel";
import { useState } from "react";

const DesignPreferences = () => {
  const { roomType } = useParams<{ roomType: string }>();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  // Handle case where room type parameter is not provided
  if (!roomType) {
    return null; // In a real app, redirect to the room selector page
  }

  const handleSelectDesign = (style: string) => {
    setSelectedStyle(style);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Design Your {roomType.charAt(0).toUpperCase() + roomType.slice(1)}</h1>
          
          <PopularDesignsCarousel onSelectDesign={handleSelectDesign} />
          
          <DesignPreferencesForm roomType={roomType} selectedStyle={selectedStyle} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DesignPreferences;
