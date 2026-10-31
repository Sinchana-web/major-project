import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Trash2,
  Calendar,
  X,
  FileSpreadsheet,
} from "lucide-react";
import type { HistoryRecord } from "../types/prediction";
import {
  getPredictionHistory,
  clearPredictionHistory,
} from "../utils/storage";
import { HistoryCard } from "../components/history/HistoryCard";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/common/Button";
import { ResultCard } from "../components/results/ResultCard";
import { formatBreedName } from "../utils/formatters";
import { exportHistoryToCSV } from "../utils/csvExport";
import { useLanguage } from "../context/LanguageContext";

export const History: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(
    null
  );

  useEffect(() => {
    setHistory(getPredictionHistory());
  }, []);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const confirmClearHistory = () => {
    clearPredictionHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const handleExportCsv = () => {
    exportHistoryToCSV(history);
  };

  // Get unique breed options for filter dropdown
  const uniqueBreeds = Array.from(
    new Set(history.map((item) => formatBreedName(item.breed)))
  );

  // Filter & Search Logic
  const filteredHistory = history
    .filter((item) => {
      const breedFormatted = formatBreedName(item.breed).toLowerCase();
      const matchesSearch =
        item.animal_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        breedFormatted.includes(searchQuery.toLowerCase()) ||
        item.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBreed =
        selectedBreed === "ALL" ||
        breedFormatted === selectedBreed.toLowerCase();

      return matchesSearch && matchesBreed;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });

  if (history.length === 0) {
    return (
      <EmptyState
        title="No Scan History Found"
        description="Your identified animals will appear here after running recognition scans."
        actionText="Identify Breed Now"
        onAction={() => navigate("/recognize")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {t.navHistory}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Access previous livestock recognition records stored locally on your device.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={handleExportCsv}
            className="text-emerald-800 hover:bg-emerald-50 border-emerald-200"
          >
            {t.exportCsv}
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={() => setShowClearConfirm(true)}
            className="text-rose-600 hover:bg-rose-50 border-rose-200"
          >
            {t.clearHistory}
          </Button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Animal ID, Breed, Species, or Region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Breed Filter Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm flex-1 md:flex-initial">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="bg-transparent text-slate-700 focus:outline-none font-medium"
            >
              <option value="ALL">All Breeds</option>
              {uniqueBreeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm flex-1 md:flex-initial">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="bg-transparent text-slate-700 focus:outline-none font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of History Cards */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No records match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((record) => (
            <HistoryCard
              key={record.id}
              record={record}
              onClick={() => setSelectedRecord(record)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal overlay when clicking a history card */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <ResultCard
              result={selectedRecord}
              onResetScan={() => {
                setSelectedRecord(null);
                navigate("/recognize");
              }}
            />
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center">Clear Scan History?</h3>
            <p className="text-sm text-slate-500 text-center mt-2">
              Are you sure you want to clear all scan history records from local storage? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmClearHistory}
                className="flex-1"
              >
                Yes, Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
