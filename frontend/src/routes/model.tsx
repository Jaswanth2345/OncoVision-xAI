import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Layers3, GitMerge, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/model")({
  head: () => ({
    meta: [
      { title: "Model - OncoVision XAI" },
      {
        name: "description",
        content: "Architecture of OncoVision XAI: ResNet50 CNN + Vision Transformer with cross-attention fusion.",
      },
      { property: "og:title", content: "OncoVision XAI - Architecture" },
      { property: "og:description", content: "CNN + ViT cross-attention fusion architecture for histopathology classification." },
    ],
  }),
  component: ModelPage,
});

function Block({
  title,
  subtitle,
  icon: Icon,
  tone = "primary",
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "accent" | "violet" | "fusion";
}) {
  const tones = {
    primary: "from-primary/10 to-primary/5 border-primary/20",
    accent: "from-accent/15 to-accent/5 border-accent/30",
    violet: "from-chart-5/15 to-chart-5/5 border-chart-5/30",
    fusion: "gradient-brand text-white border-transparent shadow-glow",
  };
  const isFusion = tone === "fusion";
  return (
    <div className={`rounded-2xl border p-5 min-w-[180px] flex-1 ${isFusion ? tones.fusion : `bg-gradient-to-br ${tones[tone]}`}`}>
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${isFusion ? "bg-white/20" : "bg-card"}`}>
        <Icon className={`h-4 w-4 ${isFusion ? "text-white" : "text-foreground"}`} />
      </span>
      <h3 className={`font-display font-semibold ${isFusion ? "text-white" : "text-foreground"}`}>{title}</h3>
      <p className={`text-xs mt-1 ${isFusion ? "text-white/80" : "text-muted-foreground"}`}>{subtitle}</p>
    </div>
  );
}

function ArrowConnector({ vertical = false }: { vertical?: boolean }) {
  return (
    <div className={`flex items-center justify-center text-muted-foreground ${vertical ? "py-2 rotate-90 md:rotate-0" : ""}`}>
      <ArrowRight className="h-5 w-5" />
    </div>
  );
}

function ModelPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
      <div className="max-w-2xl mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Architecture</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">CNN + ViT cross-attention fusion</h1>
        <p className="text-muted-foreground mt-3">
          A hybrid model combining a convolutional backbone for local texture features and a Vision
          Transformer for long-range context, fused via cross-attention for final classification.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-soft mb-10">
        <h2 className="font-display text-lg font-semibold mb-6">Architecture flow</h2>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <Block title="Input image" subtitle="H&E histopathology image" icon={Layers3} tone="primary" />
          <ArrowConnector />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Block title="ResNet50 (CNN)" subtitle="Local convolutional features" icon={Cpu} tone="accent" />
            <Block title="Vision Transformer" subtitle="Global self-attention tokens" icon={Sparkles} tone="violet" />
          </div>
          <ArrowConnector />
          <Block title="Cross-attention fusion" subtitle="CNN <-> ViT token interaction" icon={GitMerge} tone="fusion" />
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3">
          <Block title="Fused token representation" subtitle="Joint CNN + ViT features" icon={Layers3} tone="primary" />
          <ArrowConnector />
          <Block title="Hybrid classifier head" subtitle="MLP -> Benign / Malignant" icon={Cpu} tone="accent" />
          <ArrowConnector />
          <Block title="Explainability" subtitle="Grad-CAM (CNN) + IG (Fusion)" icon={Sparkles} tone="violet" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            title: "Cross-attention fusion",
            body: "CNN feature maps and ViT tokens attend to each other through a bidirectional cross-attention block, mixing local texture with global context.",
          },
          {
            title: "Fused token classifier",
            body: "The fused representation is pooled and passed through an MLP head to produce the final benign vs malignant probability.",
          },
          {
            title: "Hybrid explainability",
            body: "Grad-CAM exposes CNN saliency, while Integrated Gradients on the fused representation reveals what drove the final fused decision.",
          },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="font-display font-semibold mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
