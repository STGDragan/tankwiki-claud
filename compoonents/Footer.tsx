'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-gray-800 bg-black/90 backdrop-blur-sm">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 flex items-center justify-center glow">
                <span className="text-sm">🐠</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 glow-text animate-pulse"></div>
            </div>
            <div className="font-orbitron font-bold">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent text-lg">
                TankWiki
              </span>
              <span className="text-gray-400 text-sm ml-2">
                © {currentYear}
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-8 text-sm">
            <a
              href="/privacy"
              className="text-gray-400 hover:text-orange-400 transition-colors duration-300 font-medium"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-gray-400 hover:text-red-400 transition-colors duration-300 font-medium"
            >
              Terms
            </a>
            <a
              href="/support"
              className="text-gray-400 hover:text-green-400 transition-colors duration-300 font-medium"
            >
              Support
            </a>
          </div>

          {/* Tagline */}
          <div className="text-gray-500 text-sm font-medium">
            Advanced Aquarium Management
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">
            Built with cutting-edge technology for the modern aquarist
          </p>
        </div>
      </div>
    </footer>
  )
}