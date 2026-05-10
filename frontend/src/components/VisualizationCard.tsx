import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ZoomIn, Download } from "lucide-react";

interface Props {
  title: string;
  description: string;
  src: string;
  badge?: string;
}

export function VisualizationCard({ title, description, src, badge }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="group relative rounded-2xl border border-border bg-card shadow-soft overflow-hidden transition-all hover:shadow-elegant hover:-translate-y-0.5">
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-sm font-semibold">{title}</h4>
            {badge && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase tracking-wide">
                {badge}
              </span>
            )}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <span className="sr-only">Info</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[220px] text-xs">
              {description}
            </TooltipContent>
          </Tooltip>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="block w-full aspect-square bg-muted relative overflow-hidden cursor-zoom-in">
              {src ? (
                <img src={src} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur rounded-full p-2 shadow-soft">
                  <ZoomIn className="h-4 w-4" />
                </span>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold">{title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
              {src && (
                <a
                  href={src}
                  download={`${title.toLowerCase().replace(/\s+/g, "-")}.png`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-secondary"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              )}
            </div>
            <div className="bg-muted flex items-center justify-center max-h-[75vh] overflow-auto">
              {src && <img src={src} alt={title} className="max-w-full" />}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
