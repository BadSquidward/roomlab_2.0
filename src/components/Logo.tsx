
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <img 
        src="/lovable-uploads/a0191eed-08b6-4ed7-9b7a-cc8f4b95049d.png" 
        alt="Design Lab Logo" 
        className="w-10 h-10 mr-2" 
      />
      <span className="text-xl font-semibold text-brand-600">DesignLab</span>
    </div>
  );
};

export default Logo;
