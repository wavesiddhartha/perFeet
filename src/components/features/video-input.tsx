'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoInputProps {
  onSubmit: (url: string) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export function VideoInput({ 
  onSubmit, 
  isLoading = false, 
  placeholder = "Paste video URL here...",
  className 
}: VideoInputProps) {
  const [url, setUrl] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim() && !isLoading) {
      onSubmit(url.trim())
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const hasValidUrl = url.trim() && isValidUrl(url.trim())

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full max-w-2xl mx-auto", className)}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "relative flex items-center overflow-hidden rounded-full border-2 bg-white shadow-soft transition-all duration-300",
            isFocused 
              ? "border-black shadow-medium scale-[1.02]" 
              : "border-transparent hover:border-gray-200 hover:shadow-medium"
          )}
        >
          {/* URL Icon */}
          <div className="flex items-center justify-center pl-6 pr-2">
            <LinkIcon className="h-5 w-5 text-gray-400" />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isLoading}
            className={cn(
              "flex-1 bg-transparent px-2 py-4 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:opacity-50",
              "text-ellipsis"
            )}
            autoComplete="url"
            spellCheck={false}
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!hasValidUrl || isLoading}
            whileHover={hasValidUrl && !isLoading ? { scale: 1.05 } : {}}
            whileTap={hasValidUrl && !isLoading ? { scale: 0.95 } : {}}
            className={cn(
              "m-1.5 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200",
              hasValidUrl && !isLoading
                ? "bg-black text-white shadow-soft hover:bg-gray-900 hover:shadow-medium"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </motion.button>
        </div>

        {/* URL Validation Indicator */}
        {url && !hasValidUrl && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-6 top-full mt-2 flex items-center gap-2 text-sm text-error-500"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-error-500" />
            Please enter a valid URL
          </motion.div>
        )}

        {/* Loading State Message */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-6 top-full mt-2 flex items-center gap-2 text-sm text-accent-600"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse" />
            Analyzing video...
          </motion.div>
        )}
      </form>

      {/* Supported Platforms */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-500">
          Supports YouTube, TikTok, Instagram, Twitter, Facebook, and more
        </p>
        
        {/* Platform Icons */}
        <div className="mt-3 flex items-center justify-center gap-4 grayscale opacity-50">
          {[
            { name: 'YouTube', icon: '📺' },
            { name: 'TikTok', icon: '🎵' },
            { name: 'Instagram', icon: '📷' },
            { name: 'Twitter', icon: '🐦' },
            { name: 'Facebook', icon: '👥' },
          ].map((platform) => (
            <div
              key={platform.name}
              className="flex items-center gap-1 text-xs transition-opacity hover:opacity-100"
              title={platform.name}
            >
              <span className="text-base">{platform.icon}</span>
              <span className="hidden sm:inline text-gray-600">{platform.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Usage examples for different contexts
export function CompactVideoInput(props: VideoInputProps) {
  return (
    <VideoInput 
      {...props} 
      className="max-w-md"
      placeholder="Video URL..."
    />
  )
}

export function DashboardVideoInput(props: VideoInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Analyze New Video
        </h3>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
      </div>
      <VideoInput {...props} />
    </div>
  )
}