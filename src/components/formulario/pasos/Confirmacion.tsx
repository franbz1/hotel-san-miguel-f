'use client'

import {
  CheckCircle,
  XCircle,
  Loader2,
  RotateCcw,
  Mail,
  Printer,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  User,
  Phone,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Separator } from '../../ui/separator'
import { useState } from 'react'
import { LinkFormulario } from '@/Types/link-formulario'
import { CreateRegistroFormulario } from '@/Types/registro-formularioDto'

interface ConfirmacionProps {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error?: Error | null
  onRetry?: () => void
  linkFormulario?: LinkFormulario
  datosFormulario?: CreateRegistroFormulario
}

interface ErrorDetail {
  message: string
}

interface ServerErrorResponse {
  message: string
  error: string
  statusCode: number
}

interface CustomError extends Error {
  statusCode?: number
  errorType?: string
  serverResponse?: ServerErrorResponse
}

/**
 * Componente que muestra el estado de confirmación del envío del formulario
 * Maneja los estados: cargando, éxito y error con feedback apropiado
 * Incluye información detallada de la reserva y funcionalidad de impresión
 */
export const Confirmacion = ({
  isLoading,
  isSuccess,
  isError,
  error,
  onRetry,
  linkFormulario,
  datosFormulario,
}: ConfirmacionProps) => {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = () => {
    if (onRetry) {
      setIsRetrying(true)
      onRetry()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Resetear estado de retry cuando cambian los props
  if (
    (isLoading && isRetrying) ||
    (isSuccess && isRetrying) ||
    (!isError && isRetrying)
  ) {
    setIsRetrying(false)
  }

  // Función para parsear errores detallados
  const parseErrorDetails = (
    error: Error | null | undefined
  ): ErrorDetail[] => {
    if (!error) return []

    try {
      // Verificar si es un error personalizado del servidor
      const customError = error as CustomError
      if (customError.serverResponse) {
        const serverResponse = customError.serverResponse
        return [
          {
            message: serverResponse.message || error.message,
          },
        ]
      }

      // Verificar si es un error de validación
      if (
        error.message.includes('validation') ||
        error.message.includes('required')
      ) {
        return [{ message: error.message }]
      }

      // Verificar si es un error de red/conexión
      if (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch')
      ) {
        return [
          {
            message:
              'Error de conexión. Verifique su conexión a internet y vuelva a intentar.',
          },
        ]
      }

      // Verificar errores específicos del servidor por código de estado
      if (error.message.includes('401')) {
        return [
          {
            message: error.message,
          },
        ]
      }

      if (error.message.includes('403')) {
        return [
          {
            message: error.message,
          },
        ]
      }

      if (error.message.includes('404')) {
        return [
          {
            message:
              'El recurso solicitado no fue encontrado. Verifique que el enlace sea válido.',
          },
        ]
      }

      if (error.message.includes('500')) {
        return [
          {
            message: 'Error interno del servidor. Por favor intente más tarde.',
          },
        ]
      }

      // Error genérico
      return [{ message: error.message }]
    } catch {
      return [{ message: 'Error desconocido al procesar la solicitud' }]
    }
  }

  // Formatear fechas
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Estado de carga (inicial o retry)
  if (isLoading) {
    return (
      <Card className='mx-auto max-w-2xl w-full'>
        <CardContent className='p-4 sm:p-8 text-center'>
          <div className='flex flex-col items-center space-y-4'>
            <Loader2 className='h-16 w-16 text-blue-500 animate-spin' />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              {isRetrying ? 'Reintentando envío...' : 'Enviando formulario...'}
            </h2>
            <p className='text-gray-600 dark:text-gray-400 max-w-md'>
              {isRetrying
                ? 'Intentando enviar el formulario nuevamente. Por favor espere.'
                : 'Por favor espere mientras procesamos su información. Este proceso puede tomar unos segundos.'}
            </p>
            <div className='bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg max-w-md'>
              <p className='text-blue-700 dark:text-blue-300 text-sm'>
                💡 <strong>Consejo:</strong> No cierre esta ventana hasta que se
                complete el proceso.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Estado de éxito
  if (isSuccess) {
    return (
      <div className='space-y-4 sm:space-y-6 print:space-y-4 w-full'>
        <Card className='mx-auto max-w-4xl w-full border-green-200 dark:border-green-800 print:shadow-none print:border-gray-300'>
          <CardHeader className='text-center pb-4 px-2 sm:px-6'>
            <div className='flex flex-col items-center space-y-4 w-full'>
              <div className='relative print:hidden'>
                <CheckCircle className='h-20 w-20 text-green-500' />
                <div className='absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20'></div>
              </div>
              <div className='print:block hidden'>
                <CheckCircle className='h-12 w-12 text-green-500 mx-auto' />
              </div>

              <div className='space-y-2'>
                <CardTitle className='text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 print:text-2xl print:text-black'>
                  ¡Registro Completado!
                </CardTitle>
                <p className='text-base sm:text-lg text-gray-600 dark:text-gray-400 print:text-gray-800'>
                  Su información ha sido enviada exitosamente
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className='space-y-4 sm:space-y-6 px-2 sm:px-6'>
            {/* Información de la Reserva */}
            {linkFormulario && (
              <div className='bg-blue-50 dark:bg-blue-950/20 p-4 sm:p-6 rounded-lg print:bg-gray-50 print:border print:border-gray-200'>
                <h3 className='text-lg sm:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2 print:text-black'>
                  <Calendar className='h-5 w-5' />
                  Detalles de la Reserva
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <MapPin className='h-4 w-4 text-blue-600 print:text-gray-600' />
                      <div>
                        <p className='font-medium text-gray-900 dark:text-gray-100 print:text-black'>
                          Habitación
                        </p>
                        <p className='text-blue-700 dark:text-blue-300 print:text-gray-800'>
                          #{linkFormulario.numeroHabitacion}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <Calendar className='h-4 w-4 text-blue-600 print:text-gray-600' />
                      <div>
                        <p className='font-medium text-gray-900 dark:text-gray-100 print:text-black'>
                          Check-in
                        </p>
                        <p className='text-blue-700 dark:text-blue-300 print:text-gray-800'>
                          {formatDate(linkFormulario.fechaInicio)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <CreditCard className='h-4 w-4 text-blue-600 print:text-gray-600' />
                      <div>
                        <p className='font-medium text-gray-900 dark:text-gray-100 print:text-black'>
                          Costo Total
                        </p>
                        <p className='text-blue-700 dark:text-blue-300 font-semibold print:text-gray-800'>
                          ${linkFormulario.costo.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <Calendar className='h-4 w-4 text-blue-600 print:text-gray-600' />
                      <div>
                        <p className='font-medium text-gray-900 dark:text-gray-100 print:text-black'>
                          Check-out
                        </p>
                        <p className='text-blue-700 dark:text-blue-300 print:text-gray-800'>
                          {formatDate(linkFormulario.fechaFin)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información del Huésped Principal */}
            {datosFormulario && (
              <div className='bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 rounded-lg print:bg-white print:border print:border-gray-200'>
                <h3 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 print:text-black'>
                  <User className='h-5 w-5' />
                  Información del Huésped Principal
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <p className='font-medium text-gray-900 dark:text-gray-100 print:text-black'>
                      Nombre Completo
                    </p>
                    <p className='text-gray-700 dark:text-gray-300 print:text-gray-800'>
                      {datosFormulario.nombres}{' '}
                      {datosFormulario.primer_apellido}{' '}
                      {datosFormulario.segundo_apellido}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <p className='font-medium text-gray-900 dark:text-gray-100 print:text-black'>
                      Documento
                    </p>
                    <p className='text-gray-700 dark:text-gray-300 print:text-gray-800'>
                      {datosFormulario.tipo_documento}:{' '}
                      {datosFormulario.numero_documento}
                    </p>
                  </div>

                  {datosFormulario.telefono && (
                    <div className='space-y-2'>
                      <p className='font-medium text-gray-900 dark:text-gray-100 print:text-black flex items-center gap-2'>
                        <Phone className='h-4 w-4' />
                        Teléfono
                      </p>
                      <p className='text-gray-700 dark:text-gray-300 print:text-gray-800'>
                        {datosFormulario.telefono}
                      </p>
                    </div>
                  )}

                  {datosFormulario.correo && (
                    <div className='space-y-2'>
                      <p className='font-medium text-gray-900 dark:text-gray-100 print:text-black flex items-center gap-2'>
                        <Mail className='h-4 w-4' />
                        Correo
                      </p>
                      <p className='text-gray-700 dark:text-gray-300 print:text-gray-800'>
                        {datosFormulario.correo}
                      </p>
                    </div>
                  )}
                </div>

                {/* Acompañantes */}
                {datosFormulario.huespedes_secundarios &&
                  datosFormulario.huespedes_secundarios.length > 0 && (
                    <div className='mt-4 sm:mt-6'>
                      <Separator className='mb-3 sm:mb-4' />
                      <div className='flex items-center gap-2 mb-2 sm:mb-3'>
                        <Users className='h-5 w-5 text-gray-600' />
                        <h4 className='font-semibold text-gray-800 dark:text-gray-200 print:text-black'>
                          Acompañantes (
                          {datosFormulario.huespedes_secundarios.length})
                        </h4>
                      </div>
                      <div className='space-y-2'>
                        {datosFormulario.huespedes_secundarios.map(
                          (acompaniante, index) => (
                            <div
                              key={index}
                              className='flex items-center gap-2 flex-wrap break-words'
                            >
                              <Badge
                                variant='outline'
                                className='print:border-gray-400'
                              >
                                {index + 1}
                              </Badge>
                              <span className='text-gray-700 dark:text-gray-300 print:text-gray-800 text-xs sm:text-sm break-words'>
                                {acompaniante.nombres}{' '}
                                {acompaniante.primer_apellido}{' '}
                                {acompaniante.segundo_apellido}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Información adicional */}
            <div className='bg-green-50 dark:bg-green-950/20 p-4 sm:p-6 rounded-lg print:bg-gray-50 print:border print:border-gray-200'>
              <h3 className='font-semibold text-green-800 dark:text-green-200 mb-2 sm:mb-3 flex items-center gap-2 print:text-black text-base sm:text-lg'>
                ✅ ¿Qué sigue ahora?
              </h3>
              <ul className='text-xs sm:text-sm text-green-700 dark:text-green-300 space-y-1 sm:space-y-2 print:text-gray-800'>
                <li>• Su registro ha sido procesado correctamente</li>
                <li>• El hotel ha recibido su información</li>
                <li>• Puede cerrar esta ventana de forma segura</li>
                <li>• Recibirá confirmación por email si proporcionó uno</li>
                <li>
                  • Presente su documento de identidad al momento del check-in
                </li>
              </ul>
            </div>

            <div className='bg-blue-50 dark:bg-blue-950/20 p-3 sm:p-4 rounded-lg print:hidden'>
              <p className='text-blue-700 dark:text-blue-300 text-xs sm:text-sm'>
                📞 Si tiene alguna pregunta, puede contactar al hotel
                directamente.
              </p>
            </div>

            {/* Botones de acción */}
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 print:hidden w-full'>
              <Button
                onClick={handlePrint}
                variant='outline'
                className='flex-1 min-w-0'
              >
                <Printer className='h-4 w-4 mr-2' />
                Imprimir Confirmación
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estado de error
  if (isError) {
    const errorDetails = parseErrorDetails(error)

    return (
      <Card className='mx-auto max-w-3xl w-full border-red-200 dark:border-red-800'>
        <CardContent className='p-4 sm:p-8'>
          <div className='flex flex-col items-center space-y-6'>
            <XCircle className='h-20 w-20 text-red-500' />

            <div className='space-y-2 text-center'>
              <h2 className='text-2xl sm:text-3xl font-bold text-red-700 dark:text-red-400'>
                Error en el envío
              </h2>
              <p className='text-base sm:text-lg text-gray-600 dark:text-gray-400'>
                No se pudo completar su registro
              </p>
            </div>

            {/* Detalles de errores */}
            <div className='w-full max-w-2xl space-y-3 sm:space-y-4'>
              <div className='bg-red-50 dark:bg-red-950/20 p-3 sm:p-4 rounded-lg'>
                <h3 className='font-semibold text-red-800 dark:text-red-200 mb-2 sm:mb-3 flex items-center gap-2 text-base sm:text-lg'>
                  <AlertTriangle className='h-5 w-5' />
                  Detalles del error:
                </h3>
                <div className='space-y-2'>
                  {errorDetails.map((detail, index) => (
                    <div
                      key={index}
                      className='bg-red-100 dark:bg-red-900/20 p-2 sm:p-3 rounded border-l-4 border-red-400'
                    >
                      <div className='flex items-start gap-2'>
                        <FileText className='h-4 w-4 text-red-600 mt-0.5 flex-shrink-0' />
                        <div className='flex-1'>
                          <p className='text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium break-words'>
                            {detail.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pasos para solucionar */}
              <div className='bg-yellow-50 dark:bg-yellow-950/20 p-3 sm:p-4 rounded-lg'>
                <h3 className='font-semibold text-yellow-800 dark:text-yellow-200 mb-2 sm:mb-3 flex items-center gap-2 text-base sm:text-lg'>
                  💡 Pasos para solucionar:
                </h3>
                <ol className='text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 space-y-1 sm:space-y-2 list-decimal list-inside'>
                  <li>
                    Verificar que todos los campos estén completos y correctos
                  </li>
                  <li>Comprobar su conexión a internet</li>
                  <li>Intentar enviar el formulario nuevamente</li>
                  <li>
                    Si el problema persiste, contactar al hotel directamente
                  </li>
                </ol>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-md'>
              <Button
                onClick={handleRetry}
                variant='default'
                className='flex-1 min-w-0 bg-red-600 hover:bg-red-700 text-white'
                disabled={isRetrying}
              >
                <RotateCcw
                  className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`}
                />
                {isRetrying ? 'Reintentando...' : 'Intentar de nuevo'}
              </Button>
            </div>

            <div className='bg-blue-50 text-center dark:bg-blue-950/20 p-3 sm:p-4 rounded-lg w-full max-w-md'>
              <p className='text-blue-700 dark:text-blue-300 text-xs sm:text-sm mb-2 font-medium'>
                📧 ¿Necesita ayuda adicional?
              </p>
              <a
                href='mailto:reservas@hotelsanmiguel.com?subject=Error en formulario de registro'
                className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline text-xs sm:text-sm flex items-center justify-center gap-1'
              >
                <Mail className='h-4 w-4' />
                reservas@hotelsanmiguel.com
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Estado por defecto (no debería llegar aquí)
  return (
    <Card className='mx-auto max-w-2xl w-full'>
      <CardContent className='p-4 sm:p-8 text-center'>
        <p className='text-gray-600 dark:text-gray-400'>
          Preparando confirmación...
        </p>
      </CardContent>
    </Card>
  )
}
