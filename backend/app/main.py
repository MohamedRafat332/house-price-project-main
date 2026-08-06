import os
import json
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="House Price API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    carpet_area_sqft: float
    floor_num: int
    bathroom: int
    balcony: int
    location_grouped: str
    Furnishing: str
    Transaction: str
    Ownership: Optional[str] = "Ready to Move"
    facing: Optional[str] = "North"

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

MODEL_PATH = os.path.join(MODELS_DIR, "house_price.pkl")
LOCATIONS_PATH = os.path.join(MODELS_DIR, "locations.json")

model = None
locations_list = []

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)

if os.path.exists(LOCATIONS_PATH):
    with open(LOCATIONS_PATH, "r") as f:
        locations_list = json.load(f)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/locations")
def get_locations():
    return {"locations": locations_list}

@app.post("/predict")
def predict_price(payload: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model file not loaded.")
    
    try:
        data = payload.dict()
        df = pd.DataFrame([data])
        prediction = model.predict(df)
        predicted_val = float(prediction[0])
        return {"predicted_price": round(abs(predicted_val), 2)}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))