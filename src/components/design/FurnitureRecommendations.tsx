
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

  // IKEA furniture catalog data
  const ikeaCatalog: FurnitureItem[] = [
    // Coffee Tables
    {
      id: "holmerud-coffee-table",
      name: "HOLMERUD Coffee Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/holmerud-coffee-table-oak-effect__1113125_pe871179_s5.jpg",
      description: "Coffee table, oak effect, 90x55 cm",
      dimensions: "90x55 cm",
      price: 1290
    },
    {
      id: "jattesta-coffee-table",
      name: "JÄTTESTA Coffee Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/jaettesta-coffee-table-black__1109454_pe869713_s5.jpg",
      description: "Coffee table, black, 80x80 cm",
      dimensions: "80x80 cm",
      price: 3590
    },
    {
      id: "moxboda-coffee-table",
      name: "MOXBODA Coffee Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/moxboda-coffee-table-foldable-brown__0959940_pe807593_s5.jpg",
      description: "Coffee table, foldable/brown, 70 cm",
      dimensions: "70 cm",
      price: 1990,
      rating: 4
    },
    {
      id: "krokholmen-coffee-table",
      name: "KROKHOLMEN Coffee Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/krokholmen-coffee-table-outdoor-beige__0736123_pe740373_s5.jpg",
      description: "Coffee table, outdoor, beige, 73 cm",
      dimensions: "73 cm",
      price: 1990,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "vittsjo-nest-tables",
      name: "VITTSJÖ Nest of Tables",
      imageUrl: "https://www.ikea.com/th/en/images/products/vittsjo-nest-of-tables-set-of-2-black-brown-glass__0452609_pe601390_s5.jpg",
      description: "Nest of tables, set of 2, black-brown/glass, 90x50 cm",
      dimensions: "90x50 cm",
      price: 1990
    },
    
    // Side Tables
    {
      id: "kvistbro-storage-table",
      name: "KVISTBRO Storage Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/kvistbro-storage-table-white__0276622_pe415559_s5.jpg",
      description: "Storage table, white, 44 cm",
      dimensions: "44 cm",
      price: 790
    },
    {
      id: "guttane-side-table",
      name: "GUTTANË Side Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/guttane-side-table-oak-light-stained-oak__1168953_pe892157_s5.jpg",
      description: "Side table, oak, 58x39 cm",
      dimensions: "58x39 cm",
      price: 3590,
      isTopSeller: true
    },
    {
      id: "jattesta-side-table",
      name: "JÄTTESTA Side Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/jaettesta-side-table-black__1109453_pe869712_s5.jpg",
      description: "Side table, black, 95x30 cm",
      dimensions: "95x30 cm",
      price: 2990
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
    
    // Bedside Tables
    {
      id: "gräfjället-bedside-table",
      name: "GRÄFJÄLLET Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/graefjaellet-bedside-table-anthracite__1061361_pe849936_s5.jpg",
      description: "Bedside table, anthracite, 45x36x59 cm",
      dimensions: "45x36x59 cm",
      price: 1790
    },
    {
      id: "tonstad-bedside-table",
      name: "TONSTAD Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/tonstad-bedside-table-off-white__1186615_pe899852_s5.jpg",
      description: "Bedside table, off-white, 40x40x59 cm",
      dimensions: "40x40x59 cm",
      price: 2990
    },
    {
      id: "vikhammer-bedside-table",
      name: "VIKHAMMER Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/vikhammer-bedside-table-white__0640723_pe699998_s5.jpg",
      description: "Bedside table, white, 40x39 cm",
      dimensions: "40x39 cm",
      price: 2490
    },
    {
      id: "vihals-bedside-table",
      name: "VIHALS Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/vihals-bedside-table-white__1127587_pe876457_s5.jpg",
      description: "Bedside table, white, 37x37 cm",
      dimensions: "37x37 cm",
      price: 990,
      rating: 5
    },
    {
      id: "hattasen-bedside-table",
      name: "HATTÅSEN Bedside Table/Shelf Unit",
      imageUrl: "https://www.ikea.com/th/en/images/products/hattsen-bedside-table-shelf-unit-black__0955642_pe804123_s5.jpg",
      description: "Bedside table/shelf unit, black",
      dimensions: "Various",
      price: 790
    },
    
    // Armchairs
    {
      id: "poang-armchair",
      name: "POÄNG Armchair",
      imageUrl: "https://www.ikea.com/th/en/images/products/poaeng-armchair-birch-veneer-knisa-light-beige__0472285_pe613982_s5.jpg",
      description: "Armchair and footstool, birch veneer/Knisa light beige",
      dimensions: "Standard",
      price: 4380,
      rating: 4
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
      id: "sotenas-armchair",
      name: "SOTENÄS Armchair",
      imageUrl: "https://www.ikea.com/th/en/images/products/sotenas-armchair-hakebo-red__1137845_pe879968_s5.jpg",
      description: "Armchair, Hakebo red",
      dimensions: "Standard",
      price: 6990
    },
    {
      id: "ektorp-armchair",
      name: "EKTORP Armchair",
      imageUrl: "https://www.ikea.com/th/en/images/products/ektorp-armchair-hallarp-beige__1053461_pe846938_s5.jpg",
      description: "Armchair, Kilanda light beige",
      dimensions: "Standard",
      price: 6990,
      rating: 3
    },
    {
      id: "landskrona-armchair",
      name: "LANDSKRONA Armchair",
      imageUrl: "https://www.ikea.com/th/en/images/products/landskrona-armchair-gunnared-dark-grey-wood__0602085_pe680154_s5.jpg",
      description: "Armchair, Gunnared dark grey/wood",
      dimensions: "Standard",
      price: 10990
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
      if (!isBoqGenerated) return;
      
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const { min, max } = getBudgetRange();
        
        // Filter catalog items based on budget constraints
        let filteredItems = ikeaCatalog.filter(item => 
          item.price >= min && item.price <= max
        );
        
        // Filter by furniture type based on room
        if (roomType === 'bedroom') {
          filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes('bedside') || 
            item.name.toLowerCase().includes('table') ||
            item.name.toLowerCase().includes('armchair')
          );
        } else if (roomType === 'living-room') {
          filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes('coffee') || 
            item.name.toLowerCase().includes('side') ||
            item.name.toLowerCase().includes('armchair') ||
            item.name.toLowerCase().includes('nest')
          );
        }
        
        // Prioritize items that match the style preference
        filteredItems.sort((a, b) => {
          const aMatchesStyle = a.description.toLowerCase().includes(style.toLowerCase());
          const bMatchesStyle = b.description.toLowerCase().includes(style.toLowerCase());
          
          if (aMatchesStyle && !bMatchesStyle) return -1;
          if (!aMatchesStyle && bMatchesStyle) return 1;
          
          // If both match or don't match style, prioritize top sellers
          if (a.isTopSeller && !b.isTopSeller) return -1;
          if (!a.isTopSeller && b.isTopSeller) return 1;
          
          // Finally sort by price (lower first)
          return a.price - b.price;
        });
        
        // Limit to 5 items
        const finalRecommendations = filteredItems.slice(0, 5);
        
        setRecommendations(finalRecommendations);
        setIsLoading(false);
      }, 1000);
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
