import React, { useState, useMemo } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  MapPin,
  Milk,
  Tractor,
  Sparkles,
  X,
  History,
  Sprout,
  ShieldCheck,
  Image as ImageIcon,
  Loader2,
  Bot,
  AlertCircle,
} from "lucide-react";
import {
  INDIAN_BREED_DATABASE,
  type BreedCatalogItem,
} from "../data/breedDatabase";

export const ExploreCattle: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedBreed, setSelectedBreed] = useState<BreedCatalogItem | null>(
    null
  );
  const [modalTab, setModalTab] = useState<
    "geography" | "history" | "utility" | "rearing"
  >("geography");

  const [customBreeds, setCustomBreeds] = useState<BreedCatalogItem[]>([]);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchError, setAiSearchError] = useState<string | null>(null);

  const stateList = [
    "ALL",
    "Karnataka",
    "Gujarat",
    "Haryana",
    "Maharashtra",
    "Tamil Nadu",
    "Rajasthan",
    "Andhra Pradesh",
  ];

  const allBreeds = useMemo(() => {
    return [...customBreeds, ...INDIAN_BREED_DATABASE];
  }, [customBreeds]);

  const handleGeminiSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery || searchQuery).trim();
    if (!q) return;

    setIsAiSearching(true);
    setAiSearchError(null);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "";
      const resp = await axios.post(`${apiBase}/api/search-breed`, { query: q });
      if (resp.data.success && resp.data.breed) {
        const newBreed: BreedCatalogItem = resp.data.breed;
        setCustomBreeds((prev) => {
          const exists = prev.some(
            (b) =>
              b.id.toLowerCase() === newBreed.id.toLowerCase() ||
              b.name.toLowerCase() === newBreed.name.toLowerCase()
          );
          if (exists) return prev;
          return [newBreed, ...prev];
        });
        setSelectedBreed(newBreed);
        setModalTab("geography");
      } else {
        setAiSearchError(resp.data.error || "Breed not found in ICAR records.");
      }
    } catch (err: any) {
      setAiSearchError(
        err.response?.data?.error ||
          err.message ||
          "Gemini AI search failed. Please verify network and backend connection."
      );
    } finally {
      setIsAiSearching(false);
    }
  };

  const filteredBreeds = useMemo(() => {
    return allBreeds.filter((b) => {
      // 1. Search query match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.icarCode.toLowerCase().includes(q) ||
        b.primaryStates.toLowerCase().includes(q) ||
        b.keyDistricts.toLowerCase().includes(q) ||
        b.purpose.toLowerCase().includes(q) ||
        b.species.toLowerCase().includes(q);

      // 2. Type filter match
      let matchesType = true;
      if (selectedType === "Cattle") matchesType = b.species === "Cattle";
      else if (selectedType === "Buffalo") matchesType = b.species === "Buffalo";
      else if (selectedType === "Dairy")
        matchesType = b.purpose.toLowerCase().includes("dairy");
      else if (selectedType === "Draught")
        matchesType = b.purpose.toLowerCase().includes("draught");
      else if (selectedType === "Dual")
        matchesType = b.purpose.toLowerCase().includes("dual");

      // 3. State filter match
      let matchesState = true;
      if (selectedState !== "ALL") {
        matchesState = b.primaryStates
          .toLowerCase()
          .includes(selectedState.toLowerCase());
      }

      return matchesSearch && matchesType && matchesState;
    });
  }, [allBreeds, searchQuery, selectedType, selectedState]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-emerald-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>ICAR-NBAGR National Reference Repository</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Search & Explore Indian Livestock
          </h1>
          <p className="text-slate-300 mt-2 text-sm sm:text-base leading-relaxed font-light">
            Search any Indian cattle or buffalo by <strong>Breed Name</strong>,{" "}
            <strong>Animal ID / ICAR Accession Code</strong>,{" "}
            <strong>Location (State/District)</strong>, or{" "}
            <strong>Cattle Type</strong> to view authentic internet reference
            images and comprehensive biological dossiers.
          </p>
        </div>
      </div>

      {/* Multi-Parameter Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        {/* Search Bar Input & Gemini AI Lookup */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  handleGeminiSearch();
                }
              }}
              placeholder="Search by breed (e.g. Hallikar, Murrah, Gir, Badri, Bargur), ID, or state..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleGeminiSearch()}
            disabled={isAiSearching || !searchQuery.trim()}
            className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isAiSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching ICAR with AI...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-emerald-200" />
                <span>Search with Gemini AI</span>
              </>
            )}
          </button>
        </div>

        {aiSearchError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{aiSearchError}</span>
          </div>
        )}

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {[
            { key: "ALL", label: "All Breeds" },
            { key: "Cattle", label: "Cattle (Cows & Oxen)" },
            { key: "Buffalo", label: "Buffaloes" },
            { key: "Dairy", label: "Dairy (Milch)" },
            { key: "Draught", label: "Draught (Cultivation)" },
            { key: "Dual", label: "Dual-Purpose" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedType(item.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedType === item.key
                  ? "bg-brand-900 text-white shadow-sm shadow-brand-900/20 scale-[1.02]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Location Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Region:
          </span>
          {stateList.map((state) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedState === state
                  ? "bg-emerald-800 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
              }`}
            >
              {state === "ALL" ? "All India" : state}
            </button>
          ))}
        </div>
      </div>

      {/* Search Result Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <span>
          Showing <strong>{filteredBreeds.length}</strong> matching Indian
          livestock breeds
        </span>
        {searchQuery && (
          <span>
            Filtering by query: <em>"{searchQuery}"</em>
          </span>
        )}
      </div>

      {/* If No Local Breeds Found, offer Gemini AI Search */}
      {filteredBreeds.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-md space-y-4 max-w-xl mx-auto my-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              No matching breed found in local catalog
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {searchQuery
                ? `Would you like Gemini AI to search the national ICAR-NBAGR repository for "${searchQuery}" and fetch authentic images and biological records?`
                : "Try adjusting your filters or search for any Indian indigenous cattle or buffalo breed."}
            </p>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleGeminiSearch()}
              disabled={isAiSearching}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black inline-flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isAiSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Search "{searchQuery}" with Gemini AI</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Grid of Breed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBreeds.map((breed) => (
          <div
            key={breed.id}
            onClick={() => {
              setSelectedBreed(breed);
              setModalTab("geography");
            }}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden hover:shadow-xl hover:border-brand-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            {/* Authentic Reference Photo */}
            <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
              <img
                src={breed.referenceImageUrl}
                alt={breed.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/breeds/${breed.id}.jpg`;
                }}
              />

              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] uppercase font-bold text-white bg-slate-950/75 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs">
                  {breed.species}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${
                    breed.purpose.includes("Dairy")
                      ? "bg-blue-900/80 text-blue-200 border-blue-400/30"
                      : breed.purpose.includes("Draught")
                      ? "bg-amber-900/80 text-amber-200 border-amber-400/30"
                      : "bg-emerald-900/80 text-emerald-200 border-emerald-400/30"
                  }`}
                >
                  {breed.purpose}
                </span>
              </div>

              <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white flex items-center gap-1 font-mono">
                <ImageIcon className="w-3 h-3 text-slate-300" />
                <span>Reference Photo</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-700 transition-colors">
                    {breed.name}
                  </h3>
                </div>

                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                  {breed.icarCode}
                </span>

                <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-800">
                    {breed.primaryStates}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 ml-5">
                  {breed.keyDistricts}
                </p>
              </div>

              {/* Utility Metric Preview */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {breed.purpose.includes("Dairy") ? (
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Milk className="w-4 h-4 text-emerald-600" />
                    <span>{breed.milkYield.split("(")[0]}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                    <Tractor className="w-4 h-4 text-amber-600" />
                    <span className="line-clamp-1">Heavy Cultivation</span>
                  </div>
                )}
                <span className="text-brand-700 font-bold text-[11px] group-hover:underline flex items-center gap-0.5">
                  View Dossier →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State when no results */}
      {filteredBreeds.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">
            No matching cattle found
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Try searching for a different breed name, state, or resetting your
            filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedType("ALL");
              setSelectedState("ALL");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-brand-800 text-white text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Comprehensive Detailed Breed Modal */}
      {selectedBreed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Close Button */}
            <button
              onClick={() => setSelectedBreed(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Reference Photo Banner */}
            <div className="relative aspect-16/9 w-full bg-slate-950 overflow-hidden">
              <img
                src={selectedBreed.referenceImageUrl}
                alt={selectedBreed.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/breeds/${selectedBreed.id}.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    ICAR-NBAGR Registered
                  </span>
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {selectedBreed.species} • {selectedBreed.purpose}
                  </span>
                </div>
                <h2 className="text-3xl font-black">{selectedBreed.name}</h2>
                <span className="font-mono text-xs text-amber-200">
                  {selectedBreed.icarCode}
                </span>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setModalTab("geography")}
                className={`flex items-center gap-1.5 px-5 py-3 border-b-2 cursor-pointer shrink-0 ${
                  modalTab === "geography"
                    ? "border-emerald-600 text-emerald-900 bg-white font-extrabold"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Where Seen in India</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("history")}
                className={`flex items-center gap-1.5 px-5 py-3 border-b-2 cursor-pointer shrink-0 ${
                  modalTab === "history"
                    ? "border-emerald-600 text-emerald-900 bg-white font-extrabold"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <History className="w-4 h-4 text-emerald-600" />
                <span>History & Biology</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("utility")}
                className={`flex items-center gap-1.5 px-5 py-3 border-b-2 cursor-pointer shrink-0 ${
                  modalTab === "utility"
                    ? "border-emerald-600 text-emerald-900 bg-white font-extrabold"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <Tractor className="w-4 h-4 text-emerald-600" />
                <span>Milk vs Cultivation</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("rearing")}
                className={`flex items-center gap-1.5 px-5 py-3 border-b-2 cursor-pointer shrink-0 ${
                  modalTab === "rearing"
                    ? "border-emerald-600 text-emerald-900 bg-white font-extrabold"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Rearing & Care</span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {modalTab === "geography" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Primary Native States
                    </span>
                    <span className="text-lg font-extrabold text-emerald-950 mt-0.5 block">
                      {selectedBreed.primaryStates}
                    </span>
                    <span className="text-xs text-emerald-700 mt-1 block">
                      Key Breeding Districts: {selectedBreed.keyDistricts}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <strong className="text-slate-900 font-bold block mb-1">
                      Population Zone & Habitat:
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {selectedBreed.populationZone}
                    </span>
                  </div>
                </div>
              )}

              {modalTab === "history" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-slate-800 leading-relaxed">
                    <strong className="text-amber-950 font-bold block mb-1 text-sm">
                      Origins & Historical Heritage:
                    </strong>
                    {selectedBreed.history}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <strong className="text-slate-900 font-bold block mb-1">
                        Horn Curvature & Shape:
                      </strong>
                      <span className="text-slate-600">
                        {selectedBreed.hornTraits}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <strong className="text-slate-900 font-bold block mb-1">
                        Coat & Stature:
                      </strong>
                      <span className="text-slate-600">
                        {selectedBreed.coatAndBuild}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === "utility" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Daily Milk Yield (Cows)
                      </span>
                      <span className="text-base font-black text-emerald-950 mt-1 block">
                        {selectedBreed.milkYield}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                        Fat: {selectedBreed.fatPercentage}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                        Primary Agricultural Purpose
                      </span>
                      <span className="text-base font-black text-amber-950 mt-1 block">
                        {selectedBreed.purpose}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 font-bold block mb-1">
                      Cultivation, Ploughing & Draft Utility (Oxen/Bulls):
                    </strong>
                    {selectedBreed.cultivationPower}
                  </div>
                </div>
              )}

              {modalTab === "rearing" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 font-bold block mb-1">
                      Feeding, Grazing & Housing Guidelines:
                    </strong>
                    {selectedBreed.rearingTips}
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      Naturally resistant to tropical heat and local tick-borne
                      pathogens.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedBreed(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
