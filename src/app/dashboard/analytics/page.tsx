"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { useAnalyticsDashboard } from "@/hooks/useAnalytics"
import { FiltrosDashboardDto } from "@/Types/analytics"
import { formatCurrency, formatPercentage } from "@/lib/analytics/analytics-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  BarChart3, 
  Users, 
  Home,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Filter,
  Globe, 
  MapPin, 
  Calendar,
  Percent,
  Building,
  Info,
  Clock,
  ArrowRightLeft,
} from "lucide-react"
import { toast } from "sonner"

type PeriodoAgrupacion = 'día' | 'semana' | 'mes' | 'año'

// Función para calcular y explicar los períodos de agrupación
function explicarPeriodosAgrupacion(
  fechaInicio: string, 
  fechaFin: string, 
  tipoAgrupacion: PeriodoAgrupacion
) {
  const inicio = new Date(fechaInicio + 'T00:00:00')
  const fin = new Date(fechaFin + 'T00:00:00')
  
  switch (tipoAgrupacion) {
    case 'día': {
      // Para días: genera cada día individual en el rango
      const dias = []
      const fechaTemp = new Date(inicio)
      while (fechaTemp < fin) {
        dias.push(new Date(fechaTemp))
        fechaTemp.setDate(fechaTemp.getDate() + 1)
      }
      
      return {
        tipo: 'Agrupación por Días',
        descripcion: `Se analiza cada día individual del ${fechaInicio} al ${fechaFin}`,
        periodosGenerados: `${dias.length} días`,
        detalleLogica: 'Cada día se evalúa por separado para mostrar tendencias diarias precisas',
        ejemploPeriodos: dias.length <= 7 ? 
          dias.map(d => d.toLocaleDateString('es-ES', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short',
            timeZone: 'America/Bogota' 
          })).join(', ') :
          `${dias[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'short', timeZone: 'America/Bogota' })} hasta ${dias[dias.length-1].toLocaleDateString('es-ES', { day: 'numeric', month: 'short', timeZone: 'America/Bogota' })}`,
        icono: '📅',
        color: 'bg-blue-50 border-blue-200 text-blue-800'
      }
    }
    
    case 'semana': {
      // Para semanas: agrupa por semanas completas (lunes a domingo)
      const inicioSemana = new Date(inicio)
      const diasHastaLunes = (inicioSemana.getDay() + 6) % 7 // 0 = lunes
      inicioSemana.setDate(inicioSemana.getDate() - diasHastaLunes)
      
      const finSemana = new Date(fin)
      const diasDesdeUltimoLunes = (finSemana.getDay() + 6) % 7
      finSemana.setDate(finSemana.getDate() - diasDesdeUltimoLunes)
      
      const semanas = []
      const fechaTemp = new Date(inicioSemana)
      while (fechaTemp <= finSemana) {
        semanas.push(new Date(fechaTemp))
        fechaTemp.setDate(fechaTemp.getDate() + 7)
      }
      
      return {
        tipo: 'Agrupación por Semanas',
        descripcion: `Se agrupan los datos por semanas completas (Lunes a Domingo)`,
        periodosGenerados: `${semanas.length} semana${semanas.length > 1 ? 's' : ''}`,
        detalleLogica: 'Las reservas se agrupan en semanas completas para identificar patrones semanales',
        ejemploPeriodos: semanas.map(s => {
          const finSem = new Date(s)
          finSem.setDate(finSem.getDate() + 6)
          return `${s.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', timeZone: 'America/Bogota' })} - ${finSem.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', timeZone: 'America/Bogota' })}`
        }).join(', '),
        icono: '📊',
        color: 'bg-green-50 border-green-200 text-green-800'
      }
    }
    
    case 'mes': {
      // Para meses: agrupa por meses completos
      const inicioMes = new Date(inicio.getFullYear(), inicio.getMonth(), 1)
      const finMes = new Date(fin.getFullYear(), fin.getMonth(), 1)
      
      const meses = []
      const fechaTemp = new Date(inicioMes)
      while (fechaTemp <= finMes) {
        meses.push(new Date(fechaTemp))
        fechaTemp.setMonth(fechaTemp.getMonth() + 1)
      }
      
      return {
        tipo: 'Agrupación por Meses',
        descripcion: `Se agrupan los datos por meses completos`,
        periodosGenerados: `${meses.length} mes${meses.length > 1 ? 'es' : ''}`,
        detalleLogica: 'Las reservas se agrupan mensualmente para análisis de tendencias estacionales',
        ejemploPeriodos: meses.map(m => 
          m.toLocaleDateString('es-ES', { 
            month: 'long', 
            year: 'numeric',
            timeZone: 'America/Bogota' 
          })
        ).join(', '),
        icono: '🗓️',
        color: 'bg-purple-50 border-purple-200 text-purple-800'
      }
    }
    
    case 'año': {
      // Para años: agrupa por años completos
      const añoInicio = inicio.getFullYear()
      const añoFin = fin.getFullYear()
      const años = []
      for (let año = añoInicio; año <= añoFin; año++) {
        años.push(año)
      }
      
      return {
        tipo: 'Agrupación por Años',
        descripcion: `Se agrupan los datos por años completos`,
        periodosGenerados: `${años.length} año${años.length > 1 ? 's' : ''}`,
        detalleLogica: 'Las reservas se agrupan anualmente para análisis de tendencias a largo plazo',
        ejemploPeriodos: años.join(', '),
        icono: '📈',
        color: 'bg-orange-50 border-orange-200 text-orange-800'
      }
    }
    
    default:
      return null
  }
}

