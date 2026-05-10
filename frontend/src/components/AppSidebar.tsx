import { Link, useLocation } from "@tanstack/react-router";
import { Microscope, BarChart3, Database, Cpu, LifeBuoy, Plus, Activity } from "lucide-react";

const navItems = [
  { to: "/", label: "New Scan", icon: Microscope },
  { to: "/metrics", label: "Model Metrics", icon: BarChart3 },
  { to: "/dataset", label: "Dataset", icon: Database },
  { to: "/model", label: "Architecture", icon: Cpu },
] as const;

export function AppSidebar() {
  const location = useLocation();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-sidebar">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-glow">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <p className="font-display font-bold text-base">OncoVision <span className="text-gradient">XAI</span></p>
            <p className="text-[11px] text-muted-foreground">Pathology Lab v2.4</p>
          </div>
        </Link>
      </div>

      <div className="p-4">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl gradient-brand text-white text-sm font-medium shadow-glow hover:scale-[1.01] transition-transform"
        >
          <Plus className="h-4 w-4" /> Start New Exam
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 cursor-pointer">
          <LifeBuoy className="h-4 w-4" /> Support
        </a>
        <p className="px-3 pt-2 text-[10px] text-muted-foreground/70">
          Research prototype. Not a medical device.
        </p>
      </div>
    </aside>
  );
}
