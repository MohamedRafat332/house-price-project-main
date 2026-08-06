# 🏠 House Price Prediction (End-to-End ML Web App)

A complete machine learning product that predicts house prices based on property features, deployed as a full-stack web application with FastAPI and React (TypeScript).

---

## 📌 Features
- **Data Exploration & Cleaning**: Processed real-estate listings, handled non-standard text (Lac/Cr pricing, area units), handled missing values, and filtered outliers using Scikit-Learn pipelines.
- **Model Training**: Trained baseline Linear Regression vs. RandomForestRegressor, evaluated using MAE, RMSE, and R-squared metrics.
- **FastAPI Backend**: Microservice serving model inference with CORS enabled, lifespan startup loading, and high-coverage unit tests via `pytest`.
- **React + TypeScript Frontend**: Interactive form with real-time field validation, dynamically populated location dropdowns, loading indicators, and explicit currency formatted output.

---

## 🛠️ Tech Stack
- **Data Science**: Python 3.11, Pandas, NumPy, Scikit-Learn, Joblib
- **Backend**: FastAPI, Uvicorn, Pydantic, Pytest
- **Frontend**: React 18, TypeScript, Vite

---

## 🚀 Setup & Installation Guide

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone Repository & Setup Virtual Environment
```bash
git clone [https://github.com/](https://github.com/)<your-username>/house-price-project.git
cd house-price-project
##Made By
#-Ahmed Tomma
#-Ahmed El-Shaّbany
#-Mohamed El-Shaّbany

python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate

pip install -r backend/requirements.txt
