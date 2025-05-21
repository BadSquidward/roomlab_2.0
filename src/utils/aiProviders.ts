
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

export interface DesignGenerationResponse {
  imageUrl: string;
  success: boolean;
  error?: string;
  caption?: string; // Added caption field for text descriptions
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
- Required furniture: ${request.furniture.join(", ")}`;

    // Add special requirements if provided
    if (request.specialRequirements && request.specialRequirements.trim() !== "") {
      prompt += `\n- Special requirements: ${request.specialRequirements}`;
    }

    // Add regeneration comment for design refinement if provided
    if (request.regenerationComment && request.regenerationComment.trim() !== "") {
      prompt += `\n\nPlease make these specific changes to the previous design: ${request.regenerationComment}`;
    }

    return prompt;
  }

  // Method to be implemented by specific providers
  abstract generateDesign(request: DesignGenerationRequest): Promise<DesignGenerationResponse>;
}

// OpenAI Provider implementation
export class OpenAIProvider extends AIProvider {
  constructor(apiKey: string, model: string = "gpt-image-1") {
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
          quality: "auto" // Changed from "standard" to "hd" which is now "high"
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
      const caption = `A ${request.style.toLowerCase()} ${request.roomType.replace('-', ' ')} with ${request.colorScheme.toLowerCase()} color scheme, featuring ${request.furniture.join(', ')}.`;

      return {
        success: true,
        imageUrl: data.data[0].url,
        caption: caption
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
}

// Factory function to get the appropriate provider
export function getAIProvider(providerName: string, apiKey: string, model?: string): AIProvider {
  // Always return OpenAI provider regardless of the requested provider
  return new OpenAIProvider(apiKey, model || "gpt-image-1");
}

// Updated default API key for OpenAI
export const defaultApiKeys = {
  openai: "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"
};
