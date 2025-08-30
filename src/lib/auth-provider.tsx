'use client'

import { createContext, useContext, ReactNode } from 'react'

interface AuthContextType {
  user: any
  login: (credentials: any) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Placeholder auth provider - would integrate with NextAuth.js in production
  const auth = {
    user: null,
    login: async () => {},
    logout: async () => {},
    isLoading: false
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}