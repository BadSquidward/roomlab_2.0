import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight } from "lucide-react";

// Define design styles
const designStyles = [
  { id: "modern", name: "Modern", description: "Clean lines, minimalist aesthetic" },
  { id: "scandinavian", name: "Scandinavian", description: "Light woods, neutral colors, cozy" },
  { id: "industrial", name: "Industrial", description: "Raw materials, exposed elements" },
  { id: "traditional", name: "Traditional", description: "Classic elements, comfortable, familiar" },
  { id: "mid-century", name: "Mid-Century Modern", description: "Retro 50s-60s inspired" },
  { id: "bohemian", name: "Bohemian", description: "Eclectic, colorful, artistic" },
];

// Define color schemes
const colorSchemes = [
  { id: "neutral", name: "Neutral", colors: ["#F5F5F5", "#E0E0E0", "#9E9E9E", "#616161"] },
  { id: "warm", name: "Warm", colors: ["#FFECB3", "#FFE082", "#FFD54F", "#FFC107"] },
  { id: "cool", name: "Cool", colors: ["#BBDEFB", "#90CAF9", "#64B5F6", "#2196F3"] },
  { id: "earthy", name: "Earthy", colors: ["#D7CCC8", "#BCAAA4", "#8D6E63", "#5D4037"] },
  { id: "bold", name: "Bold", colors: ["#EF9A9A", "#F48FB1", "#CE93D8", "#9FA8DA"] },
  { id: "monochrome", name: "Monochrome", colors: ["#F5F5F5", "#E0E0E0", "#9E9E9E", "#212121"] },
];

interface DesignPreferencesFormProps {
  roomType: string;
  selectedStyle: string | null;
}

