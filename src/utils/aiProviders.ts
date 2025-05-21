
// AI Provider Integration Utilities

export interface DesignGenerationRequest {
  roomType: string;
  style: string;
  colorScheme: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  budget: string;
  furniture: string[];
  specialRequirements?: string;
  regenerationComment?: string;
}

export interface FurnitureItem {
  name: string;
  dimensions: string;
  quantity: number;
  price: number;
}

export interface DesignGenerationResponse {
  imageUrl: string;
  success: boolean;
  error?: string;
  caption?: string; // Added caption field for text descriptions
  furniture?: FurnitureItem[]; // Added furniture items with details
}

// Base class for AI providers
export abstract class AIProvider {
  protected apiKey: string;
  protected baseUrl: string;
  protected model: string;

  constructor(apiKey: string, baseUrl: string, model: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.model = model;
  }

  // Format prompt based on design preferences
  protected formatPrompt(request: DesignGenerationRequest): string {
    // Build a detailed prompt with all the design parameters
    let prompt = `Generate a photorealistic interior design for a ${request.roomType.replace("-", " ")} with the following specifications:
- Style: ${request.style}
- Color scheme: ${request.colorScheme}
- Room dimensions: ${request.dimensions.length}m × ${request.dimensions.width}m × ${request.dimensions.height}m
- Budget range: ${request.budget}
- Required furniture: ${request.furniture.join(", ")}
- All furniture designs should be referenced from IKEA furniture catalog`;

    // Add special requirements if provided
    if (request.specialRequirements && request.specialRequirements.trim() !== "") {
      prompt += `\n- Special requirements: ${request.specialRequirements}`;
    }

    // Add regeneration comment for design refinement if provided
    if (request.regenerationComment && request.regenerationComment.trim() !== "") {
      prompt += `\n\nPlease make these specific changes to the previous design: ${request.regenerationComment}`;
    }

    // Add request for furniture details with approximate prices
    prompt += `\n\nIn addition to the design image, please provide a list of all furniture items visible in the design with the following details for each item:
1. Name of the furniture piece
2. Approximate dimensions
3. Quantity
4. Approximate price in Thai Baht (฿)`;

    return prompt;
  }

  // Method to be implemented by specific providers
  abstract generateDesign(request: DesignGenerationRequest): Promise<DesignGenerationResponse>;
}

// OpenAI Provider implementation
export class OpenAIProvider extends AIProvider {
  constructor(apiKey: string, model: string = "dall-e-3") {
    super(apiKey, "https://api.openai.com/v1/images/generations", model);
  }

  async generateDesign(request: DesignGenerationRequest): Promise<DesignGenerationResponse> {
    try {
      const prompt = this.formatPrompt(request);
      console.log("Generating design with OpenAI using prompt:", prompt);
      
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard"
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("OpenAI API error:", data);
        return {
          success: false,
          imageUrl: "",
          error: data.error?.message || "Error generating image",
          caption: "Failed to generate image"
        };
      }

      // Generate a descriptive caption based on the prompt
      const caption = `A ${request.style.toLowerCase()} ${request.roomType.replace('-', ' ')} with ${request.colorScheme.toLowerCase()} color scheme, featuring ${request.furniture.join(', ')} from IKEA.`;

      // Extract furniture details from the prompt response (this will be handled separately since DALL-E doesn't return text)
      // We'll generate sample furniture items based on the request for demonstration
      const furnitureItems: FurnitureItem[] = this.generateSampleFurnitureItems(request);

      return {
        success: true,
        imageUrl: data.data[0].url,
        caption: caption,
        furniture: furnitureItems
      };
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return {
        success: false,
        imageUrl: "",
        error: "Failed to connect to OpenAI API",
        caption: "Error occurred during image generation"
      };
    }
  }

  // Generate sample furniture items based on the request
  // In a real implementation, this would be replaced with actual data from the AI response
  private generateSampleFurnitureItems(request: DesignGenerationRequest): FurnitureItem[] {
    // Create furniture items based on the requested furniture list
    const budgetLevel = request.budget.includes("10,000") ? "low" : 
                        request.budget.includes("600,001") ? "high" : "medium";
    
    return request.furniture.map(furniture => {
      let price = 0;
      let dimensions = "";
      
      // Set price ranges based on budget level and furniture type
      if (furniture.toLowerCase().includes("sofa") || furniture.toLowerCase().includes("couch")) {
        dimensions = "220 × 85 × 80 cm";
        price = budgetLevel === "low" ? 15990 : budgetLevel === "medium" ? 29990 : 49990;
      } else if (furniture.toLowerCase().includes("table") && furniture.toLowerCase().includes("coffee")) {
        dimensions = "120 × 60 × 45 cm";
        price = budgetLevel === "low" ? 7990 : budgetLevel === "medium" ? 15490 : 25990;
      } else if (furniture.toLowerCase().includes("table") && furniture.toLowerCase().includes("dining")) {
        dimensions = "180 × 90 × 75 cm";
        price = budgetLevel === "low" ? 12990 : budgetLevel === "medium" ? 24990 : 39990;
      } else if (furniture.toLowerCase().includes("chair") && furniture.toLowerCase().includes("dining")) {
        dimensions = "45 × 50 × 85 cm";
        price = budgetLevel === "low" ? 2990 : budgetLevel === "medium" ? 5990 : 9990;
      } else if (furniture.toLowerCase().includes("chair") && furniture.toLowerCase().includes("office")) {
        dimensions = "68 × 68 × 115 cm";
        price = budgetLevel === "low" ? 4990 : budgetLevel === "medium" ? 9990 : 19990;
      } else if (furniture.toLowerCase().includes("bed")) {
        dimensions = "160 × 200 cm";
        price = budgetLevel === "low" ? 19990 : budgetLevel === "medium" ? 34990 : 59990;
      } else if (furniture.toLowerCase().includes("desk")) {
        dimensions = "140 × 60 × 75 cm";
        price = budgetLevel === "low" ? 8990 : budgetLevel === "medium" ? 17990 : 29990;
      } else if (furniture.toLowerCase().includes("bookshelf") || furniture.toLowerCase().includes("bookcase")) {
        dimensions = "90 × 30 × 180 cm";
        price = budgetLevel === "low" ? 8990 : budgetLevel === "medium" ? 18990 : 29990;
      } else if (furniture.toLowerCase().includes("rug") || furniture.toLowerCase().includes("carpet")) {
        dimensions = "200 × 300 cm";
        price = budgetLevel === "low" ? 6990 : budgetLevel === "medium" ? 12990 : 24990;
      } else {
        dimensions = "60 × 40 × 50 cm";
        price = budgetLevel === "low" ? 3990 : budgetLevel === "medium" ? 7990 : 14990;
      }
      
      return {
        name: `${this.capitalizeFirstLetter(request.style)} ${furniture}`,
        dimensions,
        quantity: 1,
        price
      };
    });
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}

// Factory function to get the appropriate provider
export function getAIProvider(providerName: string, apiKey: string, model?: string): AIProvider {
  // Always return OpenAI provider regardless of the requested provider
  return new OpenAIProvider(apiKey, model || "dall-e-3");
}

// Updated API key for OpenAI
export const defaultApiKeys = {
  openai: "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"
};
