import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Camera,
  X,
  RotateCcw,
  Check,
  RefreshCw,
  Zap,
  ZapOff,
  Timer,
  Grid,
  Maximize2,
  Sparkles,
  AlertTriangle,
  Upload,
} from "lucide-react";
import { Button } from "../common/Button";
import { useLanguage } from "../../context/LanguageContext";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  onUseNativeCamera?: () => void;
}

type GuideMode = "horns" | "body" | "grid" | "none";

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  onUseNativeCamera,
}) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [capturedMeta, setCapturedMeta] = useState<{ width: number; height: number; sizeKb: number } | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Advanced Camera Controls
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorchSupport, setHasTorchSupport] = useState(false);
  const [guideMode, setGuideMode] = useState<GuideMode>("horns");
  const [timerSeconds, setTimerSeconds] = useState<0 | 3>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Play synthetic camera sound via Web Audio API (zero audio file dependencies)
  const playBeep = useCallback((freq = 600, duration = 0.05) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context restricted or muted
    }
  }, []);

  const playShutterSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      // Shutter click effect (two quick impulse bursts)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // ignore
    }
  }, []);

  const startCamera = async (mode: "environment" | "user") => {
    try {
      setCameraError(null);
      setIsTorchOn(false);
      setHasTorchSupport(false);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // First attempt: high resolution with ideal facingMode
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920, min: 1024 },
          height: { ideal: 1080, min: 720 },
        },
        audio: false,
      };

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch {
        // Fallback to basic video constraints if ideal fails on certain mobile webviews
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check for torch capability
      const track = mediaStream.getVideoTracks()[0];
      if (track && typeof track.getCapabilities === "function") {
        const capabilities: any = track.getCapabilities();
        if (capabilities && capabilities.torch) {
          setHasTorchSupport(true);
        }
      }
    } catch (err: any) {
      console.warn("Camera access error:", err);
      setCameraError(
        "Camera access is not permitted or unavailable. You can use your device's native camera or upload from gallery."
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedDataUrl(null);
      setCapturedMeta(null);
      setCountdown(null);
      startCamera(facingMode);
    } else {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen]);

  const toggleCamera = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextState = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextState }],
      });
      setIsTorchOn(nextState);
    } catch (err) {
      console.warn("Could not toggle torch:", err);
    }
  };

  const triggerSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const width = video.videoWidth || 1920;
    const height = video.videoHeight || 1080;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // If front camera, mirror horizontally for natural preview
    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    // Visual flash and audio shutter
    setIsFlashing(true);
    playShutterSound();
    setTimeout(() => setIsFlashing(false), 140);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.94);
    const approxKb = Math.round((dataUrl.length * 3) / 4 / 1024);

    setCapturedDataUrl(dataUrl);
    setCapturedMeta({ width, height, sizeKb: approxKb });
  };

  const handleCaptureClick = () => {
    if (timerSeconds === 0) {
      triggerSnap();
    } else {
      // 3-second countdown
      setCountdown(3);
      playBeep(700, 0.08);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setTimeout(() => {
              setCountdown(null);
              triggerSnap();
            }, 200);
            return null;
          }
          const next = prev - 1;
          playBeep(next === 1 ? 900 : 700, 0.08);
          return next;
        });
      }, 1000);
    }
  };

  const handleRetake = () => {
    setCapturedDataUrl(null);
    setCapturedMeta(null);
    setCountdown(null);
    if (!stream) {
      startCamera(facingMode);
    }
  };

  const handleConfirm = () => {
    if (!capturedDataUrl) return;

    fetch(capturedDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File(
          [blob],
          `pashu-camera-${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );
        onCapture(file);
        onClose();
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col max-h-[96vh]">
        {/* Shutter Visual Flash Effect */}
        {isFlashing && (
          <div className="absolute inset-0 z-50 bg-white pointer-events-none transition-opacity duration-150 animate-fadeOut" />
        )}

        {/* Top Header Controls Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300 shadow-sm">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                {t.liveCameraScanner}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {facingMode === "environment" ? "Rear Livestock Camera" : "Front Camera"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {!capturedDataUrl && (
              <>
                {/* Guide overlay toggle */}
                <div className="flex items-center bg-slate-800/80 rounded-xl p-0.5 border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setGuideMode("horns")}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                      guideMode === "horns"
                        ? "bg-emerald-600 text-white font-bold"
                        : "text-slate-300 hover:text-white"
                    }`}
                    title="Horn & Head Guide"
                  >
                    {t.alignHorns}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuideMode("body")}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                      guideMode === "body"
                        ? "bg-emerald-600 text-white font-bold"
                        : "text-slate-300 hover:text-white"
                    }`}
                    title="Body & Flank Profile Guide"
                  >
                    {t.alignBody}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuideMode("grid")}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      guideMode === "grid"
                        ? "bg-emerald-600 text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                    title="Grid Lines"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Torch / Flashlight Toggle */}
                {hasTorchSupport && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isTorchOn
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                    title={isTorchOn ? "Turn Off Torch" : "Turn On Torch"}
                  >
                    {isTorchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
                  </button>
                )}

                {/* 3s Timer Toggle */}
                <button
                  type="button"
                  onClick={() => setTimerSeconds(timerSeconds === 0 ? 3 : 0)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                    timerSeconds > 0
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                  title={timerSeconds === 0 ? "Enable 3s Timer" : "Disable Timer"}
                >
                  <Timer className="w-4 h-4" />
                  <span className="text-[11px] font-mono">{timerSeconds}s</span>
                </button>

                {/* Switch Camera */}
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title={t.switchCamera}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewfinder Window */}
        <div className="relative aspect-4/3 w-full bg-black overflow-hidden flex items-center justify-center">
          {cameraError ? (
            <div className="p-6 text-center text-slate-300 max-w-md space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-rose-300">{cameraError}</p>
                <p className="text-xs text-slate-400 mt-1">
                  On mobile devices, you can launch the native camera app directly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                {onUseNativeCamera && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Camera}
                    onClick={() => {
                      onClose();
                      onUseNativeCamera();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 font-bold"
                  >
                    Open Device Camera
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-slate-700 bg-slate-800"
                  onClick={() => startCamera(facingMode)}
                >
                  {t.retry}
                </Button>
              </div>
            </div>
          ) : capturedDataUrl ? (
            <div className="relative w-full h-full">
              <img
                src={capturedDataUrl}
                alt="Captured livestock"
                className="w-full h-full object-contain bg-slate-950"
              />

              {/* Quality & Resolution Stamp */}
              {capturedMeta && (
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-[11px] font-mono flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">READY</span>
                  <span>{capturedMeta.width} × {capturedMeta.height} px</span>
                  <span className="text-slate-400">({capturedMeta.sizeKb} KB)</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
              />

              {/* Countdown Overlay Badge */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-30">
                  <div className="w-24 h-24 rounded-full bg-emerald-600 text-white text-5xl font-black flex items-center justify-center shadow-2xl animate-ping duration-1000">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Livestock Alignment Overlays */}
              {guideMode === "horns" && (
                <div className="absolute inset-6 sm:inset-10 pointer-events-none flex flex-col justify-between p-2">
                  {/* Horn Silhouette Archetype */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl shadow-sm"></div>
                    {/* Upper Horn Curve Guideline */}
                    <div className="flex-1 max-w-xs mx-auto border-t-2 border-dashed border-emerald-400/70 pt-1 text-center">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                        Horn Tips & Crown Area
                      </span>
                    </div>
                    <div className="w-12 h-12 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl shadow-sm"></div>
                  </div>

                  {/* Center Head Frame */}
                  <div className="w-40 sm:w-56 h-40 sm:h-56 mx-auto border-2 border-emerald-400/40 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-400/60"></div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="w-12 h-12 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl shadow-sm"></div>
                    <div className="text-center pb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-black/70 px-3 py-1 rounded-full border border-emerald-400/40 shadow-sm">
                        Muzzle & Dewlap Base
                      </span>
                    </div>
                    <div className="w-12 h-12 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl shadow-sm"></div>
                  </div>
                </div>
              )}

              {guideMode === "body" && (
                <div className="absolute inset-6 sm:inset-12 border-2 border-dashed border-teal-400/60 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-teal-300 bg-black/70 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                      HUMP & DORSAL LINE
                    </span>
                    <span className="text-[10px] font-mono text-teal-300 bg-black/70 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                      RUMP
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[11px] font-mono font-bold text-white bg-teal-950/80 px-4 py-1 rounded-full border border-teal-400/50">
                      SIDE FLANK PROFILE (Cattle / Buffalo)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-teal-300 bg-black/70 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                      FRONT LEGS
                    </span>
                    <span className="text-[10px] font-mono text-teal-300 bg-black/70 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                      HIND LEGS
                    </span>
                  </div>
                </div>
              )}

              {guideMode === "grid" && (
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-b border-white/20"></div>
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-b border-white/20"></div>
                  <div className="border-r border-white/20"></div>
                  <div className="border-r border-white/20"></div>
                  <div></div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls Toolbar Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
          {capturedDataUrl ? (
            <div className="w-full flex items-center justify-between gap-3">
              <Button
                variant="outline"
                icon={RotateCcw}
                onClick={handleRetake}
                className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 cursor-pointer"
              >
                {t.retake}
              </Button>

              <Button
                variant="primary"
                icon={Check}
                onClick={handleConfirm}
                className="bg-emerald-600 hover:bg-emerald-500 font-bold px-6 shadow-lg shadow-emerald-900/30 cursor-pointer"
              >
                {t.usePhoto}
              </Button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              {/* Left Fallback: Mobile native camera trigger */}
              <div className="text-left">
                {onUseNativeCamera && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onUseNativeCamera();
                    }}
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Use Native Phone App</span>
                  </button>
                )}
              </div>

              {/* Center Shutter Button */}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleCaptureClick}
                  disabled={countdown !== null}
                  className="w-18 h-18 rounded-full bg-white p-1.5 flex items-center justify-center shadow-xl active:scale-95 transition-transform cursor-pointer group disabled:opacity-50"
                  title={t.capture}
                >
                  <div className="w-15 h-15 rounded-full bg-emerald-600 group-hover:bg-emerald-500 flex items-center justify-center transition-colors shadow-inner">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                </button>
              </div>

              {/* Right Hints info */}
              <div className="text-right text-[11px] text-slate-400 hidden sm:block max-w-[130px] leading-tight">
                Tap button to snap instant photo
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
