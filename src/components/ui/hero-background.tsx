'use client'

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full opacity-20 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-50 to-blue-50 rounded-full opacity-20 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full opacity-15 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
    </div>
  )
}