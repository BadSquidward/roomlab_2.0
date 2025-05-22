
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FurnitureItem } from "@/utils/aiProviders";

interface BillOfQuantitiesProps {
  items: FurnitureItem[];
  onNavigateToDesign: () => void;
  isLoading?: boolean;
}

const BillOfQuantities = ({ items, onNavigateToDesign, isLoading = false }: BillOfQuantitiesProps) => {
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
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[40%] h-8 py-2 text-xs">Item</TableHead>
              <TableHead className="w-[30%] h-8 py-2 text-xs">Dimensions</TableHead>
              <TableHead className="w-[10%] h-8 py-2 text-xs">Qty</TableHead>
              <TableHead className="w-[20%] h-8 py-2 text-xs text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="max-h-[400px] overflow-y-auto design-scrollbar">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Generating Bill of Quantities...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="py-2 text-sm">{item.name}</TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">{item.dimensions}</TableCell>
                  <TableCell className="py-2 text-sm">{item.quantity}</TableCell>
                  <TableCell className="py-2 text-sm text-right">฿{item.price.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-muted-foreground">
                  No furniture items available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="bg-gray-50 p-3 border-t grid grid-cols-12 text-sm font-medium">
          <div className="col-span-10">Total Estimated Cost</div>
          <div className="col-span-2 text-right">฿{totalPrice.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Prices are estimates and may vary based on vendor selection and availability.</p>
        <p className="mt-1">All furniture items are referenced from IKEA catalog.</p>
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
