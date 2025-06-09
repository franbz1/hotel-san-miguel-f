"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Home,
  RefreshCw,
  BarChart3,
  Info,
  Calendar,
  Minus,
} from "lucide-react"
import { formatCurrency, formatPercentage, convertUTCToLocal } from "@/lib/analytics/analytics-service"
import { FiltrosDashboardDto } from "@/Types/analytics"
import { useAnalyticsDashboard } from "@/hooks/useAnalytics"
import { toast } from "sonner"

interface KpisDashboardProps {
  className?: string
}

// Tipos de período disponibles
type TipoPeriodo = 'día' | 'semana' | 'mes'

// Helper: formatea una Date local a "YYYY-MM-DD"
function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Función para calcular fechas de período
// NOTA: Las fechas se calculan localmente y se envían como UTC al servidor
// El servidor devuelve fechas en UTC que se convierten a local para mostrar
function calcularPeriodos(tipoPeriodo: TipoPeriodo) {
  const hoy = new Date()
  let inicioActual: Date, finActual: Date
  let inicioAnterior: Date, finAnterior: Date

  switch (tipoPeriodo) {
    case 'día': {
      // Inicio y fin de hoy (00:00:00 y 23:59:59.999)
      inicioActual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0)
      finActual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999)

      // Día anterior
      const ayer = new Date(hoy)
      ayer.setDate(hoy.getDate() - 1)
      inicioAnterior = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate(), 0, 0, 0, 0)
      finAnterior = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate(), 23, 59, 59, 999)
      break
    }

    case 'semana': {
      // Calcular lunes de esta semana (lunes = día 1; domingo = día 0)
      const dia = hoy.getDay()
      const desplazamientoAlLunes = dia === 0 ? 6 : dia - 1

      // Lunes actual
      inicioActual = new Date(hoy)
      inicioActual.setDate(hoy.getDate() - desplazamientoAlLunes)
      inicioActual.setHours(0, 0, 0, 0)

      // Domingo de esta semana (6 días después del lunes)
      finActual = new Date(inicioActual)
      finActual.setDate(inicioActual.getDate() + 6)
      finActual.setHours(23, 59, 59, 999)

      // Semana anterior (7 días antes del lunes actual)
      const inicioSemAnterior = new Date(inicioActual)
      inicioSemAnterior.setDate(inicioActual.getDate() - 7)
      inicioAnterior = new Date(inicioSemAnterior)
      inicioAnterior.setHours(0, 0, 0, 0)

      finAnterior = new Date(inicioAnterior)
      finAnterior.setDate(inicioAnterior.getDate() + 6)
      finAnterior.setHours(23, 59, 59, 999)
      break
    }

    case 'mes': {
      const año = hoy.getFullYear()
      const mes = hoy.getMonth()

      // Mes actual: desde el día 1 hasta el último
      inicioActual = new Date(año, mes, 1, 0, 0, 0, 0)
      finActual = new Date(año, mes + 1, 0, 23, 59, 59, 999)

      // Mes anterior
      let mesAnt = mes - 1
      let añoAnt = año
      if (mesAnt < 0) {
        mesAnt = 11
        añoAnt = año - 1
      }
      inicioAnterior = new Date(añoAnt, mesAnt, 1, 0, 0, 0, 0)
      finAnterior = new Date(añoAnt, mesAnt + 1, 0, 23, 59, 59, 999)
      break
    }

    default:
      throw new Error("Tipo de período no válido")
  }

  return {
    actual: {
      fechaInicio: formatLocalDate(inicioActual),
      fechaFin: formatLocalDate(finActual),
    },
    anterior: {
      fechaInicio: formatLocalDate(inicioAnterior),
      fechaFin: formatLocalDate(finAnterior),
    },
  }
}

