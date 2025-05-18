
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  // Placeholder for authentication state
  const isAuthenticated = false;
  const userTokens = 3;

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
              <Button asChild variant="ghost" className="text-sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
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
