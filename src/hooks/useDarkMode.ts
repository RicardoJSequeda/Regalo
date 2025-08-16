'use client'

import { useState, useEffect, useCallback } from 'react'
import { ThemeState } from '@/types'

const THEME_STORAGE_KEY = 'amor-app-theme'

export function useDarkMode() {
  const [themeState, setThemeState] = useState<ThemeState>({
    isDarkMode: false
  })

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme) {
      try {
        const parsedTheme = JSON.parse(storedTheme)
        setThemeState(parsedTheme)
        // Aplicar tema al documento
        if (parsedTheme.isDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } catch (error) {
        console.error('Error parsing stored theme:', error)
        localStorage.removeItem(THEME_STORAGE_KEY)
      }
    }
  }, [])

  // Función para alternar modo oscuro
  const toggleDarkMode = useCallback(() => {
    const newThemeState: ThemeState = {
      isDarkMode: !themeState.isDarkMode
    }
    setThemeState(newThemeState)
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newThemeState))
    
    // Aplicar tema al documento
    if (newThemeState.isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [themeState.isDarkMode])

  return {
    ...themeState,
    toggleDarkMode
  }
}
