import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STAGES = [
  "Extracting CNN features…",
  "Processing transformer attention…",
  "Fusing representations…",
  "Generating explanations…",
];

export function AnalyzingOverlay({ open }: { open: boolean }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!open) {
      setStage(0);
      return;
    }
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 1800);
    return () => clearInterval(id);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="glass shadow-elegant rounded-3xl px-10 py-12 max-w-md w-[92%] text-center"
          >
            <div className="relative mx-auto mb-6 h-20 w-20">
              <div className="absolute inset-0 rounded-full gradient-brand opacity-30 blur-xl animate-pulse" />
              <div className="relative h-full w-full rounded-full gradient-brand flex items-center justify-center shadow-glow">
                <Loader2 className="h-9 w-9 text-white animate-spin" strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              Analyzing histopathology image…
            </h3>
            <div className="h-6 relative">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-sm text-muted-foreground absolute inset-x-0"
                >
                  {STAGES[stage]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-6 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full gradient-brand"
                initial={{ width: "5%" }}
                animate={{ width: ["5%", "85%", "60%", "95%"] }}
                transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
