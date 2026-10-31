import React, { useRef, useState, useEffect } from "react";
import {
  Upload,
  FileImage,
  Video,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle,
} from "lucide-react";
import { Button } from "../common/Button";
import { CameraModal } from "./CameraModal";
import { useLanguage } from "../../context/LanguageContext";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  error?: string | null;
  setError?: (err: string | null) => void;
  autoOpenCamera?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  error,
  setError,
  autoOpenCamera = false,
}) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoOpenCamera) {
      setShowCameraModal(true);
    }
  }, [autoOpenCamera]);

  const validateAndSelectFile = (file: File) => {
    if (setError) setError(null);

    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"];
    const validVideoTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const isImage = validImageTypes.includes(file.type) || ["jpg", "jpeg", "png", "webp", "heic"].includes(extension);
    const isVideo = validVideoTypes.includes(file.type) || ["mp4", "mov", "webm", "avi"].includes(extension);

    if (!isImage && !isVideo) {
      if (setError) {
        setError("Unsupported format. Please upload an image (JPG, PNG, WEBP, HEIC) or video (MP4, MOV, WEBM).");
      }
      return;
    }

    // Max 50 MB for media
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      if (setError) {
        setError("File size must be less than 50 MB.");
      }
      return;
    }

    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,video/mp4,video/quicktime,video/webm,video/x-msvideo"
        onChange={handleFileChange}
        className="hidden"
        id="cattle-gallery-input"
      />

      <input
        ref={mobileCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="cattle-mobile-camera-input"
      />

      {/* Primary Capture Action Cards: Live Camera & Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Interactive Live Camera Viewfinder */}
        <div className="relative bg-gradient-to-br from-emerald-900 via-brand-900 to-slate-900 rounded-3xl p-6 text-white overflow-hidden shadow-lg border border-emerald-700/50 flex flex-col justify-between group">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-emerald-500/20 blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-emerald-600/60 flex items-center justify-center text-emerald-300 shadow-sm group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Live Viewfinder</span>
              </span>
            </div>

            <h3 className="text-xl font-black tracking-tight mb-2">
              {t.liveCameraScanner}
            </h3>
            <p className="text-xs text-slate-200/90 leading-relaxed mb-6 font-light">
              {t.liveCameraDesc} Features horn curvature guides, flashlight torch toggle, and 3-second timer.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              icon={Camera}
              onClick={() => setShowCameraModal(true)}
              className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold border-none shadow-md cursor-pointer flex-1 justify-center"
            >
              {t.openLiveCamera}
            </Button>

            <button
              type="button"
              onClick={() => mobileCameraInputRef.current?.click()}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Open smartphone device camera app directly"
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Device App</span>
            </button>
          </div>
        </div>

        {/* Card 2: Gallery & File Upload */}
        <div
          onClick={() => galleryInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-3xl p-6 text-slate-800 border-2 border-dashed transition-all cursor-pointer flex flex-col justify-between ${
            isDragging
              ? "border-emerald-600 bg-emerald-50 scale-[1.01] shadow-md"
              : "border-slate-300 bg-white hover:border-emerald-500 hover:bg-slate-50/60 shadow-xs"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                <Upload className="w-6 h-6 stroke-[1.75]" />
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Max 50 MB
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {t.chooseGallery}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {t.dropMediaHere} or choose cattle photos from your phone gallery or computer folders.
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] font-medium text-slate-500">
              <span className="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <FileImage className="w-3 h-3 text-emerald-600" /> JPG, PNG, WEBP, HEIC
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Video className="w-3 h-3 text-teal-600" /> MP4, MOV
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            icon={ImageIcon}
            onClick={(e) => {
              e.stopPropagation();
              galleryInputRef.current?.click();
            }}
            className="w-full justify-center font-bold"
          >
            {t.clickToBrowse}
          </Button>
        </div>
      </div>

      {/* Photography Advisory for Higher AI Accuracy */}
      <div className="bg-emerald-50/70 rounded-2xl p-4 sm:p-5 border border-emerald-200/80">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-800" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
            {t.cameraTips}
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-900/90 leading-relaxed">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
            <span>{t.tip1}</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
            <span>{t.tip2}</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
            <span>{t.tip3}</span>
          </div>
        </div>
      </div>

      {/* Interactive WebRTC Camera Viewfinder Modal */}
      <CameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={(capturedFile) => validateAndSelectFile(capturedFile)}
        onUseNativeCamera={() => mobileCameraInputRef.current?.click()}
      />
    </div>
  );
};
