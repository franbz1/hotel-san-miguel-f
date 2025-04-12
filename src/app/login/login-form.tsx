"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { saveAuthCookies } from "@/lib/cookies"
import { ROLE_ROUTES, DEFAULT_ROUTE, RoleType } from "@/lib/constants"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    password: "",
    rememberMe: true,
  })
  const [errors, setErrors] = useState({
    nombre: "",
    password: "",
  })
  const [apiError, setApiError] = useState("")

  // Verificar si hay un usuario autenticado y redirigir
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.rol as RoleType
      const redirectPath = ROLE_ROUTES[userRole] || DEFAULT_ROUTE
      router.push(redirectPath)
    }
  }, [isAuthenticated, user, router])

  const validateForm = () => {
    let valid = true
    const newErrors = { nombre: "", password: "" }

    if (!formData.nombre) {
      newErrors.nombre = "El nombre de usuario es obligatorio"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError("")
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setApiError("")

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          password: formData.password,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error("Error de respuesta:", errorData)
        
        if (response.status === 404) {
          setApiError("No se encontró el endpoint de autenticación. Verifica la URL.")
        } else if (response.status === 401) {
          setApiError("Credenciales incorrectas.")
        } else if (response.status === 403) {
          setApiError("Acceso denegado. Posible problema de CORS.")
        } else {
          setApiError(`Error en la autenticación: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()
      
      // Guardar la información de autenticación en cookies
      saveAuthCookies(
        data.token,
        data.usuarioId.toString(),
        data.nombre,
        data.rol,
        formData.rememberMe
      )
      
      // Redirigir según el rol del usuario
      const redirectPath = data.rol ? ROLE_ROUTES[data.rol as RoleType] : DEFAULT_ROUTE
      router.push(redirectPath)
    } catch (error) {
      console.error("Error en la petición:", error)
      setApiError("Error de conexión. Verifica que el servidor esté en funcionamiento.")
    } finally {
      setIsLoading(false)
    }
  }

  // Si está cargando la autenticación, mostrar un indicador de carga
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de usuario</Label>
        <Input
          id="nombre"
          name="nombre"
          type="text"
          placeholder="Tu nombre de usuario"
          autoComplete="username"
          value={formData.nombre}
          onChange={handleChange}
          className={`${errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          disabled={isLoading}
          required
        />
        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className={`pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      {apiError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
          {apiError}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember-me"
          checked={formData.rememberMe}
          onCheckedChange={handleCheckboxChange}
          disabled={isLoading}
        />
        <Label htmlFor="remember-me" className="text-sm font-normal">
          Recordarme
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>
    </form>
  )
}
