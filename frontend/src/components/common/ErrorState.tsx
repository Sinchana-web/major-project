import React from "react";
import { AlertCircle, RefreshCw, ServerCrash } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isBackendError?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Prediction Failed",
  message,
  onRetry,
  isBackendError = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/60 rounded-2xl border border-rose-200/70 shadow-sm max-w-xl mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-inner">
        {isBackendError ? (
          <ServerCrash className="w-7 h-7" />
        ) : (
          <AlertCircle className="w-7 h-7" />
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed max-w-md">
        {message}
      </p>

      {isBackendError && (
        <div className="bg-white/80 p-3 rounded-lg border border-rose-200/50 mb-6 text-xs text-slate-500 text-left font-mono w-full max-w-sm">
          <p className="font-semibold text-slate-700 mb-1">Troubleshooting Checklist:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ensure Flask server is running: <code className="bg-slate-100 px-1 py-0.5 rounded">python app.py</code></li>
            <li>Verify server endpoint: <code className="bg-slate-100 px-1 py-0.5 rounded">http://127.0.0.1:5000/predict</code></li>
            <li>Confirm CORS headers are active on the backend</li>
          </ul>
        </div>
      )}

      {onRetry && (
        <Button variant="primary" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
