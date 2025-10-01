import { Gift, Package, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const dockItems = [
  { title: "Open Boxes", url: "/", icon: Gift },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Admin", url: "/admin", icon: Settings },
];

export function BottomDock() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 py-3">
          {dockItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
