
import { Button } from "@/components/ui/button";
import { RefreshCcw, Share, Phone, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface DesignActionsProps {
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const DesignActions = ({ onRegenerate, isRegenerating }: DesignActionsProps) => {
  const { toast } = useToast();
  const [isContacting, setIsContacting] = useState(false);
  
  // Handle contacting sales
  const handleContactSales = async () => {
    setIsContacting(true);
    
    // Simulate contact delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Sales Request Sent",
      description: "Our sales team will contact you shortly regarding your design inquiry.",
    });
    
    setIsContacting(false);
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
      <Button variant="outline" className="gap-2">
        <Share className="h-4 w-4" />
        Share Design
      </Button>
      <Button variant="outline" className="gap-2" onClick={handleContactSales} disabled={isContacting}>
        {isContacting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Contacting...
          </>
        ) : (
          <>
            <Phone className="h-4 w-4" />
            Contact Sales
          </>
        )}
      </Button>
    </div>
  );
};

export default DesignActions;
