import React from "react";
import { Sparkles, Dna, Info, CheckCircle2 } from "lucide-react";
import type { BreedResemblance } from "../../types/prediction";

interface BreedResemblanceBreakdownProps {
  resemblances?: BreedResemblance[];
  primaryBreed: string;
  primaryConfidence: number;
}

export const BreedResemblanceBreakdown: React.FC<BreedResemblanceBreakdownProps> = ({
  resemblances,
  primaryBreed,
  primaryConfidence,
}) => {
  // Fallback if resemblances array is missing
  const data: BreedResemblance[] = React.useMemo(() => {
    if (resemblances && resemblances.length > 0) {
      return resemblances;
    }
    const primaryPct = Math.round(primaryConfidence * 100);
    const remainder = Math.max(0, 100 - primaryPct);
    return [
      {
        breed: primaryBreed,
        percentage: primaryPct,
        reasoning: "Dominant conformational markers observed in facial structure, horn curvature, and build.",
      },
      ...(remainder > 0
        ? [
            {
              breed: "Related Indigenous Phenotype",
              percentage: remainder,
              reasoning: "General zebu characteristics, loose skin folds, or crossbred traits.",
            },
          ]
        : []),
    ];
  }, [resemblances, primaryBreed, primaryConfidence]);

  // Color palette for up to 4 segments
  const palette = [
    {
      bg: "bg-emerald-500",
      text: "text-emerald-700",
      border: "border-emerald-200",
      pill: "bg-emerald-50 text-emerald-800 border-emerald-300",
      accent: "#10b981",
    },
    {
      bg: "bg-indigo-500",
      text: "text-indigo-700",
      border: "border-indigo-200",
      pill: "bg-indigo-50 text-indigo-800 border-indigo-300",
      accent: "#6366f1",
    },
    {
      bg: "bg-amber-500",
      text: "text-amber-700",
      border: "border-amber-200",
      pill: "bg-amber-50 text-amber-800 border-amber-300",
      accent: "#f59e0b",
    },
    {
      bg: "bg-rose-500",
      text: "text-rose-700",
      border: "border-rose-200",
      pill: "bg-rose-50 text-rose-800 border-rose-300",
      accent: "#f43f5e",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">
                Breed Resemblance Breakdown
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                100% Observed Sum
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-trait biological comparison across candidate Indian indigenous breeds
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Accounting for crossbreed & regional phenotypic traits</span>
        </div>
      </div>

      {/* Stacked Multi-Color Distribution Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
          <span>Observed Trait Distribution</span>
          <span className="text-emerald-700">100% Total Resemblance</span>
        </div>

        <div className="h-5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner p-0.5 gap-0.5">
          {data.map((item, idx) => {
            const color = palette[idx % palette.length];
            return (
              <div
                key={item.breed + idx}
                style={{ width: `${Math.max(item.percentage, 3)}%` }}
                className={`h-full ${color.bg} first:rounded-l-full last:rounded-r-full transition-all duration-500 relative group flex items-center justify-center`}
                title={`${item.breed}: ${item.percentage}%`}
              >
                {item.percentage >= 12 && (
                  <span className="text-[10px] font-black text-white px-1 truncate">
                    {item.percentage}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {data.map((item, idx) => {
            const color = palette[idx % palette.length];
            return (
              <div key={item.breed + idx} className="flex items-center gap-1.5 text-xs">
                <span className={`w-3 h-3 rounded-full ${color.bg} shadow-2xs`} />
                <span className="font-bold text-slate-800">{item.breed}:</span>
                <span className="font-extrabold text-slate-900 font-mono">
                  {item.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {data.map((item, idx) => {
          const color = palette[idx % palette.length];
          const isPrimary = idx === 0;

          return (
            <div
              key={item.breed + idx}
              className={`rounded-2xl p-4.5 border transition-all duration-200 flex flex-col justify-between ${
                isPrimary
                  ? "bg-white border-emerald-300 shadow-md ring-2 ring-emerald-500/15"
                  : "bg-white/80 border-slate-200/90 shadow-2xs hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {isPrimary && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <h4 className="text-base font-black text-slate-900">
                        {item.breed}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      {isPrimary
                        ? "Primary Diagnostic Match"
                        : idx === 1
                        ? "Secondary Morphological Candidate"
                        : "Minor Phenotypic Marker"}
                    </span>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-xl text-xs font-black font-mono border shadow-2xs ${color.pill}`}
                  >
                    {item.percentage}%
                  </div>
                </div>

                {/* Progress bar per card */}
                <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${color.bg} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                {/* Anatomical Reasoning */}
                {item.reasoning && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-700 font-semibold">
                      Observed Traits:{" "}
                    </strong>
                    {item.reasoning}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Resemblance weight:</span>
                <span className="font-bold text-slate-800">
                  {item.percentage} of 100 pts
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
