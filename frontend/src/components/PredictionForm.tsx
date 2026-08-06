import React, { useState, useEffect } from "react";
import { getLocations, predictPrice } from "../api/predictionClient";
import type { PredictionRequest } from "../types/prediction";

export default function PredictionForm() {
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<PredictionRequest>({
    carpet_area_sqft: 1000,
    floor_num: 2,
    bathroom: 2,
    balcony: 1,
    location_grouped: "Other",
    Furnishing: "Semi-Furnished",
    Transaction: "Resale",
    Ownership: "Ready to Move",
    facing: "North",
  });

  useEffect(() => {
    getLocations()
      .then((locs) => {
        if (locs.length > 0) {
          setLocations(locs);
          setFormData((prev) => ({ ...prev, location_grouped: locs[0] }));
        }
      })
      .catch((err) => console.error("Error loading locations:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setPredictedPrice(null);

    try {
      const res = await predictPrice(formData);
      setPredictedPrice(res.predicted_price);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to fetch prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <div style={{
        backgroundColor: "#1e1e1e",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        width: "100%",
        maxWidth: "450px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#4CAF50" }}>🏠 House Price Predictor</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>Location:</label>
            <select 
              name="location_grouped" 
              value={formData.location_grouped} 
              onChange={handleChange} 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", backgroundColor: "#2a2a2a", color: "#fff" }}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>Carpet Area (sqft):</label>
            <input 
              type="number" 
              name="carpet_area_sqft" 
              value={formData.carpet_area_sqft} 
              onChange={handleChange} 
              required 
              min="1"
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", backgroundColor: "#2a2a2a", color: "#fff", boxSizing: "border-box" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>Floor Number:</label>
            <input 
              type="number" 
              name="floor_num" 
              value={formData.floor_num} 
              onChange={handleChange} 
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", backgroundColor: "#2a2a2a", color: "#fff", boxSizing: "border-box" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>Bathrooms:</label>
            <input 
              type="number" 
              name="bathroom" 
              value={formData.bathroom} 
              onChange={handleChange} 
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", backgroundColor: "#2a2a2a", color: "#fff", boxSizing: "border-box" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>Balconies:</label>
            <input 
              type="number" 
              name="balcony" 
              value={formData.balcony} 
              onChange={handleChange} 
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", backgroundColor: "#2a2a2a", color: "#fff", boxSizing: "border-box" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>Furnishing:</label>
            <select 
              name="Furnishing" 
              value={formData.Furnishing} 
              onChange={handleChange} 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", backgroundColor: "#2a2a2a", color: "#fff" }}
            >
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>Transaction:</label>
            <select 
              name="Transaction" 
              value={formData.Transaction} 
              onChange={handleChange} 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", backgroundColor: "#2a2a2a", color: "#fff" }}
            >
              <option value="Resale">Resale</option>
              <option value="New Property">New Property</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              padding: "12px", 
              cursor: "pointer", 
              marginTop: "10px", 
              backgroundColor: loading ? "#555" : "#4CAF50", 
              color: "white", 
              border: "none", 
              borderRadius: "6px", 
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {loading ? "Calculating..." : "Predict Price"}
          </button>
        </form>

        {errorMessage && (
          <div style={{ marginTop: "15px", padding: "12px", backgroundColor: "#3a1c1c", border: "1px solid #f44336", borderRadius: "6px", textAlign: "center" }}>
            <p style={{ margin: 0, color: "#ff8888", fontSize: "14px" }}>⚠️ {errorMessage}</p>
          </div>
        )}

        {predictedPrice !== null && (
          <div style={{ marginTop: "15px", padding: "15px", backgroundColor: "#1c3a1c", border: "1px solid #4CAF50", borderRadius: "6px", textAlign: "center" }}>
            <h3 style={{ margin: 0, color: "#81c784", fontSize: "18px" }}>Predicted Price: ₹ {predictedPrice.toLocaleString()}</h3>
          </div>
        )}
      </div>
    </div>
  );
}