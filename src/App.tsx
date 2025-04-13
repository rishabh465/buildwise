
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EstimatorProvider } from "@/contexts/EstimatorContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Estimate from "./pages/Estimate";
import Dashboard from "./pages/Dashboard";
import Optimize from "./pages/Optimize";
import Auth from "./pages/Auth";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <EstimatorProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/estimate" element={<Estimate />} />
              <Route path="/estimate/:projectId" element={<Estimate />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/:projectId" element={<Dashboard />} />
              <Route path="/optimize" element={<Optimize />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </EstimatorProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
