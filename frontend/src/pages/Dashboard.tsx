import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ScanSearch,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { getScanStats } from "../utils/storage";

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    successfulIdentifications: 0,
    latestDetection: "No scans yet",
  });

  useEffect(() => {
    setStats(getScanStats());
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-xl">
        {/* Background Decorative Circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-brand-600/20 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-200 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>AI Livestock Diagnostic Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Welcome to <span className="text-brand-300">Pashu Pehchaan</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 mt-4 leading-relaxed font-light">
            AI-powered cattle breed recognition for Indian livestock. Upload an image to analyze visual genetics, verify species identity, and generate instant livestock records.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/recognize">
              <Button
                variant="secondary"
                size="lg"
                icon={ScanSearch}
                iconPosition="left"
                className="bg-white text-brand-950 hover:bg-brand-50 border-none font-bold shadow-lg"
              >
                Identify Breed
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="ghost"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="text-white hover:bg-white/10"
              >
                Explore Neural Pipeline
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-700" />
          <span>System Diagnostics & Usage</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Scans */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Scans
              </span>
              <div className="p-2 rounded-xl bg-brand-50 text-brand-700">
                <ScanSearch className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">
              {stats.totalScans}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Images processed locally
            </p>
          </div>

          {/* Card 2: Successful Identifications */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Successful Identifications
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">
              {stats.successfulIdentifications}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              High-confidence predictions
            </p>
          </div>

          {/* Card 3: Latest Detection */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Latest Detection
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 truncate">
              {stats.latestDetection}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Most recent livestock scan
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-slate-100/70 rounded-3xl p-8 border border-slate-200/70">
        <h3 className="text-lg font-bold text-slate-900 mb-6">
          Core Diagnostic Capabilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">YOLOv8 Detection</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Auto-localizes livestock within full scenes before classifying breed features.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">MobileNetV2 Classifier</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trained specifically on indigenous Indian cattle breeds like Malnad Gidda, Gir, and Sahiwal.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Verified Records</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates unique animal tag IDs with localized regional origin and trait summaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
