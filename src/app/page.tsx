'use client'

import { LoginForm } from '@/features/auth/LoginForm'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { useAuth } from '@/hooks/useAuth'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function Home() {
  const { isLoggedIn, login, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <main>
      {!isLoggedIn ? (
        <LoginForm 
          onLogin={login} 
          onToggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
      ) : (
        <Dashboard 
          onLogout={logout}
          onToggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
      )}
    </main>
  )
}