export default function AnalyticsPage() {
  // Estado para filtros
  const [filtros, setFiltros] = useState<FiltrosDashboardDto>({
    incluirComparacion: false,
    topMercados: 5
  })

  // Estado local para período de agrupación
  const [periodoAgrupacion, setPeriodoAgrupacion] = useState<PeriodoAgrupacion>('mes')

  // Hook para obtener datos del dashboard
  const { data, loading, error, refetch } = useAnalyticsDashboard(filtros)

  // Estado para controlar visibilidad de filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // Explicación de períodos de agrupación
  const explicacionPeriodos = useMemo(() => {
    if (!filtros.fechaInicio || !filtros.fechaFin) return null
    return explicarPeriodosAgrupacion(filtros.fechaInicio, filtros.fechaFin, periodoAgrupacion)
  }, [filtros.fechaInicio, filtros.fechaFin, periodoAgrupacion])

  // Función para actualizar filtros
  const actualizarFiltro = useCallback(<K extends keyof FiltrosDashboardDto>(
    campo: K,
    valor: FiltrosDashboardDto[K]
  ) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))
  }, [])

  // Función para limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setFiltros({
      incluirComparacion: false,
      topMercados: 5
    })
    setPeriodoAgrupacion('mes')
  }, [])

  // Función para refresh manual
  const handleRefresh = useCallback(async () => {
    try {
      await refetch()
      toast.success("Dashboard actualizado", {
        description: "Los datos se han actualizado correctamente"
      })
    } catch (error) {
      console.error('Error al actualizar dashboard:', error)
      toast.error("Error al actualizar", {
        description: "No se pudieron actualizar los datos"
      })
    }
  }, [refetch])

  // Calcular indicador de cambio
  const getIndicadorCambio = (cambio: number) => {
    if (Math.abs(cambio) < 0.1) {
      return { icono: '—', color: 'text-gray-500', texto: 'Sin cambios' }
    }
    return cambio > 0
      ? { icono: '↗', color: 'text-green-600', texto: `+${cambio.toFixed(1)}%` }
      : { icono: '↘', color: 'text-red-600', texto: `${cambio.toFixed(1)}%` }
  }

  return (
    <TooltipProvider>
    <div>
      {/* Header */}
      <Header />

      {/* Analytics Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header del Dashboard */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
              <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    Dashboard Ejecutivo de Analytics
                    <Badge variant="outline" className="ml-2 text-xs">
                      Agrupado por: {periodoAgrupacion}
                    </Badge>
              </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Vista completa del rendimiento hotelero con análisis detallado y comparaciones temporales
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    className="flex items-center gap-2"
                  >
                    <Filter className={`h-4 w-4 transition-transform duration-200 ${mostrarFiltros ? 'rotate-180' : 'rotate-0'}`} />
                    Filtros
                  </Button>
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
            </CardHeader>

            {/* Panel de Filtros */}
            <div
              className={`border-t bg-slate-50 overflow-hidden transition-all duration-300 ease-in-out ${mostrarFiltros
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 opacity-0'
                }`}
            >
              <CardContent className="py-6">
                <div className={`space-y-4 transition-transform duration-300 ease-in-out ${mostrarFiltros ? 'translate-y-0' : '-translate-y-4'
                  }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Rango de fechas */}
                    <div className="space-y-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label htmlFor="fechaInicio" className="cursor-help">
                            Fecha Inicio <span className="text-blue-500">ⓘ</span>
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fecha de inicio del período a analizar. Requerida para habilitar comparaciones.</p>
                        </TooltipContent>
                      </Tooltip>
                      <Input
                        id="fechaInicio"
                        type="date"
                        value={filtros.fechaInicio || ''}
                        onChange={(e) => actualizarFiltro('fechaInicio', e.target.value || undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label htmlFor="fechaFin" className="cursor-help">
                            Fecha Fin <span className="text-blue-500">ⓘ</span>
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fecha de fin del período a analizar. Requerida para habilitar comparaciones.</p>
                        </TooltipContent>
                      </Tooltip>
                      <Input
                        id="fechaFin"
                        type="date"
                        value={filtros.fechaFin || ''}
                        onChange={(e) => actualizarFiltro('fechaFin', e.target.value || undefined)}
                      />
                    </div>

                    {/* Período de agrupación */}
                    <div className="space-y-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label htmlFor="periodoAgrupacion" className="cursor-help">
                            Agrupar por <span className="text-blue-500">ⓘ</span>
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Define cómo se agrupan los datos temporalmente. Útil para análisis de tendencias y patrones estacionales.</p>
                        </TooltipContent>
                      </Tooltip>
                      <Select
                        value={periodoAgrupacion}
                        onValueChange={(value) => {
                          setPeriodoAgrupacion(value as PeriodoAgrupacion)
                          actualizarFiltro('agruparPor', value as PeriodoAgrupacion)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="día">Día</SelectItem>
                          <SelectItem value="semana">Semana</SelectItem>
                          <SelectItem value="mes">Mes</SelectItem>
                          <SelectItem value="año">Año</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Top mercados */}
                    <div className="space-y-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label htmlFor="topMercados" className="cursor-help">
                            Top Mercados <span className="text-blue-500">ⓘ</span>
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Número de principales mercados emisores a mostrar, ordenados por cantidad de huéspedes e ingresos generados.</p>
                        </TooltipContent>
                      </Tooltip>
                      <Select
                        value={filtros.topMercados?.toString() || '5'}
                        onValueChange={(value) => actualizarFiltro('topMercados', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">Top 3</SelectItem>
                          <SelectItem value="5">Top 5</SelectItem>
                          <SelectItem value="7">Top 7</SelectItem>
                          <SelectItem value="10">Top 10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Opciones adicionales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Incluir comparación */}
                    <div className="space-y-2">
                      <Label>Comparación Temporal</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          id="incluirComparacion"
                          checked={filtros.incluirComparacion || false}
                          disabled={!filtros.fechaInicio || !filtros.fechaFin}
                          onCheckedChange={(checked) => actualizarFiltro('incluirComparacion', checked)}
                        />
                        <Label htmlFor="incluirComparacion" className={!filtros.fechaInicio || !filtros.fechaFin ? 'text-muted-foreground' : ''}>
                          Incluir Comparación con Período Anterior
                        </Label>
                      </div>
                      {(!filtros.fechaInicio || !filtros.fechaFin) && (
                        <p className="text-xs text-muted-foreground">
                          Requiere fechas de inicio y fin para habilitar comparación
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={limpiarFiltros}>
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Información de Períodos - Versión Compacta */}
          {explicacionPeriodos && (
            <div className="flex items-center justify-between text-sm text-muted-foreground bg-slate-50 rounded-lg px-4 py-2">
              <div className="flex items-center gap-3">
                <span className="text-base">{explicacionPeriodos.icono}</span>
                <span className="font-medium">{explicacionPeriodos.descripcion}</span>
                <Badge variant="outline" className="text-xs">
                  {explicacionPeriodos.periodosGenerados}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {filtros.incluirComparacion && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="text-xs cursor-help">
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        Comparación activa
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">Se calculará automáticamente un período anterior equivalente para comparación</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 cursor-help opacity-60 hover:opacity-100 transition-opacity" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md">
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">{explicacionPeriodos.tipo}</p>
                      <p className="text-sm">{explicacionPeriodos.detalleLogica}</p>
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium mb-1">Períodos analizados:</p>
                        <p className="text-xs font-mono bg-gray-100 rounded px-2 py-1 text-black">
                          {explicacionPeriodos.ejemploPeriodos}
                        </p>
                      </div>
                      <p className="text-xs opacity-75 pt-1 border-t">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Zona horaria: America/Bogotá (procesado como UTC en servidor)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          {/* Estado de error */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">Error al cargar dashboard</h3>
                  <p className="text-sm mb-4">{error}</p>
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contenido principal del dashboard */}
          {!error && (
            <>
              {/* KPIs Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Ocupación */}
                <Card>
                  <CardHeader className="pb-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium flex items-center gap-2 cursor-help">
                          <Home className="h-4 w-4 text-blue-600" />
                          Ocupación Actual
                          <span className="text-blue-500 text-xs">ⓘ</span>
                        </CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Porcentaje de habitaciones ocupadas sobre el total disponible en el período seleccionado. Meta objetivo: 75-85%</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPercentage(data?.ocupacionActual || 0)}
                        </div>
                        {data?.comparacionPeriodoAnterior && (
                          <div className={`text-sm flex items-center gap-1 ${getIndicadorCambio(data.comparacionPeriodoAnterior.cambioOcupacion).color}`}>
                            <span>{getIndicadorCambio(data.comparacionPeriodoAnterior.cambioOcupacion).icono}</span>
                            <span>{getIndicadorCambio(data.comparacionPeriodoAnterior.cambioOcupacion).texto}</span>
                            <span className="text-muted-foreground">vs anterior</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* RevPAR */}
                <Card>
                  <CardHeader className="pb-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium flex items-center gap-2 cursor-help">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          RevPAR
                          <span className="text-blue-500 text-xs">ⓘ</span>
                        </CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Revenue Per Available Room: Ingresos totales divididos por habitaciones disponibles. Métrica clave de rentabilidad hotelera.</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(data?.revparActual || 0)}
                        </div>
                        {data?.comparacionPeriodoAnterior && (
                          <div className={`text-sm flex items-center gap-1 ${getIndicadorCambio(data.comparacionPeriodoAnterior.cambioRevpar).color}`}>
                            <span>{getIndicadorCambio(data.comparacionPeriodoAnterior.cambioRevpar).icono}</span>
                            <span>{getIndicadorCambio(data.comparacionPeriodoAnterior.cambioRevpar).texto}</span>
                            <span className="text-muted-foreground">vs anterior</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ADR */}
                <Card>
                  <CardHeader className="pb-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium flex items-center gap-2 cursor-help">
                          <Percent className="h-4 w-4 text-purple-600" />
                          ADR
                          <span className="text-blue-500 text-xs">ⓘ</span>
                        </CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average Daily Rate: Tarifa promedio por habitación vendida. Indica el precio promedio que los huéspedes pagan por noche.</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(data?.adrActual || 0)}
                        </div>
                        {data?.comparacionPeriodoAnterior && (
                          <div className={`text-sm flex items-center gap-1 ${getIndicadorCambio(data.comparacionPeriodoAnterior.cambioAdr).color}`}>
                            <span>{getIndicadorCambio(data.comparacionPeriodoAnterior.cambioAdr).icono}</span>
                            <span>{getIndicadorCambio(data.comparacionPeriodoAnterior.cambioAdr).texto}</span>
                            <span className="text-muted-foreground">vs anterior</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Ingresos */}
                <Card>
                  <CardHeader className="pb-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium flex items-center gap-2 cursor-help">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                          Ingresos Período
                          <span className="text-blue-500 text-xs">ⓘ</span>
                        </CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ingresos totales generados por reservas en el período seleccionado. No incluye servicios adicionales ni impuestos.</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-orange-600">
                          {formatCurrency(data?.ingresosPeriodo || 0)}
                        </div>
                        {data?.comparacionPeriodoAnterior && (
                          <div className={`text-sm flex items-center gap-1 ${getIndicadorCambio(data.comparacionPeriodoAnterior.cambioIngresos).color}`}>
                            <span>{getIndicadorCambio(data.comparacionPeriodoAnterior.cambioIngresos).icono}</span>
                            <span>{getIndicadorCambio(data.comparacionPeriodoAnterior.cambioIngresos).texto}</span>
                            <span className="text-muted-foreground">vs anterior</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Segunda fila de métricas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Mercados Emisores */}
                <Card>
                  <CardHeader>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="flex items-center gap-2 cursor-help">
                          <Globe className="h-5 w-5 text-blue-600" />
                          Top Mercados Emisores
                          <span className="text-blue-500 text-xs">ⓘ</span>
                        </CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Países de origen de los huéspedes ordenados por cantidad y ingresos generados. Útil para estrategias de marketing.</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {data?.topMercadosEmisores?.map((mercado, index) => (
                          <div key={mercado.nacionalidad} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                                {index + 1}
                              </Badge>
                              <span className="font-medium">{mercado.nacionalidad}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{mercado.cantidad} huéspedes</div>
                              <div className="text-sm text-muted-foreground">
                                {mercado.porcentaje.toFixed(1)}% • {formatCurrency(mercado.ingresos)}
                              </div>
                            </div>
                          </div>
                        )) || <p className="text-muted-foreground">No hay datos disponibles</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Distribución Motivos de Viaje */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Motivos de Viaje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-2 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {data?.distribucionMotivosViaje?.map((motivo) => (
                          <div key={motivo.motivo} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {motivo.motivo === 'VACACIONES_RECREO_Y_OCIO' ? 'Vacaciones, Recreo y Ocio' :
                                  motivo.motivo === 'NEGOCIOS_Y_MOTIVOS_PROFESIONALES' ? 'Negocios y Motivos Profesionales' :
                                    motivo.motivo}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {motivo.cantidad} ({motivo.porcentaje.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${motivo.porcentaje}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Promedio estancia: {motivo.duracionPromedioEstancia.toFixed(1)} días
                            </p>
                          </div>
                        )) || <p className="text-muted-foreground">No hay datos disponibles</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Métricas Adicionales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Métricas Adicionales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {data?.tasaHuespedesRecurrentes?.toFixed(1) || '0.0'}%
                          </div>
                          <p className="text-sm text-muted-foreground">Huéspedes Recurrentes</p>
                          <p className="text-xs text-purple-600 mt-1">
                            Clientes que han regresado al hotel
                          </p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600 capitalize">
                            {periodoAgrupacion}
                          </div>
                          <p className="text-sm text-muted-foreground">Período de Agrupación</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Los datos se agrupan por {periodoAgrupacion}
                          </p>
                        </div>

                        {data?.comparacionPeriodoAnterior && (
                          <div className="p-4 bg-slate-50 rounded-lg">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Comparación Período Anterior
                            </h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span>Ocupación:</span>
                                <span>{formatPercentage(data.comparacionPeriodoAnterior.ocupacionAnterior)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>RevPAR:</span>
                                <span>{formatCurrency(data.comparacionPeriodoAnterior.revparAnterior)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Ingresos:</span>
                                <span>{formatCurrency(data.comparacionPeriodoAnterior.ingresosAnteriores)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Rendimiento por Habitaciones */}
              <Card>
                <CardHeader>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardTitle className="flex items-center gap-2 cursor-help">
                        <Building className="h-5 w-5 text-orange-600" />
                        Rendimiento por Habitaciones
                        <span className="text-blue-500 text-xs">ⓘ</span>
                        <Badge variant="secondary" className="ml-2">
                          {data?.rendimientoHabitaciones?.length || 0} habitaciones
                        </Badge>
                      </CardTitle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Análisis individual de cada habitación: ingresos, ocupación y reservas. Haz clic en el nombre para ver detalles.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data?.rendimientoHabitaciones?.slice(0, 10).map((habitacion) => (
                        <div key={habitacion.habitacionId} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div>
                              <div className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                                <Link
                                  href={`/dashboard/room/${habitacion.numeroHabitacion}`}
                                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                >
                                  Habitación {habitacion.numeroHabitacion}
                                </Link>
                              </div>
                              <Badge variant="outline" className="mt-1">{habitacion.tipo}</Badge>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">
                                {formatCurrency(habitacion.ingresosTotales)}
                              </div>
                              <p className="text-xs text-muted-foreground">Ingresos Totales</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {habitacion.porcentajeOcupacion.toFixed(1)}%
                              </div>
                              <p className="text-xs text-muted-foreground">Ocupación</p>
                            </div>
                            <div className="text-center">
                              <div className="text-sm">
                                <div><strong>{habitacion.totalReservas}</strong> reservas</div>
                                <div><strong>{habitacion.nochesVendidas}</strong> noches</div>
                                <div className="text-xs text-muted-foreground">
                                  Promedio: {formatCurrency(habitacion.ingresoPromedioReserva)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-muted-foreground text-center py-8">No hay datos de habitaciones disponibles</p>}

                      {data?.rendimientoHabitaciones && data.rendimientoHabitaciones.length > 10 && (
                        <p className="text-center text-sm text-muted-foreground mt-4">
                          Mostrando las primeras 10 habitaciones de {data.rendimientoHabitaciones.length} total
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
} 