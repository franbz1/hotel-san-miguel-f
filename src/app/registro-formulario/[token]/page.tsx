"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getLinkFormularioById, validateLinkFormulario } from "@/lib/formulario/link-formulario-service"
import { Role } from "@/lib/common/constants"
import { LinkFormulario } from "@/Types/link-formulario"
import RegistroFormulario from "@/components/formulario-steps/registro-formulario"

export default function RegistroFormularioPage() {
  const { token } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [linkFormulario, setLinkFormulario] = useState<LinkFormulario | null>(null)

  useEffect(() => {
    const validateToken = async () => {
      try {
        const data = await validateLinkFormulario(token as string)
        if (data.rol !== Role.REGISTRO_FORMULARIO) {
          setError('No tienes permiso para acceder a esta página')
          return
        }
        const linkFormulario = await getLinkFormularioById(data.id)

        const vencimientoUTC = new Date(linkFormulario.vencimiento)
        const ahoraUTC = new Date()
  
        if (linkFormulario.expirado || vencimientoUTC < ahoraUTC) {
          setError('Link inválido o expirado')
          return
        }

        if (linkFormulario.completado) {
          setError('Link ya completado')
          return
        }

        setLinkFormulario(linkFormulario)
      } catch (err) {
        console.error('error', err)
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

  return linkFormulario ? <RegistroFormulario linkFormulario={linkFormulario} /> : null
} 