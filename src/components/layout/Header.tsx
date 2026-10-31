import React from "react";
import { Menu, Sparkles, ScanSearch, Globe, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between no-print">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="font-bold text-slate-900 text-base">Pashu Pehchaan</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Language Switcher Pill */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              language === "en"
                ? "bg-white text-emerald-900 shadow-2xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage("kn")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              language === "kn"
                ? "bg-white text-emerald-900 shadow-2xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ಕನ್ನಡ
          </button>
        </div>

        {/* Quick Camera Action */}
        <Link
          to="/recognize?mode=camera"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          title={t.quickCameraScan}
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.quickCameraScan}</span>
        </Link>
      </div>
    </header>
  );
};
