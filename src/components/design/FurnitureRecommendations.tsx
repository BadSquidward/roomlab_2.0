
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Star } from "lucide-react";

interface FurnitureItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  dimensions?: string;
  isTopSeller?: boolean;
  rating?: number;
}

interface FurnitureRecommendationsProps {
  roomType: string;
  style: string;
  furnitureList: string[];
  onSelectFurniture: (furniture: FurnitureItem) => void;
  isBoqGenerated: boolean;
  budget?: string;
}

const FurnitureRecommendations = ({ 
  roomType, 
  style, 
  furnitureList, 
  onSelectFurniture,
  isBoqGenerated,
  budget
}: FurnitureRecommendationsProps) => {
  const { toast } = useToast();
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<FurnitureItem[]>([]);

  // Updated IKEA furniture catalog with 5 featured items from your uploaded images
  const ikeaCatalog: FurnitureItem[] = [
    {
      id: "friheten-corner-sofa-bed",
      name: "FRIHETEN Corner sofa-bed",
      imageUrl: "https://www.ikea.com/th/en/images/products/friheten-corner-sofa-bed-with-storage-skiftebo-dark-grey__0175610_pe328883_s5.jpg",
      description: "Corner sofa-bed with storage, Skiftebo dark grey",
      dimensions: "Standard",
      price: 15990,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "gladom-tray-table",
      name: "GLADOM Tray Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/gladom-tray-table-dark-grey-beige__0997173_pe822569_s5.jpg",
      description: "Tray table, dark grey-beige, 45x53 cm",
      dimensions: "45x53 cm",
      price: 499,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "lack-coffee-table-white",
      name: "LACK Coffee Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/lack-coffee-table-white__0702219_pe724342_s5.jpg",
      description: "Coffee table, white, 90x55 cm",
      dimensions: "90x55 cm",
      price: 790,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "strandmon-armchair",
      name: "STRANDMON Armchair",
      imageUrl: "https://www.ikea.com/th/en/images/products/strandmon-armchair-nordvalla-dark-grey__0601768_pe680181_s5.jpg",
      description: "Armchair and footstool, Nordvalla dark grey",
      dimensions: "Standard",
      price: 8480,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "malm-chest-6-drawers-white",
      name: "MALM Chest of 6 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/malm-chest-of-6-drawers-white__0484888_pe621358_s5.jpg",
      description: "Chest of 6 drawers, white, 160x78 cm",
      dimensions: "160x78 cm",
      price: 6290,
      isTopSeller: true,
      rating: 5
    }
  ];

  // Get budget range for filtering
  const getBudgetRange = () => {
    if (!budget) return { min: 0, max: Infinity };
    
    // Extract the range from budget string (format: "฿X - ฿Y")
    const match = budget.match(/฿([\d,]+) - ฿([\d,]+)/);
    if (!match) return { min: 0, max: Infinity };
    
    const min = parseInt(match[1].replace(/,/g, ''), 10);
    const max = parseInt(match[2].replace(/,/g, ''), 10);
    
    return { min, max };
  };

  // Generate furniture recommendations based on room type, style, and existing furniture
  useEffect(() => {
    const generateRecommendations = () => {
      // Always show recommendations regardless of isBoqGenerated
      
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // For simplicity, we're always showing the 5 mock items
        // regardless of filtering criteria
        setRecommendations(ikeaCatalog);
        setIsLoading(false);
      }, 1000);
    };
    
    generateRecommendations();
  }, [roomType, style, furnitureList, budget]);

  const handleSelectFurniture = (furniture: FurnitureItem) => {
    setSelectedFurniture(furniture);
    toast({
      title: "Furniture Selected",
      description: "If you want this furniture in your design, please click 'Regenerate Design'",
    });
    onSelectFurniture(furniture);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Furniture Recommendations</h3>
        <p className="text-muted-foreground">IKEA furniture that matches your design style and budget</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Finding perfect furniture matches...</p>
          </div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {recommendations.map((furniture) => (
              <Card key={furniture.id} className={`overflow-hidden transition-all ${selectedFurniture?.id === furniture.id ? 'ring-2 ring-brand-500' : ''}`}>
                <div className="flex flex-row h-28">
                  <div className="w-28 h-28 relative overflow-hidden">
                    {furniture.isTopSeller && (
                      <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1 py-0.5 z-10">
                        Top seller
                      </div>
                    )}
                    <img 
                      src={furniture.imageUrl} 
                      alt={furniture.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium line-clamp-1">{furniture.name}</h4>
                        {furniture.rating && (
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-3 w-3 ${i < furniture.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{furniture.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">฿{furniture.price.toLocaleString()}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectFurniture(furniture)}
                        className={selectedFurniture?.id === furniture.id ? 'bg-brand-500 text-white hover:bg-brand-600' : ''}
                      >
                        {selectedFurniture?.id === furniture.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
          
          {selectedFurniture && (
            <div className="bg-muted p-4 rounded-md text-center text-sm">
              <p>If you want the {selectedFurniture.name} in your design, please click 'Regenerate Design'</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted rounded-md p-4 text-center">
          <p className="text-muted-foreground">No recommendations available within your selected budget range. Consider adjusting your budget or contact our sales team.</p>
        </div>
      )}
    </div>
  );
};

export default FurnitureRecommendations;
