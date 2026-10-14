import React from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Info,
  Check,
  X,
  Server,
  Code2,
} from "lucide-react";

export const About: React.FC = () => {
  const pipelineSteps = [
    { title: "Uploaded Image", desc: "RGB photo input (JPG/PNG)" },
    { title: "YOLOv8 Detection", desc: "Animal bounding box extraction" },
    { title: "MobileNetV2 Classifier", desc: "Feature extraction & breed logits" },
    { title: "Prediction Response", desc: "Confidence calculation" },
    { title: "Livestock Record", desc: "Formatted passport generation" },
  ];

  const outputFields = [
    { name: "Animal ID", desc: "Unique alphanumeric tag (e.g., KA-MAL-2026-58C8)" },
    { name: "Species", desc: "Livestock taxonomy classification (e.g., Cattle)" },
    { name: "Breed", desc: "Recognized indigenous breed name (e.g., Malnad Gidda)" },
    { name: "Confidence", desc: "Classifier probability score formatted as percentage" },
    { name: "Detection Confidence", desc: "YOLO bounding box spatial detection accuracy score" },
    { name: "Region", desc: "Native geographic distribution & habitat zone in India" },
    { name: "Description", desc: "Agricultural characteristics, adaptability, & traits" },
    { name: "Scan Date", desc: "Timestamp of recognition evaluation" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 text-brand-800 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Sparkles className="w-8 h-8 text-brand-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          About Pashu Pehchaan
        </h1>
        <p className="text-slate-600 mt-3 text-base leading-relaxed max-w-2xl mx-auto">
          Pashu Pehchaan is an AI-powered livestock breed recognition system designed to assist in identifying Indian cattle breeds from images using multi-stage deep learning computer vision.
        </p>
      </div>

      {/* Visual ML Pipeline */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Server className="w-5 h-5 text-brand-700" />
          <span>Computer Vision Pipeline Architecture</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
          {pipelineSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 flex flex-col justify-between relative group hover:border-brand-400 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full inline-block mb-2">
                  STAGE 0{idx + 1}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  {step.desc}
                </p>
              </div>

              {idx < pipelineSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full border border-slate-200 text-slate-400">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Response Field Specs */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-brand-700" />
          <span>Recognition Data Output Schema</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outputFields.map((field, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="font-bold text-slate-900 text-sm block font-mono text-brand-900">
                {field.name}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                {field.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory ML Boundaries & Disclaimer */}
      <div className="bg-amber-50/70 rounded-3xl p-8 border border-amber-200/80 shadow-xs">
        <div className="flex items-center gap-3 text-amber-900 mb-4">
          <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0" />
          <h3 className="text-lg font-bold">Machine Learning Limitations & Scope</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="bg-white/80 p-4 rounded-2xl border border-amber-200/50 space-y-2">
            <h4 className="font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>What Pashu Pehchaan Does</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Identifies Indian cattle breeds from RGB photographs</li>
              <li>Calculates spatial detection & feature classification confidence</li>
              <li>Provides indigenous geographical origin & morphological traits</li>
            </ul>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-amber-200/50 space-y-2">
            <h4 className="font-bold text-rose-800 flex items-center gap-1.5 text-sm">
              <X className="w-4 h-4 text-rose-600" />
              <span>What Pashu Pehchaan Does NOT Do</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Does NOT perform veterinary medical health diagnosis</li>
              <li>Does NOT estimate animal age, weight, or milk yield</li>
              <li>Does NOT guarantee 100% accurate genetic pedigree</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-amber-800 font-medium pt-3 border-t border-amber-200/50">
          <Info className="w-4 h-4 shrink-0" />
          <span>Predictions are probabilistic estimates generated by deep neural models.</span>
        </div>
      </div>
    </div>
  );
};
