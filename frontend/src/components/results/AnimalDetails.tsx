import React, { useState } from "react";
import {
  Tag,
  Copy,
  Check,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import type { PredictionResult } from "../../types/prediction";
import { formatBreedName, formatDate } from "../../utils/formatters";

interface AnimalDetailsProps {
  result: PredictionResult;
}

export const AnimalDetails: React.FC<AnimalDetailsProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (result.animal_id) {
      navigator.clipboard.writeText(result.animal_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const details = [
    {
      label: "Animal Tag ID",
      value: result.animal_id || "N/A",
      icon: Tag,
      action: (
        <button
          onClick={handleCopyId}
          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-800 hover:bg-brand-50 transition-colors flex items-center gap-1 text-xs no-print"
          title="Copy Animal ID"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      ),
    },
    {
      label: "Species",
      value: result.species || "Cattle",
      icon: Layers,
    },
    {
      label: "Identified Breed",
      value: formatBreedName(result.breed),
      icon: Sparkles,
      highlight: true,
    },
    {
      label: "Origin / Region",
      value: result.region || "India",
      icon: MapPin,
    },
    {
      label: "Scan Date",
      value: formatDate(result.date),
      icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {details.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`p-4 rounded-2xl border transition-all ${
              item.highlight
                ? "bg-brand-50/60 border-brand-200/80 shadow-xs"
                : "bg-white border-slate-200/70"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-brand-700" />
                {item.label}
              </span>
              {item.action}
            </div>
            <p
              className={`text-base font-bold truncate ${
                item.highlight ? "text-brand-950" : "text-slate-900"
              }`}
            >
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};
