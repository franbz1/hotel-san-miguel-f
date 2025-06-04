"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Home,
  Calendar,
  RefreshCw,
  Globe,
  BarChart3,
  Target,
  HelpCircle,
  Info,
} from "lucide-react"
import Link from "next/link"
import { getAnalyticsDashboard, formatCurrency, formatPercentage, getChangeColor, getChangeIcon } from "@/lib/analytics/analytics-service"
import { DashboardEjecutivoDto, FiltrosDashboardDto } from "@/Types/analytics"
import { toast } from "sonner"

interface KpisDashboardProps {
  filtros?: FiltrosDashboardDto
  className?: string
}

export function KpisDashboard({ filtros, className = "" }: KpisDashboardProps) {
  const [data, setData] = useState<DashboardEjecutivoDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async (showToast = false) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getAnalyticsDashboard(filtros)
      
      setData(response)
      if (showToast) {
        toast.success("KPIs actualizados", {
          description: "Los datos del dashboard se han actualizado correctamente"
        })
      }
    } catch (error) {
      console.error('Error al cargar KPIs:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      toast.error("Error al cargar KPIs", {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [filtros])

  const handleRefresh = () => {
    fetchDashboardData(true)
  }

  if (error) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold mb-2">Error al cargar KPIs</h3>
            <p className="text-sm mb-4">{error}</p>
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
    <div className={`space-y-6 ${className}`}>
      {/* Header con botón de actualización y ayuda */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          KPIs Ejecutivos
        </h2>
        <div className="flex items-center gap-2">
          {/* Botón de Ayuda */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle className="h-4 w-4" />
                Ayuda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  Guía de Interpretación de KPIs Hoteleros
                </DialogTitle>
                <DialogDescription>
                  Comprende el significado de cada métrica y cómo interpretarlas para la toma de decisiones
                </DialogDescription>
              </DialogHeader>

              {/* Notificar que los datos por defecto son los historicos */}
              <div className="text-sm text-muted-foreground bg-red-50 p-4 rounded-lg">
                <p>Los datos por defecto en el dasboard principal son los historicos, para visualizarlos por rango o filtros, ademas de metricas adicionales ingrese a la sección de <Link className="text-blue-500" href="/dashboard/analytics">Analytics</Link>.</p>
              </div>

              <div className="space-y-6 mt-4">
                {/* Métricas Principales */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-700">📊 Métricas Principales</h3>
                  <div className="grid gap-4">
                    
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Ocupación Actual
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Qué es:</strong> Porcentaje de habitaciones ocupadas respecto al total disponible.<br/>
                        <strong>Cómo interpretarla:</strong> Una ocupación del 70-80% se considera óptima. Más del 90% puede indicar oportunidad de aumentar precios. Menos del 60% requiere estrategias de marketing.<br/>
                        <strong>Ejemplo:</strong> 85% significa que 85 de cada 100 habitaciones están ocupadas.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        RevPAR (Revenue Per Available Room)
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Qué es:</strong> Ingresos por habitación disponible. Se calcula: ADR × Ocupación.<br/>
                        <strong>Cómo interpretarla:</strong> Métrica clave que combina ocupación y tarifas. Un aumento indica mejor rendimiento general.<br/>
                        <strong>Ejemplo:</strong> $150,000 RevPAR significa que cada habitación disponible genera $150,000 en promedio.
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        ADR (Average Daily Rate)
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Qué es:</strong> Tarifa promedio diaria de las habitaciones vendidas.<br/>
                        <strong>Cómo interpretarla:</strong> Indica el poder de fijación de precios. Un ADR creciente sugiere mejor posicionamiento de marca.<br/>
                        <strong>Ejemplo:</strong> $200,000 ADR significa que el precio promedio por noche es de $200,000.
                      </p>
                    </div>

                    <div className="border-l-4 border-emerald-500 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Ingresos del Período
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Qué es:</strong> Total de ingresos generados por alojamiento en el período seleccionado.<br/>
                        <strong>Cómo interpretarla:</strong> Compara con períodos anteriores para evaluar crecimiento. Incluye solo ingresos de habitaciones.<br/>
                        <strong>Ejemplo:</strong> $50,000,000 en el mes indica los ingresos totales por hospedaje.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Indicadores de Comparación */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-700">📈 Indicadores de Cambio</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-green-600 font-bold">↗ +5.2%</span>
                      <span>Crecimiento positivo respecto al período anterior</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-red-600 font-bold">↘ -3.1%</span>
                      <span>Decrecimiento respecto al período anterior</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600 font-bold">→ 0.0%</span>
                      <span>Sin cambios significativos</span>
                    </div>
                  </div>
                </div>

                {/* Métricas Adicionales */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-700">🌍 Métricas de Mercado</h3>
                  <div className="grid gap-4">
                    
                    <div className="border-l-4 border-blue-400 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Top Mercados Emisores
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Qué es:</strong> Ranking de países/nacionalidades que más huéspedes aportan.<br/>
                        <strong>Cómo interpretarla:</strong> Identifica mercados clave para enfocar marketing. Diversificación reduce riesgos.<br/>
                        <strong>Ejemplo:</strong> Colombia 60% indica que 6 de cada 10 huéspedes son colombianos.
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Distribución por Motivos
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Qué es:</strong> Segmentación de huéspedes según su propósito de viaje.<br/>
                        <strong>Cómo interpretarla:</strong> Ayuda a adaptar servicios y marketing. Turismo vs. negocios requieren enfoques diferentes.<br/>
                        <strong>Ejemplo:</strong> 40% turismo, 35% negocios, 25% otros motivos.
                      </p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Tasa de Huéspedes Recurrentes
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Qué es:</strong> Porcentaje de huéspedes que han regresado al hotel.<br/>
                        <strong>Cómo interpretarla:</strong> Indica fidelización. Una tasa alta (&gt;30%) sugiere excelente servicio y satisfacción.<br/>
                        <strong>Ejemplo:</strong> 25% significa que 1 de cada 4 huéspedes ya había estado antes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consejos de Interpretación */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800">💡 Consejos para la Toma de Decisiones</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-blue-700">•</span>
                      <span><strong>Balance Ocupación-ADR:</strong> No siempre más ocupación es mejor. Busca el equilibrio óptimo.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-blue-700">•</span>
                      <span><strong>Tendencias Temporales:</strong> Observa patrones estacionales y compara períodos similares.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-blue-700">•</span>
                      <span><strong>Segmentación:</strong> Diferentes mercados pueden requerir estrategias distintas.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-blue-700">•</span>
                      <span><strong>Benchmarking:</strong> Compara con competidores y estándares de la industria.</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ocupación Actual */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ocupación Actual</p>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{formatPercentage(data?.ocupacionActual || 0)}</p>
                )}
                {!loading && data?.comparacionPeriodoAnterior && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${getChangeColor(data.comparacionPeriodoAnterior.ocupacion.porcentajeCambio)}`}>
                    <span>{getChangeIcon(data.comparacionPeriodoAnterior.ocupacion.porcentajeCambio)}</span>
                    {Math.abs(data.comparacionPeriodoAnterior.ocupacion.porcentajeCambio).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Home className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RevPAR */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">RevPAR</p>
                {loading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{formatCurrency(data?.revparActual || 0)}</p>
                )}
                {!loading && data?.comparacionPeriodoAnterior && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${getChangeColor(data.comparacionPeriodoAnterior.revpar.porcentajeCambio)}`}>
                    <span>{getChangeIcon(data.comparacionPeriodoAnterior.revpar.porcentajeCambio)}</span>
                    {Math.abs(data.comparacionPeriodoAnterior.revpar.porcentajeCambio).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ADR */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ADR</p>
                {loading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{formatCurrency(data?.adrActual || 0)}</p>
                )}
                {!loading && data?.comparacionPeriodoAnterior && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${getChangeColor(data.comparacionPeriodoAnterior.adr.porcentajeCambio)}`}>
                    <span>{getChangeIcon(data.comparacionPeriodoAnterior.adr.porcentajeCambio)}</span>
                    {Math.abs(data.comparacionPeriodoAnterior.adr.porcentajeCambio).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingresos del Período */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos del Período</p>
                {loading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{formatCurrency(data?.ingresosPeriodo || 0)}</p>
                )}
                {!loading && data?.comparacionPeriodoAnterior && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${getChangeColor(data.comparacionPeriodoAnterior.ingresos.porcentajeCambio)}`}>
                    <span>{getChangeIcon(data.comparacionPeriodoAnterior.ingresos.porcentajeCambio)}</span>
                    {Math.abs(data.comparacionPeriodoAnterior.ingresos.porcentajeCambio).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Mercados Emisores */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Mercados Emisores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.topMercadosEmisores?.slice(0, 5).map((mercado, index) => (
                  <div key={mercado.nacionalidad} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm font-medium">{mercado.nacionalidad}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">{mercado.cantidad}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({formatPercentage(mercado.porcentaje)})
                      </span>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay datos disponibles
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivos de Viaje */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Distribución por Motivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.distribucionMotivosViaje?.slice(0, 4).map((motivo) => (
                  <div key={motivo.motivo} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {motivo.motivo.toLowerCase().replace(/_/g, ' ')}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-bold">{motivo.cantidad}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({formatPercentage(motivo.porcentaje)})
                      </span>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay datos disponibles
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Huéspedes recurrentes */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tasa de Huéspedes Recurrentes</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{formatPercentage(data?.tasaHuespedesRecurrentes || 0)}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Porcentaje de huéspedes que han regresado
              </p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 