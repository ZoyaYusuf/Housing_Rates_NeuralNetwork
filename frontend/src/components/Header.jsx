import React from 'react'

export default function Header({ backendStatus }) {
  return (
    <header className="border-b border-[#E5EBE3] bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#164E36] flex items-center justify-center text-[#F4C95D] shadow-sm">
            {/* Elegant House Icon */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-[#1F2933]">
                BOSTON HOUSING RATES
              </span>
            </div>
            <p className="text-xs text-[#68766B] font-medium hidden sm:block">
              Neural Network Price Prediction
            </p>
          </div>
        </div>

        {/* Status / Badge */}
        <div className="flex items-center gap-3">

          {backendStatus && (
            <div
              className={`hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border ${
                backendStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : backendStatus === 'checking'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
              title={
                backendStatus === 'connected'
                  ? 'Backend is online'
                  : 'Backend is offline. Ensure Python FastAPI is running.'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus === 'connected'
                    ? 'bg-emerald-500'
                    : backendStatus === 'checking'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
              <span className="capitalize">{backendStatus}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
