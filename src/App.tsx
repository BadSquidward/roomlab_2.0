
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UserProfilePage from "./pages/UserProfilePage";
import DesignGeneration from "./pages/DesignGeneration";
import DesignPreferences from "./pages/DesignPreferences";
import DesignResultPage from "./pages/DesignResultPage";
import TokensPage from "./pages/TokensPage";
import PricingPage from "./pages/PricingPage";
import DesignsPage from "./pages/DesignsPage";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('user');
  
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page with return url
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location]);
  
  return isAuthenticated ? <>{children}</> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/designs" element={<DesignsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          
          {/* Protected routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/design-generation" 
            element={
              <ProtectedRoute>
                <DesignGeneration />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/design-generation/:roomType" 
            element={
              <ProtectedRoute>
                <DesignPreferences />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/design-generation/:roomType/result" 
            element={
              <ProtectedRoute>
                <DesignResultPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tokens" 
            element={
              <ProtectedRoute>
                <TokensPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
