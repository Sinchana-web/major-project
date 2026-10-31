import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ScanSearch,
  Camera,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  GitCompare,
  Sprout,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { getScanStats, getPredictionHistory, savePredictionToHistory } from "../utils/storage";
import { AnalyticsCharts } from "../components/analytics/AnalyticsCharts";
import { useLanguage } from "../context/LanguageContext";
import type { HistoryRecord } from "../types/prediction";

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalScans: 0,
    successfulIdentifications: 0,
    latestDetection: "No scans yet",
  });
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  const refreshData = () => {
    setStats(getScanStats());
    setHistory(getPredictionHistory());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSeedDemoData = () => {
    const sampleRecord = {
      animal_id: "INDIA_CATTLE_0800_HALLIKAR_03008",
      breed: "Hallikar",
      species: "Cattle",
      animal_gender: "Bull / Ox",
      confidence: 0.96,
      detection_confidence: 0.98,
      breed_resemblances: [
        { breed: "Hallikar", percentage: 85, reasoning: "Characteristic long sweeping horns and grey muscular stature." },
        { breed: "Amritmahal", percentage: 15, reasoning: "Tight skin and high-speed trotting frame." }
      ],
      region: "Tumkur, Mandya, Hassan (Karnataka)",
      description: "Premier indigenous draught breed known for extraordinary endurance and ploughing speed.",
      purpose: "Draught (Cultivation)",
      average_daily_milk_litres: "3 - 5 Litres/day",
      fat_percentage: "4.5%",
      cultivation_utility: "Fast trotting and heavy deep tillage in rocky Deccan soil.",
      rearing_and_care: "Thrives on dry jowar and ragi stalks.",
      date: new Date().toISOString().split("T")[0],
      engine: "Google Gemini 2.5 Flash Vision (ICAR Grounded)",
      success: true,
    };
    savePredictionToHistory(sampleRecord as any, "/breeds/hallikar.jpg");
    refreshData();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative bg-gradient-to-br from-emerald-950 via-brand-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-600/20 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.appSubtitle}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {t.appName}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 mt-4 leading-relaxed font-light">
            AI-powered cattle and buffalo breed recognition for Indian livestock. Upload or photograph your animal to analyze visual genetics, verify species identity, and generate instant ICAR-NBAGR digital passports.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/recognize?mode=camera">
              <Button
                variant="primary"
                size="lg"
                icon={Camera}
                iconPosition="left"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/25 border-none cursor-pointer"
              >
                {t.quickCameraScan}
              </Button>
            </Link>

            <Link to="/recognize">
              <Button
                variant="secondary"
                size="lg"
                icon={ScanSearch}
                iconPosition="left"
                className="bg-white text-emerald-950 hover:bg-emerald-50 border-none font-bold shadow-lg cursor-pointer"
              >
                {t.navRecognize}
              </Button>
            </Link>

            <Link to="/compare">
              <Button
                variant="outline"
                size="lg"
                icon={GitCompare}
                iconPosition="left"
                className="text-white border-white/30 hover:bg-white/10 font-semibold"
              >
                {t.navCompare}
              </Button>
            </Link>

            <Link to="/farmer-info">
              <Button
                variant="ghost"
                size="lg"
                icon={Sprout}
                iconPosition="left"
                className="text-white hover:bg-white/10"
              >
                {t.navFarmerInfo}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>Diagnostics & Usage Overview</span>
          </h2>

          {history.length === 0 && (
            <button
              onClick={handleSeedDemoData}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-4 cursor-pointer"
            >
              + Load Sample Record
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Scans */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.totalScans}
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <ScanSearch className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {stats.totalScans}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated on device
            </p>
          </div>

          {/* Card 2: Successful Identifications */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.successfulScans}
              </span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {stats.successfulIdentifications}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              High confidence diagnoses
            </p>
          </div>

          {/* Card 3: Latest Detection */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Latest Animal
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 truncate">
              {stats.latestDetection}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Most recent livestock evaluation
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <AnalyticsCharts history={history} />

      {/* Feature Highlights Grid */}
      <div className="bg-slate-100/70 rounded-3xl p-8 border border-slate-200/70">
        <h3 className="text-lg font-bold text-slate-900 mb-6">
          Platform Architecture & Capabilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Gemini 2.5 Flash Vision</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Deep multimodal analysis extracting horn orientation, facial convexity, coat, and dewlap folds.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">ICAR-NBAGR Passports</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates official national accession codes with zero farmer tracking or personal data collection.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
              <GitCompare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Breed Comparison</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Multi-breed side-by-side matrices for milk yield, butterfat %, and agricultural draught power.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
