from pydantic import BaseModel
from typing import List, Optional

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

class PredictionResponse(BaseModel):
    predicted_price: float

class LocationsResponse(BaseModel):
    locations: List[str]