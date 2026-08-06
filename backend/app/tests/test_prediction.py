from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_prediction_success():
    payload = {
        "carpet_area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "location_grouped": "Other",
        "Furnishing": "Semi-Furnished",
        "Transaction": "Resale",
        "Ownership": "Ready to Move",
        "facing": "North"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    assert "predicted_price" in response.json()

def test_prediction_invalid_input():
    payload = {
        "carpet_area_sqft": "invalid_number"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422