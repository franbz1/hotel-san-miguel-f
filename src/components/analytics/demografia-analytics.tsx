"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAnalyticsDemografia } from "@/hooks/useAnalytics"
import { FiltrosAnalyticsDto } from "@/Types/analytics"
import { TipoHabitacion } from "@/Types/enums/tiposHabitacion"
import { MotivosViajes } from "@/Types/enums/motivosViajes"
import { EstadosReserva } from "@/Types/enums/estadosReserva"
import { Users, Filter, PieChart, BarChart3, Globe, DollarSign, Info, Trash } from "lucide-react"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// Colores para los gráficos de pastel
const COLORES_PAISES = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
  '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4', '#84cc16'
]

export function DemografiaAnalytics() {
  const [filtros, setFiltros] = useState<FiltrosAnalyticsDto>({})
  
  const { data, loading, error } = useAnalyticsDemografia(filtros)

  const handleFiltroChange = (campo: keyof FiltrosAnalyticsDto, valor: string | string[] | TipoHabitacion | MotivosViajes | EstadosReserva | undefined) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor === 'TODOS' ? undefined : valor
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({})
  }

  // Formatear datos para gráfico de pastel
  const formatearDatosPastel = () => {
    if (!data || data.length === 0) return []
    
    return data
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5) // Top 5 nacionalidades
      .map(item => ({
        name: item.nacionalidad,
        value: item.cantidad,
        porcentaje: item.porcentaje,
        ingresos: item.ingresos
      }))
  }

  // Formatear datos para gráfico de barras (ingresos)
  const formatearDatosBarras = () => {
    if (!data || data.length === 0) return []
    
    return data
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5) // Top 5 por ingresos
      .map(item => ({
        nacionalidad: item.nacionalidad.length > 12 ? 
          item.nacionalidad.substring(0, 12) + '...' : 
          item.nacionalidad,
        nacionalidadCompleta: item.nacionalidad,
        ingresos: Number((item.ingresos / 1000000).toFixed(2)), // En millones
        cantidad: item.cantidad,
        ingresosFormateados: item.ingresos.toLocaleString()
      }))
  }

  const datosPastel = formatearDatosPastel()
  const datosBarras = formatearDatosBarras()

  // Calcular métricas resumen
  const totalHuespedes = data?.reduce((sum, item) => sum + item.cantidad, 0) || 0
  const totalIngresos = data?.reduce((sum, item) => sum + item.ingresos, 0) || 0
  const nacionalidadesUnicas = data?.length || 0
  const ingresoPromedioPorHuesped = totalHuespedes > 0 ? totalIngresos / totalHuespedes : 0

  // Tooltip personalizado para gráfico de pastel
  const CustomPieTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: {
        porcentaje: number;
        ingresos: number;
      };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-blue-600">Huéspedes: {data.value}</p>
          <p className="text-sm text-green-600">Porcentaje: {data.payload.porcentaje.toFixed(1)}%</p>
          <p className="text-sm text-orange-600">Ingresos: ${data.payload.ingresos.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  // Tooltip personalizado para gráfico de barras
  const CustomBarTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: {
        nacionalidadCompleta: string;
        cantidad: number;
        ingresosFormateados: string;
      };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.payload.nacionalidadCompleta}</p>
          <p className="text-sm text-green-600">Ingresos: ${data.payload.ingresosFormateados}</p>
          <p className="text-sm text-blue-600">Huéspedes: {data.payload.cantidad}</p>
        </div>
      )
    }
    return null
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Demografía
            </CardTitle>
            <CardDescription>
              Configure los parámetros para analizar la demografía de huéspedes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Fecha Inicio */}
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={filtros.fechaInicio || ''}
                  onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                />
              </div>

              {/* Fecha Fin */}
              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={filtros.fechaFin || ''}
                  onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                />
              </div>

              {/* Tipo Habitación */}
              <div className="space-y-2">
                <Label>Tipo de Habitación</Label>
                <Select
                  value={filtros.tipoHabitacion || 'TODOS'}
                  onValueChange={(value) => handleFiltroChange('tipoHabitacion', value === 'TODOS' ? undefined : value as TipoHabitacion)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos los tipos</SelectItem>
                    {Object.values(TipoHabitacion).map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Motivo de Viaje */}
              <div className="space-y-2">
                <Label>Motivo de Viaje</Label>
                <Select
                  value={filtros.motivoViaje || 'TODOS'}
                  onValueChange={(value) => handleFiltroChange('motivoViaje', value === 'TODOS' ? undefined : value as MotivosViajes)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los motivos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos los motivos</SelectItem>
                    {Object.values(MotivosViajes).map((motivo) => (
                      <SelectItem key={motivo} value={motivo}>
                        {motivo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                {filtros.fechaInicio && (
                  <Badge variant="secondary">
                    Desde: {new Date(filtros.fechaInicio).toLocaleDateString('es-ES')}
                  </Badge>
                )}
                {filtros.fechaFin && (
                  <Badge variant="secondary">
                    Hasta: {new Date(filtros.fechaFin).toLocaleDateString('es-ES')}
                  </Badge>
                )}
                {filtros.tipoHabitacion && (
                  <Badge variant="secondary">
                    Tipo: {filtros.tipoHabitacion}
                  </Badge>
                )}
                {filtros.motivoViaje && (
                  <Badge variant="secondary">
                    Motivo: {filtros.motivoViaje}
                  </Badge>
                )}
                <Button onClick={limpiarFiltros} className="flex items-center cursor-pointer">
                  <Trash className="h-4 w-4" />
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <PieChart className="h-5 w-5" />
                <span className="font-medium">Error al cargar datos:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Métricas Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">Total Huéspedes</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">¿Qué representa?</p>
                    <p className="text-sm">
                      Número total de huéspedes únicos en el período seleccionado.
                      <br/><br/>
                      <strong>Útil para:</strong> Evaluar el volumen de huéspedes y comparar con períodos anteriores.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    {totalHuespedes.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    huéspedes únicos
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">Nacionalidades</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">¿Qué mide?</p>
                    <p className="text-sm">
                      Diversidad de mercados internacionales.
                      <br/><br/>
                      <strong>Alta diversidad:</strong> Menor riesgo, múltiples mercados
                      <br/>
                      <strong>Baja diversidad:</strong> Dependencia de pocos mercados
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    {nacionalidadesUnicas}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    países diferentes
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">¿Qué representa?</p>
                    <p className="text-sm">
                      Ingresos totales generados por todos los huéspedes en el período.
                      <br/><br/>
                      <strong>Analiza:</strong> Qué nacionalidades generan más ingresos para enfocar marketing.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    ${(totalIngresos / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ingresos en millones
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">Ingreso Promedio</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">¿Cómo interpretarlo?</p>
                    <p className="text-sm">
                      Ingreso promedio por huésped en el período.
                      <br/><br/>
                      <strong>Alto valor:</strong> Huéspedes de mayor poder adquisitivo
                      <br/>
                      <strong>Comparar por nacionalidad:</strong> Identifica mercados premium
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    ${ingresoPromedioPorHuesped.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    por huésped
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pastel - Distribución por Nacionalidad */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Distribución por Nacionalidad</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="font-semibold mb-1">¿Cómo interpretar?</p>
                    <p className="text-sm">
                      Muestra el Top 5 de nacionalidades por cantidad de huéspedes.
                      <br/><br/>
                      <strong>Segmentos grandes:</strong> Mercados principales para fidelizar
                      <br/>
                      <strong>Segmentos pequeños:</strong> Oportunidades de crecimiento
                      <br/><br/>
                      <strong>Estrategia:</strong> Diversificar si hay alta concentración
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>
                Top 5 nacionalidades por cantidad de huéspedes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80 w-full" />
              ) : datosPastel.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <RechartsPieChart>
                    <Pie
                      data={datosPastel}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, porcentaje }) => `${name}: ${porcentaje.toFixed(1)}%`}
                      labelLine={false}
                    >
                      {datosPastel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES_PAISES[index % COLORES_PAISES.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-80">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-500 mb-2">Sin datos disponibles</p>
                    <p className="text-sm text-gray-400">
                      Ajuste los filtros para obtener datos del período seleccionado
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Top Ingresos por Nacionalidad */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Top Ingresos por Nacionalidad</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="font-semibold mb-1">¿Qué analizar?</p>
                    <p className="text-sm">
                      Top 5 nacionalidades ordenadas por ingresos generados (millones).
                      <br/><br/>
                      <strong>Barras altas:</strong> Mercados más valiosos económicamente
                      <br/>
                      <strong>Compara con cantidad:</strong> Identifica huéspedes premium
                      <br/><br/>
                      <strong>Acción:</strong> Enfocar marketing en mercados de alto valor
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>
                Top 5 nacionalidades por ingresos generados (millones)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80 w-full" />
              ) : datosBarras.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={datosBarras} margin={{ bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="nacionalidad" 
                      fontSize={11}
                      tick={{ fill: '#6b7280' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <RechartsTooltip content={<CustomBarTooltip />} />
                    <Bar 
                      dataKey="ingresos" 
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-80">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-500 mb-2">Sin datos disponibles</p>
                    <p className="text-sm text-gray-400">
                      Ajuste los filtros para obtener datos del período seleccionado
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Datos Detallados */}
        {!loading && data && data.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Datos Detallados por Nacionalidad</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="font-semibold mb-1">¿Cómo usar esta tabla?</p>
                    <p className="text-sm">
                      Datos completos para análisis detallado:
                      <br/><br/>
                      <strong>Cantidad:</strong> Número de huéspedes
                      <br/>
                      <strong>Porcentaje:</strong> Participación del total
                      <br/>
                      <strong>Ingresos:</strong> Valor económico generado
                      <br/>
                      <strong>Promedio:</strong> Ingreso por huésped de esa nacionalidad
                      <br/><br/>
                      <strong>Tip:</strong> Ordena por columnas para diferentes análisis
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>
                Información completa ordenada por cantidad de huéspedes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Nacionalidad</th>
                      <th className="text-right p-2 font-medium">Cantidad</th>
                      <th className="text-right p-2 font-medium">Porcentaje</th>
                      <th className="text-right p-2 font-medium">Ingresos</th>
                      <th className="text-right p-2 font-medium">Promedio/Huésped</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .sort((a, b) => b.cantidad - a.cantidad)
                      .map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">
                            {item.nacionalidad}
                          </td>
                          <td className="text-right p-2 font-mono">
                            {item.cantidad.toLocaleString()}
                          </td>
                          <td className="text-right p-2 font-mono">
                            {item.porcentaje.toFixed(1)}%
                          </td>
                          <td className="text-right p-2 font-mono">
                            ${item.ingresos.toLocaleString()}
                          </td>
                          <td className="text-right p-2 font-mono">
                            ${(item.ingresos / item.cantidad).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
} 