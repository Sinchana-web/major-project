import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  ScanSearch,
  Printer,
  Bookmark,
  ArrowLeft,
  BookmarkCheck,
  Sparkles,
  MapPin,
} from "lucide-react";
import type { PredictionResult } from "../../types/prediction";
import { formatBreedName } from "../../utils/formatters";
import { ConfidenceCard } from "./ConfidenceCard";
import { BreedResemblanceBreakdown } from "./BreedResemblanceBreakdown";
import { AnimalDetails } from "./AnimalDetails";
import { BreedDescription } from "./BreedDescription";
import { NationalBreedProfileCard } from "../passport/NationalBreedProfileCard";
import { Button } from "../common/Button";
import { savePredictionToHistory } from "../../utils/storage";

interface ResultCardProps {
  result: PredictionResult;
  imageFile?: File | null;
  onResetScan: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  imageFile,
  onResetScan,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [mediaUrl] = useState<string>(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    return "";
  });

  const isVideo =
    result.media_type === "video" ||
    (imageFile && (imageFile.type.startsWith("video/") || /\.(mp4|mov|webm|avi)$/i.test(imageFile.name)));

  const formattedBreed = formatBreedName(result.breed);

  const handleSaveResult = () => {
    savePredictionToHistory(result, mediaUrl);
    setIsSaved(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Analysis Complete
                </span>
                {result.animal_gender && (
                  <span className="text-xs font-bold tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {result.animal_gender}
                  </span>
                )}
                {result.engine && (
                  <span className="text-xs font-semibold tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>{result.engine}</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {formattedBreed} ({result.species})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap no-print">
            <Button
              variant="outline"
              size="sm"
              icon={isSaved ? BookmarkCheck : Bookmark}
              onClick={handleSaveResult}
              className={isSaved ? "text-emerald-700 border-emerald-300 bg-emerald-50" : ""}
            >
              {isSaved ? "Saved" : "Save Result"}
            </Button>
            <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
              Print Report
            </Button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Media Preview (Photo or Video) */}
          <div className="lg:col-span-5 relative bg-slate-900 rounded-2xl overflow-hidden shadow-inner aspect-4/3 flex items-center justify-center border border-slate-200">
            {mediaUrl ? (
              isVideo ? (
                <video
                  src={mediaUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={formattedBreed}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="text-slate-400 text-sm flex flex-col items-center">
                <ScanSearch className="w-12 h-12 text-slate-600 mb-2" />
                <span>Media Sample</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs flex justify-between items-center">
              <span className="font-mono text-emerald-400 font-bold">
                {result.animal_id}
              </span>
              <span className="font-medium text-slate-300">
                {result.species} {result.animal_gender ? `• ${result.animal_gender}` : ""}
              </span>
            </div>
          </div>

          {/* Right Column: Confidence Visualization & Primary Stats */}
          <div className="lg:col-span-7 space-y-6">
            <ConfidenceCard
              confidence={result.confidence}
              detectionConfidence={result.detection_confidence}
            />

            {/* Quick Metadata Pill Summary */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                    Identified Breed
                  </span>
                  <span className="text-2xl font-black text-white">
                    {formattedBreed}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                    Taxonomy / Role
                  </span>
                  <span className="text-base font-bold text-emerald-300">
                    {result.species} {result.purpose ? `(${result.purpose})` : ""}
                  </span>
                </div>
              </div>

              {result.region && (
                <div className="pt-3 border-t border-slate-800 flex items-start gap-2 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Seen Most in:</strong> {result.region}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 100% Multi-Breed Resemblance & Phenotype Breakdown */}
        <BreedResemblanceBreakdown
          resemblances={result.breed_resemblances}
          primaryBreed={formattedBreed}
          primaryConfidence={result.confidence}
        />

        {/* Detailed Breakdown Cards */}
        <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">
            Biological Traits & Morphological Assessment
          </h3>
          <AnimalDetails result={result} />
          <BreedDescription
            breed={formattedBreed}
            description={result.description}
          />
        </div>

        {/* National Breed Dossier (Zero Owner Info) */}
        {result.national_breed_profile && (
          <NationalBreedProfileCard
            profile={result.national_breed_profile}
            engine={result.engine}
          />
        )}

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <Link to="/dashboard">
            <Button variant="ghost" icon={ArrowLeft}>
              Back to Dashboard
            </Button>
          </Link>
          <Button variant="primary" icon={ScanSearch} onClick={onResetScan}>
            Analyze Another Animal
          </Button>
        </div>
      </div>
    </div>
  );
};
