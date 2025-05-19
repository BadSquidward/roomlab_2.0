
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share, Loader2, RefreshCcw, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Sample design result data
const sampleDesign = {
  imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop",
  roomType: "living-room",
  style: "Modern",
  colorScheme: "Neutral",
  dimensions: "4m × 3m × 2.5m",
};

// Sample BOQ data
const sampleBOQ = [
  { name: "Modern Gray Sofa", dimensions: "220 × 85 × 80 cm", quantity: 1, price: 29990 },
  { name: "Coffee Table - Oak", dimensions: "120 × 60 × 45 cm", quantity: 1, price: 15490 },
  { name: "Side Table", dimensions: "45 × 45 × 55 cm", quantity: 2, price: 4990 },
  { name: "Floor Lamp", dimensions: "35 × 35 × 165 cm", quantity: 1, price: 6890 },
  { name: "Area Rug - Light Gray", dimensions: "200 × 300 cm", quantity: 1, price: 12990 },
  { name: "Wall Art Set", dimensions: "50 × 70 cm", quantity: 3, price: 2990 },
  { name: "Decorative Cushions", dimensions: "45 × 45 cm", quantity: 4, price: 1290 },
  { name: "Bookshelf", dimensions: "90 × 30 × 180 cm", quantity: 1, price: 18990 },
];

const DesignResult = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [regenerationComment, setRegenerationComment] = useState("");
  
  // Calculate total price
  const totalPrice = sampleBOQ.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
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
    
    // Simulate API call to regenerate design
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
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
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate design. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  // Handle contacting sales
  const handleContactSales = async () => {
    setIsContacting(true);
    
    // Simulate contact delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Sales Request Sent",
      description: "Our sales team will contact you shortly regarding your design inquiry.",
    });
    
    setIsContacting(false);
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
              src={sampleDesign.imageUrl}
              alt="Generated Room Design"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Regeneration Comment Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="regenerationComment">Regeneration Comments</Label>
              <Textarea
                id="regenerationComment"
                placeholder="Add specific changes you'd like in the regenerated design..."
                value={regenerationComment}
                onChange={(e) => setRegenerationComment(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="gap-2" onClick={handleRegenerate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4" />
                  Regenerate Design
                </>
              )}
            </Button>
            <Button variant="outline" className="gap-2">
              <Share className="h-4 w-4" />
              Share Design
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleContactSales} disabled={isContacting}>
              {isContacting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Contacting...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4" />
                  Contact Sales
                </>
              )}
            </Button>
          </div>
          
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Design Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Room Type:</span>
                <p>{sampleDesign.roomType === "living-room" ? "Living Room" : sampleDesign.roomType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Style:</span>
                <p>{sampleDesign.style}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Color Scheme:</span>
                <p>{sampleDesign.colorScheme}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Dimensions:</span>
                <p>{sampleDesign.dimensions}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Bill of Quantities (BOQ) Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Bill of Quantities</h3>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleContactSales} disabled={isContacting}>
              {isContacting ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Phone className="h-3 w-3 mr-1" />
              )}
              Contact Sales
            </Button>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 p-3 border-b grid grid-cols-12 text-xs font-medium text-muted-foreground">
              <div className="col-span-6">Item</div>
              <div className="col-span-3">Dimensions</div>
              <div className="col-span-1">Qty</div>
              <div className="col-span-2 text-right">Price</div>
            </div>
            
            <div className="divide-y max-h-[500px] overflow-y-auto design-scrollbar">
              {sampleBOQ.map((item, index) => (
                <div key={index} className="p-3 grid grid-cols-12 items-center text-sm">
                  <div className="col-span-6">{item.name}</div>
                  <div className="col-span-3 text-xs text-muted-foreground">{item.dimensions}</div>
                  <div className="col-span-1">{item.quantity}</div>
                  <div className="col-span-2 text-right">฿{item.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-3 border-t grid grid-cols-12 text-sm font-medium">
              <div className="col-span-10">Total Estimated Cost</div>
              <div className="col-span-2 text-right">฿{totalPrice.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Prices are estimates and may vary based on vendor selection and availability.</p>
          </div>
          
          <Button
            onClick={() => navigate("/design-generation")}
            variant="outline"
            className="w-full mt-4"
          >
            Create Another Design
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignResult;
