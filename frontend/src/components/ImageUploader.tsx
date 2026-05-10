import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, ImageIcon, X, CheckCircle2 } from "lucide-react";

interface Props {
  file: File | null;
  preview: string | null;
  onFile: (file: File | null, preview: string | null) => void;
  disabled?: boolean;
}

export function ImageUploader({ file, preview, onFile, disabled }: Props) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: readonly { errors: readonly { message: string }[] }[]) => {
      setError(null);
      if (rejected?.length) {
        setError(rejected[0].errors[0]?.message ?? "File rejected");
        return;
      }
      const f = accepted[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => onFile(f, reader.result as string);
      reader.readAsDataURL(f);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
    disabled,
  });

  if (file && preview) {
    return (
      <div className="relative rounded-2xl border border-border bg-card shadow-soft p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-success/15 shrink-0">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">Image loaded</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Preview is shown in the <span className="font-medium text-foreground">Specimen View</span> panel.
              </p>
              <div className="mt-2 flex items-center gap-2 min-w-0">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary shrink-0">
                  <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            </div>
          </div>
          {!disabled && (
            <button
              onClick={() => onFile(null, null)}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors"
              aria-label="Remove selected image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer p-10 sm:p-14 text-center
          ${isDragActive
            ? "border-accent bg-accent/10 scale-[1.01]"
            : "border-border bg-card hover:border-ring/50 hover:bg-secondary/40"}
          ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand shadow-glow">
          <UploadCloud className="h-7 w-7 text-white" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-1">
          {isDragActive ? "Drop the image here" : "Upload histopathology image"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Drag & drop or <span className="text-foreground font-medium underline underline-offset-2">browse</span> — JPEG / PNG up to 25 MB
        </p>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
