
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Transform your spaces with AI-generated interior designs tailored to your preferences.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/design-generation" className="text-muted-foreground text-sm hover:text-brand-600">
                  Room Design
                </Link>
              </li>
              <li>
                <Link to="/designs" className="text-muted-foreground text-sm hover:text-brand-600">
                  Popular Designs
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground text-sm hover:text-brand-600">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground text-sm hover:text-brand-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground text-sm hover:text-brand-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground text-sm hover:text-brand-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground text-sm hover:text-brand-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t">
          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} DesignLab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
