import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getAIProvider, DesignGenerationRequest, defaultApiKeys, FurnitureItem } from "@/utils/aiProviders";
import BillOfQuantities from "./BillOfQuantities";
import DesignDetails from "./DesignDetails";
import RegenerationComments from "./RegenerationComments";
import DesignActions from "./DesignActions";
import FurnitureRecommendations from "./FurnitureRecommendations";
import { getBudgetText, sampleBOQ, sampleDesign } from "@/utils/designUtils";

interface DesignResultProps {
  selectedFurniture?: {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    price: number;
  } | null;
}

const DesignResult = ({ selectedFurniture }: DesignResultProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBOQ, setIsLoadingBOQ] = useState(false);
  const [isBoqGenerated, setIsBoqGenerated] = useState(false);
  const [regenerationComment, setRegenerationComment] = useState("");
  const [designData, setDesignData] = useState({
    ...sampleDesign,
    caption: "", // Add caption field to track AI-generated text
    furniture: sampleBOQ // Initialize with sample furniture items
  });
  const [selectedProvider] = useState("openai"); // Default to OpenAI
  
  // Handle the selected furniture from recommendations
  const [recommendedFurniture, setRecommendedFurniture] = useState(null);
  
  // Load data from localStorage
  useEffect(() => {
    // Get form data from localStorage if available
    const storedFormData = localStorage.getItem('designFormData');
    const storedDesignData = localStorage.getItem('designResult');
    
    if (storedDesignData) {
      try {
        const parsedDesignData = JSON.parse(storedDesignData);
        setDesignData(parsedDesignData);
        setIsBoqGenerated(true); // If we have design data, BOQ is considered generated
      } catch (error) {
        console.error("Error parsing stored design data:", error);
      }
    } else if (storedFormData) {
      // If we have form data but no result yet, generate a new design
      try {
        const formData = JSON.parse(storedFormData);
        generateInitialDesign(formData);
      } catch (error) {
        console.error("Error parsing stored form data:", error);
      }
    }
  }, []);
  
  // Update regeneration comment when furniture is selected
  useEffect(() => {
    if (recommendedFurniture) {
      setRegenerationComment(prev => 
        `Please include the ${recommendedFurniture.name} in this design. ${prev ? prev : ""}`
      );
    }
  }, [recommendedFurniture]);
  
  // Generate initial design using form data
  const generateInitialDesign = async (formData: any) => {
    // Check if user has enough tokens
    const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : { tokens: 0 };
    
    if (!userInfo || userInfo.tokens < 1) {
      toast({
        title: "Insufficient tokens",
        description: "You need at least 1 token to generate a design. Please purchase more tokens.",
        variant: "destructive",
      });
      // Redirect to pricing page with return URL
      navigate(`/pricing?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create request from form data
      const request: DesignGenerationRequest = {
        roomType: formData.roomType || "living-room",
        style: formData.style || "modern",
        colorScheme: formData.colorScheme || "neutral",
        dimensions: {
          length: formData.length || "4",
          width: formData.width || "3",
          height: formData.height || "2.5"
        },
        budget: getBudgetText(formData.budget || 50),
        furniture: formData.furniture || ["Sofa", "Coffee Table", "Bookshelf"],
        specialRequirements: formData.specialRequirements || ""
      };
      
      // Generate design with AI
      const result = await generateDesignWithAI(false, "openai", request);
      
      if (result) {
        // Create new design data object with temporary furniture items
        const newDesignData = {
          imageUrl: result.imageUrl,
          roomType: formData.roomType || "living-room",
          style: formData.style || "Modern",
          colorScheme: formData.colorScheme || "Neutral",
          dimensions: `${formData.length || "4"}m × ${formData.width || "3"}m × ${formData.height || "2.5"}m`,
          caption: result.caption || "", // Store caption in design data
          furniture: result.furniture || [] // Store temporary furniture items in design data
        };
        
        // Update state and localStorage
        setDesignData(newDesignData);
        localStorage.setItem('designResult', JSON.stringify(newDesignData));
        
        // Now generate BOQ with Gemini
        setIsLoadingBOQ(true);
        const boqResult = await generateBOQWithGemini(request);
        setIsLoadingBOQ(false);
        
        if (boqResult && boqResult.length > 0) {
          // Update design data with Gemini-generated furniture items
          const updatedDesignData = {
            ...newDesignData,
            furniture: boqResult
          };
          
          setDesignData(updatedDesignData);
          localStorage.setItem('designResult', JSON.stringify(updatedDesignData));
          setIsBoqGenerated(true); // Set BOQ as generated
        }
        
        // Deduct token
        const updatedTokens = userInfo.tokens - 1;
        localStorage.setItem('user', JSON.stringify({
          ...userInfo,
          tokens: updatedTokens
        }));
        
        toast({
          title: "Design Generated",
          description: `1 token has been used. Remaining tokens: ${updatedTokens}`,
        });

        // Clear localStorage data to allow for new design generation
        localStorage.removeItem('designFormData');
      }
    } catch (error) {
      console.error("Error generating initial design:", error);
      toast({
        title: "Error",
        description: "Failed to generate design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate BOQ using Gemini
  const generateBOQWithGemini = async (request: DesignGenerationRequest): Promise<FurnitureItem[]> => {
    try {
      // Get API key for Gemini
      const apiKey = defaultApiKeys.gemini;
      
      if (!apiKey) {
        toast({
          title: "API Key Not Available",
          description: "No Gemini API key available. Please contact support.",
          variant: "destructive",
        });
        return [];
      }
      
      // Create provider instance with Gemini
      const geminiProvider = getAIProvider("gemini", apiKey, "gemini-2.0-flash-lite");
      
      console.log("Generating BOQ with Gemini provider");
      
      // Generate BOQ
      const result = await geminiProvider.generateDesign(request);
      
      if (!result.success) {
        toast({
          title: "BOQ Generation Failed",
          description: result.error || "Failed to generate BOQ with Gemini",
          variant: "destructive",
        });
        return [];
      }
      
      setIsBoqGenerated(true); // Set BOQ as generated when successful
      return result.furniture || [];
    } catch (error) {
      console.error("Error generating BOQ with Gemini:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating the BOQ",
        variant: "destructive",
      });
      return [];
    }
  };
  
  // Generate design using AI provider
  const generateDesignWithAI = async (
    isRegeneration: boolean = false, 
    providerName: string = "openai", 
    customRequest?: DesignGenerationRequest
  ) => {
    try {
      // Get API key for OpenAI
      const apiKey = defaultApiKeys.openai;
      
      if (!apiKey) {
        toast({
          title: "API Key Not Available",
          description: "No OpenAI API key available. Please contact support.",
          variant: "destructive",
        });
        return null;
      }
      
      // Extract path parameters for room type
      const pathParts = window.location.pathname.split('/');
      const roomTypeFromPath = pathParts[pathParts.length - 2] || "living-room";
      
      // Create provider instance with OpenAI
      const aiProvider = getAIProvider("openai", apiKey, "dall-e-3");
      
      console.log("Generating design with OpenAI provider");
      
      // Prepare request
      const request = customRequest || {
        roomType: roomTypeFromPath,
        style: designData.style,
        colorScheme: designData.colorScheme,
        dimensions: {
          length: designData.dimensions.split('×')[0].trim().replace('m', ''),
          width: designData.dimensions.split('×')[1].trim().replace('m', ''),
          height: designData.dimensions.split('×')[2].trim().replace('m', '')
        },
        budget: getBudgetText(50), // Default mid-range budget
        furniture: ["Sofa", "Coffee Table", "Bookshelf"], // Default furniture items
        specialRequirements: "",
      };
      
      // Add regeneration comments if this is a regeneration request
      if (isRegeneration && regenerationComment.trim()) {
        request.regenerationComment = regenerationComment;
        console.log("Adding regeneration comment to prompt:", regenerationComment);
      }
      
      // Generate design
      const result = await aiProvider.generateDesign(request);
      
      if (!result.success) {
        toast({
          title: "Generation Failed",
          description: result.error || "Failed to generate design with OpenAI",
          variant: "destructive",
        });
        return null;
      }
      
      return result;
    } catch (error) {
      console.error("Error generating design:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating the design",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Handle regeneration of design
  const handleRegenerate = async () => {
    // Check if user has enough tokens
    const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    if (!userInfo || userInfo.tokens < 1) {
      toast({
        title: "Insufficient tokens",
        description: "You need at least 1 token to regenerate a design. Please purchase more tokens.",
        variant: "destructive",
      });
      navigate(`/pricing?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Extract current design data for the request
      const dimensions = designData.dimensions.split('×').map(d => d.trim().replace('m', ''));
      
      // Prepare request for regeneration
      const request: DesignGenerationRequest = {
        roomType: designData.roomType,
        style: designData.style,
        colorScheme: designData.colorScheme,
        dimensions: {
          length: dimensions[0] || "4",
          width: dimensions[1] || "3",
          height: dimensions[2] || "2.5"
        },
        budget: getBudgetText(50), // Default mid-range budget
        furniture: designData.furniture.map(item => item.name.split(' ').slice(1).join(' ')), // Extract furniture names
        specialRequirements: "",
        regenerationComment: regenerationComment
      };
      
      // If we have a recommended furniture, add it to the regeneration comment
      if (recommendedFurniture) {
        request.regenerationComment = `Please include the ${recommendedFurniture.name} in this design. ${regenerationComment || ""}`;
      }
      
      // Generate new design with OpenAI
      const result = await generateDesignWithAI(true, "openai", request);
      
      if (result) {
        // Update design with new image and temporary furniture items
        const updatedDesignData = {
          ...designData,
          imageUrl: result.imageUrl,
          caption: result.caption || designData.caption, // Update caption if provided
          furniture: result.furniture || designData.furniture // Update with temporary furniture if provided
        };
        
        setDesignData(updatedDesignData);
        localStorage.setItem('designResult', JSON.stringify(updatedDesignData));
        
        // Now generate BOQ with Gemini
        setIsLoadingBOQ(true);
        setIsBoqGenerated(false); // Reset BOQ generated state during regeneration
        const boqResult = await generateBOQWithGemini(request);
        setIsLoadingBOQ(false);
        
        if (boqResult && boqResult.length > 0) {
          // Update design data with Gemini-generated furniture items
          const finalDesignData = {
            ...updatedDesignData,
            furniture: boqResult
          };
          
          setDesignData(finalDesignData);
          localStorage.setItem('designResult', JSON.stringify(finalDesignData));
          setIsBoqGenerated(true); // Set BOQ as generated when successful
        }
        
        // Deduct 1 token from the user's balance
        const updatedTokens = userInfo.tokens - 1;
        localStorage.setItem('user', JSON.stringify({
          ...userInfo,
          tokens: updatedTokens
        }));
        
        toast({
          title: "Design Regenerated",
          description: `1 token has been used. Remaining tokens: ${updatedTokens}`,
        });
        
        // Reset the regeneration comment
        setRegenerationComment("");

        // Reset recommended furniture after regeneration
        setRecommendedFurniture(null);

        // Clear localStorage data to allow for new design generation
        localStorage.removeItem('designFormData');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear session and start new design
  const clearDesignSession = () => {
    localStorage.removeItem('designFormData');
    localStorage.removeItem('designResult');
    navigate("/design-generation");
  };
  
  // Handle navigation to design generation page with session clearing
  const handleNavigateToDesign = () => {
    clearDesignSession();
    navigate("/design-generation");
  };
  
  // Handle selecting a furniture from recommendations
  const handleSelectFurniture = (furniture) => {
    setRecommendedFurniture(furniture);
  };
  
  // Extract furniture names from BOQ for recommendations
  const getFurnitureNames = () => {
    if (!designData.furniture || designData.furniture.length === 0) {
      return ["Sofa", "Table", "Chair"];
    }
    
    return designData.furniture.map(item => {
      const nameParts = item.name.split(" ");
      return nameParts.length > 1 ? nameParts.slice(1).join(" ") : item.name;
    });
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Your Design Result</h2>
        <p className="text-muted-foreground mt-1">
          Here's your custom interior design based on your preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Design Preview Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border">
              <img
                src={designData.imageUrl}
                alt="Generated Room Design"
                className="w-full h-full object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full mb-2"></div>
                    <p>Generating design...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Design Caption - Display the AI-generated text */}
            {designData.caption && (
              <div className="bg-muted rounded-md p-4">
                <p className="text-muted-foreground italic text-sm">{designData.caption}</p>
              </div>
            )}
          </div>
          
          {/* Regeneration Comments Section */}
          <RegenerationComments 
            value={regenerationComment}
            onChange={setRegenerationComment}
          />
          
          {/* Design Action Buttons */}
          <DesignActions 
            onRegenerate={handleRegenerate}
            isRegenerating={isLoading}
          />
          
          {/* Design Details Card */}
          <DesignDetails 
            roomType={designData.roomType}
            style={designData.style}
            colorScheme={designData.colorScheme}
            dimensions={designData.dimensions}
          />
        </div>
        
        {/* Bill of Quantities (BOQ) Section */}
        <div>
          <BillOfQuantities 
            items={designData.furniture || sampleBOQ}
            onNavigateToDesign={handleNavigateToDesign}
            isLoading={isLoadingBOQ}
          />
        </div>
      </div>
      
      {/* Furniture Recommendations Section */}
      <FurnitureRecommendations
        roomType={designData.roomType}
        style={designData.style}
        furnitureList={getFurnitureNames()}
        onSelectFurniture={handleSelectFurniture}
        isBoqGenerated={isBoqGenerated}
      />
    </div>
  );
};

export default DesignResult;
