import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Habitacion } from '@/Types/habitacion'
import { EstadosReserva } from '@/Types/enums/estadosReserva'
import { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface RoomAnalyticsProps {
  habitacion?: Habitacion | null
  loading: boolean
}

type PeriodoAnalisis = 'historico' | '30dias' | '15dias' | '7dias' | 'hoy'

interface DatoIngreso {
  fecha: string
  ingresos: number
  fechaCompleta: string
}

export function RoomAnalytics({ habitacion, loading }: RoomAnalyticsProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] =
    useState<PeriodoAnalisis>('30dias')

  const getFechaInicio = (periodo: PeriodoAnalisis): Date => {
    const ahora = new Date()

    switch (periodo) {
      case 'historico':
        return habitacion?.created_at
          ? new Date(habitacion.created_at)
          : new Date(2020, 0, 1)
      case '30dias':
        return new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
      case '15dias':
        return new Date(ahora.getTime() - 15 * 24 * 60 * 60 * 1000)
      case '7dias':
        return new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
      case 'hoy':
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        return hoy
      default:
        return new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
  }

  const analytics = useMemo(() => {
    if (!habitacion?.reservas) {
      return {
        totalIngresos: 0,
        totalNoches: 0,
        totalHuespedes: 0,
        reservasActivas: 0,
        tasaOcupacion: 0,
        ingresoPromedioPorNoche: 0,
        reservasFinalizadas: 0,
        reservasCanceladas: 0,
      }
    }

    const reservas = habitacion.reservas
    const ahora = new Date()
    const fechaInicio = getFechaInicio(periodoSeleccionado)

    // Filtrar reservas del período seleccionado
    const reservasPeriodo = reservas.filter((reserva) => {
      const fechaReserva = new Date(reserva.fecha_inicio)
      return fechaReserva >= fechaInicio && fechaReserva <= ahora
    })

    // Calcular métricas
    const reservasFinalizadas = reservasPeriodo.filter(
      (r) => r.estado === EstadosReserva.FINALIZADO
    ).length

    const reservasCanceladas = reservasPeriodo.filter(
      (r) => r.estado === EstadosReserva.CANCELADO
    ).length

    const reservasActivas = reservasPeriodo.filter(
      (r) =>
        r.estado === EstadosReserva.RESERVADO ||
        r.estado === EstadosReserva.PENDIENTE
    ).length

    // Calcular ingresos solo de reservas finalizadas
    const reservasConIngresos = reservasPeriodo.filter(
      (r) => r.estado === EstadosReserva.FINALIZADO
    )

    const totalIngresos = reservasConIngresos.reduce(
      (total, reserva) => total + (reserva.costo || 0),
      0
    )

    // Calcular noches ocupadas (suma total para otras métricas)
    const totalNoches = reservasConIngresos.reduce((total, reserva) => {
      const inicio = new Date(reserva.fecha_inicio)
      const fin = new Date(reserva.fecha_fin)
      const noches = Math.ceil(
        (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
      )
      return total + noches
    }, 0)

    // Calcular total de huéspedes
    const totalHuespedes = reservasConIngresos.reduce(
      (total, reserva) => total + 1 + (reserva.numero_acompaniantes || 0),
      0
    )

    // Calcular tasa de ocupación CORREGIDA - cuenta días únicos ocupados
    let diasPeriodo: number
    if (periodoSeleccionado === 'hoy') {
      diasPeriodo = 1
    } else if (periodoSeleccionado === 'historico') {
      diasPeriodo = Math.ceil(
        (ahora.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
      )
    } else {
      diasPeriodo = Math.ceil(
        (ahora.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
      )
    }

    // Calcular días únicos ocupados para la tasa de ocupación
    const diasOcupados = new Set<string>()
    
    reservasConIngresos.forEach(reserva => {
      const inicio = new Date(reserva.fecha_inicio)
      const fin = new Date(reserva.fecha_fin)
      const fechaActual = new Date(inicio)
      
      // Iterar por cada día de la reserva
      while (fechaActual < fin) {
        // Solo contar días dentro del período seleccionado
        if (fechaActual >= fechaInicio && fechaActual <= ahora) {
          diasOcupados.add(fechaActual.toDateString())
        }
        fechaActual.setDate(fechaActual.getDate() + 1)
      }
    })

    const tasaOcupacion =
      diasPeriodo > 0 ? Math.round((diasOcupados.size / diasPeriodo) * 100) : 0

    const ingresoPromedioPorNoche =
      totalNoches > 0 ? totalIngresos / totalNoches : 0

    return {
      totalIngresos,
      totalNoches,
      totalHuespedes,
      reservasActivas,
      tasaOcupacion, // Ya no necesita limitación al 100%
      ingresoPromedioPorNoche,
      reservasFinalizadas,
      reservasCanceladas,
    }
  }, [habitacion, periodoSeleccionado])

  const datosGrafica = useMemo((): DatoIngreso[] => {
    if (!habitacion?.reservas) {
      return []
    }

    const fechaInicio = getFechaInicio(periodoSeleccionado)
    const ahora = new Date()

    // Crear un mapa de ingresos por fecha
    const ingresosPorFecha = new Map<string, number>()

    // Obtener reservas finalizadas del período
    const reservasFinalizadas = habitacion.reservas.filter((reserva) => {
      const fechaReserva = new Date(reserva.fecha_inicio)
      return (
        fechaReserva >= fechaInicio &&
        fechaReserva <= ahora &&
        reserva.estado === EstadosReserva.FINALIZADO
      )
    })

    // Sumar ingresos por fecha de inicio de reserva
    reservasFinalizadas.forEach((reserva) => {
      const fechaKey = new Date(reserva.fecha_inicio).toLocaleDateString(
        'es-CO'
      )
      const ingresoActual = ingresosPorFecha.get(fechaKey) || 0
      ingresosPorFecha.set(fechaKey, ingresoActual + (reserva.costo || 0))
    })

    // Generar array de fechas completo (incluyendo días sin ingresos)
    const datos: DatoIngreso[] = []
    const fechaActual = new Date(fechaInicio)

    while (fechaActual <= ahora) {
      const fechaKey = fechaActual.toLocaleDateString('es-CO')
      const ingresos = ingresosPorFecha.get(fechaKey) || 0

      // Formato de fecha para mostrar
      let fechaDisplay: string
      if (periodoSeleccionado === 'hoy') {
        fechaDisplay = 'Hoy'
      } else if (
        periodoSeleccionado === '7dias' ||
        periodoSeleccionado === '15dias'
      ) {
        fechaDisplay = fechaActual.toLocaleDateString('es-CO', {
          month: 'short',
          day: 'numeric',
        })
      } else {
        fechaDisplay = fechaActual.toLocaleDateString('es-CO', {
          month: 'short',
          day: 'numeric',
        })
      }

      datos.push({
        fecha: fechaDisplay,
        ingresos,
        fechaCompleta: fechaKey,
      })

      // Avanzar al siguiente día
      fechaActual.setDate(fechaActual.getDate() + 1)
    }

    return datos
  }, [habitacion, periodoSeleccionado])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatTooltipCurrency = (value: number) => {
    if (value === 0) return 'Sin ingresos'
    return formatCurrency(value)
  }

  return (
    <Card className='border shadow-sm h-full'>
      <CardHeader>
        <CardTitle className='text-lg'>
          Analíticas{' '}
          {habitacion && `- Habitación ${habitacion.numero_habitacion}`}
        </CardTitle>
        <div className='pt-2'>
          <Select
            value={periodoSeleccionado}
            onValueChange={(value: PeriodoAnalisis) =>
              setPeriodoSeleccionado(value)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Seleccionar período' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='historico'>Histórico</SelectItem>
              <SelectItem value='30dias'>Últimos 30 días</SelectItem>
              <SelectItem value='15dias'>Últimos 15 días</SelectItem>
              <SelectItem value='7dias'>Últimos 7 días</SelectItem>
              <SelectItem value='hoy'>Solo hoy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className='p-4'>
        {loading ? (
          <Skeleton className='h-40 w-full' />
        ) : (
          <div className='space-y-4'>
            {/* Gráfica de Ingresos */}
            <div className='border-t pt-4'>
              <h4 className='text-sm font-medium text-muted-foreground mb-3'>
                Ingresos por día
              </h4>
              <div className='h-48 w-full'>
                <ResponsiveContainer
                  width='100%'
                  height='100%'
                >
                  <AreaChart data={datosGrafica}>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='#f0f0f0'
                    />
                    <XAxis
                      dataKey='fecha'
                      tick={{ fontSize: 10 }}
                      interval='preserveStartEnd'
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat('es-CO', {
                          notation: 'compact',
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatTooltipCurrency(value),
                        'Ingresos',
                      ]}
                      labelFormatter={(label) => `Fecha: ${label}`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='ingresos'
                      stroke='#10b981'
                      fill='#10b981'
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Métricas principales */}
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='bg-blue-50 p-3 rounded-md border border-blue-200'>
                <div className='text-blue-600 font-medium'>Ocupación</div>
                <div className='font-bold text-blue-800'>
                  {analytics.tasaOcupacion}%
                </div>
              </div>

              <div className='bg-green-50 p-3 rounded-md border border-green-200'>
                <div className='text-green-600 font-medium'>Ingresos</div>
                <div className='font-bold text-green-800 text-xs'>
                  {formatCurrency(analytics.totalIngresos)}
                </div>
              </div>

              <div className='bg-purple-50 p-3 rounded-md border border-purple-200'>
                <div className='text-purple-600 font-medium'>Noches</div>
                <div className='font-bold text-purple-800'>
                  {analytics.totalNoches}
                </div>
              </div>

              <div className='bg-orange-50 p-3 rounded-md border border-orange-200'>
                <div className='text-orange-600 font-medium'>Huéspedes</div>
                <div className='font-bold text-orange-800'>
                  {analytics.totalHuespedes}
                </div>
              </div>
            </div>

            {/* Métricas adicionales */}
            <div className='space-y-2 text-sm border-t pt-3'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Reservas activas:</span>
                <span className='font-medium'>{analytics.reservasActivas}</span>
              </div>

              <div className='flex justify-between'>
                <span className='text-muted-foreground'>
                  Reservas finalizadas:
                </span>
                <span className='font-medium text-green-600'>
                  {analytics.reservasFinalizadas}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-muted-foreground'>
                  Reservas canceladas:
                </span>
                <span className='font-medium text-red-600'>
                  {analytics.reservasCanceladas}
                </span>
              </div>

              {analytics.ingresoPromedioPorNoche > 0 && (
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Promedio/noche:</span>
                  <span className='font-medium text-xs'>
                    {formatCurrency(analytics.ingresoPromedioPorNoche)}
                  </span>
                </div>
              )}
            </div>

            {/* Mensaje si no hay datos */}
            {analytics.totalNoches === 0 && (
              <div className='text-center text-muted-foreground text-sm mt-4 p-3 bg-gray-50 rounded-md'>
                <p>No hay reservas finalizadas en este período</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
