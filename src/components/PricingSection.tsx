
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const PricingSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  
  // Get user info from localStorage
  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : { tokens: 0 };
  
  const tokenPackages = [
    {
      id: "starter",
      name: "Starter",
      price: 349,
      tokens: 5,
      features: [
        "5 Room Design Generations",
        "High-Quality Renderings",
        "Detailed Bill of Quantities",
        "PDF Export Functionality",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 890,
      tokens: 15,
      features: [
        "15 Room Design Generations",
        "High-Quality Renderings",
        "Detailed Bill of Quantities",
        "PDF Export Functionality",
        "Priority Generation",
        "Multiple Design Variations",
      ],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: 1790,
      tokens: 35,
      features: [
        "35 Room Design Generations",
        "Ultra HD Renderings",
        "Detailed Bill of Quantities",
        "PDF Export Functionality",
        "Priority Generation",
        "Multiple Design Variations",
        "Designer Consultation",
      ],
      popular: false,
    },
  ];

  // Handle token purchase
  const handlePurchase = async (packageData: { id: string, tokens: number, name: string }) => {
    setIsLoading(true);
    setLoadingPackage(packageData.id);
    
    // Simulate payment process
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update user tokens
      const newTokens = (userInfo.tokens || 0) + packageData.tokens;
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify({
        ...userInfo,
        tokens: newTokens
      }));
      
      toast({
        title: "Purchase Successful",
        description: `You've added ${packageData.tokens} tokens to your account.`,
      });
      
      // Navigate to design generation if requested
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      if (returnUrl) {
        navigate(returnUrl);
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingPackage(null);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mt-4">
            Purchase tokens to generate designs whenever inspiration strikes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tokenPackages.map((pkg, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-lg shadow-sm border overflow-hidden ${
                pkg.popular ? "border-brand-500" : "border-gray-200"
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-brand-500 text-white px-3 py-1 text-xs font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">฿{pkg.price}</span>
                </div>
                <p className="mb-6 pb-6 border-b text-sm text-muted-foreground">
                  {pkg.tokens} tokens for generating unique room designs
                </p>
                
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${pkg.popular ? "bg-brand-500 hover:bg-brand-600" : ""}`}
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handlePurchase({id: pkg.id, tokens: pkg.tokens, name: pkg.name})}
                  disabled={isLoading}
                >
                  {isLoading && loadingPackage === pkg.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Buy Now`
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