// Función para obtener el nombre del período (maneja fechas UTC del servidor)
function getNombrePeriodo(tipoPeriodo: TipoPeriodo, fechaInicio: string, fechaFin: string) {
  // Las fechas pueden venir en formato UTC del servidor, las convertimos a fecha local para mostrar
  const inicioLocal = fechaInicio.includes('T') ? convertUTCToLocal(fechaInicio) : fechaInicio
  const finLocal = fechaFin.includes('T') ? convertUTCToLocal(fechaFin) : fechaFin
  
  const inicio = new Date(inicioLocal + 'T00:00:00')
  const fin = new Date(finLocal + 'T00:00:00')

  switch (tipoPeriodo) {
    case 'día':
      return inicio.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Bogota'
      })

    case 'semana': {
      const mesInicio = inicio.toLocaleDateString('es-ES', { month: 'short', timeZone: 'America/Bogota' })
      const mesFin = fin.toLocaleDateString('es-ES', { month: 'short', timeZone: 'America/Bogota' })
      const añoInicio = inicio.getFullYear()
      const añoFin = fin.getFullYear()

      // Si la semana está completamente en el mismo mes y año
      if (
        inicio.getMonth() === fin.getMonth() &&
        inicio.getFullYear() === fin.getFullYear()
      ) {
        return `Semana del ${inicio.getDate()} al ${fin.getDate()} de ${inicio.toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric',
          timeZone: 'America/Bogota'
        })}`
      } else {
        // Si cruza mes o año
        return `Semana del ${inicio.getDate()} ${mesInicio} ${añoInicio} al ${fin.getDate()} ${mesFin} ${añoFin}`
      }
    }

    case 'mes':
      return inicio.toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric',
        timeZone: 'America/Bogota'
      })

    default:
      return 'Período'
  }
}

// Función para calcular el cambio porcentual
function calcularCambio(actual: number, anterior: number): number {
  if (anterior === 0) return actual > 0 ? 100 : 0
  return ((actual - anterior) / anterior) * 100
}

