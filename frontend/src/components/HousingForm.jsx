import React, { useState } from 'react'

// Illustrative sample dataset (median values from dataset, clearly marked as illustrative)
const SAMPLE_VALUES = {
  CRIM: 0.25,
  ZN: 12.5,
  INDUS: 7.87,
  CHAS: 0,
  NOX: 0.524,
  RM: 6.25,
  AGE: 65.0,
  DIS: 3.8,
  RAD: 5,
  TAX: 311,
  PTRATIO: 18.5,
  B: 391.5,
  LSTAT: 11.5,
}

const EMPTY_VALUES = {
  CRIM: '',
  ZN: '',
  INDUS: '',
  CHAS: 0,
  NOX: '',
  RM: '',
  AGE: '',
  DIS: '',
  RAD: '',
  TAX: '',
  PTRATIO: '',
  B: '',
  LSTAT: '',
}

export default function HousingForm({ onSubmit, isLoading, initialValues }) {
  const [formData, setFormData] = useState(initialValues || EMPTY_VALUES)
  const [errors, setErrors] = useState({})
  const [activeTooltip, setActiveTooltip] = useState(null)
  const [isSampleLoaded, setIsSampleLoaded] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleUseSample = () => {
    setFormData(SAMPLE_VALUES)
    setErrors({})
    setIsSampleLoaded(true)
  }

  const handleClear = () => {
    setFormData(EMPTY_VALUES)
    setErrors({})
    setIsSampleLoaded(false)
  }

  const validate = () => {
    const newErrors = {}
    const requiredFields = [
      'CRIM',
      'ZN',
      'INDUS',
      'NOX',
      'RM',
      'AGE',
      'DIS',
      'RAD',
      'TAX',
      'PTRATIO',
      'B',
      'LSTAT',
    ]

    requiredFields.forEach((field) => {
      const val = formData[field]
      if (val === '' || val === null || val === undefined || isNaN(Number(val))) {
        newErrors[field] = 'Please enter a valid numeric value'
      } else {
        const num = Number(val)
        if (num < 0 && field !== 'CHAS') {
          newErrors[field] = 'Value cannot be negative'
        }
        if ((field === 'ZN' || field === 'AGE') && num > 100) {
          newErrors[field] = 'Cannot exceed 100%'
        }
      }
    })

    if (formData.CHAS !== 0 && formData.CHAS !== 1) {
      newErrors.CHAS = 'Select No or Yes'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      return
    }

    // Convert all values to numbers while preserving exact model feature keys
    const payload = {
      CRIM: Number(formData.CRIM),
      ZN: Number(formData.ZN),
      INDUS: Number(formData.INDUS),
      CHAS: Number(formData.CHAS),
      NOX: Number(formData.NOX),
      RM: Number(formData.RM),
      AGE: Number(formData.AGE),
      DIS: Number(formData.DIS),
      RAD: Number(formData.RAD),
      TAX: Number(formData.TAX),
      PTRATIO: Number(formData.PTRATIO),
      B: Number(formData.B),
      LSTAT: Number(formData.LSTAT),
    }

    onSubmit(payload)
  }

  const toggleTooltip = (key) => {
    setActiveTooltip(activeTooltip === key ? null : key)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5EBE3] shadow-md p-6 sm:p-8" id="estimation-form">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5EBE3] gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2933] tracking-tight">
            Property Details
          </h2>
          <p className="text-sm text-[#68766B] mt-1">
            Fill in the property and neighborhood information to estimate its value.
          </p>
        </div>

        {/* Sample Values Helper Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseSample}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F8FAF5] hover:bg-[#E5EBE3] text-[#164E36] border border-[#E5EBE3] transition-colors cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 text-[#3F8F57]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <span>Use Sample Values</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#68766B] hover:text-[#1F2933] hover:bg-[#F8FAF5] transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {isSampleLoaded && (
        <div className="mt-4 p-3 bg-[#F4C95D]/15 border border-[#F4C95D]/40 rounded-xl flex items-center justify-between text-xs text-[#1F2933]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F4C95D]"></span>
            <span>
              <strong>Sample profile loaded:</strong> Illustrative example representative of historical median Boston tracts. Not a verified real address.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSampleLoaded(false)}
            className="text-[#68766B] hover:text-[#1F2933] font-bold px-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Form Form Elements */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-8" noValidate>
        {/* Section 1: Property Characteristics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#164E36]/10 text-[#164E36] flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h3 className="text-base font-semibold text-[#1F2933]">
              Property Characteristics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* RM: Average Number of Rooms */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-RM"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Average Rooms</span>
                  <span className="text-xs text-[#68766B] font-mono">(RM)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('RM')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Average Rooms"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-RM"
                type="number"
                step="0.01"
                min="1"
                max="15"
                placeholder="e.g. 6.25"
                value={formData.RM}
                onChange={(e) => handleChange('RM', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.RM
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'RM' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Average number of rooms per dwelling (typically 4–8 in residential homes).
                </p>
              )}
              {errors.RM && <p className="text-xs text-rose-500">{errors.RM}</p>}
            </div>

            {/* AGE: Older Housing Proportion */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-AGE"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Pre-1940 Homes (%)</span>
                  <span className="text-xs text-[#68766B] font-mono">(AGE)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('AGE')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Older Housing Proportion"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-AGE"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 65.0"
                value={formData.AGE}
                onChange={(e) => handleChange('AGE', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.AGE
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'AGE' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Proportion of owner-occupied units built prior to 1940 (0% to 100%).
                </p>
              )}
              {errors.AGE && <p className="text-xs text-rose-500">{errors.AGE}</p>}
            </div>

            {/* CHAS: Charles River Location (Segmented Control) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1F2933] flex items-center gap-1">
                  <span>Charles River Border</span>
                  <span className="text-xs text-[#68766B] font-mono">(CHAS)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('CHAS')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Charles River"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>

              {/* Segmented Control No / Yes */}
              <div className="grid grid-cols-2 p-1 bg-[#F8FAF5] rounded-xl border border-[#E5EBE3] h-[46px] items-center">
                <button
                  type="button"
                  onClick={() => handleChange('CHAS', 0)}
                  className={`h-full rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    formData.CHAS === 0
                      ? 'bg-white text-[#164E36] shadow-xs border border-[#E5EBE3]'
                      : 'text-[#68766B] hover:text-[#1F2933]'
                  }`}
                >
                  No (0)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('CHAS', 1)}
                  className={`h-full rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    formData.CHAS === 1
                      ? 'bg-[#164E36] text-[#F4C95D] shadow-xs'
                      : 'text-[#68766B] hover:text-[#1F2933]'
                  }`}
                >
                  Yes, Bounds River (1)
                </button>
              </div>
              {activeTooltip === 'CHAS' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Whether the tract bounds the Charles River (1 = tract tract bounds river; 0 = otherwise).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Location & Neighborhood */}
        <div className="space-y-4 pt-2 border-t border-[#E5EBE3]/70">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#164E36]/10 text-[#164E36] flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h3 className="text-base font-semibold text-[#1F2933]">
              Location &amp; Neighborhood
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* CRIM: Per-capita crime rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-CRIM"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Crime Rate</span>
                  <span className="text-xs text-[#68766B] font-mono">(CRIM)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('CRIM')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Crime Rate"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-CRIM"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 0.25"
                value={formData.CRIM}
                onChange={(e) => handleChange('CRIM', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.CRIM
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'CRIM' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Per-capita crime rate by town (historical median is 0.25).
                </p>
              )}
              {errors.CRIM && <p className="text-xs text-rose-500">{errors.CRIM}</p>}
            </div>

            {/* ZN: Residential Land Zone */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-ZN"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Large Lot Zoning (%)</span>
                  <span className="text-xs text-[#68766B] font-mono">(ZN)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('ZN')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Residential Land Zone"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-ZN"
                type="number"
                step="0.5"
                min="0"
                max="100"
                placeholder="e.g. 12.5"
                value={formData.ZN}
                onChange={(e) => handleChange('ZN', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.ZN
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'ZN' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Proportion of residential land zoned for lots over 25,000 sq.ft (0–100%).
                </p>
              )}
              {errors.ZN && <p className="text-xs text-rose-500">{errors.ZN}</p>}
            </div>

            {/* INDUS: Non-Retail Business Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-INDUS"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Non-Retail Business (%)</span>
                  <span className="text-xs text-[#68766B] font-mono">(INDUS)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('INDUS')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Non-Retail Business Area"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-INDUS"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 7.87"
                value={formData.INDUS}
                onChange={(e) => handleChange('INDUS', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.INDUS
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'INDUS' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Proportion of non-retail business acres per town.
                </p>
              )}
              {errors.INDUS && <p className="text-xs text-rose-500">{errors.INDUS}</p>}
            </div>

            {/* NOX: Air Pollution Level */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-NOX"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Air Pollution Level</span>
                  <span className="text-xs text-[#68766B] font-mono">(NOX)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('NOX')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Air Pollution Level"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-NOX"
                type="number"
                step="0.001"
                min="0.2"
                max="1.0"
                placeholder="e.g. 0.524"
                value={formData.NOX}
                onChange={(e) => handleChange('NOX', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.NOX
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'NOX' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Nitric oxides concentration in parts per 10 million (typical range 0.38–0.87).
                </p>
              )}
              {errors.NOX && <p className="text-xs text-rose-500">{errors.NOX}</p>}
            </div>

            {/* B: Neighborhood Demographic Index */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-B"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Demographic Index</span>
                  <span className="text-xs text-[#68766B] font-mono">(B)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('B')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Demographic Index"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-B"
                type="number"
                step="0.1"
                min="0"
                max="400"
                placeholder="e.g. 391.5"
                value={formData.B}
                onChange={(e) => handleChange('B', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.B
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'B' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Legacy historical demographic index variable from original 1978 dataset: 1000(Bk - 0.63)^2.
                </p>
              )}
              {errors.B && <p className="text-xs text-rose-500">{errors.B}</p>}
            </div>

            {/* LSTAT: Lower-Income Population Percentage */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-LSTAT"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Lower-Income Pop. (%)</span>
                  <span className="text-xs text-[#68766B] font-mono">(LSTAT)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('LSTAT')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Lower-Income Population Percentage"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-LSTAT"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 11.5"
                value={formData.LSTAT}
                onChange={(e) => handleChange('LSTAT', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.LSTAT
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'LSTAT' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Percentage of lower socioeconomic status population in the tract (typically 1.7% to 38%).
                </p>
              )}
              {errors.LSTAT && <p className="text-xs text-rose-500">{errors.LSTAT}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Accessibility & Local Factors */}
        <div className="space-y-4 pt-2 border-t border-[#E5EBE3]/70">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#164E36]/10 text-[#164E36] flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h3 className="text-base font-semibold text-[#1F2933]">
              Accessibility &amp; Local Factors
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* DIS: Distance to Employment Centers */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-DIS"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Employment Distance</span>
                  <span className="text-xs text-[#68766B] font-mono">(DIS)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('DIS')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Employment Distance"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-DIS"
                type="number"
                step="0.1"
                min="0.5"
                max="20"
                placeholder="e.g. 3.8"
                value={formData.DIS}
                onChange={(e) => handleChange('DIS', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.DIS
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'DIS' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Weighted distances to five Boston employment centers (in miles).
                </p>
              )}
              {errors.DIS && <p className="text-xs text-rose-500">{errors.DIS}</p>}
            </div>

            {/* RAD: Highway Accessibility */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-RAD"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Highway Index</span>
                  <span className="text-xs text-[#68766B] font-mono">(RAD)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('RAD')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Highway Accessibility"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-RAD"
                type="number"
                step="1"
                min="1"
                max="24"
                placeholder="e.g. 5"
                value={formData.RAD}
                onChange={(e) => handleChange('RAD', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.RAD
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'RAD' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Accessibility index to radial highways (integer scale 1 to 24).
                </p>
              )}
              {errors.RAD && <p className="text-xs text-rose-500">{errors.RAD}</p>}
            </div>

            {/* TAX: Property Tax Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-TAX"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Tax Rate ($/10k)</span>
                  <span className="text-xs text-[#68766B] font-mono">(TAX)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('TAX')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Property Tax Rate"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-TAX"
                type="number"
                step="1"
                min="100"
                max="1000"
                placeholder="e.g. 311"
                value={formData.TAX}
                onChange={(e) => handleChange('TAX', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.TAX
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'TAX' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Full-value property-tax rate per $10,000 (typical range 187–711).
                </p>
              )}
              {errors.TAX && <p className="text-xs text-rose-500">{errors.TAX}</p>}
            </div>

            {/* PTRATIO: Student-Teacher Ratio */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="field-PTRATIO"
                  className="text-xs font-semibold text-[#1F2933] flex items-center gap-1"
                >
                  <span>Student-Teacher Ratio</span>
                  <span className="text-xs text-[#68766B] font-mono">(PTRATIO)</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('PTRATIO')}
                  className="text-[#68766B] hover:text-[#164E36] p-0.5 rounded cursor-pointer"
                  title="Click for details"
                  aria-label="Info on Student-Teacher Ratio"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                </button>
              </div>
              <input
                id="field-PTRATIO"
                type="number"
                step="0.1"
                min="10"
                max="30"
                placeholder="e.g. 18.5"
                value={formData.PTRATIO}
                onChange={(e) => handleChange('PTRATIO', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#3F8F57]/30 ${
                  errors.PTRATIO
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#E5EBE3] bg-white focus:border-[#3F8F57]'
                }`}
              />
              {activeTooltip === 'PTRATIO' && (
                <p className="text-[11px] text-[#68766B] bg-[#F8FAF5] p-2 rounded-lg border border-[#E5EBE3]">
                  Pupil-teacher ratio by town (typical range 12.6–22.0).
                </p>
              )}
              {errors.PTRATIO && <p className="text-xs text-rose-500">{errors.PTRATIO}</p>}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-[#E5EBE3] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#68766B]">
            All 13 features will be preprocessed and evaluated by the trained neural network model.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#164E36] hover:bg-[#0f3927] text-white font-semibold text-sm transition-all duration-150 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer ${
              isLoading ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-1 h-4 w-4 text-[#F4C95D]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Evaluating Neural Network...</span>
              </>
            ) : (
              <>
                <span>Estimate Property Value</span>
                <svg
                  className="w-4 h-4 text-[#F4C95D]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
