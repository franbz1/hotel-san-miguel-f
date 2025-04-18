"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { validateLinkFormulario } from "@/lib/link-formulario-service"
import { Role } from "@/lib/constants"

export default function RegistroFormularioPage() {
  const { token } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const validateToken = async () => {
      try {
        const data = await validateLinkFormulario(token as string)
        if (data.rol !== Role.REGISTRO_FORMULARIO) {
          setError('No tienes permiso para acceder a esta página')
        }
      } catch (err) {
        console.log('error', err)
        setError('Link inválido o expirado')
      } finally {
        setIsLoading(false)
      }
    }

    validateToken()
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Validando acceso...</h1>
          <p>Por favor espere mientras verificamos su token.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Registro de Formulario</h1>
        <p className="text-center text-gray-600">
          Aquí irá el formulario de registro
        </p>
      </div>
    </div>
  )
} 