import React from "react";
import { Tag, MapPin, Calendar, Layers, ShieldCheck, ChevronRight } from "lucide-react";
import type { HistoryRecord } from "../../types/prediction";
import { formatBreedName, formatDate, formatPercentage } from "../../utils/formatters";

interface HistoryCardProps {
  record: HistoryRecord;
  onClick: () => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ record, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-brand-300 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Top Tag & Confidence */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-semibold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200/60 flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-brand-600" />
            {record.animal_id}
          </span>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            {formatPercentage(record.confidence)}
          </span>
        </div>

        {/* Breed Name */}
        <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-800 transition-colors">
          {formatBreedName(record.breed)}
        </h4>

        <div className="mt-3 space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Species: <strong className="text-slate-700 font-medium">{record.species}</strong></span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{record.region}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(record.date)}
        </span>
        <span className="text-brand-700 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
          View details <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