// Componente para mostrar el indicador de cambio - MEMOIZADO
const IndicadorCambio = memo(
  ({ cambio, label }: { cambio: number; label: string }) => {
    const esCrecimiento = cambio > 0
    const esNeutral = Math.abs(cambio) < 0.1

    if (esNeutral) {
      return (
        <div className="flex items-center gap-2 text-gray-600">
          <Minus className="h-4 w-4" />
          <span className="text-sm font-medium">Sin cambios significativos</span>
          <span className="text-xs text-muted-foreground">
            ({Math.abs(cambio).toFixed(1)}%)
          </span>
        </div>
      )
    }

    return (
      <div
        className={`flex items-center gap-2 ${
          esCrecimiento ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {esCrecimiento ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {esCrecimiento ? 'Crecimiento' : 'Decrecimiento'} del{' '}
          {Math.abs(cambio).toFixed(1)}%
        </span>
        <span className="text-xs text-muted-foreground">vs {label}</span>
      </div>
    )
  }
)

IndicadorCambio.displayName = 'IndicadorCambio'

export function KpisDashboard({ className = '' }: KpisDashboardProps) {
  const [tipoPeriodo, setTipoPeriodo] = useState<TipoPeriodo>('mes')

  // Calcular períodos - MEMOIZADO
  const periodos = useMemo(() => calcularPeriodos(tipoPeriodo), [tipoPeriodo])

  // Filtros para período actual - MEMOIZADOS
  const filtrosActual = useMemo(
    (): FiltrosDashboardDto => ({
      fechaInicio: periodos.actual.fechaInicio,
      fechaFin: periodos.actual.fechaFin,
    }),
    [periodos.actual.fechaInicio, periodos.actual.fechaFin]
  )

  // Filtros para período anterior - MEMOIZADOS
  const filtrosAnterior = useMemo(
    (): FiltrosDashboardDto => ({
      fechaInicio: periodos.anterior.fechaInicio,
      fechaFin: periodos.anterior.fechaFin,
    }),
    [periodos.anterior.fechaInicio, periodos.anterior.fechaFin]
  )

  // Hooks para obtener datos
  const {
    data: dataActual,
    loading: loadingActual,
    error: errorActual,
    refetch: refetchActual,
  } = useAnalyticsDashboard(filtrosActual)

  const {
    data: dataAnterior,
    loading: loadingAnterior,
    error: errorAnterior,
    refetch: refetchAnterior,
  } = useAnalyticsDashboard(filtrosAnterior)

  const loading = loadingActual || loadingAnterior
  const error = errorActual || errorAnterior

  // Extraer mensaje de error en texto
  const textoError = 
    error === null ? '' :
    typeof error === 'string' ? error :
    'Error desconocido'

  // Calcular cambios - MEMOIZADOS
  const cambioOcupacion = useMemo(() => {
    const a = dataActual?.ocupacionActual ?? 0
    const b = dataAnterior?.ocupacionActual ?? 0
    return calcularCambio(a, b)
  }, [dataActual, dataAnterior])

  const cambioIngresos = useMemo(() => {
    const a = dataActual?.ingresosPeriodo ?? 0
    const b = dataAnterior?.ingresosPeriodo ?? 0
    return calcularCambio(a, b)
  }, [dataActual, dataAnterior])

  // Nombres de períodos memoizados
  const nombrePeriodoActual = useMemo(
    () =>
      getNombrePeriodo(
        tipoPeriodo,
        periodos.actual.fechaInicio,
        periodos.actual.fechaFin
      ),
    [tipoPeriodo, periodos.actual.fechaInicio, periodos.actual.fechaFin]
  )

  const nombrePeriodoAnterior = useMemo(
    () =>
      getNombrePeriodo(
        tipoPeriodo,
        periodos.anterior.fechaInicio,
        periodos.anterior.fechaFin
      ),
    [tipoPeriodo, periodos.anterior.fechaInicio, periodos.anterior.fechaFin]
  )

  // Función de refresh memoizada
  const handleRefresh = useCallback(async () => {
    if (loading) return
    try {
      await Promise.all([refetchActual(), refetchAnterior()])
      toast.success("KPIs actualizados", {
        description: "Los datos del dashboard se han actualizado correctamente",
      })
    } catch (err) {
      console.error("Error al actualizar KPIs:", err)
      toast.error("Error al actualizar KPIs", {
        description: "No se pudieron actualizar los datos del dashboard",
      })
    }
  }, [refetchActual, refetchAnterior, loading])

  // Handler para cambio de período memoizado
  const handlePeriodoChange = useCallback((value: TipoPeriodo) => {
    setTipoPeriodo(value)
  }, [])

  if (textoError) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold mb-2">Error al cargar KPIs</h3>
            <p className="text-sm mb-4">{textoError}</p>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
    <div className={`space-y-6 ${className}`}>
        {/* Header con controles */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
            KPIs Ejecutivos - Comparación de Períodos
        </h2>
          <div className="flex items-center gap-3">
            {/* Selector de período */}
        <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={tipoPeriodo} onValueChange={handlePeriodoChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="día">Día</SelectItem>
                  <SelectItem value="semana">Semana</SelectItem>
                  <SelectItem value="mes">Mes</SelectItem>
                </SelectContent>
              </Select>
                </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
              className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

        {/* Información de períodos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">Período Anterior:</span>
            <span>{nombrePeriodoAnterior}</span>
          </div>
          <div className="flex items-center gap-2 md:justify-end">
            <span className="font-medium">Período Actual:</span>
            <span>{nombrePeriodoActual}</span>
        </div>
      </div>

      {/* Métricas principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ocupación */}
        <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Ocupación Hotelera
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <div className="space-y-2">
                      <p className="font-semibold">¿Qué es la Ocupación?</p>
                      <p className="text-sm">
                        Porcentaje de habitaciones ocupadas respecto al total disponible
                        en el período.
                      </p>
                      <p className="text-sm">
                        <strong>Interpretación:</strong>
                        <br />• 70-85%: Rango óptimo de ocupación
                        <br />• &gt;90%: Considerar aumentar tarifas
                        <br />• &lt;60%: Revisar estrategias de marketing
                      </p>
                      <p className="text-sm">
                        <strong>Tendencia actual:</strong>
                        <br />
                        {!loading && dataActual && dataAnterior ? (
                          cambioOcupacion > 5 ? (
                            <span className="text-green-600">
                              📈 Excelente crecimiento del {cambioOcupacion.toFixed(1)}%. 
                              La estrategia actual está funcionando bien.
                            </span>
                          ) : cambioOcupacion < -5 ? (
                            <span className="text-red-600">
                              📉 Decrecimiento del {Math.abs(cambioOcupacion).toFixed(1)}%. 
                              Revisar estrategias de marketing y precios.
                            </span>
                          ) : (
                            <span className="text-yellow-600">
                              ➖ Ocupación estable. Buscar oportunidades de optimización.
                            </span>
                          )
                        ) : 'Cargando análisis...'}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Datos del período actual */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Período Actual
                  </span>
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                </div>
                {loading ? (
                  <Skeleton className="h-12 w-24" />
                ) : (
                  <p className="text-3xl font-bold text-blue-600">
                    {formatPercentage(dataActual?.ocupacionActual ?? 0)}
                  </p>
                )}
              </div>

              {/* Datos del período anterior */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Período Anterior
                  </span>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                </div>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-xl font-semibold text-gray-600">
                    {formatPercentage(dataAnterior?.ocupacionActual ?? 0)}
                  </p>
                )}
              </div>

              {/* Indicador de cambio */}
              <div className="pt-4 border-t">
                {loading ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <IndicadorCambio
                    cambio={cambioOcupacion}
                    label={nombrePeriodoAnterior}
                  />
                )}
            </div>
          </CardContent>
        </Card>

          {/* Ingresos */}
        <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Ingresos del Período
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <div className="space-y-2">
                      <p className="font-semibold">¿Qué son los Ingresos del Período?</p>
                      <p className="text-sm">
                        Total de ingresos generados por alojamiento en el período
                        seleccionado.
                      </p>
                      <p className="text-sm">
                        <strong>Interpretación:</strong>
                        <br />• Compara períodos similares para identificar tendencias
                        <br />• Evalúa efectividad de estrategias de precios
                        <br />• Identifica oportunidades de Revenue Management
                      </p>
                      <p className="text-sm">
                        <strong>Análisis actual:</strong>
                        <br />
                        {!loading && dataActual && dataAnterior ? (
                          cambioIngresos > 5 ? (
                            <span className="text-green-600">
                              💰 Crecimiento sólido del {cambioIngresos.toFixed(1)}%. 
                              Los ingresos muestran tendencia positiva.
                            </span>
                          ) : cambioIngresos < -5 ? (
                            <span className="text-red-600">
                              📊 Disminución del {Math.abs(cambioIngresos).toFixed(1)}%. 
                              Evaluar estrategias de Revenue Management.
                            </span>
                          ) : (
                            <span className="text-yellow-600">
                              📈 Ingresos estables. Considerar estrategias para impulsar crecimiento.
                            </span>
                          )
                        ) : 'Cargando análisis...'}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Datos del período actual */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Período Actual
                  </span>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
                {loading ? (
                  <Skeleton className="h-12 w-32" />
                ) : (
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(dataActual?.ingresosPeriodo ?? 0)}
                  </p>
                )}
              </div>

              {/* Datos del período anterior */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Período Anterior
                  </span>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
      </div>
            {loading ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <p className="text-xl font-semibold text-gray-600">
                    {formatCurrency(dataAnterior?.ingresosPeriodo ?? 0)}
                  </p>
                )}
              </div>

              {/* Indicador de cambio */}
              <div className="pt-4 border-t">
            {loading ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <IndicadorCambio
                    cambio={cambioIngresos}
                    label={nombrePeriodoAnterior}
                  />
                )}
              </div>
          </CardContent>
        </Card>
      </div>
            </div>
    </TooltipProvider>
  )
}
