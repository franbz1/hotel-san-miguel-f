"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie, removeAuthCookies } from '@/lib/cookies'
import { COOKIE_NAMES } from '@/lib/cookies'
import { getValidatedUser } from '@/lib/auth-service'

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
  login: (userData: User) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  login: () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
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

  const logout = () => {
    removeAuthCookies()
    setUser(null)
    router.push('/login')
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