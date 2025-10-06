import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AssetPreloader } from "@/components/AssetPreloader";
import { BottomDock } from "@/components/BottomDock";
import { initializeTelegramWebApp } from "@/lib/telegram";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Initialize Telegram WebApp
  React.useEffect(() => {
    initializeTelegramWebApp();
  }, []);

  if (!assetsLoaded) {
    return <AssetPreloader onComplete={() => setAssetsLoaded(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col w-full">
            {/* Header - simplified without wallet connect */}
            <header className="h-14 flex items-center justify-center border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50 px-4">
              <h1 className="text-xl font-bold text-primary">⭐ Pullemon</h1>
            </header>
            
            {/* Main content with bottom padding for dock */}
            <main className="flex-1 pb-20">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/auth" element={<Auth />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Bottom Navigation Dock */}
            <BottomDock />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
