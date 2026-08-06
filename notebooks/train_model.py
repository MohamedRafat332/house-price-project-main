import os
import re
import json
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(BASE_DIR, "data", "house_prices.csv")
PROJECT_ROOT = os.path.dirname(BASE_DIR)

if not os.path.exists(data_path):
    raise FileNotFoundError(f"File not found: {data_path}")

df = pd.read_csv(data_path)

def parse_amount(val):
    if pd.isna(val):
        return None
    val_str = str(val).strip().lower()
    try:
        if "lac" in val_str:
            return float(re.sub(r"[^\d.]", "", val_str.replace("lac", ""))) * 100000.0
        elif "cr" in val_str:
            return float(re.sub(r"[^\d.]", "", val_str.replace("cr", ""))) * 10000000.0
        else:
            cleaned = re.sub(r"[^\d.]", "", val_str)
            return float(cleaned) if cleaned else None
    except Exception:
        return None

target_col = "Amount (in rupees)" if "Amount (in rupees)" in df.columns else "Price (in rupees)"
if target_col not in df.columns and "Price" in df.columns:
    target_col = "Price"

df["price_clean"] = df[target_col].apply(parse_amount)
df = df.dropna(subset=["price_clean"])
df = df[df["price_clean"] > 0]

def parse_area(val):
    if pd.isna(val):
        return np.nan
    val_str = str(val).strip().lower()
    try:
        match = re.search(r"([\d.]+)", val_str)
        if not match:
            return np.nan
        num = float(match.group(1))
        if "sqm" in val_str or "sq m" in val_str:
            return num * 10.764
        return num
    except Exception:
        return np.nan

area_col = "Carpet Area" if "Carpet Area" in df.columns else "Super Area"
df["carpet_area_sqft"] = df[area_col].apply(parse_area)
df["carpet_area_sqft"] = df["carpet_area_sqft"].fillna(df["carpet_area_sqft"].median())

def parse_floor(val):
    if pd.isna(val):
        return 1
    val_str = str(val).strip().lower()
    if "ground" in val_str or "basement" in val_str:
        return 0
    match = re.search(r"\d+", val_str)
    return int(match.group(0)) if match else 1

floor_col = "Floor" if "Floor" in df.columns else "floor"
df["floor_num"] = df[floor_col].apply(parse_floor) if floor_col in df.columns else 1

for col in ["Bathroom", "Balcony"]:
    if col in df.columns:
        df[col.lower()] = pd.to_numeric(df[col].astype(str).str.extract(r"(\d+)")[0], errors="coerce").fillna(1)
    else:
        df[col.lower()] = 1

loc_col = "location" if "location" in df.columns else "Location"
if loc_col in df.columns:
    df["location_clean"] = df[loc_col].astype(str).str.strip().str.title()
    top_locations = df["location_clean"].value_counts().head(50).index.tolist()
    df["location_grouped"] = df["location_clean"].apply(lambda x: x if x in top_locations else "Other")
else:
    df["location_grouped"] = "Other"

for col in ["Furnishing", "Transaction", "Ownership", "facing"]:
    if col not in df.columns:
        df[col] = "Unknown"
    else:
        df[col] = df[col].fillna("Unknown").astype(str)

df["price_per_sqft"] = df["price_clean"] / (df["carpet_area_sqft"] + 1e-5)
low, high = df["price_per_sqft"].quantile(0.01), df["price_per_sqft"].quantile(0.99)
df = df[(df["price_per_sqft"] >= low) & (df["price_per_sqft"] <= high)]

numeric_features = ["carpet_area_sqft", "floor_num", "bathroom", "balcony"]
categorical_features = ["location_grouped", "Furnishing", "Transaction", "Ownership", "facing"]

preprocessor = ColumnTransformer([
    ("num", Pipeline([
        ("impute", SimpleImputer(strategy="median")),
        ("scale", StandardScaler())
    ]), numeric_features),
    ("cat", Pipeline([
        ("impute", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ]), categorical_features)
])

X = df[numeric_features + categorical_features]
y = df["price_clean"]
y_log = np.log1p(y)

X_train, X_test, y_train, y_test = train_test_split(X, y_log, test_size=0.2, random_state=42)

rf = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
model = Pipeline([
    ("prep", preprocessor),
    ("reg", rf)
])

model.fit(X_train, y_train)

models_dir = os.path.join(PROJECT_ROOT, "models")
os.makedirs(models_dir, exist_ok=True)

joblib.dump(model, os.path.join(models_dir, "house_price.pkl"))

locations_list = sorted(df["location_grouped"].unique().tolist())
with open(os.path.join(models_dir, "locations.json"), "w") as f:
    json.dump(locations_list, f, indent=2)

print("Done")