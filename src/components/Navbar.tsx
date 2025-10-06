import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, Package, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 overflow-x-hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Gift className="h-4 w-4 mr-2" />
              Open Boxes
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/inventory")}>
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </div>
          <div className="shrink-0">
            <span className="text-sm text-muted-foreground">⭐ Telegram Stars</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
