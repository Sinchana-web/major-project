import React from "react";
import { Tag, MapPin, Calendar, Layers, ShieldCheck, ChevronRight, Download } from "lucide-react";
import type { HistoryRecord } from "../../types/prediction";
import { formatBreedName, formatDate, formatPercentage } from "../../utils/formatters";
import { generatePassportPDF } from "../../utils/pdfGenerator";

interface HistoryCardProps {
  record: HistoryRecord;
  onClick: () => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ record, onClick }) => {
  const handlePdfDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    generatePassportPDF(record, record.imageUrl);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Top Tag & Confidence */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 flex items-center gap-1.5 truncate max-w-[200px]">
            <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{record.animal_id}</span>
          </span>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            {formatPercentage(record.confidence)}
          </span>
        </div>

        {/* Breed Name */}
        <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePdfDownload}
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            title="Download PDF Passport"
          >
            <Download className="w-4 h-4" />
          </button>
          <span className="text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
            Passport <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
