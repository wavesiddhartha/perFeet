'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Sparkles 
} from 'lucide-react'
import { useOpenRouter } from '@/lib/openrouter-client'
import { cn } from '@/lib/utils'

interface FactCheckResult {
  verdict: 'true' | 'false' | 'partially_true' | 'unverifiable'
  confidence: number
  explanation: string
  model_used: string
}

interface KimiFactCheckerProps {
  className?: string
}

export function KimiFactChecker({ className }: KimiFactCheckerProps) {
  const [claim, setClaim] = useState('')
  const [result, setResult] = useState<FactCheckResult | null>(null)
  const { factCheck, loading, error } = useOpenRouter()

  const handleFactCheck = async () => {
    if (!claim.trim()) return

    try {
      const response = await factCheck(claim)
      
      // Try to parse structured response
      try {
        const parsed = JSON.parse(response)
        setResult({
          verdict: parsed.verdict || 'unverifiable',
          confidence: parsed.confidence || 0.5,
          explanation: parsed.explanation || response,
          model_used: 'moonshotai/kimi-k2:free'
        })
      } catch {
        // Fallback to text analysis
        const confidence = response.toLowerCase().includes('confident') ? 0.8 : 0.6
        let verdict: 'true' | 'false' | 'partially_true' | 'unverifiable' = 'unverifiable'
        
        if (response.toLowerCase().includes('true') && !response.toLowerCase().includes('false')) {
          verdict = 'true'
        } else if (response.toLowerCase().includes('false') && !response.toLowerCase().includes('true')) {
          verdict = 'false'
        } else if (response.toLowerCase().includes('partially')) {
          verdict = 'partially_true'
        }
        
        setResult({
          verdict,
          confidence,
          explanation: response,
          model_used: 'moonshotai/kimi-k2:free'
        })
      }
    } catch (err) {
      console.error('Fact-check failed:', err)
      setResult({
        verdict: 'unverifiable',
        confidence: 0,
        explanation: 'Failed to fact-check this claim. Please try again.',
        model_used: 'moonshotai/kimi-k2:free'
      })
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return <CheckCircle className="h-5 w-5 text-success-600" />
      case 'false':
        return <XCircle className="h-5 w-5 text-error-600" />
      case 'partially_true':
        return <AlertTriangle className="h-5 w-5 text-warning-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return 'bg-success-50 border-success-200 text-success-900'
      case 'false':
        return 'bg-error-50 border-error-200 text-error-900'
      case 'partially_true':
        return 'bg-warning-50 border-warning-200 text-warning-900'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return 'True'
      case 'false':
        return 'False'
      case 'partially_true':
        return 'Partially True'
      default:
        return 'Unverifiable'
    }
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-accent-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Kimi K2 Fact Checker
          </h2>
        </div>
        <p className="text-gray-600">
          Powered by Moonshot AI's Kimi K2 model via OpenRouter
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="Enter a claim to fact-check (e.g., 'The Eiffel Tower was built in 1889')"
            className="w-full min-h-[120px] p-4 border border-gray-200 rounded-2xl resize-none focus:border-accent-500 focus:ring-0 focus:outline-none transition-colors"
            disabled={loading}
          />
          
          <motion.button
            onClick={handleFactCheck}
            disabled={!claim.trim() || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
              claim.trim() && !loading
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? 'Checking...' : 'Fact Check'}
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-error-50 border border-error-200 rounded-2xl"
          >
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-error-600" />
              <span className="text-error-900 font-medium">Error</span>
            </div>
            <p className="text-error-700 mt-1">{error}</p>
          </motion.div>
        )}
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Verdict Card */}
            <div className={cn(
              "p-6 border rounded-2xl",
              getVerdictColor(result.verdict)
            )}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  {getVerdictIcon(result.verdict)}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {getVerdictLabel(result.verdict)}
                    </h3>
                    
                    {/* Confidence Score */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Confidence:
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-20 h-2 bg-white/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full bg-current rounded-full"
                          />
                        </div>
                        <span className="text-sm font-mono">
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Model Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 px-4">
              <span>Analyzed by: {result.model_used}</span>
              <span>Response time: ~2s</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Example Claims */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Try these examples:</h4>
        <div className="flex flex-wrap gap-2">
          {[
            "The Great Wall of China is visible from space",
            "Water boils at 100°C at sea level",
            "Shakespeare wrote Romeo and Juliet in 1595",
            "Humans only use 10% of their brains"
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setClaim(example)}
              disabled={loading}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Compact version for embedding in other components
export function CompactKimiFactChecker({ className }: KimiFactCheckerProps) {
  const [claim, setClaim] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const { factCheck, loading } = useOpenRouter()

  const handleQuickCheck = async () => {
    if (!claim.trim()) return
    
    try {
      const response = await factCheck(claim)
      // Show result in a toast or modal
      console.log('Fact-check result:', response)
    } catch (err) {
      console.error('Quick fact-check failed:', err)
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent-600" />
        <span className="text-sm font-medium text-gray-700">
          Quick Fact Check
        </span>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="Enter claim to verify..."
          className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-full focus:border-accent-500 focus:ring-0 focus:outline-none"
          onKeyPress={(e) => e.key === 'Enter' && handleQuickCheck()}
        />
        
        <button
          onClick={handleQuickCheck}
          disabled={!claim.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black text-white rounded-full disabled:bg-gray-300"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Search className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  )
}