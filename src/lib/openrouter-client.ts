/**
 * OpenRouter API Client for Kimi K2 Model
 * Frontend TypeScript implementation
 */

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface OpenRouterRequest {
  model: string
  messages: OpenRouterMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  stream?: boolean
}

export interface OpenRouterResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class OpenRouterClient {
  private readonly apiKey: string
  private readonly baseUrl = 'https://openrouter.ai/api/v1'
  private readonly defaultModel = 'moonshotai/kimi-k2:free'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''
    
    if (!this.apiKey) {
      console.warn('OpenRouter API key not provided')
    }
  }

  private getHeaders(): Headers {
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.apiKey}`)
    headers.set('Content-Type', 'application/json')
    headers.set('HTTP-Referer', process.env.NEXT_PUBLIC_SITE_URL || 'https://gehraiyaan.com')
    headers.set('X-Title', 'Gehraiyaan - AI Video Fact Checker')
    
    return headers
  }

  /**
   * Make a chat completion request to Kimi K2 model
   */
  async chatCompletion(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: request.model || this.defaultModel,
          messages: request.messages,
          temperature: request.temperature ?? 0.1,
          max_tokens: request.max_tokens ?? 4000,
          top_p: request.top_p ?? 1,
          frequency_penalty: request.frequency_penalty ?? 0,
          presence_penalty: request.presence_penalty ?? 0,
          stream: request.stream ?? false
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('OpenRouter API request failed:', error)
      throw error
    }
  }

  /**
   * Simple fact-check request using Kimi K2
   */
  async factCheck(claim: string, context?: string): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: 'You are an expert fact-checker. Analyze claims and provide accurate, evidence-based assessments. Be concise but thorough.'
      },
      {
        role: 'user',
        content: `Please fact-check the following claim: "${claim}"${context ? `\n\nContext: ${context}` : ''}\n\nProvide your assessment with evidence and confidence level.`
      }
    ]

    try {
      const response = await this.chatCompletion({
        model: this.defaultModel,
        messages,
        temperature: 0.1,
        max_tokens: 2000
      })

      return response.choices[0]?.message?.content || 'Unable to fact-check claim'
    } catch (error) {
      console.error('Fact-check request failed:', error)
      throw new Error('Failed to fact-check claim')
    }
  }

  /**
   * Extract claims from text using Kimi K2
   */
  async extractClaims(text: string): Promise<string[]> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: 'You are an expert at identifying factual claims in text. Extract only verifiable, objective statements. Return as a JSON array of strings.'
      },
      {
        role: 'user',
        content: `Extract all factual claims from this text:\n\n"${text}"\n\nReturn only a JSON array of claim strings, no additional text.`
      }
    ]

    try {
      const response = await this.chatCompletion({
        model: this.defaultModel,
        messages,
        temperature: 0.1,
        max_tokens: 3000
      })

      const content = response.choices[0]?.message?.content || '[]'
      
      // Try to parse JSON response
      try {
        const claims = JSON.parse(content)
        return Array.isArray(claims) ? claims : []
      } catch (parseError) {
        console.warn('Failed to parse claims as JSON:', content)
        // Fallback: split by lines and clean up
        return content
          .split('\n')
          .map(line => line.trim().replace(/^[-*•]\s*/, ''))
          .filter(line => line.length > 10)
      }
    } catch (error) {
      console.error('Claim extraction failed:', error)
      return []
    }
  }

  /**
   * Get available models from OpenRouter
   */
  async getModels(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`)
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Failed to fetch models:', error)
      return []
    }
  }

  /**
   * Check model availability and pricing
   */
  async checkModelInfo(modelName: string = this.defaultModel): Promise<any> {
    try {
      const models = await this.getModels()
      return models.find(model => model.id === modelName)
    } catch (error) {
      console.error('Failed to check model info:', error)
      return null
    }
  }
}

// Export singleton instance
export const openRouterClient = new OpenRouterClient()

// Utility functions for common use cases
export const factCheckClaim = (claim: string, context?: string): Promise<string> => {
  return openRouterClient.factCheck(claim, context)
}

export const extractClaimsFromText = (text: string): Promise<string[]> => {
  return openRouterClient.extractClaims(text)
}

// React hook for using OpenRouter client
import { useState, useCallback } from 'react'

export function useOpenRouter() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const factCheck = useCallback(async (claim: string, context?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await openRouterClient.factCheck(claim, context)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const extractClaims = useCallback(async (text: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await openRouterClient.extractClaims(text)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    factCheck,
    extractClaims,
    loading,
    error
  }
}