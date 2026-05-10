import { createFileRoute } from "@tanstack/react-router";
import { Database, Layers, Microscope, Tag } from "lucide-react";

export const Route = createFileRoute("/dataset")({
  head: () => ({
    meta: [
      { title: "Dataset — OncoVision XAI" },
      {
        name: "description",
        content: "BreakHis breast cancer histopathology dataset overview: classes, magnifications, and image counts.",
      },
      { property: "og:title", content: "OncoVision XAI — Dataset" },
      { property: "og:description", content: "BreakHis dataset details used to train the OncoVision XAI model." },
    ],
  }),
  component: DatasetPage,
});

const stats = [
  { label: "Total images", value: "7,909", icon: Database },
  { label: "Classes", value: "2 (Benign / Malignant)", icon: Tag },
  { label: "Magnifications", value: "4 levels", icon: Layers },
  { label: "Patients", value: "82", icon: Microscope },
];

const magnifications = [
  { level: "40x", count: 1995, color: "oklch(0.55 0.22 285)" },
  { level: "100x", count: 2081, color: "oklch(0.6 0.2 260)" },
  { level: "200x", count: 2013, color: "oklch(0.65 0.18 230)" },
  { level: "400x", count: 1820, color: "oklch(0.78 0.14 200)" },
];

const subclasses = {
  Benign: ["Adenosis", "Fibroadenoma", "Phyllodes Tumor", "Tubular Adenoma"],
  Malignant: ["Ductal Carcinoma", "Lobular Carcinoma", "Mucinous Carcinoma", "Papillary Carcinoma"],
};

function DatasetPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
      <div className="max-w-2xl mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Data</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">BreakHis dataset</h1>
        <p className="text-muted-foreground mt-3">
          The Breast Cancer Histopathological Image Classification (BreakHis) dataset: microscopic
          biopsy images of benign and malignant breast tumors collected at four magnifications.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary mb-3">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </span>
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold mb-4">Magnification distribution</h2>
          <div className="space-y-4">
            {magnifications.map((m) => {
              const max = Math.max(...magnifications.map((x) => x.count));
              const pct = (m.count / max) * 100;
              return (
                <div key={m.level}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">{m.level}</span>
                    <span className="text-muted-foreground">{m.count.toLocaleString()} images</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: m.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold mb-4">Tumor subtypes</h2>
          <div className="space-y-5">
            {Object.entries(subclasses).map(([cls, subs]) => (
              <div key={cls}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`h-2 w-2 rounded-full ${cls === "Benign" ? "bg-success" : "bg-destructive"}`} />
                  <h3 className="font-semibold text-sm">{cls}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subs.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold mb-2">Acquisition</h2>
        <p className="text-sm text-muted-foreground">
          Slides were stained with hematoxylin and eosin (H&E) and digitized using a digital camera mounted on
          an optical microscope. Each sample is provided at 40×, 100×, 200×, and 400× magnifications, giving
          multi-scale views of the same tissue region — the basis for our scale-aware embedding.
        </p>
      </div>
    </div>
  );
}
