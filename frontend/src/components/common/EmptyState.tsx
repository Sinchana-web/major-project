import React from "react";
import { Database, ScanSearch } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Records Found",
  description = "Your identified animals will appear here once you scan an image.",
  actionText = "Identify Breed Now",
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4 shadow-sm">
        <Database className="w-8 h-8 opacity-80" />
      </div>

      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>

      {onAction && (
        <Button variant="primary" icon={ScanSearch} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
