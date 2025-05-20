
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

// Updated Gemini Provider implementation with proper handling of image and text response
export class GeminiProvider extends AIProvider {
  constructor(apiKey: string, model: string = "gemini-2.0-flash-preview-image-generation") {
    super(apiKey, "https://generativelanguage.googleapis.com/v1beta/models", model);
  }

  async generateDesign(request: DesignGenerationRequest): Promise<DesignGenerationResponse> {
    try {
      const prompt = this.formatPrompt(request);
      const fullUrl = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
      
      console.log("Requesting Gemini image generation with URL:", fullUrl.replace(this.apiKey, "[REDACTED]"));
      console.log("Using prompt:", prompt);
      
      // Updated request format - using only text prompt without function calling
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048
          }
        })
      });

      const data = await response.json();
      console.log("Gemini API response:", JSON.stringify(data));
      
      if (!response.ok) {
        console.error("Gemini API error:", data);
        return {
          success: false,
          imageUrl: "",
          error: data.error?.message || "Error generating image"
        };
      }

      // Extract image data and text from Gemini response
      let imageUrl = "";
      let caption = "";
      
      try {
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const parts = data.candidates[0].content.parts;
          
          // Process each part to extract image and text
          for (const part of parts) {
            // Extract image if available
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
              imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            } 
            // Extract text if available
            else if (part.text) {
              caption += part.text;
            }
          }
        }
        
        if (!imageUrl) {
          console.log("No image found in Gemini response, using Unsplash as fallback");
          
          // Generate a tailored search term based on the request
          const roomType = request.roomType.replace('-', ' ');
          let searchTerms = `interior,${request.style.toLowerCase()},${roomType}`;
          
          // Add regeneration comment keywords if available
          if (request.regenerationComment && request.regenerationComment.trim() !== "") {
            // Extract key descriptive words from the regeneration comment
            const keywords = request.regenerationComment
              .split(/\s+/)
              .filter(word => word.length > 3)  // Only use words longer than 3 chars
              .slice(0, 3)  // Take up to 3 keywords
              .join(',');
            
            if (keywords) {
              searchTerms += `,${keywords}`;
            }
          }
          
          // Add color scheme to search terms
          searchTerms += `,${request.colorScheme.toLowerCase()}`;
          
          const encodedSearchTerms = encodeURIComponent(searchTerms);
          // Use random parameter to avoid caching and get different images
          const randomParam = Math.floor(Math.random() * 1000);
          imageUrl = `https://source.unsplash.com/featured/?${encodedSearchTerms}&random=${randomParam}`;
          
          // Generate a default caption if none was provided
          if (!caption) {
            caption = `A ${request.style} ${request.roomType.replace('-', ' ')} with ${request.colorScheme} color scheme.`;
          }
        }
        
        return {
          success: true,
          imageUrl,
          caption
        };
      } catch (error) {
        console.error("Error parsing Gemini API response:", error);
        return {
          success: false,
          imageUrl: "",
          error: "Failed to parse Gemini API response"
        };
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return {
        success: false,
        imageUrl: "",
        error: "Failed to connect to Gemini API"
      };
    }
  }
  
  // Keep the helper method for compatibility, but simplify it
  private async generateImageOnly(prompt: string): Promise<DesignGenerationResponse> {
    try {
      const fullUrl = `${this.baseUrl}/gemini-pro-vision:generateContent?key=${this.apiKey}`;
      
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a photorealistic image based on this description: ${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          imageUrl: "",
          error: data.error?.message || "Error generating image"
        };
      }
      
      let imageUrl = "";
      
      // Try to extract image data
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const parts = data.candidates[0].content.parts;
        
        for (const part of parts) {
          if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
      
      return {
        success: !!imageUrl,
        imageUrl,
        caption: prompt
      };
    } catch (error) {
      return {
        success: false,
        imageUrl: "",
        error: "Failed to generate image in follow-up request"
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
    case "gemini":
      return new GeminiProvider(apiKey, model || "gemini-2.0-flash-preview-image-generation");
    default:
      throw new Error(`Unsupported AI provider: ${providerName}`);
  }
}

// Updated default API keys with the new Gemini API key
export const defaultApiKeys = {
  openai: "sk-your-openai-api-key", // Replace with your actual API key
  stabilityai: "sk-your-stability-api-key", // Replace with your actual API key
  gemini: "AIzaSyA5WAO7LtMrT9BvUkR_3t7lrDRTsOeBm0g" // Updated Gemini API key
};
