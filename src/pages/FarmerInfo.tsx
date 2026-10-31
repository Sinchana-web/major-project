import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Sprout,
  ShieldCheck,
  Milk,
  Tractor,
  ThermometerSun,
  AlertCircle,
  HelpCircle,
  BookOpen,
} from "lucide-react";

export const FarmerInfo: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"rgm" | "nutrition" | "health" | "a2milk">("rgm");

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold mb-4">
            <Sprout className="w-3.5 h-3.5" />
            <span>Rashtriya Gokul Mission (RGM) Scientific Advisory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t.farmerGuideTitle}
          </h1>
          <p className="text-slate-300 mt-2 text-sm sm:text-base leading-relaxed font-light">
            {t.farmerGuideSubtitle}
          </p>
        </div>
      </div>

      {/* Verified Standard vs AI Model Scope Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-800 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                {t.verifiedIcarBadge}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {t.aiEstimatedBadge}
              </span>
            </div>
            <h3 className="text-base font-bold text-amber-950">
              Understanding Verified Data vs. AI Visual Recognition
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Breed reference standards, accession codes (e.g. <code>INDIA_CATTLE_0800_HALLIKAR_03008</code>), native breeding tracts, and typical milk/draught capacities shown in this portal are sourced from official <strong>ICAR-NBAGR descriptor protocols</strong>.
              When an animal photograph or video is uploaded, deep learning vision models calculate probabilistic visual resemblances based on observable phenotype. Always consult local veterinary officers for clinical diagnoses or pedigree registration.
            </p>
          </div>
        </div>
      </div>

      {/* Advisory Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab("rgm")}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 cursor-pointer shrink-0 transition-colors ${
              activeTab === "rgm"
                ? "border-emerald-700 text-emerald-950 bg-white font-extrabold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>{language === "kn" ? "ರಾಷ್ಟ್ರೀಯ ಗೋಕುಲ್ ಮಿಷನ್" : "Indigenous Breed Value"}</span>
          </button>

          <button
            onClick={() => setActiveTab("a2milk")}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 cursor-pointer shrink-0 transition-colors ${
              activeTab === "a2milk"
                ? "border-emerald-700 text-emerald-950 bg-white font-extrabold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Milk className="w-4 h-4 text-emerald-600" />
            <span>{language === "kn" ? "A2 ಹಾಲಿನ ಗುಣಮಟ್ಟ" : "A2 Milk Quality"}</span>
          </button>

          <button
            onClick={() => setActiveTab("nutrition")}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 cursor-pointer shrink-0 transition-colors ${
              activeTab === "nutrition"
                ? "border-emerald-700 text-emerald-950 bg-white font-extrabold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{language === "kn" ? "ಮೇವು ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶ" : "Fodder & Nutrition"}</span>
          </button>

          <button
            onClick={() => setActiveTab("health")}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 cursor-pointer shrink-0 transition-colors ${
              activeTab === "health"
                ? "border-emerald-700 text-emerald-950 bg-white font-extrabold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <ThermometerSun className="w-4 h-4 text-emerald-600" />
            <span>{language === "kn" ? "ಬೇಸಿಗೆ ಮತ್ತು ಆರೋಗ್ಯ ಆರೈಕೆ" : "Summer & Health Care"}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {activeTab === "rgm" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Why Rear Indian Indigenous Breeds?</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
                    <li><strong>Superior Thermoregulation:</strong> High sweat gland density and prominent dewlaps allow indigenous cattle to comfortably thrive in 45°C+ summer heat without heat distress.</li>
                    <li><strong>Tick & Parasite Immunity:</strong> Natural skin sebum and genetic resistance drastically reduce incidence of tick-borne theileriosis and babesiosis.</li>
                    <li><strong>Efficient Low-Quality Roughage Converters:</strong> Capable of maintaining body condition and producing rich milk on agricultural crop residues (ragi/jowar straw) with low concentrate inputs.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Tractor className="w-5 h-5 text-amber-600" />
                    <span>Dual & Draught Utility (Oxen Power)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Breeds such as <strong>Hallikar</strong>, <strong>Amritmahal</strong>, <strong>Kangayam</strong>, and <strong>Krishna Valley</strong> provide unmatched draught speed and pulling stamina. A pair of Hallikar oxen can work 7 to 9 continuous hours in dry or black cotton soils without fatigue, reducing diesel expenditures for small and marginal farmers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "a2milk" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <h4 className="font-bold text-blue-950 text-sm mb-2">
                  A2 Beta-Casein Protein in Indigenous Breeds
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  Indian Zebu cattle (<em>Bos indicus</em>) naturally produce milk containing the <strong>A2 allele of beta-casein</strong>. Unlike exotic A1 milk, A2 milk does not release the peptide BCM-7 during digestion, resulting in easier digestive assimilation, reduced bloating, and higher immunological value.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block">High Butterfat (4.5% - 8.5%)</span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">Produces superior ghee yield with traditional bilona churning.</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block">Carotenoid-Rich Colostrum</span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">High natural vitamin A & micronutrient concentration.</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block">Ayurvedic Formulations</span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">Gir, Sahiwal, and Malnad Gidda milk is preferred in Panchagavya therapy.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "nutrition" && (
            <div className="space-y-4 animate-fadeIn text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 font-bold block mb-1">
                  Daily Ration Composition for Milking Indigenous Cows:
                </strong>
                <p className="leading-relaxed mb-3">
                  A balanced indigenous ration comprises 60-70% dry roughage (jowar stalks, paddy straw, ragi stover), 20-30% green fodder (hybrid napier, cowpea, maize), and 2-3 kg mineral-fortified grain concentrate tailored to daily milk output.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <strong className="text-emerald-900 block mb-0.5">Mineral Mixtures:</strong>
                    <span>50 grams daily of chelated mineral mixture prevents silent heat and maintains reproductive cycling.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <strong className="text-emerald-900 block mb-0.5">Clean Drinking Water:</strong>
                    <span>Provide 50 to 80 litres of clean potable water daily; buffaloes require wallowing or showering twice daily.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-4 animate-fadeIn text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200">
                <strong className="text-orange-950 font-bold block mb-1">
                  Mandatory National Preventive Health Calendar:
                </strong>
                <ul className="space-y-2 list-disc list-inside mt-2 text-slate-700">
                  <li><strong>Foot & Mouth Disease (FMD):</strong> Vaccinate biannually (prior to monsoon and post-monsoon).</li>
                  <li><strong>Haemorrhagic Septicaemia (HS) & Black Quarter (BQ):</strong> Annual pre-monsoon vaccination in May/June.</li>
                  <li><strong>Deworming:</strong> Administer broad-spectrum anthelmintics every 6 months to calves and adult cattle before seasonal grazing.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-slate-600">
                  Always report sudden high fever or vesicular lesions on hooves or mouth to your local veterinary dispensary or Gram Panchayat livestock inspector immediately.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
