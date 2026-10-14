import React, { useRef, useState } from "react";
import { Upload, FileImage, Video, AlertCircle } from "lucide-react";
import { Button } from "../common/Button";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  error?: string | null;
  setError?: (err: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  error,
  setError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelectFile = (file: File) => {
    if (setError) setError(null);

    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    const validVideoTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const isImage = validImageTypes.includes(file.type) || ["jpg", "jpeg", "png"].includes(extension);
    const isVideo = validVideoTypes.includes(file.type) || ["mp4", "mov", "webm", "avi"].includes(extension);

    if (!isImage && !isVideo) {
      if (setError) {
        setError("Unsupported format. Please upload a photo (JPG, PNG) or video (MP4, MOV, WEBM).");
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
      const file = e.dataTransfer.files[0];
      validateAndSelectFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-brand-600 bg-brand-50/80 scale-[1.01] shadow-lg shadow-brand-900/5"
            : "border-slate-300 hover:border-brand-500 bg-white hover:bg-slate-50/50 shadow-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime,video/webm,video/x-msvideo"
          onChange={handleFileChange}
          className="hidden"
          id="cattle-media-input"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-6 shadow-xs group-hover:scale-110 transition-transform duration-200">
            <Upload className="w-10 h-10 stroke-[1.75]" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Drop your photo or video here
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            or <span className="text-brand-700 font-semibold underline underline-offset-4">click to browse</span> from your device
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs font-medium text-slate-500 bg-slate-100/80 px-4 py-2 rounded-full">
            <span className="flex items-center gap-1 text-slate-700">
              <FileImage className="w-3.5 h-3.5 text-brand-600" /> Photos: JPG, PNG
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <Video className="w-3.5 h-3.5 text-teal-600" /> Videos: MP4, MOV, WEBM (Max 50 MB)
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Choose Photo or Video
          </Button>
        </div>
      </div>
    </div>
  );
};
