'use client'

import { ChevronRightIcon, BeakerIcon, CameraIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-2 text-sm font-medium text-orange-400 ring-1 ring-orange-500/20 mb-8 glow">
            <span className="mr-2">🐠</span>
            Next-Gen Aquarium Management
          </div>

          {/* Hero Headline */}
          <h1 className="mx-auto max-w-4xl font-orbitron text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              TANK
            </span>
            <span className="text-green-400 glow-text">
              WIKI
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="mx-auto mt-8 max-w-2xl text-xl text-gray-300 leading-8">
            Advanced aquarium management with AI-powered monitoring, automated test strip analysis, and intelligent species identification. The future of aquatic care is here.
          </p>

          {/* Hero CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-orange-500/25 hover:shadow-2xl hover:scale-105 glow-button"
            >
              Launch Dashboard
              <ChevronRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="/demo"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gray-800/50 px-8 py-4 text-lg font-semibold text-gray-200 ring-1 ring-gray-600 transition-all duration-300 hover:bg-green-400/10 hover:text-green-400 hover:ring-green-400/50 hover:scale-105"
            >
              Watch Demo
              <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl font-bold text-white sm:text-5xl">
              Advanced Features
            </h2>
            <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
              Cutting-edge technology meets aquarium management with our suite of AI-powered tools
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 backdrop-blur-sm border border-gray-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 glow">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="mt-6 font-orbitron text-2xl font-bold text-white">
                  Smart Monitoring
                </h3>
                <p className="mt-4 text-gray-300 leading-7">
                  Real-time tank parameter tracking with predictive analytics. Get alerts before problems occur and maintain optimal conditions automatically.
                </p>
                
                <div className="mt-6 flex items-center text-orange-400 font-semibold group-hover:text-green-400 transition-colors">
                  Learn more
                  <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 backdrop-blur-sm border border-gray-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 glow">
                  <BeakerIcon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="mt-6 font-orbitron text-2xl font-bold text-white">
                  AI Test Analysis
                </h3>
                <p className="mt-4 text-gray-300 leading-7">
                  Snap a photo of your test strips and get instant, accurate readings. Our AI analyzes colors with laboratory precision and tracks trends over time.
                </p>
                
                <div className="mt-6 flex items-center text-red-400 font-semibold group-hover:text-green-400 transition-colors">
                  Learn more
                  <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 backdrop-blur-sm border border-gray-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-500 glow">
                  <CameraIcon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="mt-6 font-orbitron text-2xl font-bold text-white">
                  Species ID
                </h3>
                <p className="mt-4 text-gray-300 leading-7">
                  Identify fish, plants, and invertebrates instantly with computer vision. Get care requirements, compatibility info, and breeding tips automatically.
                </p>
                
                <div className="mt-6 flex items-center text-green-400 font-semibold group-hover:text-green-400 transition-colors">
                  Learn more
                  <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-3xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-12 backdrop-blur-sm border border-gray-700/50">
            <h2 className="font-orbitron text-4xl font-bold text-white sm:text-5xl">
              Ready to Upgrade Your Aquarium?
            </h2>
            <p className="mt-6 text-xl text-gray-300">
              Join thousands of aquarists using TankWiki to maintain perfect aquatic environments
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-orange-500/25 hover:shadow-2xl hover:scale-105 glow-button"
              >
                Start Free Trial
                <ChevronRightIcon className="h-5 w-5" />
              </Link>
              
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gray-800/50 px-8 py-4 text-lg font-semibold text-gray-200 ring-1 ring-gray-600 transition-all duration-300 hover:bg-green-400/10 hover:text-green-400 hover:ring-green-400/50 hover:scale-105"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}