import React from "react";
import type { HistoryRecord } from "../../types/prediction";
import { formatBreedName } from "../../utils/formatters";
import { BarChart3, PieChart, TrendingUp, MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface AnalyticsChartsProps {
  history: HistoryRecord[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ history }) => {
  const { t } = useLanguage();

  if (!history || history.length === 0) {
    return null;
  }

  // 1. Cattle vs Buffalo calculation
  const cattleCount = history.filter(
    (h) => (h.species || "").toLowerCase() !== "buffalo"
  ).length;
  const buffaloCount = history.filter(
    (h) => (h.species || "").toLowerCase() === "buffalo"
  ).length;
  const total = history.length;
  const cattlePct = total > 0 ? Math.round((cattleCount / total) * 100) : 0;
  const buffaloPct = total > 0 ? 100 - cattlePct : 0;

  // 2. Most frequently identified breeds
  const breedCounts: Record<string, number> = {};
  history.forEach((h) => {
    const name = formatBreedName(h.breed) || "Unspecified";
    breedCounts[name] = (breedCounts[name] || 0) + 1;
  });

  const sortedBreeds = Object.entries(breedCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxBreedCount = sortedBreeds.length > 0 ? sortedBreeds[0][1] : 1;

  // 3. Monthly statistics (last 6 months)
  const monthMap: Record<string, number> = {};
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();

  // Initialize last 6 months
  const last6Months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mKey = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
    last6Months.push(mKey);
    monthMap[mKey] = 0;
  }

  history.forEach((h) => {
    try {
      const d = new Date(h.date || h.timestamp);
      if (!isNaN(d.getTime())) {
        const mKey = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
        if (monthMap[mKey] !== undefined) {
          monthMap[mKey]++;
        }
      }
    } catch (e) {
      // Ignore invalid dates
    }
  });

  const maxMonthCount = Math.max(...Object.values(monthMap), 1);

  // 4. Regional Distribution
  const regionCounts: Record<string, number> = {};
  history.forEach((h) => {
    if (h.region && h.region.trim()) {
      const primary = h.region.split(",")[0].trim();
      regionCounts[primary] = (regionCounts[primary] || 0) + 1;
    }
  });

  const sortedRegions = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Cattle vs Buffalo Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {t.cattleVsBuffalo}
                  </h3>
                  <p className="text-xs text-slate-500">Species classification split</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {total} Total
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="mt-4 space-y-2">
              <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden flex p-1 gap-1">
                <div
                  style={{ width: `${Math.max(cattlePct, 5)}%` }}
                  className="h-full bg-emerald-600 rounded-l-full transition-all duration-500 flex items-center justify-center text-white text-[10px] font-black"
                >
                  {cattlePct}%
                </div>
                <div
                  style={{ width: `${Math.max(buffaloPct, 5)}%` }}
                  className="h-full bg-teal-800 rounded-r-full transition-all duration-500 flex items-center justify-center text-white text-[10px] font-black"
                >
                  {buffaloPct}%
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span className="text-slate-800">Cattle (Cows/Oxen): {cattleCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-800" />
                  <span className="text-slate-800">Buffaloes: {buffaloCount}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
            Based on active computer vision scans recorded in your session.
          </p>
        </div>

        {/* Chart 2: Top Identified Breeds */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-700">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {t.topBreeds}
                </h3>
                <p className="text-xs text-slate-500">Most frequent candidate matches</p>
              </div>
            </div>

            <div className="space-y-3 mt-3">
              {sortedBreeds.map(([breed, count], idx) => {
                const pct = Math.round((count / maxBreedCount) * 100);
                return (
                  <div key={breed} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono text-[10px]">#{idx + 1}</span>
                        {breed}
                      </span>
                      <span className="text-emerald-800 font-mono font-bold">
                        {count} scan{count > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
            Prioritizes verified indigenous breeds under the ICAR-NBAGR classification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Monthly Scan Activity Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {t.monthlyTrend}
              </h3>
              <p className="text-xs text-slate-500">Scan throughput over time</p>
            </div>
          </div>

          <div className="h-40 flex items-end justify-between gap-3 pt-6 px-2">
            {last6Months.map((m) => {
              const val = monthMap[m] || 0;
              const barHeight = Math.max(Math.round((val / maxMonthCount) * 100), 12);
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600">
                    {val}
                  </span>
                  <div
                    style={{ height: `${barHeight}%` }}
                    className="w-full max-w-[36px] bg-emerald-600 hover:bg-emerald-500 rounded-t-lg transition-all"
                  />
                  <span className="text-[10px] font-medium text-slate-500 truncate w-full text-center">
                    {m}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: District & Regional Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Regional Distribution
              </h3>
              <p className="text-xs text-slate-500">Geographic origin of identified stock</p>
            </div>
          </div>

          {sortedRegions.length > 0 ? (
            <div className="space-y-3 mt-3">
              {sortedRegions.map(([reg, count]) => (
                <div
                  key={reg}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="font-bold text-slate-800">{reg}</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {count} animal{count > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-4 text-center py-8">
              Geographic tracts will populate automatically as animals are evaluated.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
