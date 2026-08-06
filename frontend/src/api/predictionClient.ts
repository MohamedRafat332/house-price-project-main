import type { PredictionRequest, PredictionResponse } from "../types/prediction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const getLocations = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/locations`);
  if (!response.ok) throw new Error("Failed to fetch locations");
  const data = await response.json();
  return data.locations || [];
};

export const predictPrice = async (payload: PredictionRequest): Promise<PredictionResponse> => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Prediction request failed");
  }

  return await response.json();
};