import React, { useState } from "react";
import type { PredictionResult, RecognitionStatus } from "../types/prediction";
import { predictBreed } from "../services/api";
import { ImageUploader } from "../components/upload/ImageUploader";
import { ImagePreview } from "../components/upload/ImagePreview";
import { ScanAnimation } from "../components/upload/ScanAnimation";
import { ResultCard } from "../components/results/ResultCard";
import { ErrorState } from "../components/common/ErrorState";

export const Recognize: React.FC = () => {
  const [status, setStatus] = useState<RecognitionStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBackendError, setIsBackendError] = useState<boolean>(false);

  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    setStatus("selected");
    setErrorMessage(null);
    setIsBackendError(false);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setStatus("idle");
    setErrorMessage(null);
  };

  const handleIdentifyBreed = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select an image first.");
      setStatus("error");
      return;
    }

    setStatus("processing");
    setErrorMessage(null);
    setIsBackendError(false);

    try {
      const data = await predictBreed(selectedFile);
      setResult(data);
      setStatus("success");
    } catch (err: any) {
      console.error("Prediction API call error:", err);
      let msg = "Unable to connect to the AI engine. Please make sure the backend server is running.";
      let isNetErr = true;

      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          msg = err.response.data;
        } else if (err.response.data.message) {
          msg = err.response.data.message;
        } else if (err.response.data.error) {
          msg = err.response.data.error;
        }
        isNetErr = false;
      } else if (err.message) {
        msg = `Network error: ${err.message}. Please check that the Flask backend is running on port 5000.`;
      }

      setErrorMessage(msg);
      setIsBackendError(isNetErr);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
    setIsBackendError(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      {status !== "success" && (
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Identify Your Animal
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Upload a clear image of a cattle or livestock animal to identify its breed using deep learning.
          </p>
        </div>
      )}

      {/* State Render Switch */}
      {status === "idle" && (
        <ImageUploader
          onImageSelected={handleImageSelected}
          error={errorMessage}
          setError={setErrorMessage}
        />
      )}

      {status === "selected" && selectedFile && (
        <ImagePreview
          file={selectedFile}
          onRemove={handleRemoveImage}
          onIdentify={handleIdentifyBreed}
        />
      )}

      {status === "processing" && selectedFile && (
        <ScanAnimation imageFile={selectedFile} />
      )}

      {status === "success" && result && (
        <ResultCard
          result={result}
          imageFile={selectedFile}
          onResetScan={handleReset}
        />
      )}

      {status === "error" && (
        <ErrorState
          title="Breed Identification Error"
          message={
            errorMessage ||
            "An unexpected error occurred while processing the image."
          }
          isBackendError={isBackendError}
          onRetry={() => {
            if (selectedFile) {
              setStatus("selected");
            } else {
              handleReset();
            }
          }}
        />
      )}
    </div>
  );
};
