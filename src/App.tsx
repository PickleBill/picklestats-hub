import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PickleDaasProvider } from "@/context/PickleDaasContext";
import { TMNTProvider } from "@/context/TMNTContext";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import PizzaEasterEgg from "./components/PizzaEasterEgg";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import Index from "./pages/Index";
import Highlights from "./pages/Highlights";
import PlayerDNA from "./pages/PlayerDNA";
import Brands from "./pages/Brands";
import Sports from "./pages/Sports";
import VoiceLab from "./pages/VoiceLab";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PickleDaasProvider>
      <TMNTProvider>
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
                  <Route path="/sports" element={<Sports />} />
                  <Route path="/voice-lab" element={<VoiceLab />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <PizzaEasterEgg />
          </BrowserRouter>
        </TooltipProvider>
      </TMNTProvider>
    </PickleDaasProvider>
  </QueryClientProvider>
);

export default App;
