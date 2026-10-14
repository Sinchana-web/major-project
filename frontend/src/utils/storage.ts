import type { HistoryRecord, PredictionResult } from "../types/prediction";

const HISTORY_STORAGE_KEY = "pashu_prediction_history";

export const getPredictionHistory = (): HistoryRecord[] => {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryRecord[];
  } catch (e) {
    console.error("Failed to load history from localStorage", e);
    return [];
  }
};

export const savePredictionToHistory = (
  result: PredictionResult,
  imageUrl?: string
): HistoryRecord => {
  const history = getPredictionHistory();

  const existingIndex = history.findIndex(
    (item) => item.animal_id === result.animal_id && item.date === result.date
  );

  const newRecord: HistoryRecord = {
    ...result,
    id: result.animal_id || `SCAN-${Date.now()}`,
    timestamp: Date.now(),
    imageUrl,
  };

  let updatedHistory: HistoryRecord[];
  if (existingIndex >= 0) {
    updatedHistory = [...history];
    updatedHistory[existingIndex] = newRecord;
  } else {
    updatedHistory = [newRecord, ...history];
  }

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error("Failed to save history to localStorage", e);
  }

  return newRecord;
};

export const clearPredictionHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear history", e);
  }
};

export const getScanStats = () => {
  const history = getPredictionHistory();
  const totalScans = history.length;
  const successfulIdentifications = history.filter(
    (item) => item.confidence >= 0.5
  ).length;
  const latestItem = history.length > 0 ? history[0] : null;

  return {
    totalScans,
    successfulIdentifications,
    latestDetection: latestItem
      ? `${latestItem.species} (${latestItem.breed.replace(/_/g, " ")})`
      : "No scans yet",
  };
};
