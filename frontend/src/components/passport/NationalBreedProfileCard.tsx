import React, { useState } from "react";
import {
  MapPin,
  History,
  Milk,
  Tractor,
  Sprout,
  Award,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ThermometerSun,
} from "lucide-react";
import type { NationalBreedProfile } from "../../types/prediction";

interface NationalBreedProfileCardProps {
  profile: NationalBreedProfile;
  engine?: string;
}

export const NationalBreedProfileCard: React.FC<NationalBreedProfileCardProps> = ({
  profile,
  engine,
}) => {
  const [activeTab, setActiveTab] = useState<
    "geography" | "history" | "utility" | "rearing" | "icar"
  >("geography");

  const handlePrint = () => {
    window.print();
  };

  const isCow = profile.dairy_profile?.applicable;

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden mt-8 transition-all">
      {/* ICAR Official Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-32 h-32 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Award className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  ICAR-NBAGR Recognized
                </span>
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {profile.species} • {profile.gender_identified}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1.5">
                {profile.breed} — National Breed Intelligence
              </h2>
              <p className="text-xs text-slate-300 mt-1 font-light">
                Indian Council of Agricultural Research • Comprehensive Biological & Agrarian Dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-sm transition-colors cursor-pointer shadow-sm no-print"
              title="Print official breed report"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* National Accession & Quick Classification Banner */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg text-amber-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-amber-300 font-semibold tracking-wider block">
                Official ICAR-NBAGR Accession Code
              </span>
              <span className="text-lg sm:text-xl font-mono font-black tracking-wider text-white">
                {profile.icar_accession_code}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-mono text-slate-300 font-semibold tracking-wider block">
              Primary Indian Distribution
            </span>
            <span className="text-xs font-bold text-emerald-300 bg-black/40 px-2.5 py-1 rounded-md border border-emerald-500/30 inline-block mt-0.5">
              {profile.geographic_distribution.primary_states}
            </span>
          </div>
        </div>
      </div>

      {/* Verification Engine Indicator */}
      <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700 font-medium">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
          <span>Evaluation Engine: <strong className="font-bold text-slate-900">{engine || "Google Gemini 3.6 Flash (ICAR-NBAGR Grounded)"}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>Report Generated: {profile.evaluation_date}</span>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/60 overflow-x-auto text-xs font-bold text-slate-600 no-print">
        <button
          type="button"
          onClick={() => setActiveTab("geography")}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "geography"
              ? "border-emerald-600 text-emerald-950 bg-white font-extrabold"
              : "border-transparent hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Where Seen Most in India</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "history"
              ? "border-emerald-600 text-emerald-950 bg-white font-extrabold"
              : "border-transparent hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <History className="w-4 h-4 text-emerald-600" />
          <span>History & Biology</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("utility")}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "utility"
              ? "border-emerald-600 text-emerald-950 bg-white font-extrabold"
              : "border-transparent hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          {isCow ? (
            <Milk className="w-4 h-4 text-emerald-600" />
          ) : (
            <Tractor className="w-4 h-4 text-emerald-600" />
          )}
          <span>Utility: Milk & Cultivation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rearing")}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "rearing"
              ? "border-emerald-600 text-emerald-950 bg-white font-extrabold"
              : "border-transparent hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>Rearing & Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("icar")}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "icar"
              ? "border-emerald-600 text-emerald-950 bg-white font-extrabold"
              : "border-transparent hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>ICAR Standards & Registry</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 sm:p-8">
        {/* Tab 1: Geographic Distribution */}
        {activeTab === "geography" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Geographic Presence Summary
              </span>
              <p className="text-base font-extrabold text-emerald-950 mt-1">
                {profile.geographic_distribution.concentration_summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Primary Indian States
                </span>
                <span className="text-base font-bold text-slate-900 mt-1 block">
                  {profile.geographic_distribution.primary_states}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  Population Zone: {profile.geographic_distribution.population_zone}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Key Breeding Districts
                </span>
                <span className="text-sm font-semibold text-slate-900 mt-1 block">
                  {profile.geographic_distribution.key_districts}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-bold block">
                  Agro-Climatic Habitat & Terrain:
                </strong>
                <span className="text-slate-600 mt-0.5 block leading-relaxed">
                  {profile.geographic_distribution.agro_climatic_habitat}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: History & Biology */}
        {activeTab === "history" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Origin & Historical Lineage
              </span>
              <p className="text-sm text-slate-800 mt-1.5 leading-relaxed">
                {profile.history_and_origin.origin_summary}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                {profile.history_and_origin.cultural_importance}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Biological & Morphological Anatomy
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
                  <strong className="text-slate-900 font-bold block mb-1">
                    Horn Structure & Morphology:
                  </strong>
                  {profile.biological_traits.horn_morphology}
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
                  <strong className="text-slate-900 font-bold block mb-1">
                    Coat Pigmentation & Build:
                  </strong>
                  {profile.biological_traits.coat_and_pigmentation}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 text-xs leading-relaxed text-slate-700 flex items-start gap-2.5">
                <ThermometerSun className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-orange-950 font-bold block mb-0.5">
                    Heat Tolerance:
                  </strong>
                  {profile.biological_traits.heat_tolerance}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs leading-relaxed text-slate-700 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold block mb-0.5">
                    Natural Disease Resistance:
                  </strong>
                  {profile.biological_traits.disease_resistance}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Utility (Dairy for Cows vs Cultivation for Oxen) */}
        {activeTab === "utility" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Milk Section */}
            {profile.dairy_profile?.applicable && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Milk className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-extrabold text-slate-900">
                    Milk Production & Dairy Performance (Cow / Female)
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Daily Milk Yield
                    </span>
                    <span className="text-base font-black text-emerald-950 mt-1 block">
                      {profile.dairy_profile.average_daily_yield}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                      Fat Percentage
                    </span>
                    <span className="text-base font-black text-teal-950 mt-1 block">
                      {profile.dairy_profile.fat_percentage}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                      Lactation Cycle Yield
                    </span>
                    <span className="text-xs font-extrabold text-blue-950 mt-1 block">
                      {profile.dairy_profile.lactation_period_yield}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      Protein Quality
                    </span>
                    <span className="text-xs font-extrabold text-amber-950 mt-1 block">
                      {profile.dairy_profile.milk_quality}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Cultivation / Ox Section */}
            {profile.cultivation_profile?.applicable && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Tractor className="w-5 h-5 text-amber-600" />
                  <h4 className="text-base font-extrabold text-slate-900">
                    Agricultural Cultivation & Draft Utility (Ox / Bullock / Bull)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      Ploughing Suitability
                    </span>
                    <span className="text-sm font-extrabold text-amber-950 mt-1 block">
                      {profile.cultivation_profile.cultivation_suitability}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Soil Compatibility
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 mt-1 block">
                      {profile.cultivation_profile.soil_compatibility}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Transport / Cart Speed
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 mt-1 block">
                      {profile.cultivation_profile.carting_and_transport}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-amber-950 font-bold block mb-1">
                    Field Cultivation & Pulling Capability:
                  </strong>
                  {profile.cultivation_profile.cultivation_summary}
                  <span className="block mt-1.5 text-slate-500 font-semibold">
                    Stamina: {profile.cultivation_profile.field_work_endurance}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Rearing & Management */}
        {activeTab === "rearing" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
                <strong className="text-slate-900 font-bold block mb-1">
                  Grazing System & Management:
                </strong>
                {profile.rearing_and_care.grazing_management}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
                <strong className="text-slate-900 font-bold block mb-1">
                  Feeding & Roughage Requirements:
                </strong>
                {profile.rearing_and_care.feeding_requirements}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
                <strong className="text-slate-900 font-bold block mb-1">
                  Housing & Climate Protection:
                </strong>
                {profile.rearing_and_care.housing_recommendations}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
                <strong className="text-slate-900 font-bold block mb-1">
                  Veterinary & Vaccination Care:
                </strong>
                {profile.rearing_and_care.veterinary_care}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: ICAR Standards */}
        {activeTab === "icar" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    National Bureau of Animal Genetic Resources Registry
                  </span>
                  <span className="text-base font-black text-slate-900 mt-1 block font-mono">
                    {profile.icar_accession_code}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{profile.conservation_status.icar_registry_status}</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200">
                <strong>Population Status:</strong> {profile.conservation_status.population_status}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                <strong>Government Mission:</strong> {profile.conservation_status.national_mission}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              Standardized in accordance with ICAR-NBAGR descriptor protocols for Indian Indigenous Livestock.
              Registration verifies native germplasm integrity without any private personal or ownership records.
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span>Report ID: <strong className="font-mono text-slate-700">{profile.profile_id}</strong></span>
        <span>{profile.issuing_institute}</span>
      </div>
    </div>
  );
};