const DesignPreferencesForm: React.FC<DesignPreferencesFormProps> = ({ roomType, selectedStyle }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    length: "4",
    width: "3",
    height: "2.5",
    style: selectedStyle || "",
    colorScheme: "",
    budget: 50, // Medium budget by default (percentage)
    furniture: [] as string[],
    specialRequirements: "", // New field for additional requirements
  });

  // Update style when selectedStyle prop changes
  useState(() => {
    if (selectedStyle && selectedStyle !== formData.style) {
      setFormData(prev => ({ ...prev, style: selectedStyle }));
    }
  });

  // Handle input changes
  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle furniture selection toggle
  const handleFurnitureToggle = (item: string) => {
    setFormData((prev) => {
      const currentFurniture = [...prev.furniture];
      if (currentFurniture.includes(item)) {
        return { ...prev, furniture: currentFurniture.filter((i) => i !== item) };
      } else {
        return { ...prev, furniture: [...currentFurniture, item] };
      }
    });
  };

  // Budget to price range
  const getBudgetText = () => {
    if (formData.budget <= 33) {
      return "฿10,000 - ฿300,000";
    } else if (formData.budget <= 66) {
      return "฿300,001 - ฿600,000";
    } else {
      return "฿600,001 - ฿1,000,000";
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (
      !formData.length ||
      !formData.width ||
      !formData.height ||
      !formData.style ||
      !formData.colorScheme
    ) {
      toast({
        title: "Incomplete form",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough tokens
    const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    if (!userInfo || userInfo.tokens < 1) {
      toast({
        title: "Insufficient tokens",
        description: "You need at least 1 token to generate a design. Please purchase more tokens.",
        variant: "destructive",
      });
      navigate("/tokens");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate design generation API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Deduct 1 token from the user's balance
      const updatedTokens = userInfo.tokens - 1;
      localStorage.setItem('user', JSON.stringify({
        ...userInfo,
        tokens: updatedTokens
      }));
      
      // Show success toast with token deduction
      toast({
        title: "Design Generated",
        description: `1 token has been used. Remaining tokens: ${updatedTokens}`,
      });
      
      // Navigate to the results page
      navigate(`/design-generation/${roomType}/result`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate design. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Determine room title based on room type
  const getRoomTitle = () => {
    switch (roomType) {
      case "living-room":
        return "Living Room";
      case "bedroom":
        return "Bedroom";
      case "kitchen":
        return "Kitchen";
      case "bathroom":
        return "Bathroom";
      case "office":
        return "Home Office";
      case "dining-room":
        return "Dining Room";
      default:
        return "Room";
    }
  };

  // Get furniture options based on room type
  const getFurnitureOptions = () => {
    switch (roomType) {
      case "living-room":
        return [
          "Sofa",
          "Coffee Table",
          "TV Stand",
          "Armchair",
          "Side Table",
          "Bookshelf",
          "Floor Lamp",
        ];
      case "bedroom":
        return [
          "Bed",
          "Nightstand",
          "Dresser",
          "Wardrobe",
          "Vanity",
          "Chair",
          "Floor Lamp",
        ];
      case "kitchen":
        return [
          "Island",
          "Bar Stools",
          "Dining Table",
          "Chairs",
          "Storage Cabinet",
          "Open Shelving",
        ];
      case "bathroom":
        return [
          "Vanity",
          "Mirror",
          "Storage Cabinet",
          "Shower",
          "Bathtub",
          "Towel Rack",
        ];
      case "office":
        return [
          "Desk",
          "Office Chair",
          "Bookshelf",
          "Filing Cabinet",
          "Side Table",
          "Desk Lamp",
        ];
      case "dining-room":
        return [
          "Dining Table",
          "Dining Chairs",
          "Sideboard",
          "China Cabinet",
          "Bar Cart",
          "Chandelier",
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Design Your {getRoomTitle()}</h2>
        <p className="text-muted-foreground mt-1">
          Enter your preferences to generate a custom design
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Room Dimensions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Room Dimensions (meters)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                min="1"
                value={formData.length}
                onChange={(e) => handleChange("length", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                min="1"
                value={formData.width}
                onChange={(e) => handleChange("width", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                min="1"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Design Style */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Design Style</h3>
          <RadioGroup
            value={formData.style}
            onValueChange={(value) => handleChange("style", value)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {designStyles.map((style) => (
              <div key={style.id} className="flex items-start space-x-2">
                <RadioGroupItem value={style.id} id={`style-${style.id}`} />
                <Label
                  htmlFor={`style-${style.id}`}
                  className="cursor-pointer flex-1"
                >
                  <div className="font-medium">{style.name}</div>
                  <div className="text-muted-foreground text-sm">{style.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Color Scheme */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Color Scheme</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {colorSchemes.map((scheme) => (
              <div
                key={scheme.id}
                onClick={() => handleChange("colorScheme", scheme.id)}
                className={`p-4 rounded-md border cursor-pointer transition-all ${
                  formData.colorScheme === scheme.id 
                    ? "border-brand-500 ring-2 ring-brand-200" 
                    : "hover:border-brand-200"
                }`}
              >
                <div className="flex space-x-2 mb-3">
                  {scheme.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: color }}
                      className="h-6 w-6 rounded-full"
                    />
                  ))}
                </div>
                <div className="font-medium">{scheme.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Budget Range */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Budget</h3>
          <div className="space-y-6">
            <Slider
              value={[formData.budget]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleChange("budget", value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Economic</span>
              <span className="font-medium">{getBudgetText()}</span>
              <span className="text-muted-foreground">Luxury</span>
            </div>
          </div>
        </div>
        
        {/* Furniture Preferences - Updated to use checkboxes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Furniture Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Select specific furniture items you'd like to include in your design
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {getFurnitureOptions().map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox 
                  id={`furniture-${item}`} 
                  checked={formData.furniture.includes(item)}
                  onCheckedChange={() => handleFurnitureToggle(item)}
                />
                <Label htmlFor={`furniture-${item}`} className="cursor-pointer">
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Special Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Special Requirements</h3>
          <p className="text-sm text-muted-foreground">
            Add any specific requirements or details you'd like to include in your design
          </p>
          <Textarea
            placeholder="E.g., I need a home office corner in my living room, or I want to incorporate plants and natural elements..."
            value={formData.specialRequirements}
            onChange={(e) => handleChange("specialRequirements", e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto gap-1">
          {isLoading ? (
            "Generating Design..."
          ) : (
            <>
              Generate Design <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default DesignPreferencesForm;
