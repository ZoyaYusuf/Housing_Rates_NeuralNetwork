import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import tensorflow as tf

app = FastAPI(
    title="Boston Housing Price Prediction API",
    description="Neural network prediction API for Boston Housing median property value",
    version="1.0.0",
)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts safely
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "housing_model.keras"
IMPUTER_PATH = BASE_DIR / "housing_imputer.joblib"
SCALER_PATH = BASE_DIR / "housing_scaler.joblib"
FEATURES_PATH = BASE_DIR / "housing_features.joblib"

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    imputer = joblib.load(IMPUTER_PATH)
    scaler = joblib.load(SCALER_PATH)
    features_list = joblib.load(FEATURES_PATH)
    print("All model artifacts loaded successfully.")
except Exception as err:
    print(f"Warning: Could not load model artifacts: {err}")
    model = None
    imputer = None
    scaler = None
    features_list = None


class PredictionRequest(BaseModel):
    CRIM: float = Field(..., ge=0, description="Per-capita crime rate")
    ZN: float = Field(..., ge=0, le=100, description="Proportion of residential land zoned for large lots")
    INDUS: float = Field(..., ge=0, description="Proportion of non-retail business acres")
    CHAS: int = Field(..., ge=0, le=1, description="Charles River dummy variable (1 if tract bounds river; 0 otherwise)")
    NOX: float = Field(..., ge=0, description="Nitric oxides concentration (parts per 10 million)")
    RM: float = Field(..., ge=0, description="Average number of rooms per dwelling")
    AGE: float = Field(..., ge=0, le=100, description="Proportion of owner-occupied units built prior to 1940")
    DIS: float = Field(..., ge=0, description="Weighted distances to five Boston employment centres")
    RAD: float = Field(..., ge=1, description="Index of accessibility to radial highways")
    TAX: float = Field(..., ge=0, description="Full-value property-tax rate per $10,000")
    PTRATIO: float = Field(..., ge=0, description="Pupil-teacher ratio by town")
    B: float = Field(..., ge=0, description="Neighborhood demographic index")
    LSTAT: float = Field(..., ge=0, description="Lower-income population percentage")


class PredictionResponse(BaseModel):
    predicted_medv: float
    unit: str


@app.get("/")
def read_root():
    return {
        "message": "Boston Housing Rates Prediction API is running",
        "docs": "/docs",
        "model_loaded": model is not None,
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if model is None or imputer is None or scaler is None or features_list is None:
        raise HTTPException(
            status_code=503,
            detail="Model artifacts are not loaded on the server.",
        )

    try:
        req_dict = request.model_dump()
        # Arrange features in exact order stored in housing_features.joblib
        input_df = pd.DataFrame([{col: req_dict[col] for col in features_list}])

        # Preprocessing: Impute then Scale
        imputed_vals = imputer.transform(input_df)
        scaled_vals = scaler.transform(imputed_vals)

        # Inference with Keras model
        raw_pred = float(model.predict(scaled_vals, verbose=0)[0][0])
        # Housing median value should not be negative
        medv = max(0.0, raw_pred)

        return PredictionResponse(
            predicted_medv=round(medv, 2),
            unit="thousands_of_usd",
        )
    except Exception as err:
        raise HTTPException(
            status_code=500,
            detail="Failed to compute prediction from the model.",
        )
