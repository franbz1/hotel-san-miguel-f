'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  X,
  RefreshCw,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/common/utils'
import { BookingCard } from '@/Types/bookin-card'
import { EstadosFormulario } from '@/Types/enums/estadosFormulario'
import { regenerateLinkFormulario } from '@/lib/formulario/link-formulario-service'
import {
  deleteBookingCard,
  getBookingCardByLinkId,
  tryUploadTra,
} from '@/lib/bookings/bookin-card-service'
import { toast } from 'sonner'

interface BookingCardUIProps {
  booking: BookingCard
  onDeleted?: () => void
}

export default function BookingCardUI({
  booking: initialBooking,
  onDeleted,
}: BookingCardUIProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [booking, setBooking] = useState<BookingCard>(initialBooking)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const statusConfig: Record<
    EstadosFormulario,
    { color: string; text: string }
  > = {
    [EstadosFormulario.COMPLETADO]: {
      color: 'bg-emerald-500',
      text: 'Formulario completado',
    },
    [EstadosFormulario.PENDIENTE]: {
      color: 'bg-amber-500',
      text: 'Formulario pendiente',
    },
    [EstadosFormulario.EXPIRADO]: {
      color: 'bg-red-500',
      text: 'Formulario expirado',
    },
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(booking.url)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleRegenerateLink = async () => {
    try {
      if (booking.estado === EstadosFormulario.COMPLETADO) {
        toast.error(
          'No se puede regenerar el enlace porque el formulario ya ha sido completado'
        )
        return
      }

      setIsRegenerating(true)
      const regeneratedLink = await regenerateLinkFormulario(
        booking.link_formulario_id
      )
      const bookingRegenerated = await getBookingCardByLinkId(
        regeneratedLink.id
      )
      setBooking(bookingRegenerated)
    } catch (error) {
      console.error('Error al regenerar el enlace:', error)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleDeleteBookingCard = async () => {
    try {
      const confirmed = window.confirm(
        `¿Estás seguro que deseas eliminar la reserva de ${booking.nombre}? Esta acción no se puede deshacer.`
      )

      if (!confirmed) return

      setIsDeleting(true)
      await deleteBookingCard(booking.link_formulario_id)
      toast.success('Reserva eliminada exitosamente')
      onDeleted?.() // Notify parent component to refresh the list
    } catch (error: unknown) {
      console.error('Error al eliminar la reserva:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al eliminar la reserva. Por favor, inténtalo de nuevo.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewBookingCard = () => {
    window.open(booking.url, '_blank')
  }

  const handleUploadTra = async () => {
    // Crear una ID para el toast de carga para poder dismissearlo más tarde
    const loadingToastId = 'upload-tra-loading'

    try {
      // Verificar que el estado sea COMPLETADO y no esté ya subido a TRA
      if (
        booking.estado !== EstadosFormulario.COMPLETADO ||
        booking.subido_tra
      ) {
        toast.error(
          'El formulario debe estar completado y no subido a TRA previamente'
        )
        return
      }

      if (!booking.formulario_id) {
        toast.error(
          'Error al subir el formulario a TRA: el formulario no existe o no ha sido completado'
        )
        return
      }

      // Mostrar toast de carga con ID específico
      toast.loading('Subiendo formulario a TRA...', { id: loadingToastId })

      await tryUploadTra(booking.formulario_id)

      // Si llegamos aquí sin error, la subida fue exitosa
      toast.success('Formulario subido exitosamente a TRA')
      setBooking({ ...booking, subido_tra: true })
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al subir el formulario a TRA. Por favor, inténtalo de nuevo.'
      )
    } finally {
      // Asegurarse de que el toast de carga se cierre
      toast.dismiss(loadingToastId)
    }
  }

  return (
    <div className='border rounded-lg overflow-hidden mb-3 transition-all duration-200 hover:shadow-md'>
      {/* HEADER - MOBILE (dos secciones: izquierda con estado/nombre/fechas/hab en columna, derecha el botón) */}
      <div
        className={cn(
          'md:hidden flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-slate-50 transition-colors',
          isExpanded && 'border-b'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Left: estado, nombre, fechas, habitación (columna) centrado */}
        <div className='flex-1 flex flex-col gap-1 items-center justify-center text-center'>
          <div className='flex items-center gap-3'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`h-5 w-5 rounded-full ${
                      statusConfig[booking.estado].color
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{statusConfig[booking.estado].text}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className='font-medium truncate'>{booking.nombre}</div>
          </div>

          <div className='text-sm text-gray-500'>
            <div>
              Fechas:{' '}
              <span className='font-medium'>
                {new Date(booking.fecha_inicio).toLocaleDateString()} -{' '}
                {new Date(booking.fecha_fin).toLocaleDateString()}
              </span>
            </div>
            <div>
              Habitación:{' '}
              <span className='font-medium'>{booking.numero_habitacion}</span>
            </div>
          </div>
        </div>

        {/* Right: botón dropdown */}
        <div className='flex items-center pl-2'>
          <Button
            variant='ghost'
            size='icon'
            className='ml-1 cursor-pointer'
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </Button>
        </div>
      </div>

      {/* HEADER - DESKTOP (mantener layout original) */}
      <div
        className={cn(
          'hidden md:flex items-center p-4 cursor-pointer bg-white hover:bg-slate-50 transition-colors',
          isExpanded && 'border-b'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`h-5 w-5 rounded-full ${
                  statusConfig[booking.estado].color
                }`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{statusConfig[booking.estado].text}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className='ml-4 flex-1'>
          <div className='font-medium'>{booking.nombre}</div>
          <div className='text-sm text-gray-500'>
            Habitación: {booking.numero_habitacion}
          </div>
        </div>

        <div className='flex items-center gap-1 text-s text-gray-500'>
          <span>{new Date(booking.fecha_inicio).toLocaleDateString()}</span>
          <span> - </span>
          <span>{new Date(booking.fecha_fin).toLocaleDateString()}</span>
        </div>

        <Button
          variant='ghost'
          size='icon'
          className='ml-1 cursor-pointer'
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          {isExpanded ? (
            <ChevronUp className='h-4 w-4' />
          ) : (
            <ChevronDown className='h-4 w-4' />
          )}
        </Button>
      </div>

      {/* Contenido expandido */}
      {isExpanded && (
        <div className='p-4 bg-white animate-in slide-in-from-top-2 duration-200'>
          {/* --- MOBILE: Stacked sections en el orden solicitado, centrados --- */}
          <div className='md:hidden flex flex-col gap-4 items-center justify-center'>
            {/* 1. URL (input full width but centrado dentro de un contenedor con max-width) */}
            <div className='w-full'>
              <input
                type='text'
                value={booking.url}
                readOnly
                className='w-full px-3 py-2 border rounded-lg text-sm text-gray-700 bg-gray-50'
                placeholder='link al formulario'
              />
            </div>

            {/* 2. Botones copiar y regenerar (centrados) */}
            <div className='flex gap-2 justify-center'>
              <Button
                variant='outline'
                size='icon'
                className={cn(
                  'cursor-pointer',
                  isRegenerating && 'animate-spin'
                )}
                onClick={handleRegenerateLink}
                disabled={isRegenerating}
              >
                <RefreshCw size={12} />
              </Button>

              <Button
                variant='outline'
                size='sm'
                className={cn(
                  'cursor-pointer',
                  copySuccess && 'bg-green-50 text-green-700 border-green-200'
                )}
                onClick={handleCopyLink}
              >
                {copySuccess ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>

            {/* 3. Botones TRA y SIRE (centrados) */}
            <div className='flex flex-col gap-2 items-center'>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-gray-700'>TRA</span>
                {booking.subido_tra ? (
                  <Badge
                    variant='outline'
                    className='rounded-full p-1 bg-emerald-100 text-emerald-700 border-emerald-200'
                  >
                    ✓
                  </Badge>
                ) : booking.estado === EstadosFormulario.COMPLETADO ? (
                  <Button
                    size='sm'
                    variant='outline'
                    className={cn(
                      'h-7 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                      'transition-all duration-200 cursor-pointer'
                    )}
                    onClick={handleUploadTra}
                    disabled={
                      booking.estado !== EstadosFormulario.COMPLETADO ||
                      !booking.formulario_id
                    }
                  >
                    <Upload size={10} />
                  </Button>
                ) : (
                  <Badge
                    variant='outline'
                    className='rounded-full p-1 bg-red-100 text-red-700 border-red-200'
                  >
                    <X size={12} />
                  </Badge>
                )}
              </div>

              <div className='flex items-center gap-2'>
                <span className='font-medium text-gray-700'>SIRE</span>
                <Badge
                  variant='outline'
                  className={cn(
                    'rounded-full p-1',
                    booking.subido_sire
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                  )}
                >
                  {booking.subido_sire ? '✓' : <X size={12} />}
                </Badge>
              </div>
            </div>

            {/* 4. Costo (centrado) */}
            <div className='flex items-center justify-center'>
              <div className='flex items-center gap-2'>
                <span className='text-gray-700'>valor</span>
                <span className='font-semibold'>
                  ${booking.valor.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 5. Botones eye y eliminar (centrados) */}
            <div className='flex gap-2 justify-center'>
              <Button
                onClick={handleViewBookingCard}
                variant='ghost'
                size='icon'
                className='cursor-pointer h-8 w-8 rounded-full'
              >
                <Eye className='h-6 w-6' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className={cn(
                  'cursor-pointer h-8 w-8 rounded-full transition-all duration-200',
                  'text-red-500 hover:text-red-600 hover:bg-red-50',
                  'active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                  isDeleting && 'animate-pulse bg-red-50'
                )}
                onClick={handleDeleteBookingCard}
                disabled={isDeleting}
                title={'Eliminar reserva'}
              >
                <Trash2 className='h-6 w-6' />
              </Button>
            </div>
          </div>

          {/* --- DESKTOP: mantener layout actual --- */}
          <div className='hidden md:block'>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-2 w-full'>
                <div className='flex-1'>
                  <input
                    type='text'
                    value={booking.url}
                    readOnly
                    className='w-full px-3 py-2 border rounded-lg text-sm text-gray-700 bg-gray-50'
                    placeholder='link al formulario'
                  />
                </div>
                <div className='flex items-center gap-1'>
                  <Button
                    variant='outline'
                    size='icon'
                    className={cn(
                      'cursor-pointer',
                      isRegenerating && 'animate-spin'
                    )}
                    onClick={handleRegenerateLink}
                    disabled={isRegenerating}
                  >
                    <RefreshCw size={12} />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className={cn(
                      'cursor-pointer',
                      copySuccess &&
                        'bg-green-50 text-green-700 border-green-200'
                    )}
                    onClick={handleCopyLink}
                  >
                    {copySuccess ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              </div>

              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <div className='flex gap-2'>
                    <div className='flex items-center gap-1'>
                      <span className='font-medium text-gray-700'>TRA</span>
                      {booking.subido_tra ? (
                        <Badge
                          variant='outline'
                          className='rounded-full p-1 bg-emerald-100 text-emerald-700 border-emerald-200'
                        >
                          ✓
                        </Badge>
                      ) : booking.estado === EstadosFormulario.COMPLETADO ? (
                        <Button
                          size='sm'
                          variant='outline'
                          className={cn(
                            'h-7 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                            'transition-all duration-200 cursor-pointer'
                          )}
                          onClick={handleUploadTra}
                          disabled={
                            booking.estado !== EstadosFormulario.COMPLETADO ||
                            !booking.formulario_id
                          }
                        >
                          <Upload size={10} />
                        </Button>
                      ) : (
                        <Badge
                          variant='outline'
                          className='rounded-full p-1 bg-red-100 text-red-700 border-red-200'
                        >
                          <X size={12} />
                        </Badge>
                      )}
                    </div>
                    <span className='font-medium text-gray-700'>SIRE</span>
                    <Badge
                      variant='outline'
                      className={cn(
                        'rounded-full p-1',
                        booking.subido_sire
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      )}
                    >
                      {booking.subido_sire ? '✓' : <X size={12} />}
                    </Badge>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-700'>valor</span>
                    <span className='font-semibold'>
                      ${booking.valor.toLocaleString()}
                    </span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Button
                      onClick={handleViewBookingCard}
                      variant='ghost'
                      size='icon'
                      className='cursor-pointer h-8 w-8 rounded-full'
                    >
                      <Eye className='h-6 w-6' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className={cn(
                        'cursor-pointer h-8 w-8 rounded-full transition-all duration-200',
                        'text-red-500 hover:text-red-600 hover:bg-red-50',
                        'active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                        isDeleting && 'animate-pulse bg-red-50'
                      )}
                      onClick={handleDeleteBookingCard}
                      disabled={isDeleting}
                      title={'Eliminar reserva'}
                    >
                      <Trash2 className='h-6 w-6' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
