import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading data...",
  subtext = "Please wait a moment while we process your request.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-700 animate-spin"></div>
        <Loader2 className="w-6 h-6 text-brand-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{message}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1">{subtext}</p>
    </div>
  );
};
