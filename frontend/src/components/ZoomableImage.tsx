import { useRef, useState, useCallback } from "react";
import { ZoomIn, ZoomOut, Maximize2, Download, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  src: string;
  alt: string;
  loading?: boolean;
  emptyLabel?: string;
  downloadName?: string;
  compact?: boolean;
}

export function ZoomableImage({
  src,
  alt,
  loading,
  emptyLabel = "Awaiting analysis",
  downloadName = "image.png",
  compact = false,
}: Props) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    dragging.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    setPos({ x: e.clientX - dragging.current.x, y: e.clientY - dragging.current.y });
  };
  const onMouseUp = () => (dragging.current = null);

  const reset = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  const zoomIn = () => setScale((s) => Math.min(s + 0.5, 5));
  const zoomOut = () =>
    setScale((s) => {
      const next = Math.max(s - 0.5, 1);
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });

  return (
    <div className={`relative rounded-xl bg-muted overflow-hidden group ${compact ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full gradient-brand opacity-30 blur-md animate-pulse" />
            <div className="relative h-full w-full rounded-full gradient-brand flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground animate-pulse">Generating…</p>
        </div>
      ) : src ? (
        <>
          <div
            className="absolute inset-0 overflow-hidden"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            style={{ cursor: scale > 1 ? (dragging.current ? "grabbing" : "grab") : "zoom-in" }}
            onDoubleClick={() => (scale === 1 ? setScale(2) : reset())}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="w-full h-full object-contain select-none transition-transform duration-150"
              style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transformOrigin: "center" }}
            />
          </div>

          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-background/90 backdrop-blur p-1 shadow-soft border border-border opacity-90">
            <button onClick={zoomOut} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground" aria-label="Zoom out">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-medium text-muted-foreground w-8 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={zoomIn} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground" aria-label="Zoom in">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground" aria-label="Fullscreen">
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl p-0 overflow-hidden">
                <div className="p-3 border-b flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm">{alt}</h3>
                  <a
                    href={src}
                    download={downloadName}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-secondary"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                </div>
                <div className="bg-muted flex items-center justify-center max-h-[80vh] overflow-auto">
                  <img src={src} alt={alt} className="max-w-full" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-center p-6">
          <p className="text-xs text-muted-foreground">{emptyLabel}</p>
        </div>
      )}
    </div>
  );
}
