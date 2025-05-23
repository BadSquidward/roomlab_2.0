
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
  budget?: string;
}

const BillOfQuantities = ({ items, onNavigateToDesign, isLoading = false, budget }: BillOfQuantitiesProps) => {
  const { toast } = useToast();
  const [isContacting, setIsContacting] = useState(false);
  
  // Filter to include only furniture items (exclude decorative items, etc.)
  const furnitureItems = items.filter(item => {
    const lowerName = item.name.toLowerCase();
    return (
      lowerName.includes('table') || 
      lowerName.includes('chair') || 
      lowerName.includes('sofa') || 
      lowerName.includes('desk') || 
      lowerName.includes('bed') ||
      lowerName.includes('shelf') ||
      lowerName.includes('cabinet') ||
      lowerName.includes('wardrobe')
    );
  });
  
  // Calculate total price from filtered furniture items only
  const totalPrice = furnitureItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Check if total is within budget
  const isWithinBudget = () => {
    if (!budget) return true;
    
    // Extract the upper limit from budget range (format: "฿X - ฿Y")
    const upperLimitMatch = budget.match(/฿([\d,]+) - ฿([\d,]+)/);
    if (!upperLimitMatch) return true;
    
    const upperLimit = parseInt(upperLimitMatch[2].replace(/,/g, ''), 10);
    return totalPrice <= upperLimit;
  };
  
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
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleContactSales} disabled={isContacting}>
            {isContacting ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Phone className="h-3 w-3 mr-1" />
            )}
            Contact Sales
          </Button>
          <Button
            onClick={onNavigateToDesign}
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
          >
            Create New Design
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[40%] h-8 py-2 text-xs font-semibold">Item</TableHead>
              <TableHead className="w-[30%] h-8 py-2 text-xs font-semibold">Dimensions</TableHead>
              <TableHead className="w-[10%] h-8 py-2 text-xs font-semibold text-center">QTY</TableHead>
              <TableHead className="w-[20%] h-8 py-2 text-xs font-semibold text-right">Price</TableHead>
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
            ) : furnitureItems.length > 0 ? (
              furnitureItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="py-2 text-sm font-medium">{item.name}</TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">{item.dimensions}</TableCell>
                  <TableCell className="py-2 text-sm text-center">{item.quantity}</TableCell>
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
        
        {budget && !isWithinBudget() && (
          <div className="bg-amber-50 p-3 border-t text-sm text-amber-700">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Total exceeds your budget range. Consider removing some items or contact our sales team for custom options.</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Prices are estimates and may vary based on vendor selection and availability.</p>
        <p className="mt-1">All furniture items are referenced from IKEA catalog.</p>
      </div>
    </div>
  );
};

export default BillOfQuantities;
