import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AssetPreloader } from "@/components/AssetPreloader";
import { TonConnectProvider } from "@/providers/TonConnectProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TonConnectButton } from "@/components/TonConnectButton";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  if (!assetsLoaded) {
    return <AssetPreloader onComplete={() => setAssetsLoaded(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider defaultOpen={false}>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  {/* Header with wallet connect */}
                  <header className="h-14 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50 px-4">
                    <SidebarTrigger />
                    <div className="shrink-0 max-w-[200px] overflow-hidden">
                      <TonConnectButton />
                    </div>
                  </header>
                  
                  {/* Main content */}
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/auth" element={<Auth />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </TonConnectProvider>
    </QueryClientProvider>
  );
};

export default App;
