"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCookie, removeAuthCookies } from '@/lib/common/cookies'
import { COOKIE_NAMES } from '@/lib/common/cookies'
import { getValidatedUser } from '@/lib/auth/auth-service'
import { AUTH_ENDPOINTS } from '@/lib/common/api'

interface User {
  id: number
  nombre: string
  rol: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
  login: (userData: User) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
  login: () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const token = getCookie(COOKIE_NAMES.TOKEN)
        if (!token) {
          removeAuthCookies()
          setUser(null)
          return
        }
        
        const validatedUser = await getValidatedUser(token)
        if (validatedUser) {
          setUser(validatedUser)
        } else {
          removeAuthCookies()
          setUser(null)
        }
      } catch {
        removeAuthCookies()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    validateAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setIsLoading(false)
  }

  const logout = async () => {
    const token = getCookie(COOKIE_NAMES.TOKEN)

    try {
      if (token) {
        await fetch(AUTH_ENDPOINTS.LOGOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Backend logout request failed:', error)
    } finally {
      removeAuthCookies()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 