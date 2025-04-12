
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EstimatorProvider } from "@/contexts/EstimatorContext";
import Index from "./pages/Index";
import Estimate from "./pages/Estimate";
import Dashboard from "./pages/Dashboard";
import Optimize from "./pages/Optimize";
import Report from "./pages/Report";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <EstimatorProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/estimate" element={<Estimate />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/optimize" element={<Optimize />} />
            <Route path="/report" element={<Report />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EstimatorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
