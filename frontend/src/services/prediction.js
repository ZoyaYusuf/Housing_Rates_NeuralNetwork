const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Requests median home value prediction from the FastAPI backend.
 *
 * @param {Record<string, number>} features - The 13 required Boston housing features.
 * @returns {Promise<{ predicted_medv: number, unit: string }>}
 */
export async function getHousingPrediction(features) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features),
    });

    if (!response.ok) {
      let errorMessage = `Prediction request failed (${response.status})`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          if (Array.isArray(errorJson.detail)) {
            // Validation error from Pydantic
            errorMessage = errorJson.detail.map((d) => d.msg || `${d.loc?.join('.')}: invalid`).join(', ');
          } else {
            errorMessage = errorJson.detail;
          }
        }
      } catch {
        if (response.statusText) errorMessage = response.statusText;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (typeof data.predicted_medv !== 'number') {
      throw new Error('Invalid prediction result received from the server.');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
      throw new Error(
        'Cannot reach backend at ' +
          API_BASE_URL +
          '. Make sure the Python server is running (`uv run uvicorn main:app --reload` in backend).'
      );
    }
    throw error;
  }
}

/**
 * Performs a health check to verify backend status and model availability.
 *
 * @returns {Promise<{ status: string, model_loaded: boolean }>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return { status: 'error', model_loaded: false };
    return await response.json();
  } catch {
    return { status: 'offline', model_loaded: false };
  }
}
