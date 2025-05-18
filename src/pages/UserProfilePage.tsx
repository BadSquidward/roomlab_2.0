
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Coins, ArrowRight } from "lucide-react";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState({
    name: "",
    tokens: 0,
  });
  
  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        name: parsedUser.name || "User",
        tokens: parsedUser.tokens || 0,
      });
    } else {
      // Redirect to login if no user data is found
      toast({
        title: "Login Required",
        description: "Please log in to access your profile",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  const handleGenerateClick = () => {
    // Check if user has enough tokens
    if (user.tokens <= 0) {
      toast({
        title: "No tokens available",
        description: "Please purchase tokens to generate designs",
        variant: "destructive"
      });
      navigate("/tokens");
      return;
    }
    
    // Navigate to the design generation flow
    navigate("/design-generation");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Hi {user.name}!</h1>
            <p className="text-muted-foreground">
              Welcome to your design studio. Create beautiful interior designs with just a few clicks.
            </p>
          </div>
          
          {/* Token display */}
          <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-blue-50">
            <CardContent className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-brand-100">
                  <Coins className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Your Design Tokens</h3>
                  <p className="text-sm text-muted-foreground">
                    Use tokens to generate new designs
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-3xl font-bold text-brand-600">{user.tokens}</span>
                {user.tokens <= 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs border-brand-200 text-brand-600"
                    onClick={() => navigate("/tokens")}
                  >
                    Buy Tokens
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Start Generate button */}
          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleGenerateClick} 
              size="lg" 
              className="gap-2"
            >
              Start Generate
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Recent designs section - placeholder for future feature */}
          <div className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Your Recent Designs</h2>
            <div className="bg-muted/50 rounded-lg p-12 flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">
                Your design history will appear here after you create your first design.
              </p>
              <Button 
                variant="link" 
                onClick={handleGenerateClick} 
                className="mt-2"
              >
                Create your first design
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
