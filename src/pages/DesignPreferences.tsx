
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DesignPreferencesForm from "@/components/design/DesignPreferencesForm";

const DesignPreferences = () => {
  const { roomType } = useParams<{ roomType: string }>();

  // Handle case where room type parameter is not provided
  if (!roomType) {
    return null; // In a real app, redirect to the room selector page
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <DesignPreferencesForm roomType={roomType} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DesignPreferences;
