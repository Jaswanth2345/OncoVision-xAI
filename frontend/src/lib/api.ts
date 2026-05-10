// Backend API client for OncoVision XAI
// Set VITE_API_URL in your .env file (e.g. VITE_API_URL=http://localhost:8000)

export interface PredictionResult {
  prediction: string;
  confidence: number;
  gradcam_image: string; // base64 data URL or raw base64
  fusion_ig_image: string;
}

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export function isApiConfigured() {
  return Boolean(API_URL);
}

export function getApiUrl() {
  return API_URL;
}

export async function predictImage(file: File): Promise<PredictionResult> {
  if (!API_URL) {
    throw new Error(
      "Backend API URL is not configured. Set VITE_API_URL in your .env file."
    );
  }
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL.replace(/\/$/, "")}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  return (await res.json()) as PredictionResult;
}

export function toImageSrc(value: string): string {
  if (!value) return "";
  if (value.startsWith("data:")) return value;
  if (value.startsWith("http")) return value;
  // Assume raw base64 PNG
  return `data:image/png;base64,${value}`;
}
