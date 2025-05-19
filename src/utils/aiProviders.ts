
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
  constructor(apiKey: string, model: string = "dall-e-3") {
    super(apiKey, "https://api.openai.com/v1/images/generations", model);
  }

  async generateDesign(request: DesignGenerationRequest): Promise<DesignGenerationResponse> {
    try {
      const prompt = this.formatPrompt(request);
      
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
          quality: "standard",
          response_format: "url"
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("OpenAI API error:", data);
        return {
          success: false,
          imageUrl: "",
          error: data.error?.message || "Error generating image"
        };
      }

      return {
        success: true,
        imageUrl: data.data[0].url
      };
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return {
        success: false,
        imageUrl: "",
        error: "Failed to connect to OpenAI API"
      };
    }
  }
}

// Stability AI Provider implementation
export class StabilityAIProvider extends AIProvider {
  constructor(apiKey: string, model: string = "stable-diffusion-xl") {
    super(apiKey, "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", model);
  }

  async generateDesign(request: DesignGenerationRequest): Promise<DesignGenerationResponse> {
    try {
      const prompt = this.formatPrompt(request);
      
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 50
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Stability AI API error:", data);
        return {
          success: false,
          imageUrl: "",
          error: data.message || "Error generating image"
        };
      }

      // Extract image data from response
      const imageBase64 = data.artifacts[0].base64;
      const imageUrl = `data:image/png;base64,${imageBase64}`;

      return {
        success: true,
        imageUrl
      };
    } catch (error) {
      console.error("Error calling Stability AI API:", error);
      return {
        success: false,
        imageUrl: "",
        error: "Failed to connect to Stability AI API"
      };
    }
  }
}

// Factory function to get the appropriate provider
export function getAIProvider(providerName: string, apiKey: string, model?: string): AIProvider {
  switch (providerName.toLowerCase()) {
    case "openai":
      return new OpenAIProvider(apiKey, model || "dall-e-3");
    case "stabilityai":
      return new StabilityAIProvider(apiKey, model || "stable-diffusion-xl");
    default:
      throw new Error(`Unsupported AI provider: ${providerName}`);
  }
}
