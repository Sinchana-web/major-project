import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye } from "lucide-react";
import { formatPercentage } from "../../utils/formatters";

interface ConfidenceCardProps {
  confidence: number;
  detectionConfidence: number;
}

export const ConfidenceCard: React.FC<ConfidenceCardProps> = ({
  confidence,
  detectionConfidence,
}) => {
  const breedPct = confidence > 1 ? confidence : confidence * 100;
  const detectPct =
    detectionConfidence > 1 ? detectionConfidence : detectionConfidence * 100;

  // SVG Circular progress values
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (breedPct / 100) * circumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Breed Recognition Confidence - Circular */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex items-center gap-4">
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 84 84">
            <circle
              cx="42"
              cy="42"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              className="text-slate-200"
              fill="transparent"
            />
            <motion.circle
              cx="42"
              cy="42"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              className="text-brand-700"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-900 text-xs">
            {breedPct.toFixed(1)}%
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Breed Match</span>
          </div>
          <p className="text-xl font-bold text-slate-900">
            {formatPercentage(confidence)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Model classification certainty
          </p>
        </div>
      </div>

      {/* Animal Detection Confidence - Horizontal Bar */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-800 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5" />
              <span>YOLO Detection</span>
            </div>
            <span className="text-xs font-bold text-slate-900">
              {formatPercentage(detectionConfidence)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Animal bounding box confidence
          </p>
        </div>

        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
          <motion.div
            className="bg-brand-600 h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${detectPct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};
