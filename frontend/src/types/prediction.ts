export interface PredictionRequest {
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  location_grouped: string;
  Furnishing: string;
  Transaction: string;
  Ownership: string;
  facing: string;
}

export interface PredictionResponse {
  predicted_price: number;
}