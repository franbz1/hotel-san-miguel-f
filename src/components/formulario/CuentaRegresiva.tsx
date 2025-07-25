import { useState, useEffect } from 'react'

interface CuentaRegresivaProps {
  fechaVencimiento: Date
  onExpired?: () => void
}

interface TiempoRestante {
  dias: number
  horas: number
  minutos: number
  segundos: number
  total: number
}

/**
 * Componente minimalista que muestra el tiempo restante para completar el formulario
 * @param fechaVencimiento - Fecha y hora límite para completar el formulario
 */
export const CuentaRegresiva = ({ fechaVencimiento, onExpired }: CuentaRegresivaProps) => {
  const [tiempoRestante, setTiempoRestante] = useState<TiempoRestante>({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
    total: 0,
  })

  const calcularTiempoRestante = (): TiempoRestante => {
    const ahora = new Date().getTime()
    const vencimiento = new Date(fechaVencimiento).getTime()
    const diferencia = vencimiento - ahora

    if (diferencia <= 0) {
      return { dias: 0, horas: 0, minutos: 0, segundos: 0, total: 0 }
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000)

    return { dias, horas, minutos, segundos, total: diferencia }
  }

  useEffect(() => {
    // Calcular tiempo restante inmediatamente
    const tiempoActual = calcularTiempoRestante()
    setTiempoRestante(tiempoActual)

    // Si ya expiró, llamar al callback inmediatamente
    if (tiempoActual.total <= 0 && onExpired) {
      onExpired()
    }

    // Actualizar cada segundo
    const intervalo = setInterval(() => {
      const tiempoActualizado = calcularTiempoRestante()
      setTiempoRestante(tiempoActualizado)
      
      // Si expiró durante la actualización, llamar al callback
      if (tiempoActualizado.total <= 0 && tiempoActual.total > 0 && onExpired) {
        onExpired()
      }
    }, 1000)

    return () => clearInterval(intervalo)
  }, [fechaVencimiento, onExpired])

  // Formatear número con ceros a la izquierda
  const formatearNumero = (num: number): string => {
    return num.toString().padStart(2, '0')
  }

  // Determinar si está en estado crítico (menos de 5 minutos)
  const esCritico = tiempoRestante.total <= 5 * 60 * 1000 && tiempoRestante.total > 0

  // Si el tiempo expiró
  if (tiempoRestante.total <= 0) {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
        <span>⏰ Expirado</span>
      </div>
    )
  }

  // Determinar qué mostrar según el tiempo restante
  const obtenerTextoTiempo = () => {
    if (tiempoRestante.dias > 0) {
      return `${tiempoRestante.dias}d ${formatearNumero(tiempoRestante.horas)}h ${formatearNumero(tiempoRestante.minutos)}m`
    } else if (tiempoRestante.horas > 0) {
      return `${formatearNumero(tiempoRestante.horas)}h ${formatearNumero(tiempoRestante.minutos)}m`
    } else {
      return `${formatearNumero(tiempoRestante.minutos)}:${formatearNumero(tiempoRestante.segundos)}`
    }
  }

  return (
    <div
      className={`text-sm sm:text-base lg:text-lg font-medium flex items-center gap-2 ${
        esCritico
          ? 'text-red-600 dark:text-red-400'
          : 'text-gray-600 dark:text-gray-400'
      }`}
    >
      <p className='hidden sm:inline'>Tiempo para completar el formulario:</p>
      <span className={esCritico ? 'animate-pulse' : ''}>{obtenerTextoTiempo()}</span>
    </div>
  )
} 