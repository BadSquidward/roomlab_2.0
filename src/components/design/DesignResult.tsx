
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
  const [selectedProvider] = useState("gemini"); // Default to Gemini
  
  // Load data from localStorage
  useEffect(() => {
    // Get form data from localStorage if available
    const storedFormData = localStorage.getItem('designFormData');
    const storedDesignData = localStorage.getItem('designResult');
    
    if (storedDesignData) {
      try {
        const parsedDesignData = JSON.parse(storedDesignData);
        setDesignData(parsedDesignData);
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
      const imageResult = await generateDesignWithAI(false, selectedProvider, request);
      
      if (imageResult) {
        // Create new design data object
        const newDesignData = {
          imageUrl: imageResult,
          roomType: formData.roomType || "living-room",
          style: formData.style || "Modern",
          colorScheme: formData.colorScheme || "Neutral",
          dimensions: `${formData.length || "4"}m × ${formData.width || "3"}m × ${formData.height || "2.5"}m`,
        };
        
        // Update state and localStorage
        setDesignData(newDesignData);
        localStorage.setItem('designResult', JSON.stringify(newDesignData));
        
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
  
  // Generate design using AI provider
  const generateDesignWithAI = async (
    isRegeneration: boolean = false, 
    providerName: string = "gemini", 
    customRequest?: DesignGenerationRequest
  ) => {
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
      
      console.log(`Generating design with ${providerName} provider`);
      
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
          description: result.error || `Failed to generate design with ${providerName}`,
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
      navigate(`/pricing?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate new design with regeneration comments
      const newImageUrl = await generateDesignWithAI(true, "gemini");
      
      if (newImageUrl) {
        // Update design with new image
        const updatedDesignData = {
          ...designData,
          imageUrl: newImageUrl
        };
        
        setDesignData(updatedDesignData);
        localStorage.setItem('designResult', JSON.stringify(updatedDesignData));
        
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
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full mb-2"></div>
                  <p>Generating design...</p>
                </div>
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
            items={sampleBOQ} 
            onNavigateToDesign={handleNavigateToDesign}
          />
        </div>
      </div>
    </div>
  );
};

export default DesignResult;
