import React from 'react'

const FEATURE_NAMES_MAP = {
  RM: 'Average Rooms',
  AGE: 'Pre-1940 Homes (%)',
  CHAS: 'Charles River Border',
  CRIM: 'Crime Rate',
  ZN: 'Large Lot Zoning (%)',
  INDUS: 'Non-Retail Acres (%)',
  NOX: 'Air Pollution (NOX)',
  B: 'Demographic Index',
  LSTAT: 'Lower-Income Pop. (%)',
  DIS: 'Distance to Employment',
  RAD: 'Highway Accessibility',
  TAX: 'Property Tax Rate',
  PTRATIO: 'Student-Teacher Ratio',
}

export default function PredictionResult({
  result,
  error,
  submittedInputs,
  onCalculateAgain,
  onRetry,
}) {
  if (error) {
    return (
      <div
        id="prediction-result"
        className="bg-white rounded-2xl border border-rose-200 shadow-md p-6 sm:p-8 space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#1F2933]">
              Prediction Request Failed
            </h3>
            <p className="text-sm text-[#68766B]">{error}</p>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-xl bg-[#164E36] hover:bg-[#0f3927] text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              Retry Prediction
            </button>
          )}
          <button
            type="button"
            onClick={onCalculateAgain}
            className="px-4 py-2 rounded-xl bg-[#F8FAF5] hover:bg-[#E5EBE3] text-[#1F2933] text-xs font-semibold border border-[#E5EBE3] transition cursor-pointer"
          >
            Review Form Details
          </button>
        </div>
      </div>
    )
  }

  if (!result) return null

  // MEDV is in thousands of USD: e.g. 24.5 -> $24,500
  const rawMedv = result.predicted_medv
  const formattedDollarValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(rawMedv * 1000)

  return (
    <div
      id="prediction-result"
      className="bg-white rounded-2xl border border-[#E5EBE3] shadow-lg p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      {/* Top Banner: Success Badge and Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E5EBE3]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3F8F57]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#164E36]">
            Prediction Complete
          </span>
        </div>

        <button
          type="button"
          onClick={onCalculateAgain}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#164E36] hover:text-[#0f3927] bg-[#F8FAF5] hover:bg-[#E5EBE3] px-3.5 py-1.5 rounded-lg border border-[#E5EBE3] transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-[#3F8F57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Calculate Again</span>
        </button>
      </div>

      {/* Main Metric Hero Card */}
      <div className="bg-gradient-to-br from-[#F8FAF5] to-[#f2f6ee] p-6 sm:p-8 rounded-2xl border border-[#E5EBE3] text-center space-y-3">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#68766B]">
          Estimated Median Home Value
        </p>

        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl sm:text-6xl font-extrabold text-[#164E36] tracking-tight">
            {formattedDollarValue}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4C95D]/20 text-[#1F2933] text-xs font-medium border border-[#F4C95D]/40">
          <svg className="w-3.5 h-3.5 text-[#164E36]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
          </svg>
          <span>
            Model raw MEDV: <strong>{rawMedv.toFixed(2)}</strong> (units are in $1,000s USD)
          </span>
        </div>

        <p className="text-xs text-[#68766B] max-w-md mx-auto pt-1 leading-relaxed">
          Inference calculated by the saved four-layer neural network with median feature imputation and standard scaling.
        </p>
      </div>

      {/* Input Summary Section */}
      {submittedInputs && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#68766B]">
              Submitted Parameters Summary
            </h4>
            <span className="text-[11px] text-[#68766B]">13 Features Evaluated</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {Object.entries(submittedInputs).map(([key, val]) => (
              <div
                key={key}
                className="bg-[#F8FAF5] p-2.5 rounded-xl border border-[#E5EBE3] text-xs space-y-0.5"
              >
                <div className="flex items-center justify-between text-[#68766B]">
                  <span className="font-medium truncate" title={FEATURE_NAMES_MAP[key] || key}>
                    {FEATURE_NAMES_MAP[key] || key}
                  </span>
                  <span className="font-mono text-[10px] text-[#164E36] font-semibold">{key}</span>
                </div>
                <p className="font-bold text-sm text-[#1F2933]">
                  {key === 'CHAS' ? (val === 1 ? 'Yes (1)' : 'No (0)') : val}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
