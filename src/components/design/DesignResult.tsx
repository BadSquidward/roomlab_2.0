
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getAIProvider, DesignGenerationRequest, defaultApiKeys } from "@/utils/aiProviders";
import BillOfQuantities from "./BillOfQuantities";
import DesignDetails from "./DesignDetails";
import RegenerationComments from "./RegenerationComments";
import DesignActions from "./DesignActions";
import { getBudgetText, sampleBOQ, sampleDesign } from "@/utils/designUtils";

const DesignResult = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [regenerationComment, setRegenerationComment] = useState("");
  const [designData, setDesignData] = useState(sampleDesign);
  
  // Load data from localStorage
  useEffect(() => {
    // Check if we have a direct design result from popular designs
    const selectedDesign = localStorage.getItem('selectedDesign');
    if (selectedDesign) {
      const designInfo = JSON.parse(selectedDesign);
      if (designInfo.useDirectResult) {
        // Update design data with selected style
        setDesignData({
          ...designData,
          style: designInfo.style.charAt(0).toUpperCase() + designInfo.style.slice(1)
        });
        
        // Clear the flag after use
        localStorage.removeItem('selectedDesign');
      }
    }
  }, []);
  
  // Generate design using AI provider
  const generateDesignWithAI = async (isRegeneration: boolean = false, providerName: string = "openai") => {
    try {
      // Get API key for the selected provider
      const apiKey = defaultApiKeys[providerName as keyof typeof defaultApiKeys];
      
      if (!apiKey) {
        toast({
          title: "API Key Not Available",
          description: `No API key available for ${providerName}. Please contact support.`,
          variant: "destructive",
        });
        return null;
      }
      
      // Extract path parameters for room type
      const pathParts = window.location.pathname.split('/');
      const roomTypeFromPath = pathParts[pathParts.length - 2] || "living-room";
      
      // Create provider instance with default model for the provider
      const aiProvider = getAIProvider(providerName, apiKey);
      
      // Prepare request
      const request: DesignGenerationRequest = {
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
      }
      
      // Generate design
      const result = await aiProvider.generateDesign(request);
      
      if (!result.success) {
        toast({
          title: "Generation Failed",
          description: result.error || "Failed to generate design with AI provider",
          variant: "destructive",
        });
        return null;
      }
      
      return result.imageUrl;
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
      navigate("/tokens");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Rotate between providers for diversity (you can change this logic based on your preference)
      const providers = ["openai", "stabilityai", "gemini"];
      const randomProviderIndex = Math.floor(Math.random() * providers.length);
      const selectedProvider = providers[randomProviderIndex];
      
      // Generate new design with AI using regeneration comments
      const newImageUrl = await generateDesignWithAI(true, selectedProvider);
      
      if (newImageUrl) {
        // Update design with new image
        setDesignData({
          ...designData,
          imageUrl: newImageUrl
        });
        
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
  
  // Handle navigation to design generation page
  const handleNavigateToDesign = () => {
    navigate("/design-generation");
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
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border">
            <img
              src={designData.imageUrl}
              alt="Generated Room Design"
              className="w-full h-full object-cover"
            />
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
            items={sampleBOQ} 
            onNavigateToDesign={handleNavigateToDesign}
          />
        </div>
      </div>
    </div>
  );
};

export default DesignResult;
