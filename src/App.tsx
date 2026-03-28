import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import TopNav from "./components/TopNav";
import Index from "./pages/Index";
import Highlights from "./pages/Highlights";
import PlayerDNA from "./pages/PlayerDNA";
import Brands from "./pages/Brands";
import VoiceLab from "./pages/VoiceLab";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TopNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/player-dna" element={<PlayerDNA />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/voice-lab" element={<VoiceLab />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
