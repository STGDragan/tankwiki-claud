import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ColorModeProvider from '@/components/ColorModeProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'TankWiki - Advanced Aquarium Management',
  description: 'Sci-fi aquarium management with AI-powered monitoring and species identification',
  keywords: ['aquarium', 'fish', 'tank', 'management', 'AI', 'monitoring'],
  authors: [{ name: 'TankWiki Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden">
        <ColorModeProvider>
          {/* Background Effects */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Primary gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-black"></div>
            
            {/* Animated orbs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-gradient-to-l from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-green-400/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
            
            {/* Tech grid overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent opacity-20"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #ff6b00 0px, transparent 1px), 
                               radial-gradient(circle at 75% 75%, #ff0000 0px, transparent 1px)`,
              backgroundSize: '100px 100px'
            }}></div>
          </div>

          {/* Main Layout */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-1 relative">
              {children}
            </main>
            
            <Footer />
          </div>
        </ColorModeProvider>
      </body>
    </html>
  )
}