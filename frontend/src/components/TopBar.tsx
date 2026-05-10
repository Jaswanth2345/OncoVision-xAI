import { Link } from "@tanstack/react-router";
import { Bell, Settings, Activity } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
              <Activity className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display font-bold text-sm">OncoVision <span className="text-gradient">XAI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            <span className="font-display font-semibold text-primary">OncoVision AI</span>
            <span className="h-5 w-px bg-border" />
            <span className="text-sm text-muted-foreground">Histopathology Analysis</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Settings className="h-4 w-4" />
          </button>
          <span className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-semibold shadow-glow">
            DR
          </span>
        </div>
      </div>
    </header>
  );
}
