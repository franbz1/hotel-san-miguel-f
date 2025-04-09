"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie, clearAuthCookies } from '@/lib/cookies'
import { COOKIE_NAMES } from '@/lib/cookies'

interface User {
  id: number
  nombre: string
  rol: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la página
    const userId = getCookie(COOKIE_NAMES.USER_ID)
    const userName = getCookie(COOKIE_NAMES.USER_NAME)
    const userRole = getCookie(COOKIE_NAMES.USER_ROLE)

    if (userId && userName && userRole) {
      setUser({
        id: parseInt(userId, 10),
        nombre: userName,
        rol: userRole,
      })
    }

    setIsLoading(false)
  }, [])

  const logout = () => {
    // Limpiar cookies y estado
    clearAuthCookies()
    setUser(null)
    
    // Redirigir al login
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 