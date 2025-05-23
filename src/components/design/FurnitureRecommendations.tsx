
import { useState } from "react";
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
}

const FurnitureRecommendations = ({ 
  roomType, 
  style, 
  furnitureList, 
  onSelectFurniture 
}: FurnitureRecommendationsProps) => {
  const { toast } = useToast();
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<FurnitureItem[]>([]);

  // Generate furniture recommendations based on room type, style, and existing furniture
  useState(() => {
    const generateRecommendations = () => {
      setIsLoading(true);
      
      // In a real application, this would be an API call to get recommendations
      // Here we're generating mock data based on the room type and style
      setTimeout(() => {
        const mockRecommendations: FurnitureItem[] = [
          {
            id: "1",
            name: `${style} Coffee Table`,
            imageUrl: "https://images.unsplash.com/photo-1565371767810-ef913ac1eef0?q=80&w=500&auto=format&fit=crop",
            description: `Elegant ${style.toLowerCase()} coffee table, perfect for your ${roomType.replace('-', ' ')}`,
            price: 15990
          },
          {
            id: "2",
            name: `${style} Side Table`,
            imageUrl: "https://images.unsplash.com/photo-1611967164521-abae8fba4668?q=80&w=500&auto=format&fit=crop",
            description: `Stylish ${style.toLowerCase()} side table to complement your space`,
            price: 8990
          },
          {
            id: "3",
            name: `${style} Floor Cushion`,
            imageUrl: "https://images.unsplash.com/photo-1595500381751-d838f72aa196?q=80&w=500&auto=format&fit=crop",
            description: `Comfortable ${style.toLowerCase()} floor cushion for extra seating`,
            price: 3990
          },
          {
            id: "4",
            name: `${style} Wall Art`,
            imageUrl: "https://images.unsplash.com/photo-1581337204873-1a08a019d8d1?q=80&w=500&auto=format&fit=crop",
            description: `Beautiful ${style.toLowerCase()} wall art to enhance your ${roomType.replace('-', ' ')}`,
            price: 5990
          },
          {
            id: "5",
            name: `${style} Decorative Plant`,
            imageUrl: "https://images.unsplash.com/photo-1602923668104-110fa096bb1e?q=80&w=500&auto=format&fit=crop",
            description: `Stylish ${style.toLowerCase()} plant to add life to your space`,
            price: 2990
          }
        ];
        
        setRecommendations(mockRecommendations);
        setIsLoading(false);
      }, 1500);
    };
    
    generateRecommendations();
  }, [roomType, style, furnitureList]);

  const handleSelectFurniture = (furniture: FurnitureItem) => {
    setSelectedFurniture(furniture);
    toast({
      title: "Furniture Selected",
      description: "If you want this furniture in your design, please click 'Regenerate Design'",
    });
    onSelectFurniture(furniture);
  };

  return (
    <div className="mt-8 space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Furniture Recommendations</h3>
        <p className="text-muted-foreground">Based on your design preferences and selections</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Finding perfect furniture matches...</p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default FurnitureRecommendations;
