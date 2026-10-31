import React, { useState } from "react";
import { INDIAN_BREED_DATABASE, type BreedCatalogItem } from "../data/breedDatabase";
import { useLanguage } from "../context/LanguageContext";
import { GitCompare, Plus, X, Milk, Tractor, MapPin, Sparkles } from "lucide-react";

export const BreedComparison: React.FC = () => {
  const { t } = useLanguage();

  // Initial selection: 2 well-known breeds (Hallikar & Gir)
  const [selectedBreedIds, setSelectedBreedIds] = useState<string[]>([
    "hallikar",
    "gir",
  ]);

  const [filterSpecies, setFilterSpecies] = useState<"ALL" | "Cattle" | "Buffalo">("ALL");

  const availableBreeds = INDIAN_BREED_DATABASE.filter((b) => {
    if (filterSpecies === "ALL") return true;
    return b.species === filterSpecies;
  });

  const selectedBreeds: BreedCatalogItem[] = selectedBreedIds
    .map((id) => INDIAN_BREED_DATABASE.find((b) => b.id === id))
    .filter((b): b is BreedCatalogItem => Boolean(b));

  const addBreed = (id: string) => {
    if (selectedBreedIds.length < 3 && !selectedBreedIds.includes(id)) {
      setSelectedBreedIds([...selectedBreedIds, id]);
    }
  };

  const removeBreed = (id: string) => {
    if (selectedBreedIds.length > 1) {
      setSelectedBreedIds(selectedBreedIds.filter((bId) => bId !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-brand-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold mb-4">
            <GitCompare className="w-3.5 h-3.5" />
            <span>ICAR-NBAGR Head-to-Head Morphological Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t.compareBreedsTitle}
          </h1>
          <p className="text-slate-300 mt-2 text-sm sm:text-base leading-relaxed font-light">
            {t.compareBreedsSubtitle}
          </p>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {t.selectBreedsToCompare}
            </h3>
            <p className="text-xs text-slate-500">
              Select up to 3 indigenous breeds to inspect phenotypic and functional metrics.
            </p>
          </div>

          {/* Species Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(["ALL", "Cattle", "Buffalo"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterSpecies(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterSpecies === s
                    ? "bg-white text-emerald-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {s === "ALL" ? "All Species" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Add Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Breed:
          </span>
          {availableBreeds.map((breed) => {
            const isSelected = selectedBreedIds.includes(breed.id);
            return (
              <button
                key={breed.id}
                disabled={isSelected || selectedBreedIds.length >= 3}
                onClick={() => addBreed(breed.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
                  isSelected
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold opacity-75"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <span>{breed.name}</span>
                {isSelected ? (
                  <span className="text-[10px] text-emerald-700">✓</span>
                ) : (
                  <Plus className="w-3 h-3 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {selectedBreeds.map((breed) => (
          <div
            key={breed.id}
            className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-md flex flex-col justify-between relative group hover:border-emerald-500 transition-colors"
          >
            {/* Remove breed button */}
            {selectedBreeds.length > 1 && (
              <button
                onClick={() => removeBreed(breed.id)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                title="Remove from comparison"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Photo banner */}
            <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
              <img
                src={breed.referenceImageUrl}
                alt={breed.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/breeds/${breed.id}.jpg`;
                }}
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="text-[10px] uppercase font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full">
                  {breed.species}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-200 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {breed.purpose}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{breed.name}</h3>
                  <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                    {breed.icarCode}
                  </span>
                </div>

                {/* Regional Tract */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" /> Primary Distribution
                  </span>
                  <span className="font-bold text-slate-800 block">{breed.primaryStates}</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">{breed.keyDistricts}</span>
                </div>

                {/* Milk Specs */}
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                    <Milk className="w-3 h-3 text-emerald-600" /> Dairy Performance
                  </span>
                  <div className="flex justify-between items-center text-emerald-950 font-bold">
                    <span>Daily Yield:</span>
                    <span className="font-mono">{breed.milkYield}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-900 text-[11px]">
                    <span>Fat Content:</span>
                    <span className="font-mono font-bold">{breed.fatPercentage}</span>
                  </div>
                </div>

                {/* Draught & Cultivation Power */}
                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                    <Tractor className="w-3 h-3 text-amber-600" /> Cultivation & Ploughing
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {breed.cultivationPower}
                  </p>
                </div>

                {/* Horns & Anatomy */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Horn Curvature & Morphology
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {breed.hornTraits}
                  </p>
                </div>
              </div>

              {/* Rearing Tip */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{breed.rearingTips}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
