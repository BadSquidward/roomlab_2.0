
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

  // Separate method for formatting BOQ prompt for Gemini
  protected formatBOQPrompt(request: DesignGenerationRequest): string {
    let prompt = `สร้าง BOQ สำหรับเฟอร์นิเจอร์เท่านั้น (ไม่รวมของตกแต่งหรืออุปกรณ์อื่นๆ) จากคำขอออกแบบข้างต้นในรูปแบบตารางที่มีหัวข้อ Item, Dimensions, Qty และ Price เท่านั้น
    
    กรุณาให้รายการเฉพาะเฟอร์นิเจอร์จากแคตตาล็อก IKEA เท่านั้น และกำหนดราคาให้สมเหตุสมผลตามมาตรฐานราคา IKEA ในประเทศไทย
    
    คำขอออกแบบ:
    - ประเภทห้อง: ${request.roomType.replace("-", " ")}
    - สไตล์: ${request.style}
    - โทนสี: ${request.colorScheme}
    - ขนาดห้อง: ${request.dimensions.length}m × ${request.dimensions.width}m × ${request.dimensions.height}m
    - งบประมาณ: ${request.budget}
    - เฟอร์นิเจอร์ที่ต้องการ: ${request.furniture.join(", ")}
    - เฟอร์นิเจอร์ทั้งหมดอ้างอิงจากแคตตาล็อกเฟอร์นิเจอร์ IKEA
    
    หมายเหตุสำคัญ:
    - Item เป็นชื่อ Product และชื่อ Funiture เท่านั้น
    - Dimensions: ให้อยู่ใแน Pattern กว้าง x ยาว x สูง
    - Price หากไม่มีราคาในข้อมูล ให้ประมาณการ แต่ Total Price ต้องอยู่ในช่วงงบประมาณที่กำหนด
    - กรุณาใส่ราคาเป็นตัวเลขเท่านั้น ไม่ต้องใส่สัญลักษณ์สกุลเงิน`;

    // Add special requirements if provided
    if (request.specialRequirements && request.specialRequirements.trim() !== "") {
      prompt += `\n- ความต้องการพิเศษ: ${request.specialRequirements}`;
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

// Gemini Provider implementation
export class GeminiProvider extends AIProvider {
  constructor(apiKey: string, model: string = "gemini-2.0-flash-lite") {
    super(apiKey, "https://generativelanguage.googleapis.com/v1", model);
  }
  
  async generateBOQ(request: DesignGenerationRequest): Promise<FurnitureItem[]> {
    try {
      const boqPrompt = this.formatBOQPrompt(request);
      console.log("Generating BOQ with Gemini using prompt:", boqPrompt);
      
      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: boqPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Gemini API error:", data);
        return [];
      }
      
      // Parse the Gemini response to extract furniture items
      return this.parseBOQFromGeminiResponse(data);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return [];
    }
  }

  private parseBOQFromGeminiResponse(data: any): FurnitureItem[] {
    try {
      // Access the text content from the Gemini response
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textContent) {
        console.error("No text content in Gemini response");
        return [];
      }
      
      // Extract table data from the text
      // This is a simple implementation assuming a fairly consistent format
      const lines = textContent.split("\n").filter(line => line.trim().length > 0);
      const furnitureItems: FurnitureItem[] = [];
      
      let tableStarted = false;
      
      for (const line of lines) {
        // Skip header lines or non-table rows
        if (line.includes("Item") && line.includes("Dimensions") && line.includes("Qty") && line.includes("ราคา")) {
          tableStarted = true;
          continue;
        }
        
        if (!tableStarted) continue;
        
        // Skip separator lines
        if (line.includes("---") || line.includes("===")) continue;
        
        // Extract table cells - handle different table formats (markdown, plain text)
        let cells: string[] = [];
        
        if (line.includes("|")) {
          // Markdown table format
          cells = line.split("|")
            .map(cell => cell.trim())
            .filter(cell => cell.length > 0);
        } else {
          // Assume space or tab delimited
          cells = line.split(/\s{2,}|\t/)
            .map(cell => cell.trim())
            .filter(cell => cell.length > 0);
        }
        
        if (cells.length >= 4) {
          // Extract values from cells
          const name = cells[0];
          const dimensions = cells[1];
          
          // Parse quantity and price, handling various formats
          let quantity = 1;
          let price = 0;
          
          try {
            quantity = parseInt(cells[2].replace(/[^\d]/g, ""));
            
            // Extract price - handle ฿ symbol and commas
            const priceStr = cells[3].replace(/[^\d]/g, "");
            price = parseInt(priceStr);
          } catch (e) {
            console.warn("Error parsing quantity/price:", e);
          }
          
          // Only add valid items
          if (name && dimensions && !isNaN(quantity) && !isNaN(price) && price > 0) {
            furnitureItems.push({
              name,
              dimensions,
              quantity,
              price
            });
          }
        }
      }
      
      return furnitureItems;
    } catch (error) {
      console.error("Error parsing BOQ from Gemini response:", error);
      return [];
    }
  }

  async generateDesign(request: DesignGenerationRequest): Promise<DesignGenerationResponse> {
    // For Gemini, we'll focus on generating the BOQ as we're using OpenAI for the image
    try {
      // Generate BOQ using Gemini
      const furnitureItems = await this.generateBOQ(request);
      
      if (furnitureItems.length === 0) {
        return {
          success: false,
          imageUrl: "",
          error: "Failed to generate BOQ with Gemini",
          furniture: []
        };
      }
      
      // Return success with furniture items
      return {
        success: true,
        imageUrl: "", // We'll use OpenAI for the image
        furniture: furnitureItems
      };
    } catch (error) {
      console.error("Error generating BOQ with Gemini:", error);
      return {
        success: false,
        imageUrl: "",
        error: "An unexpected error occurred while generating the BOQ",
        furniture: []
      };
    }
  }
}

// Factory function to get the appropriate provider
export function getAIProvider(providerName: string, apiKey: string, model?: string): AIProvider {
  if (providerName.toLowerCase() === "gemini") {
    return new GeminiProvider(apiKey, model || "gemini-2.0-flash-lite");
  }
  // Default to OpenAI provider
  return new OpenAIProvider(apiKey, model || "dall-e-3");
}

// Updated API keys for both providers
export const defaultApiKeys = {
  openai: "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",
  gemini: "AIzaSyDGcREooKS1QaZeefR2zdE-eElbpyqN6Fc"
};
