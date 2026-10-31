import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "kn";

export interface Translations {
  appName: string;
  appSubtitle: string;
  navDashboard: string;
  navRecognize: string;
  navExplore: string;
  navCompare: string;
  navHistory: string;
  navFarmerInfo: string;
  navAbout: string;
  quickScan: string;
  identifyTitle: string;
  identifySubtitle: string;
  dropMediaHere: string;
  clickToBrowse: string;
  takePhotoCamera: string;
  chooseGallery: string;
  analyzingLivestock: string;
  analyzingSubtitle: string;
  analysisComplete: string;
  saveResult: string;
  saved: string;
  printReport: string;
  downloadPassportPdf: string;
  shareRecord: string;
  linkCopied: string;
  passportShared: string;
  identifiedBreed: string;
  taxonomyRole: string;
  seenMostIn: string;
  resemblanceBreakdown: string;
  observedTraitDist: string;
  biologicalTraits: string;
  nationalBreedIntelligence: string;
  whereSeenInIndia: string;
  historyAndOrigin: string;
  milkVsCultivation: string;
  rearingAndCare: string;
  icarStandards: string;
  dailyMilkYield: string;
  fatPercentage: string;
  cultivationStamina: string;
  soilSuitability: string;
  totalScans: string;
  successfulScans: string;
  cattleVsBuffalo: string;
  topBreeds: string;
  monthlyTrend: string;
  exportCsv: string;
  clearHistory: string;
  compareBreedsTitle: string;
  compareBreedsSubtitle: string;
  selectBreedsToCompare: string;
  farmerGuideTitle: string;
  farmerGuideSubtitle: string;
  a2MilkBenefits: string;
  droughtResistance: string;
  verifiedIcarBadge: string;
  aiEstimatedBadge: string;
  engineOnline: string;
  reconnecting: string;
  close: string;
  retry: string;
  liveCameraScanner: string;
  liveCameraDesc: string;
  openLiveCamera: string;
  switchCamera: string;
  torch: string;
  timer: string;
  capture: string;
  retake: string;
  usePhoto: string;
  alignHorns: string;
  alignBody: string;
  gridLines: string;
  noOverlay: string;
  cameraTips: string;
  tip1: string;
  tip2: string;
  tip3: string;
  quickCameraScan: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: "Pashu Pehchaan",
    appSubtitle: "AI Livestock Diagnostic Suite",
    navDashboard: "Dashboard",
    navRecognize: "Breed Recognition",
    navExplore: "Search & Explore",
    navCompare: "Breed Comparison",
    navHistory: "Scan History",
    navFarmerInfo: "Farmer Advisory",
    navAbout: "About AI Engine",
    quickScan: "Quick Scan",
    identifyTitle: "Identify Your Livestock",
    identifySubtitle: "Upload an image or capture a photo of cattle or buffalo for instant AI recognition and ICAR-NBAGR passport generation.",
    dropMediaHere: "Drop photo or video here",
    clickToBrowse: "click to browse",
    takePhotoCamera: "Take Live Photo",
    chooseGallery: "Choose from Gallery",
    analyzingLivestock: "Analyzing Livestock Sample",
    analyzingSubtitle: "Please wait while our computer vision pipeline evaluates visual genetics and anatomical features.",
    analysisComplete: "Analysis Complete",
    saveResult: "Save Result",
    saved: "Saved",
    printReport: "Print Report",
    downloadPassportPdf: "Download PDF Passport",
    shareRecord: "Share Record",
    linkCopied: "Passport link copied to clipboard!",
    passportShared: "Passport shared successfully!",
    identifiedBreed: "Identified Breed",
    taxonomyRole: "Taxonomy / Role",
    seenMostIn: "Seen Most In",
    resemblanceBreakdown: "Breed Resemblance Breakdown",
    observedTraitDist: "Observed Trait Distribution",
    biologicalTraits: "Biological Traits & Anatomy",
    nationalBreedIntelligence: "National Breed Intelligence",
    whereSeenInIndia: "Where Seen in India",
    historyAndOrigin: "History & Biology",
    milkVsCultivation: "Milk vs Cultivation",
    rearingAndCare: "Rearing & Management",
    icarStandards: "ICAR Standards & Registry",
    dailyMilkYield: "Daily Milk Yield (Cows)",
    fatPercentage: "Fat Percentage",
    cultivationStamina: "Field Cultivation Stamina",
    soilSuitability: "Soil Suitability",
    totalScans: "Total Animals Scanned",
    successfulScans: "Confident Identifications",
    cattleVsBuffalo: "Cattle vs Buffalo Ratio",
    topBreeds: "Frequently Identified Breeds",
    monthlyTrend: "Monthly Scan Activity",
    exportCsv: "Export CSV",
    clearHistory: "Clear History",
    compareBreedsTitle: "Indigenous Breed Comparison",
    compareBreedsSubtitle: "Compare morphological features, milk characteristics, and draught capability side-by-side across Indian breeds.",
    selectBreedsToCompare: "Select breeds to compare:",
    farmerGuideTitle: "Farmer Livestock Advisory & Care",
    farmerGuideSubtitle: "Scientifically validated management guidelines for Indian indigenous cattle and buffalo breeds.",
    a2MilkBenefits: "A2 Beta-Casein Milk Profile",
    droughtResistance: "Heat & Tropical Disease Resilience",
    verifiedIcarBadge: "ICAR-NBAGR Verified Standard",
    aiEstimatedBadge: "Vision Model Estimation",
    engineOnline: "AI Engine Online",
    reconnecting: "Reconnecting...",
    close: "Close",
    retry: "Try Again",
    liveCameraScanner: "Live Camera Scanner",
    liveCameraDesc: "Direct real-time viewfinder with livestock framing guidelines and instant shutter.",
    openLiveCamera: "Launch Live Camera",
    switchCamera: "Switch Camera (Front/Rear)",
    torch: "Flashlight / Torch",
    timer: "Shutter Timer",
    capture: "Capture Photo",
    retake: "Retake Photo",
    usePhoto: "Use Photo & Recognize",
    alignHorns: "Horns & Head",
    alignBody: "Body & Flank",
    gridLines: "3x3 Grid",
    noOverlay: "Clear",
    cameraTips: "Camera Framing Guidelines",
    tip1: "Position animal sideways or 45° angle to capture horns, hump, and dewlap clearly.",
    tip2: "Ensure good ambient lighting or turn on the flashlight for shaded cow sheds.",
    tip3: "Keep hands steady or enable the 3-second timer before taking the shot.",
    quickCameraScan: "Camera Scan",
  },
  kn: {
    appName: "ಪಶು ಗುರುತು (Pashu Pehchaan)",
    appSubtitle: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಜಾನುವಾರು ತಳಿ ಪತ್ತೆ",
    navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navRecognize: "ತಳಿ ಗುರುತಿಸುವಿಕೆ",
    navExplore: "ತಳಿಗಳ ಹುಡುಕಾಟ",
    navCompare: "ತಳಿ ಹೋಲಿಕೆ",
    navHistory: "ಇತಿಹಾಸ",
    navFarmerInfo: "ರೈತ ಮಾರ್ಗದರ್ಶಿ",
    navAbout: "AI ತಂತ್ರಜ್ಞಾನ",
    quickScan: "ತ್ವರಿತ ಸ್ಕ್ಯಾನ್",
    identifyTitle: "ನಿಮ್ಮ ಜಾನುವಾರಿನ ತಳಿ ಗುರುತಿಸಿ",
    identifySubtitle: "ಹಸು ಅಥವಾ ಎಮ್ಮೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ತಳಿ ಮಾಹಿತಿ ಮತ್ತು ಅಧಿಕೃತ ಪಾಸ್‌ಪೋರ್ಟ್ ಪಡೆಯಿರಿ.",
    dropMediaHere: "ಫೋಟೋ ಅಥವಾ ವೀಡಿಯೊ ಇಲ್ಲಿ ಹಾಕಿ",
    clickToBrowse: "ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    takePhotoCamera: "ಕ್ಯಾಮೆರಾದಿಂದ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    chooseGallery: "ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ",
    analyzingLivestock: "ಜಾನುವಾರನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ",
    analyzingSubtitle: "ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಮತ್ತು ಜೆಮಿನೈ ಎಐ ಮೂಲಕ ಜಾನುವಾರಿನ ಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ, ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ.",
    analysisComplete: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
    saveResult: "ಉಳಿಸಿ",
    saved: "ಉಳಿಸಲಾಗಿದೆ",
    printReport: "ಮುದ್ರಿಸಿ (Print)",
    downloadPassportPdf: "PDF ಪಾಸ್‌ಪೋರ್ಟ್ ಡೌನ್‌ಲೋಡ್",
    shareRecord: "ಹಂಚಿಕೊಳ್ಳಿ (Share)",
    linkCopied: "ಪಾಸ್‌ಪೋರ್ಟ್ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!",
    passportShared: "ಪಾಸ್‌ಪೋರ್ಟ್ ಯಶಸ್ವಿಯಾಗಿ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ!",
    identifiedBreed: "ಗುರುತಿಸಲಾದ ತಳಿ",
    taxonomyRole: "ವರ್ಗೀಕರಣ / ಪಾತ್ರ",
    seenMostIn: "ಹೆಚ್ಚಾಗಿ ಕಂಡುಬರುವ ಪ್ರದೇಶ",
    resemblanceBreakdown: "ತಳಿ ಹೋಲಿಕೆಯ ಶೇಕಡಾವಾರು ವಿಂಗಡಣೆ",
    observedTraitDist: "ಲಕ್ಷಣಗಳ ಹಂಚಿಕೆ",
    biologicalTraits: "ಜೈವಿಕ ಲಕ್ಷಣಗಳು ಮತ್ತು ಮೈಕಟ್ಟು",
    nationalBreedIntelligence: "ರಾಷ್ಟ್ರೀಯ ತಳಿ ಮಾಹಿತಿ ಕೋಶ",
    whereSeenInIndia: "ಭಾರತದಲ್ಲಿ ಎಲ್ಲಿ ಕಂಡುಬರುತ್ತದೆ",
    historyAndOrigin: "ಇತಿಹಾಸ ಮತ್ತು ಮೂಲ",
    milkVsCultivation: "ಹಾಲು ಮತ್ತು ಉಳುಮೆ ಸಾಮರ್ಥ್ಯ",
    rearingAndCare: "ಪಾಲನೆ ಮತ್ತು ನಿರ್ವಹಣೆ",
    icarStandards: "ICAR ರಾಷ್ಟ್ರೀಯ ಮಾನದಂಡಗಳು",
    dailyMilkYield: "ದೈನಂದಿನ ಹಾಲಿನ ಇಳುವರಿ (ಹಸು)",
    fatPercentage: "ವೆಣ್ಣೆಯ ಪ್ರಮಾಣ (Fat %)",
    cultivationStamina: "ಉಳುಮೆ ಮತ್ತು ಕೃಷಿ ಶಕ್ತಿ",
    soilSuitability: "ಮಣ್ಣಿನ ಹೊಂದಾಣಿಕೆ",
    totalScans: "ಒಟ್ಟು ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಪ್ರಾಣಿಗಳು",
    successfulScans: "ಯಶಸ್ವಿ ಗುರುತಿಸುವಿಕೆಗಳು",
    cattleVsBuffalo: "ಹಸು ಮತ್ತು ಎಮ್ಮೆ ಅನುಪಾತ",
    topBreeds: "ಹೆಚ್ಚು ಗುರುತಿಸಲ್ಪಟ್ಟ ತಳಿಗಳು",
    monthlyTrend: "ಮಾಸಿಕ ಸ್ಕ್ಯಾನ್ ವಿವರ",
    exportCsv: "CSV ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    clearHistory: "ಇತಿಹಾಸ ಅಳಿಸಿ",
    compareBreedsTitle: "ದೇಶಿ ತಳಿಗಳ ಮುಖಾಮುಖಿ ಹೋಲಿಕೆ",
    compareBreedsSubtitle: "ಭಾರತದ ವಿಶಿಷ್ಟ ಹಸು ಮತ್ತು ಎಮ್ಮೆ ತಳಿಗಳ ಹಾಲು, ಉಳುಮೆ ಮತ್ತು ದೈಹಿಕ ಲಕ್ಷಣಗಳನ್ನು ನೇರವಾಗಿ ಹೋಲಿಸಿ ನೋಡಿ.",
    selectBreedsToCompare: "ಹೋಲಿಕೆ ಮಾಡಲು ತಳಿಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
    farmerGuideTitle: "ರೈತರಿಗಾಗಿ ಜಾನುವಾರು ಸಲಹೆ ಮತ್ತು ಮಾಹಿತಿ",
    farmerGuideSubtitle: "ಭಾರತೀಯ ದೇಶಿ ಗೋತಳಿಗಳ ಸಂರಕ್ಷಣೆ, ಪೌಷ್ಟಿಕ ಆಹಾರ ಮತ್ತು ಸುಸ್ಥಿರ ಹೈನುಗಾರಿಕೆ ಮಾಹಿತಿ.",
    a2MilkBenefits: "ನೈಸರ್ಗಿಕ A2 ಹಾಲಿನ ಮಹತ್ವ",
    droughtResistance: "ಬಿಸಿಲು ಮತ್ತು ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ",
    verifiedIcarBadge: "ICAR-NBAGR ಮಾನ್ಯತೆ ಪಡೆದ ಮಾಹಿತಿ",
    aiEstimatedBadge: "AI ಅಂದಾಜಿಸಿದ ವಿವರಣೆ",
    engineOnline: "AI ಎಂಜಿನ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    reconnecting: "ಮರುಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...",
    close: "ಮುಚ್ಚಿ",
    retry: "ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ",
    liveCameraScanner: "ಲೈವ್ ಕ್ಯಾಮೆರಾ ಸ್ಕ್ಯಾನರ್",
    liveCameraDesc: "ಜಾನುವಾರು ಜೋಡಣೆ ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಶಟರ್ ಹೊಂದಿರುವ ನೇರ ಕ್ಯಾಮೆರಾ ವೀಕ್ಷಕ.",
    openLiveCamera: "ಲೈವ್ ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ",
    switchCamera: "ಕ್ಯಾಮೆರಾ ಬದಲಿಸಿ (ಮುಂಭಾಗ/ಹಿಂಭಾಗ)",
    torch: "ಫ್ಲ್ಯಾಶ್‌ಲೈಟ್",
    timer: "ಟೈಮರ್",
    capture: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
    retake: "ಮತ್ತೆ ತೆಗೆಯಿರಿ",
    usePhoto: "ಈ ಫೋಟೋ ಬಳಸಿ ವಿಶ್ಲೇಷಿಸಿ",
    alignHorns: "ಕೊಂಬುಗಳು ಮತ್ತು ಮುಖ",
    alignBody: "ದೇಹ ಮತ್ತು ಮೈಕಟ್ಟು",
    gridLines: "ಗ್ರಿಡ್ ರೇಖೆಗಳು",
    noOverlay: "ಸ್ಪಷ್ಟ",
    cameraTips: "ಕ್ಯಾಮೆರಾ ಛಾಯಾಗ್ರಹಣ ಸಲಹೆಗಳು",
    tip1: "ಕೊಂಬುಗಳು, ಡುಬ್ಬ ಮತ್ತು ಕಿವಿಗಳು ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುವಂತೆ ಪ್ರಾಣಿಯನ್ನು 45 ಡಿಗ್ರಿ ಕೋನದಲ್ಲಿರಿಸಿ.",
    tip2: "ಕೊಟ್ಟಿಗೆಯಲ್ಲಿ ಸಾಕಷ್ಟು ಬೆಳಕಿರಲಿ ಅಥವಾ ಕ್ಯಾಮೆರಾ ಫ್ಲ್ಯಾಶ್‌ಲೈಟ್ ಆನ್ ಮಾಡಿ.",
    tip3: "ಪ್ರಾಣಿ ಚಲಿಸದಂತೆ 3-ಸೆಕೆಂಡ್ ಟೈಮರ್ ಬಳಸಿ ಸ್ಥಿರವಾಗಿ ಫೋಟೋ ತೆಗೆಯಿರಿ.",
    quickCameraScan: "ಕ್ಯಾಮೆರಾ ಸ್ಕ್ಯಾನ್",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("pashu_lang");
    return saved === "kn" ? "kn" : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("pashu_lang", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
