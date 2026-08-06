const API_BASE_URL = "http://127.0.0.1:8000";

export const fetchLocations = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    const data = await response.json();
    return data.locations || [];
  } catch (err) {
    return [];
  }
};

export const predictPrice = async (formData: any): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Server Error" }));
      throw new Error(errorData.detail || `Server status: ${response.status}`);
    }

    const data = await response.json();
    return data.predicted_price;
  } catch (err: any) {
    throw new Error(err.message || "Failed to connect to backend server");
  }
};