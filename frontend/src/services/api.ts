import axios from "axios";
import type { PredictionResult } from "../types/prediction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export const predictBreed = async (file: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post<PredictionResult>(
    `${API_BASE_URL}/predict`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
    }
  );

  return response.data;
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, { timeout: 3000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
