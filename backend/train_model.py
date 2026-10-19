import pandas as pd
import numpy as np
import tensorflow as tf
import joblib

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# 1. Load housing.csv from the same folder as this script
df = pd.read_csv("HousingData.csv")

# Clean column names and make sure MEDV is the target
df.columns = df.columns.str.strip().str.upper()
if "MEDV" not in df.columns:
    raise ValueError(
        "Target column 'MEDV' was not found. "
        f"Columns in CSV: {df.columns.tolist()}"
    )

# Convert columns to numeric; invalid entries become missing values
df = df.apply(pd.to_numeric, errors="coerce")
df = df.dropna(subset=["MEDV"])

X = df.drop(columns=["MEDV"])
y = df["MEDV"]

if X.shape[1] == 0:
    raise ValueError("No input feature columns were found.")

print("Dataset shape:", df.shape)
print("Input features:", X.columns.tolist())

# 2. Split before fitting preprocessing to avoid data leakage
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42
)

# 3. Fill missing feature values using training-set medians
imputer = SimpleImputer(strategy="median")
X_train = imputer.fit_transform(X_train)
X_test = imputer.transform(X_test)

# 4. Standardize features using training-set statistics
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# 5. Build a four-layer network:
# input -> hidden (10 neurons) -> hidden (5 neurons) -> output
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(10, activation="relu"),
    tf.keras.layers.Dense(5, activation="relu"),
    tf.keras.layers.Dense(1)  # Linear output for regression
])

# 6. Configure and train
model.compile(optimizer="adam", loss="mse")

early_stopping = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss",
    patience=20,
    restore_best_weights=True
)

history = model.fit(
    X_train,
    y_train.to_numpy(),
    validation_split=0.20,
    epochs=300,
    batch_size=16,
    callbacks=[early_stopping],
    verbose=1
)

# 7. Evaluate on the held-out test set
y_pred = model.predict(X_test, verbose=0).flatten()

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n--- Test-set evaluation ---")
print(f"RMSE: {rmse:.3f}")
print(f"MAE:  {mae:.3f}")
print(f"R²:   {r2:.3f}")

print("\nSample predictions (MEDV units are $1,000s):")
results = pd.DataFrame({
    "Actual_MEDV": y_test.to_numpy(),
    "Predicted_MEDV": y_pred
})
print(results.head(10).round(2).to_string(index=False))

# 8. Save the trained model and preprocessing objects
OUTPUT_DIR = Path(__file__).resolve().parent
model.save(OUTPUT_DIR / "housing_model.keras")
joblib.dump(imputer, OUTPUT_DIR / "housing_imputer.joblib")
joblib.dump(scaler, OUTPUT_DIR / "housing_scaler.joblib")
joblib.dump(list(X.columns), OUTPUT_DIR / "housing_features.joblib")

print("\nTraining complete.")
print("Saved: housing_model.keras")
print("Saved: housing_imputer.joblib")
print("Saved: housing_scaler.joblib")
print("Saved: housing_features.joblib")
