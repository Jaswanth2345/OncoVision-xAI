import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";

const navItems = [
  { to: "/", label: "Predict" },
  { to: "/metrics", label: "Metrics" },
  { to: "/dataset", label: "Dataset" },
  { to: "/model", label: "Model" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-glow">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight">
              OncoVision <span className="text-gradient">XAI</span>
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wide uppercase">
              Histopathology AI
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors data-[status=active]:text-foreground data-[status=active]:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <details className="relative">
            <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-card shadow-elegant p-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary data-[status=active]:text-foreground data-[status=active]:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
