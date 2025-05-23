
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface FurnitureItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
}

interface FurnitureRecommendationsProps {
  roomType: string;
  style: string;
  furnitureList: string[];
  onSelectFurniture: (furniture: FurnitureItem) => void;
  isBoqGenerated: boolean;
  budget?: string; // Add budget to filter recommendations by price
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
      if (!isBoqGenerated) return;
      
      setIsLoading(true);
      
      // In a real application, this would be an API call to get recommendations
      // Here we're generating mock data based on the room type and style with images from nocnoc.com
      setTimeout(() => {
        const mockRecommendations: FurnitureItem[] = [
          {
            id: "1",
            name: `${style} Coffee Table`,
            imageUrl: "https://www.nocnoc.com/static/version1715746264/frontend/Nocnoc/base/th_TH/images/category/c-furniture/c-tables-desks/c-coffee-table.jpg",
            description: `Elegant ${style.toLowerCase()} coffee table, perfect for your ${roomType.replace('-', ' ')}`,
            price: 15990
          },
          {
            id: "2",
            name: `${style} Side Table`,
            imageUrl: "https://www.nocnoc.com/static/version1715746264/frontend/Nocnoc/base/th_TH/images/category/c-furniture/c-tables-desks/c-side-table.jpg",
            description: `Stylish ${style.toLowerCase()} side table to complement your space`,
            price: 8990
          },
          {
            id: "3",
            name: `${style} Floor Lamp`,
            imageUrl: "https://www.nocnoc.com/static/version1715746264/frontend/Nocnoc/base/th_TH/images/category/c-lighting/c-floor-lamps.jpg",
            description: `Beautiful ${style.toLowerCase()} floor lamp to illuminate your space`,
            price: 5990
          },
          {
            id: "4",
            name: `${style} Wall Art`,
            imageUrl: "https://www.nocnoc.com/static/version1715746264/frontend/Nocnoc/base/th_TH/images/category/c-home-decor/c-wall-decor/c-wall-art-frames.jpg",
            description: `Beautiful ${style.toLowerCase()} wall art to enhance your ${roomType.replace('-', ' ')}`,
            price: 5990
          },
          {
            id: "5",
            name: `${style} Decorative Plant`,
            imageUrl: "https://www.nocnoc.com/static/version1715746264/frontend/Nocnoc/base/th_TH/images/category/c-home-decor/c-artificial-plants-flowers/c-artificial-plants.jpg",
            description: `Stylish ${style.toLowerCase()} plant to add life to your space`,
            price: 2990
          }
        ];
        
        // Filter recommendations based on budget if provided
        const { min, max } = getBudgetRange();
        const filteredRecommendations = mockRecommendations.filter(item => 
          item.price >= min && item.price <= max
        );
        
        setRecommendations(filteredRecommendations);
        setIsLoading(false);
      }, 1500);
    };
    
    generateRecommendations();
  }, [roomType, style, furnitureList, isBoqGenerated, budget]);

  const handleSelectFurniture = (furniture: FurnitureItem) => {
    setSelectedFurniture(furniture);
    toast({
      title: "Furniture Selected",
      description: "If you want this furniture in your design, please click 'Regenerate Design'",
    });
    onSelectFurniture(furniture);
  };

  if (!isBoqGenerated) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Furniture Recommendations</h3>
        <p className="text-muted-foreground">Based on your design preferences and budget</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Finding perfect furniture matches...</p>
          </div>
        </div>
      ) : recommendations.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {recommendations.map((furniture) => (
              <Card key={furniture.id} className={`overflow-hidden transition-all ${selectedFurniture?.id === furniture.id ? 'ring-2 ring-brand-500' : ''}`}>
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={furniture.imageUrl} 
                    alt={furniture.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4 space-y-2">
                  <h4 className="font-medium line-clamp-1">{furniture.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{furniture.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-medium">฿{furniture.price.toLocaleString()}</span>
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
              </Card>
            ))}
          </div>
          
          {selectedFurniture && (
            <div className="bg-muted p-4 rounded-md mt-4 text-center">
              <p>If you want the {selectedFurniture.name} in your design, please click 'Regenerate Design'</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-muted rounded-md p-4 text-center">
          <p className="text-muted-foreground">No recommendations available within your selected budget range. Consider adjusting your budget or contact our sales team.</p>
        </div>
      )}
    </div>
  );
};

export default FurnitureRecommendations;
