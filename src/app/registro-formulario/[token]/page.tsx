"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Role } from "@/lib/common/constants/constants"
import { LinkFormulario } from "@/Types/link-formulario"
import { RegistroFormulario } from "@/components/formulario/RegistroFormulario"
import { FormularioWrapper } from "@/components/formulario/FormularioWrapper"
import { useValidateLinkFormulario, useLinkFormularioById } from "@/hooks/formulario/useLinkFormulario"
import { useCreateRegistroFormulario } from "@/hooks/formulario/useRegistroFormulario"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"

export default function RegistroFormularioPage() {
  const { token } = useParams()
  const [validatedLinkId, setValidatedLinkId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Hooks para validación y obtención de datos del link
  const { 
    data: validationData, 
    isLoading: isValidating, 
    error: validationError 
  } = useValidateLinkFormulario(token as string)

  const { 
    data: linkFormulario, 
    isLoading: isLoadingLink, 
    error: linkError 
  } = useLinkFormularioById(validatedLinkId!)

  // Hook para crear el registro final
  const createRegistroMutation = useCreateRegistroFormulario()

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

  // Efecto para validar el token y obtener el ID del link
  useEffect(() => {
    if (validationError) {
      handleValidationError(validationError)
      return
    }

    if (validationData) {
      // Verificar el rol
      if (validationData.rol !== Role.REGISTRO_FORMULARIO) {
        setError('No tienes permiso para acceder a esta página')
        return
      }
      
      // Establecer el ID para obtener los datos del link
      setValidatedLinkId(validationData.id)
    }
  }, [validationData, validationError])

  // Efecto para validar la expiración del link
  useEffect(() => {
    if (linkError) {
      handleValidationError(linkError)
      return
    }

    if (linkFormulario) {
      try {
        validateLinkExpiration(linkFormulario)
      } catch (err) {
        handleValidationError(err)
      }
    }
  }, [linkFormulario, linkError])

  /**
   * Maneja el envío final del formulario
   * Combina los datos del usuario (del formulario) con los datos del link
   * @param formData - Datos capturados por el usuario en el formulario
   */
  const handleFormSubmit = async (formData: Partial<CreateRegistroFormulario>) => {
    if (!linkFormulario) {
      console.error('No hay datos del link disponibles')
      return
    }

    try {
      // Combinar datos del link con datos del formulario del usuario
      const completeRegistrationData: CreateRegistroFormulario = {
        // Datos del link (no editables por el usuario)
        numero_habitacion: linkFormulario.numeroHabitacion,
        costo: linkFormulario.costo,
        fecha_inicio: new Date(linkFormulario.fechaInicio),
        fecha_fin: new Date(linkFormulario.fechaFin),
        
        // Datos del formulario (capturados del usuario)
        motivo_viaje: formData.motivo_viaje!,
        numero_acompaniantes: formData.numero_acompaniantes || 0,
        
        // Datos del huésped principal
        tipo_documento: formData.tipo_documento!,
        numero_documento: formData.numero_documento!,
        primer_apellido: formData.primer_apellido!,
        segundo_apellido: formData.segundo_apellido,
        nombres: formData.nombres!,
        pais_residencia: formData.pais_residencia!,
        ciudad_residencia: formData.ciudad_residencia!,
        pais_procedencia: formData.pais_procedencia!,
        ciudad_procedencia: formData.ciudad_procedencia!,
        fecha_nacimiento: formData.fecha_nacimiento!,
        nacionalidad: formData.nacionalidad!,
        ocupacion: formData.ocupacion!,
        genero: formData.genero!,
        telefono: formData.telefono,
        correo: formData.correo,
        
        // Huéspedes secundarios
        huespedes_secundarios: formData.huespedes_secundarios || []
      }

      // Ejecutar la creación del registro
      await createRegistroMutation.mutateAsync({
        token: token as string,
        data: completeRegistrationData
      })

      // TODO: Redirigir a página de éxito o mostrar confirmación
      console.log('Registro creado exitosamente')
      
    } catch (error) {
      console.error('Error al crear registro:', error)
      // TODO: Mostrar error específico al usuario
    }
  }

  // Estados de carga
  const isLoading = isValidating || isLoadingLink
  const isSubmitting = createRegistroMutation.isPending

  // Estados de carga y error
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

  if (!linkFormulario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
          <p>Obteniendo información del formulario...</p>
        </div>
      </div>
    )
  }

  // Renderizar el formulario
  return (
    <FormularioWrapper onSubmit={handleFormSubmit}>
      <RegistroFormulario 
        linkFormulario={linkFormulario}
        isSubmitting={isSubmitting}
      />
    </FormularioWrapper>
  )
} 