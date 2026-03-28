import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PickleDaasProvider } from "@/context/PickleDaasContext";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Highlights from "./pages/Highlights";
import PlayerDNA from "./pages/PlayerDNA";
import Brands from "./pages/Brands";
import VoiceLab from "./pages/VoiceLab";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PickleDaasProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Sidebar />
          <div className="md:ml-64 min-h-screen flex flex-col pb-16 md:pb-0">
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/highlights" element={<Highlights />} />
                <Route path="/player-dna" element={<PlayerDNA />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/voice-lab" element={<VoiceLab />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </PickleDaasProvider>
  </QueryClientProvider>
);

export default App;
