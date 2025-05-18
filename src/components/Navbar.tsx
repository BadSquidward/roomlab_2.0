
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get user info from localStorage - in a real app this would come from auth context
  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const isAuthenticated = !!userInfo;
  const userTokens = userInfo?.tokens || 0;
  const userName = userInfo?.name || '';
  
  const handleStartDesigning = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please sign in to start designing",
      });
      navigate("/login");
      return;
    }
    
    navigate("/design-generation");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-sm font-medium hover:text-brand-600 transition-colors">
            Home
          </Link>
          <Link to="/designs" className="text-sm font-medium hover:text-brand-600 transition-colors">
            Popular Designs
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-brand-600 transition-colors">
            Pricing
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600">
                <span className="text-xs font-semibold">{userTokens} tokens</span>
              </div>
              <Button asChild variant="ghost" className="text-sm flex items-center gap-2">
                <Link to="/profile">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{userName}</span>
                </Link>
              </Button>
              <Button asChild onClick={handleStartDesigning}>
                <Link to="/design-generation">Create Design</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
