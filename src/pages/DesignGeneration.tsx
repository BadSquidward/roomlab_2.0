
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomTypeSelector from "@/components/design/RoomTypeSelector";
import { useNavigate } from "react-router-dom";

const DesignGeneration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);

  // Handle room type selection
  const handleRoomTypeSelect = (roomType: string) => {
    setSelectedRoomType(roomType);
    navigate(`/design-generation/${roomType}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <RoomTypeSelector onSelectRoomType={handleRoomTypeSelect} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DesignGeneration;
