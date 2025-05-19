
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BOQItem {
  name: string;
  dimensions: string;
  quantity: number;
  price: number;
}

interface BillOfQuantitiesProps {
  items: BOQItem[];
  onNavigateToDesign: () => void;
}

const BillOfQuantities = ({ items, onNavigateToDesign }: BillOfQuantitiesProps) => {
  const { toast } = useToast();
  const [isContacting, setIsContacting] = useState(false);
  
  // Calculate total price
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Bill of Quantities</h3>
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleContactSales} disabled={isContacting}>
          {isContacting ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <Phone className="h-3 w-3 mr-1" />
          )}
          Contact Sales
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 p-3 border-b grid grid-cols-12 text-xs font-medium text-muted-foreground">
          <div className="col-span-6">Item</div>
          <div className="col-span-3">Dimensions</div>
          <div className="col-span-1">Qty</div>
          <div className="col-span-2 text-right">Price</div>
        </div>
        
        <div className="divide-y max-h-[500px] overflow-y-auto design-scrollbar">
          {items.map((item, index) => (
            <div key={index} className="p-3 grid grid-cols-12 items-center text-sm">
              <div className="col-span-6">{item.name}</div>
              <div className="col-span-3 text-xs text-muted-foreground">{item.dimensions}</div>
              <div className="col-span-1">{item.quantity}</div>
              <div className="col-span-2 text-right">฿{item.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-3 border-t grid grid-cols-12 text-sm font-medium">
          <div className="col-span-10">Total Estimated Cost</div>
          <div className="col-span-2 text-right">฿{totalPrice.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Prices are estimates and may vary based on vendor selection and availability.</p>
      </div>
      
      <Button
        onClick={onNavigateToDesign}
        variant="outline"
        className="w-full mt-4"
      >
        Create Another Design
      </Button>
    </div>
  );
};

export default BillOfQuantities;
