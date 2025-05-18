
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DesignGeneration from "./pages/DesignGeneration";
import DesignPreferences from "./pages/DesignPreferences";
import DesignResultPage from "./pages/DesignResultPage";
import TokensPage from "./pages/TokensPage";
import PricingPage from "./pages/PricingPage";
import DesignsPage from "./pages/DesignsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/design-generation" element={<DesignGeneration />} />
          <Route path="/design-generation/:roomType" element={<DesignPreferences />} />
          <Route path="/design-generation/:roomType/result" element={<DesignResultPage />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/designs" element={<DesignsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
