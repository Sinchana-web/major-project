import React from "react";
import { Info, BookOpen } from "lucide-react";

interface BreedDescriptionProps {
  breed: string;
  description: string;
}

export const BreedDescription: React.FC<BreedDescriptionProps> = ({
  breed,
  description,
}) => {
  return (
    <div className="bg-gradient-to-br from-brand-900/5 to-slate-50 rounded-2xl p-6 border border-brand-200/60 shadow-xs">
      <div className="flex items-center gap-2 mb-3 text-brand-900">
        <div className="p-2 rounded-xl bg-brand-100/80 text-brand-800">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 leading-tight">
            About {breed}
          </h4>
          <p className="text-xs text-brand-700 font-medium">
            Agricultural & Ecological Profile
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed font-normal bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-slate-200/50">
        {description ||
          "No specific breed description available for this livestock entry."}
      </p>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>Source: National Bureau of Animal Genetic Resources (NBAGR) Catalog</span>
      </div>
    </div>
  );
};
