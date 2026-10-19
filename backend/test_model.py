
import pandas as pd
import tensorflow as tf
import joblib
from pathlib import Path

# Locate the saved files
# folder = Path(__file__).resolve().parent

# 1. Load the trained model and preprocessing objects
model = tf.keras.models.load_model("housing_model.keras")
imputer = joblib.load("housing_imputer.joblib")
scaler = joblib.load("housing_scaler.joblib")
features = joblib.load("housing_features.joblib")

print("Model loaded successfully!")
print("Input features:", len(features))
print("Trainable parameters:", model.count_params())

# 2. Load housing data
df = pd.read_csv("HousingData.csv")
df.columns = df.columns.str.strip().str.upper()
df = df.apply(pd.to_numeric, errors="coerce")

# Select one row with available input features
sample = df.dropna(subset=["MEDV"]).iloc[[0]]

# 3. Prepare inputs in the original feature order
X = sample[features]

# 4. Apply the SAME preprocessing used during training
X = imputer.transform(X)
X = scaler.transform(X)

# 5. Make a prediction without training again
prediction = model.predict(X, verbose=0)[0][0]

actual = sample["MEDV"].iloc[0]

print("\n--- Prediction test ---")
print(f"Actual MEDV:     {actual:.2f}")
print(f"Predicted MEDV:  {prediction:.2f}")
print(f"Absolute error:  {abs(actual - prediction):.2f}")
print("\nSaved model is usable for prediction!")
