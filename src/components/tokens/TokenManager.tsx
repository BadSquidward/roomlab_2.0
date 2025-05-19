
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Coins, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const TokenManager = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user info from localStorage
  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : { tokens: 0 };
  const [userTokens, setUserTokens] = useState(userInfo.tokens || 0);
  
  const tokenPackages = [
    { id: "starter", name: "Starter", tokens: 5, price: 349 },
    { id: "pro", name: "Pro", tokens: 15, price: 890 },
    { id: "premium", name: "Premium", tokens: 35, price: 1790 },
  ];
  
  const handlePurchase = async (packageData: { id: string, tokens: number }) => {
    setIsLoading(true);
    
    // Simulate payment process
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update user tokens
      const newTokens = userTokens + packageData.tokens;
      setUserTokens(newTokens);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify({
        ...userInfo,
        tokens: newTokens
      }));
      
      toast({
        title: "Purchase Successful",
        description: `You've added ${packageData.tokens} tokens to your account.`,
      });
      
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Token Management</h2>
        <p className="text-muted-foreground mt-1">
          Purchase and manage your design generation tokens
        </p>
      </div>
      
      {/* Current Token Balance */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Current Balance</h3>
            <p className="text-3xl font-bold flex items-center">
              <Coins className="h-5 w-5 mr-2 text-yellow-500" />
              {userTokens} Tokens
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setUserTokens(userInfo.tokens);
              toast({
                title: "Balance Refreshed",
                description: "Your token balance has been refreshed.",
              });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Balance
          </Button>
        </div>
      </Card>
      
      {/* Token Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tokenPackages.map((pkg) => (
          <Card key={pkg.id} className="p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{pkg.name}</h3>
              <p className="text-muted-foreground">{pkg.tokens} Tokens</p>
            </div>
            <div className="text-3xl font-bold mb-6">
              ฿{pkg.price.toLocaleString()}
            </div>
            <ul className="mb-6 space-y-2 flex-grow">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">{pkg.tokens} Room Design Generations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">High-Quality Renderings</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Detailed Bill of Quantities</span>
              </li>
            </ul>
            <Button 
              onClick={() => handlePurchase(pkg)} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Purchase"}
            </Button>
          </Card>
        ))}
      </div>

      {/* Added button to return to design generation */}
      <div className="flex justify-center mt-8">
        <Button 
          variant="outline" 
          className="mr-4"
          onClick={() => navigate("/design-generation")}
        >
          Return to Room Selection
        </Button>
        
        <Button 
          onClick={() => navigate(-1)}
        >
          Continue Your Design
        </Button>
      </div>
    </div>
  );
};

export default TokenManager;
