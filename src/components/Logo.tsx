
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <img 
        src="/lovable-uploads/9dad30b7-3b8b-45b5-a198-e8289b6324f0.png" 
        alt="RoomLab Logo" 
        className="w-10 h-10 mr-2" 
      />
      <span className="text-xl font-semibold text-brand-600">RoomLab</span>
    </div>
  );
};

export default Logo;
