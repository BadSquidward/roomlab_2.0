
import { Button } from "@/components/ui/button";
import { RefreshCcw, Share, Loader2, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface DesignActionsProps {
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const DesignActions = ({ onRegenerate, isRegenerating }: DesignActionsProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Handle submitting BOQ
  const handleSubmitBOQ = async () => {
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "BOQ Submitted Successfully!",
      description: "Thank you for confirming your BOQ! Our team has received your design request and will be in touch with you shortly to assist further. We appreciate your trust in RoomLab — let's bring your dream space to life.",
    });
    
    setIsSubmitting(false);
  };
  
  // Handle sharing design
  const handleShareDesign = async () => {
    setIsSharing(true);
    
    // Simulate share delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Design Shared Successfully",
      description: "Your design has been shared and added to Popular Designs!",
      duration: 3000,
    });
    
    setIsSharing(false);
  };
  
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="outline" className="gap-2" onClick={onRegenerate} disabled={isRegenerating}>
        {isRegenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Regenerating...
          </>
        ) : (
          <>
            <RefreshCcw className="h-4 w-4" />
            Regenerate Design
          </>
        )}
      </Button>
      <Button 
        variant="outline" 
        className="gap-2" 
        onClick={handleShareDesign}
        disabled={isSharing}
      >
        {isSharing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sharing...
          </>
        ) : (
          <>
            <Share className="h-4 w-4" />
            Share Design
          </>
        )}
      </Button>
      <Button 
        variant="default" 
        className="gap-2 bg-blue-500 hover:bg-blue-600" 
        onClick={handleSubmitBOQ}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Submit BOQ
          </>
        )}
      </Button>
    </div>
  );
};

export default DesignActions;
