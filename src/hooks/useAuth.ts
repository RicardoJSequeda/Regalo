'use client'

import { useState, useEffect, useCallback } from 'react'
import { AuthState } from '@/types'

const AUTH_STORAGE_KEY = 'amor-app-auth'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    anniversaryDate: null
  })

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth)
        setAuthState(parsedAuth)
      } catch (error) {
        console.error('Error parsing stored auth:', error)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
  }, [])

  // Función de login
  const login = useCallback((anniversaryDate: string) => {
    const newAuthState: AuthState = {
      isLoggedIn: true,
      anniversaryDate
    }
    setAuthState(newAuthState)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState))
  }, [])

  // Función de logout
  const logout = useCallback(() => {
    const newAuthState: AuthState = {
      isLoggedIn: false,
      anniversaryDate: null
    }
    setAuthState(newAuthState)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  return {
    ...authState,
    login,
    logout
  }
}
