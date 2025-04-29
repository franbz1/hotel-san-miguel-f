"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getLinkFormularioById, validateLinkFormulario } from "@/lib/formulario/link-formulario-service"
import { Role } from "@/lib/common/constants/constants"
import { LinkFormulario } from "@/Types/link-formulario"
import RegistroFormulario from "@/components/formulario-steps/registro-formulario"

export default function RegistroFormularioPage() {
  const { token } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [linkFormulario, setLinkFormulario] = useState<LinkFormulario | null>(null)

  const validateLinkAccess = async (token: string) => {
    const data = await validateLinkFormulario(token)
    if (data.rol !== Role.REGISTRO_FORMULARIO) {
      throw new Error('No tienes permiso para acceder a esta página')
    }
    return data
  }

  const validateLinkExpiration = (linkFormulario: LinkFormulario) => {
    const vencimientoUTC = new Date(linkFormulario.vencimiento)
    const ahoraUTC = new Date()

    if (linkFormulario.completado) {
      throw new Error('Link ya completado')
    }

    if (linkFormulario.expirado || vencimientoUTC < ahoraUTC) {
      throw new Error('Link inválido o expirado')
    }
  }

  const handleValidationError = (err: unknown) => {
    if (err instanceof Error) {
      switch (err.message) {
        case 'Link inválido o expirado':
        case 'Link invalido':
        case 'Link expirado':
        case 'Formulario ya completado':
          setError(err.message)
          break
        default:
          setError('Error al validar el link del formulario')
      }
    } else {
      setError('Error al validar el link del formulario')
    }
  }

  useEffect(() => {
    const validateToken = async () => {
      try {
        const data = await validateLinkAccess(token as string)
        const linkFormulario = await getLinkFormularioById(data.id)
        validateLinkExpiration(linkFormulario)
        setLinkFormulario(linkFormulario)
      } catch (err) {
        handleValidationError(err)
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

  return linkFormulario ? <RegistroFormulario linkFormulario={linkFormulario} /> : null
} 