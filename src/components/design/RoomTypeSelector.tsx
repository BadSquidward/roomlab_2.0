
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

// Define room types with icons and descriptions
const roomTypes = [
  {
    id: "living-room",
    name: "Living Room",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <rect x="8" y="12" width="8" height="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
      </svg>
    ),
    description: "The main social space for relaxation and entertainment"
  },
  {
    id: "bedroom",
    name: "Bedroom",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M2 4v16" />
        <path d="M22 4v16" />
        <path d="M4 8h16" />
        <path d="M4 16h16" />
        <path d="M8.01 12h.01" />
        <path d="M12.01 12h.01" />
        <path d="M16.01 12h.01" />
      </svg>
    ),
    description: "A peaceful sanctuary for rest and relaxation"
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M8 5h8l-1 9H9l-1-9Z" />
        <path d="M6 19h12" />
        <path d="M12 5v14" />
      </svg>
    ),
    description: "The heart of the home for cooking and gathering"
  },
  {
    id: "bathroom",
    name: "Bathroom",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M4 12H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2" />
        <path d="M20 12h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2" />
        <rect width="16" height="10" x="4" y="4" rx="2" />
        <path d="m4 14 16 6" />
        <path d="m20 14-16 6" />
      </svg>
    ),
    description: "A functional space for personal care and relaxation"
  },
  {
    id: "office",
    name: "Home Office",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect width="16" height="12" x="4" y="4" rx="2" />
        <path d="M10 4v4" />
        <path d="M14 4v4" />
        <path d="M10 16v4" />
        <path d="M14 16v4" />
        <path d="M4 10h16" />
      </svg>
    ),
    description: "A productive workspace for focus and creativity"
  },
  {
    id: "dining-room",
    name: "Dining Room",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M16 2v17" />
        <path d="M8 2v17" />
        <path d="M3 10h18" />
        <path d="M2 19h20" />
      </svg>
    ),
    description: "A dedicated space for enjoying meals with family and friends"
  }
];

interface RoomTypeSelectorProps {
  onSelectRoomType: (roomType: string) => void;
}

const RoomTypeSelector: React.FC<RoomTypeSelectorProps> = ({ onSelectRoomType }) => {
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);

  const handleSelect = (roomTypeId: string) => {
    setSelectedRoomType(roomTypeId);
    onSelectRoomType(roomTypeId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Select Room Type</h2>
        <p className="text-muted-foreground mt-1">
          Choose the type of room you want to design
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {roomTypes.map((roomType) => (
          <Card 
            key={roomType.id}
            className={`cursor-pointer transition-all ${
              selectedRoomType === roomType.id 
                ? 'border-brand-500 ring-2 ring-brand-200' 
                : 'hover:border-brand-200'
            }`}
            onClick={() => handleSelect(roomType.id)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`p-3 rounded-full ${
                selectedRoomType === roomType.id ? 'bg-brand-100 text-brand-600' : 'bg-gray-100'
              }`}>
                {roomType.icon}
              </div>
              <h3 className="font-medium mt-4 mb-1">{roomType.name}</h3>
              <p className="text-sm text-muted-foreground">{roomType.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomTypeSelector;
