'use client'

import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function ColorModeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (stored === 'light' || (stored === null && !prefersDark)) {
      setIsDark(false)
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      setIsDark(true)
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse"></div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      
      {/* Icons with smooth transition */}
      <div className="relative flex items-center justify-center">
        <SunIcon 
          className={`h-5 w-5 text-orange-400 transition-all duration-500 ${
            isDark ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <MoonIcon 
          className={`h-5 w-5 text-blue-400 absolute transition-all duration-500 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-50'
          }`}
        />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isDark 
          ? 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
          : 'shadow-[0_0_20px_rgba(249,115,22,0.3)]'
      } opacity-0 group-hover:opacity-100`}></div>
    </button>
  )
}