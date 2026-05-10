import type { PredictionResult } from "@/lib/api";
import { toImageSrc } from "@/lib/api";
import { VisualizationCard } from "./VisualizationCard";
import { CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  result: PredictionResult;
  originalPreview: string;
}

export function ResultsPanel({ result, originalPreview }: Props) {
  const isMalignant = result.prediction.toLowerCase().includes("malig");
  const confidencePct = Math.round(result.confidence * 1000) / 10;

  const downloadJson = () => {
    const blob = new Blob(
      [JSON.stringify({ prediction: result.prediction, confidence: result.confidence }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "oncovision-result.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Prediction summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div
          className={`md:col-span-2 rounded-2xl p-6 shadow-soft border relative overflow-hidden ${
            isMalignant
              ? "bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30"
              : "bg-gradient-to-br from-success/10 to-success/5 border-success/30"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Prediction
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    isMalignant ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"
                  }`}
                >
                  {isMalignant ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                </span>
                <h2 className="font-display text-3xl font-bold capitalize">
                  {result.prediction}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Classified by the CNN + ViT cross-attention fusion model.
              </p>
            </div>
            <button
              onClick={downloadJson}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border bg-background/60 backdrop-blur hover:bg-background"
            >
              <Download className="h-3.5 w-3.5" /> JSON
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-card border border-border shadow-soft">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Confidence
          </p>
          <p className="font-display text-3xl font-bold text-gradient">{confidencePct}%</p>
          <div className="mt-4 h-2 w-full rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePct}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="h-full gradient-brand"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Model probability for the predicted class.
          </p>
        </div>
      </div>

      {/* Visualizations */}
      <div>
        <h3 className="font-display text-lg font-semibold mb-3">Explainability</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VisualizationCard
            title="Original"
            description="The uploaded histopathology image."
            src={originalPreview}
            badge="Input"
          />
          <VisualizationCard
            title="Grad-CAM"
            description="CNN class-activation map highlighting regions that drove the convolutional features."
            src={toImageSrc(result.gradcam_image)}
            badge="CNN"
          />
          <VisualizationCard
            title="Fusion IG"
            description="Integrated Gradients overlay computed after cross-attention fusion of CNN + ViT branches."
            src={toImageSrc(result.fusion_ig_image)}
            badge="Fusion"
          />
        </div>
      </div>
    </motion.div>
  );
}
