import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import HousingForm from './components/HousingForm'
import PredictionResult from './components/PredictionResult'
import { getHousingPrediction, checkBackendHealth } from './services/prediction'

export default function App() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [isLoading, setIsLoading] = useState(false)
  const [predictionResult, setPredictionResult] = useState(null)
  const [predictionError, setPredictionError] = useState(null)
  const [lastSubmittedFeatures, setLastSubmittedFeatures] = useState(null)

  useEffect(() => {
    verifyBackend()
  }, [])

  const verifyBackend = async () => {
    try {
      const health = await checkBackendHealth()
      if (health.status === 'ok' && health.model_loaded) {
        setBackendStatus('connected')
      } else if (health.status === 'ok' && !health.model_loaded) {
        setBackendStatus('model missing')
      } else {
        setBackendStatus('offline')
      }
    } catch {
      setBackendStatus('offline')
    }
  }

  const handlePredict = async (features) => {
    setIsLoading(true)
    setPredictionError(null)
    setLastSubmittedFeatures(features)

    try {
      const data = await getHousingPrediction(features)
      setPredictionResult(data)
      setPredictionError(null)

      // Smooth scroll to result
      setTimeout(() => {
        const resultEl = document.getElementById('prediction-result')
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (err) {
      setPredictionError(err.message || 'An unexpected error occurred during prediction.')
      setPredictionResult(null)

      // Smooth scroll to error
      setTimeout(() => {
        const resultEl = document.getElementById('prediction-result')
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScrollToForm = () => {
    const formEl = document.getElementById('estimation-form')
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleCalculateAgain = () => {
    const formEl = document.getElementById('estimation-form')
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleRetry = () => {
    if (lastSubmittedFeatures) {
      handlePredict(lastSubmittedFeatures)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAF5] text-[#1F2933] flex flex-col font-sans selection:bg-[#F4C95D] selection:text-[#164E36]">
      {/* Slim Elegant Header */}
      <Header backendStatus={backendStatus} />

      {/* Hero Section */}
      <Hero onScrollToForm={handleScrollToForm} />

      {/* Main Content Area: Form & Prediction Result */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        {/* Offline Warning Notice if Backend is unreachable */}
        {backendStatus === 'offline' && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                <strong>Backend Server Offline:</strong> Predictions require the Python FastAPI service. Run{' '}
                <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-[11px]">
                  cd backend &amp;&amp; uv run uvicorn main:app --reload
                </code>{' '}
                to start the backend on port 8000.
              </span>
            </div>
            <button
              onClick={verifyBackend}
              className="px-3 py-1 bg-amber-200/60 hover:bg-amber-200 rounded-md font-semibold text-amber-900 shrink-0 cursor-pointer"
            >
              Check Again
            </button>
          </div>
        )}

        {/* Input Form */}
        <HousingForm
          onSubmit={handlePredict}
          isLoading={isLoading}
          initialValues={lastSubmittedFeatures}
        />

        {/* Prediction Result Display */}
        {(predictionResult || predictionError) && (
          <PredictionResult
            result={predictionResult}
            error={predictionError}
            submittedInputs={lastSubmittedFeatures}
            onCalculateAgain={handleCalculateAgain}
            onRetry={handleRetry}
          />
        )}
      </main>

      {/* Small Informational Footer */}
      <footer className="border-t border-[#E5EBE3] bg-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <p className="text-xs font-semibold text-[#1F2933]">
            Boston Housing Price Prediction · Neural Network Demonstration
          </p>
          <p className="text-[11px] text-[#68766B] max-w-2xl mx-auto leading-relaxed">
            This is a machine learning estimate based on the dataset used to train the model.
            It is not a professional property appraisal or a guarantee of current market value.
          </p>
        </div>
      </footer>
    </div>
  )
}
