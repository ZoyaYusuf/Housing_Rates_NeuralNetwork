import React from 'react'
import heroImage from '../assets/boston_house_hero.jpg'

export default function Hero({ onScrollToForm }) {
  return (
    <section className="relative overflow-hidden py-8 md:py-12 bg-gradient-to-b from-white to-[#F8FAF5] border-b border-[#E5EBE3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Pitch */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#164E36]/10 text-[#164E36] text-xs font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4C95D]"></span>
              SMARTER HOUSING INSIGHTS
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2933] tracking-tight leading-[1.15]">
              Discover the Estimated Value of a Home
            </h1>

            <p className="text-base sm:text-lg text-[#68766B] leading-relaxed max-w-xl">
              Enter a property's details and let our trained neural network
              estimate its median value in Boston's housing market.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onScrollToForm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#164E36] hover:bg-[#0f3927] text-white text-sm font-semibold transition-all duration-150 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
              >
                <span>Enter Property Details</span>
                <svg
                  className="w-4 h-4 text-[#F4C95D]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              <div className="flex items-center gap-2 text-xs text-[#68766B] font-medium bg-white px-3 py-2 rounded-lg border border-[#E5EBE3]">
                <svg
                  className="w-4 h-4 text-[#3F8F57]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Powered by a trained machine learning model</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Property Image and Floating Accents */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Soft decorative background shapes */}
              <div className="absolute -top-4 -right-4 w-64 h-64 bg-[#F4C95D]/25 rounded-full filter blur-2xl -z-10" />
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-[#3F8F57]/20 rounded-full filter blur-2xl -z-10" />

              {/* Main Image Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E5EBE3] shadow-lg bg-white">
                <img
                  src={heroImage}
                  alt="Boston Historic Brownstone Property"
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs bg-black/40 backdrop-blur-md px-3 py-2 rounded-lg">
                  <span className="font-medium">Historic Boston Architecture</span>
                  <span className="text-[#F4C95D] font-semibold">13 Model Features</span>
                </div>
              </div>

              {/* Small Floating Card 1: AI-Based Estimation */}
              <div className="absolute -top-3 -left-3 sm:-left-5 bg-white rounded-xl shadow-md border border-[#E5EBE3] p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3F8F57]/15 flex items-center justify-center text-[#164E36]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#1F2933] uppercase tracking-wider">
                    AI-Based Estimation
                  </p>
                  <p className="text-[10px] text-[#68766B]">
                    Multi-layer neural network
                  </p>
                </div>
              </div>

              {/* Small Floating Card 2: Accuracy Note */}
              <div className="absolute -bottom-3 -right-2 sm:-right-4 bg-white rounded-xl shadow-md border border-[#E5EBE3] px-3.5 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F4C95D]" />
                <span className="text-xs font-semibold text-[#1F2933]">
                  13 Property &amp; Area Features
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
