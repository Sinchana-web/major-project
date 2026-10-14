import React from "react";
import { Menu, Sparkles, ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between no-print">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-800 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-300" />
          </div>
          <span className="font-bold text-slate-900 text-base">Pashu Pehchaan</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/recognize"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-brand-50 text-brand-800 hover:bg-brand-100 text-xs font-semibold border border-brand-200 transition-colors"
        >
          <ScanSearch className="w-3.5 h-3.5" />
          <span>Quick Scan</span>
        </Link>
      </div>
    </header>
  );
};
