import React, { useEffect, useState } from "react";
import { Trash2, ScanSearch, HardDrive, CheckCircle2, Video, FileImage } from "lucide-react";
import { Button } from "../common/Button";
import { formatFileSize } from "../../utils/formatters";

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  onIdentify: () => void;
  isLoading?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  onRemove,
  onIdentify,
  isLoading = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|webm|avi)$/i.test(file.name);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
        {/* Left: Media preview (image or video) */}
        <div className="w-full md:w-1/2 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/60 aspect-4/3 flex items-center justify-center group">
          {previewUrl && (
            isVideo ? (
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Uploaded livestock preview"
                className="w-full h-full object-cover rounded-2xl"
              />
            )
          )}
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready for Analysis ({isVideo ? "Video" : "Photo"})</span>
          </div>
        </div>

        {/* Right: File Details & Actions */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Selected Media Details
            </h3>

            <div className="space-y-3.5 mb-6">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 text-sm">
                <div className="flex items-center gap-2.5 text-slate-600 truncate">
                  {isVideo ? (
                    <Video className="w-4 h-4 text-teal-600 shrink-0" />
                  ) : (
                    <FileImage className="w-4 h-4 text-brand-700 shrink-0" />
                  )}
                  <span className="font-medium text-slate-900 truncate">
                    {file.name}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block mb-1 font-medium">Media Type</span>
                  <span className="font-semibold text-slate-800 uppercase">
                    {isVideo ? "Video Stream" : "Still Photo"}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block mb-1 font-medium flex items-center gap-1">
                    <HardDrive className="w-3 h-3" /> File Size
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              icon={Trash2}
              onClick={onRemove}
              disabled={isLoading}
              className="w-full sm:w-auto text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              Remove
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={ScanSearch}
              onClick={onIdentify}
              isLoading={isLoading}
              className="w-full sm:flex-1"
            >
              Analyze Animal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
