# Boston Housing Rates · Neural Network Price Prediction

A modern full-stack web application predicting median housing values in Boston based on a trained 4-layer neural network model with 13 property and area features.

## Project Structure

```
├── backend/
│   ├── main.py                  # FastAPI application with /predict endpoint
│   ├── train_model.py           # Model training pipeline
│   ├── test_model.py            # Model verification script
│   ├── housing_model.keras      # Trained Keras neural network model
│   ├── housing_imputer.joblib   # Scikit-learn median imputer
│   ├── housing_scaler.joblib    # Scikit-learn standard scaler
│   ├── housing_features.joblib  # Saved feature ordering
│   ├── HousingData.csv          # Boston Housing dataset
│   └── pyproject.toml           # uv project configuration
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx       # Header with live backend status indicator
    │   │   ├── Hero.jsx         # Hero section with imagery and badges
    │   │   ├── HousingForm.jsx  # 13-feature form with validation & sample loader
    │   │   └── PredictionResult.jsx # Formatted median value ($1,000s) & summary
    │   ├── services/
    │   │   └── prediction.js    # API service client
    │   ├── App.jsx              # Main single-page application layout
    │   └── index.css            # Tailwind CSS v4 styling & theme tokens
    ├── package.json
    └── vite.config.js
```

## Features

- **Trained Neural Network**: 4-layer TensorFlow/Keras neural network (`Input -> Dense(10) -> Dense(5) -> Dense(1)`).
- **Exact Preprocessing**: Median imputation and standard scaling matching training-set distributions.
- **FastAPI Backend**: Validates 13 features via Pydantic, enables CORS, and delivers predictions in real-time.
- **React 19 + Vite + Tailwind CSS v4 Frontend**: Clean, responsive real estate analytics interface featuring deep forest green (`#164E36`) and warm yellow accents.
- **User-Friendly Form**:
  - Segmented control for Charles River bounds (`CHAS`).
  - Inline helper tooltips for non-technical users.
  - "Use Sample Values" option for quick illustrative testing.
  - Price formatted in thousands of USD (e.g., MEDV `20.80` $\rightarrow$ `$20,800`).

---

## Getting Started

### 1. Backend Setup (Python + uv)

```bash
cd backend

# Install dependencies and start server
uv run uvicorn main:app --reload --port 8000
```

The backend API will run on `http://127.0.0.1:8000`. You can inspect interactive OpenAPI docs at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup (React + Vite + Tailwind)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.
