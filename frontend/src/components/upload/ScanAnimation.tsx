import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Sparkles, Cpu } from "lucide-react";

interface ScanAnimationProps {
  imageFile: File;
}

const STAGES = [
  "Preparing image...",
  "Detecting animal...",
  "Analyzing visual features...",
  "Identifying breed...",
  "Generating livestock record...",
];

export const ScanAnimation: React.FC<ScanAnimationProps> = ({ imageFile }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-10 text-center">
      <div className="flex flex-col items-center">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/70 text-brand-800 text-xs font-semibold mb-6">
          <Cpu className="w-3.5 h-3.5 text-brand-600 animate-spin" />
          <span>YOLOv8 + MobileNetV2 Neural Engine</span>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-1">
          Analyzing Image
        </h3>
        <p className="text-sm text-slate-500 mb-8">
          Please wait while our computer vision pipeline evaluates the livestock sample.
        </p>

        {/* Animated Image Scanner Box */}
        <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden border-2 border-brand-500/40 shadow-inner bg-slate-900 mb-8">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Scanning Target"
              className="w-full h-full object-cover opacity-90"
            />
          )}

          {/* Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle, #22c55e 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Laser Scanning Line */}
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#22c55e]"
            animate={{
              top: ["0%", "96%", "0%"],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Corner Bounding Box Indicators */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400"></div>

          {/* Live AI Detection Label */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-mono text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <Scan className="w-3.5 h-3.5 animate-pulse" />
            <span>EXTRACTING FEATURE MAPS</span>
          </div>
        </div>

        {/* Animated Text Stages */}
        <div className="w-full max-w-md bg-slate-50 rounded-2xl p-4 border border-slate-200/70">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-4 h-4 text-brand-700 animate-bounce" />
            <div className="h-6 overflow-hidden relative w-64 text-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={stageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="font-semibold text-slate-800 text-sm block"
                >
                  {STAGES[stageIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="bg-brand-700 h-full rounded-full"
              initial={{ width: "10%" }}
              animate={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
