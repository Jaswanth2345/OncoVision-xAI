import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Target, Activity, ShieldCheck, Crosshair, Gauge } from "lucide-react";

export const Route = createFileRoute("/metrics")({
  head: () => ({
    meta: [
      { title: "Metrics — OncoVision XAI" },
      {
        name: "description",
        content: "Model performance: accuracy, AUC, sensitivity, specificity, F1-score, and cross-magnification results.",
      },
      { property: "og:title", content: "OncoVision XAI — Model Metrics" },
      { property: "og:description", content: "Performance metrics across magnification levels for the CNN+ViT fusion model." },
    ],
  }),
  component: MetricsPage,
});

const overall = [
  { label: "Accuracy", value: "94.21%", icon: Target, hint: "Overall classification accuracy" },
  { label: "AUC", value: "0.9871", icon: Activity, hint: "Area under ROC curve" },
  { label: "Sensitivity", value: "96.34%", icon: Crosshair, hint: "True positive rate (recall)" },
  { label: "Specificity", value: "91.93%", icon: ShieldCheck, hint: "True negative rate" },
  { label: "F1-score", value: "94.52%", icon: Gauge, hint: "Harmonic mean of precision & recall" },
];

const magnifications = [
  { mag: "40x", Accuracy: 90.73 },
  { mag: "100x", Accuracy: 95.62 },
  { mag: "200x", Accuracy: 97.12 },
  { mag: "400x", Accuracy: 93.83 },
];

const radar = [
  { metric: "Accuracy", value: 94.21 },
  { metric: "AUC", value: 98.71 },
  { metric: "Sensitivity", value: 96.34 },
  { metric: "Specificity", value: 91.93 },
  { metric: "F1-score", value: 94.52 },
];

function MetricsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
      <div className="max-w-2xl mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Performance</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Model metrics</h1>
        <p className="text-muted-foreground mt-3">
          Hybrid CNN-ViT (Cross-Attention) — evaluation on the held-out BreakHis test split.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {overall.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </span>
              <span className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">{label}</span>
            </div>
            <p className="font-display text-3xl font-bold text-gradient">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Cross-magnification accuracy</h2>
              <p className="text-sm text-muted-foreground">Accuracy across BreakHis magnification levels.</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={magnifications} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" />
                <XAxis dataKey="mag" stroke="oklch(0.5 0.03 260)" fontSize={12} />
                <YAxis domain={[85, 100]} stroke="oklch(0.5 0.03 260)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 250)", fontSize: 12 }} />
                <Bar dataKey="Accuracy" fill="oklch(0.55 0.22 285)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold mb-1">Metric profile</h2>
            <p className="text-sm text-muted-foreground mb-4">Balanced performance across all metrics.</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar}>
                  <PolarGrid stroke="oklch(0.92 0.01 250)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "oklch(0.4 0.04 260)" }} />
                  <PolarRadiusAxis angle={30} domain={[80, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    dataKey="value"
                    stroke="oklch(0.55 0.22 285)"
                    fill="oklch(0.55 0.22 285)"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}
