import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, AlertCircle, FlaskConical, Info } from "lucide-react";
import { motion } from "framer-motion";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalyzingOverlay } from "@/components/AnalyzingOverlay";
import { ZoomableImage } from "@/components/ZoomableImage";
import { predictImage, isApiConfigured, toImageSrc, type PredictionResult } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Analysis Dashboard — OncoVision XAI" },
      { name: "description", content: "Upload histopathology images for automated malignancy prediction with Grad-CAM and Fusion IG explanations." },
      { property: "og:title", content: "OncoVision XAI — Analysis Dashboard" },
      { property: "og:description", content: "Explainable AI predictions for histopathology images." },
    ],
  }),
  component: PredictPage,
});

function PredictPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const onAnalyze = async () => {
    if (!file) return;
    if (!isApiConfigured()) {
      toast.error("Backend API URL not configured", {
        description: "Set VITE_API_URL in your .env file to your FastAPI server URL.",
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await predictImage(file);
      setResult(res);
      toast.success("Prediction complete", {
        description: `${res.prediction} • ${(res.confidence * 100).toFixed(2)}% confidence`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Prediction failed";
      toast.error("Prediction failed", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const isMalignant = result?.prediction.toLowerCase().includes("malig");
  const confidencePct = result ? Math.round(result.confidence * 1000) / 10 : 0;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Analysis Dashboard</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Upload digitized H&E stained histopathology images for automated malignancy prediction
            and region-of-interest highlighting.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">System Status</p>
          <p className="text-sm font-medium mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            Model V3.1 Online
          </p>
        </div>
      </div>

      {/* Upload */}
      <div className="rounded-2xl border border-border bg-card/40 p-3 mb-6 shadow-soft">
        <ImageUploader
          file={file}
          preview={preview}
          onFile={(f, p) => { setFile(f); setPreview(p); setResult(null); }}
          disabled={loading}
        />
      </div>

      {!isApiConfigured() && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-3 flex gap-2.5 text-sm mb-6">
          <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Backend not configured</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Add <code className="px-1 py-0.5 rounded bg-background border text-[11px]">VITE_API_URL=https://your-api</code> to your <code className="text-[11px]">.env</code> and restart.
            </p>
          </div>
        </div>
      )}

      {/* Specimen + Results */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold">Specimen View</h2>
            {file && (
              <span className="text-xs text-muted-foreground font-mono">{file.name}</span>
            )}
          </div>
          <ZoomableImage
            src={preview ?? ""}
            alt="Original histopathology specimen"
            emptyLabel="Upload an image to see the specimen view"
            downloadName="specimen.png"
            compact
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <FlaskConical className="h-3.5 w-3.5 text-primary" />
            </span>
            <h2 className="font-display text-base font-semibold">Analysis Results</h2>
          </div>

          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col"
            >
              <div className={`rounded-xl border p-5 text-center ${
                isMalignant
                  ? "border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5"
                  : "border-success/30 bg-gradient-to-br from-success/10 to-success/5"
              }`}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Primary Classification
                </p>
                <div className="flex items-center justify-center gap-2">
                  {isMalignant
                    ? <AlertTriangle className="h-6 w-6 text-destructive" />
                    : <CheckCircle2 className="h-6 w-6 text-success" />}
                  <h3 className={`font-display text-3xl font-bold capitalize ${isMalignant ? "text-destructive" : "text-success"}`}>
                    {result.prediction}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  CNN + ViT cross-attention fusion model
                </p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Confidence Score</span>
                  <span className="font-display font-bold text-lg">{confidencePct}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidencePct}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full gradient-brand"
                  />
                </div>
              </div>

              <button
                onClick={onAnalyze}
                disabled={!file || loading}
                className="mt-5 inline-flex items-center justify-center gap-2 h-11 rounded-xl gradient-brand text-white font-medium shadow-glow disabled:opacity-50 transition-transform hover:scale-[1.01]"
              >
                <FlaskConical className="h-4 w-4" /> Re-Analyze Image
              </button>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 rounded-xl border border-dashed border-border bg-muted/30 flex items-center justify-center text-center p-6 min-h-[180px]">
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Upload an image and click <span className="font-medium text-foreground">Analyze</span> to see prediction & confidence here.
                </p>
              </div>
              <button
                onClick={onAnalyze}
                disabled={!file || loading}
                className="mt-5 inline-flex items-center justify-center gap-2 h-11 rounded-xl gradient-brand text-white font-medium shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01]"
              >
                <FlaskConical className="h-4 w-4" /> Analyze Image
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="mb-4">
          <h2 className="font-display text-base font-semibold">Explainability Maps</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Grad-CAM and Fusion IG are shown side by side for direct comparison.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <ExplainCard
            title="Model Explainability (Grad-CAM)"
            subtitle="CNN class-activation map highlighting regions that drove the convolutional features."
            src={result ? toImageSrc(result.gradcam_image) : ""}
            loading={loading}
            downloadName="gradcam.png"
            info="The model focuses on densely packed nuclear regions. High intensity (red) correlates with irregular cell morphology typical of invasive structures."
          />
          <ExplainCard
            title="Fusion Integrated Gradients"
            subtitle="IG overlay computed after cross-attention fusion of CNN and ViT branches."
            src={result ? toImageSrc(result.fusion_ig_image) : ""}
            loading={loading}
            downloadName="fusion-ig.png"
            info="Fusion IG attributes contribution to both CNN-local and ViT-global tokens. Hot regions indicate areas where multi-scale evidence agreed on the prediction."
          />
        </div>
      </div>

      <AnalyzingOverlay open={loading} />
    </div>
  );
}

function ExplainCard({
  title, subtitle, src, loading, downloadName, info,
}: {
  title: string; subtitle: string; src: string; loading: boolean; downloadName: string; info: string;
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="space-y-4">
        <div>
          <ZoomableImage src={src} alt={title} loading={loading} downloadName={downloadName} compact />
        </div>
        <div>
          <div>
            <p className="text-xs font-medium mb-2">Attention Intensity</p>
            <div className="h-2 rounded-full" style={{ background: "linear-gradient(90deg, oklch(0.4 0.18 265), oklch(0.7 0.18 160), oklch(0.78 0.16 70), oklch(0.6 0.22 25))" }} />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>Low Importance</span>
              <span>High Importance</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Color intensity shows attribution magnitude (importance), not class label sign.
            </p>
          </div>
          <div className="rounded-xl bg-secondary/60 p-3 flex gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20">
              <Info className="h-3 w-3 text-success" />
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">{info}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
