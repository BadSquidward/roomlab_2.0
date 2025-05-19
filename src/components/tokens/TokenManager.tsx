
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Coins, CreditCard, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TokenManager = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ tokens: number, name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo(parsedUser);
    } else {
      navigate('/login');
      toast({
        title: "Authentication required",
        description: "Please login to manage your tokens",
        variant: "destructive"
      });
    }
  }, [navigate, toast]);

  // Sample token packages
  const tokenPackages = [
    {
      id: "tokens-5",
      amount: 5,
      price: 349,
      popular: false,
    },
    {
      id: "tokens-15",
      amount: 15,
      price: 890,
      popular: true,
    },
    {
      id: "tokens-35",
      amount: 35,
      price: 1790,
      popular: false,
    },
  ];

  // Simulate token purchase
  const handlePurchaseTokens = async (packageId: string) => {
    const selectedPackage = tokenPackages.find((pkg) => pkg.id === packageId);
    if (!selectedPackage || !userInfo) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update user tokens in state and localStorage
      const updatedTokens = userInfo.tokens + selectedPackage.amount;
      const updatedUserInfo = { ...userInfo, tokens: updatedTokens };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUserInfo));
      
      // Update state
      setUserInfo(updatedUserInfo);
      
      toast({
        title: "Purchase successful!",
        description: `You've added ${selectedPackage.amount} tokens to your account.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Your Tokens</h2>
        <p className="text-muted-foreground mt-1">
          Manage your design tokens and purchase more when needed
        </p>
      </div>
      
      <div className="flex items-center justify-between p-6 rounded-lg bg-gradient-to-r from-brand-50 to-blue-50 border">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-brand-100">
            <Coins className="h-6 w-6 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Available Tokens</h3>
            <p className="text-sm text-muted-foreground">
              Use tokens to generate new designs
            </p>
          </div>
        </div>
        <div className="text-4xl font-bold text-brand-600">
          {userInfo.tokens}
        </div>
      </div>
      
      {userInfo.tokens === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>No Tokens Available</span>
            </CardTitle>
            <CardDescription>
              You've used all your tokens. Purchase more to continue generating designs.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Purchase Tokens</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tokenPackages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={pkg.popular ? "border-brand-300" : ""}
            >
              {pkg.popular && (
                <div className="bg-brand-500 text-white text-xs font-medium px-3 py-1 absolute top-0 right-0 rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-brand-500" />
                  {pkg.amount} Tokens
                </CardTitle>
                <CardDescription>
                  Generate {pkg.amount} unique room designs
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <span className="text-2xl font-bold">฿{pkg.price}</span>
                </div>
                
                <Button 
                  className="w-full gap-2"
                  onClick={() => handlePurchaseTokens(pkg.id)}
                  disabled={isLoading}
                >
                  <CreditCard className="h-4 w-4" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          Secure payment processing. Your payment information is never stored on our servers.
        </p>
      </div>
    </div>
  );
};

export default TokenManager;
