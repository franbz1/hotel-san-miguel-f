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
import { useAnalyticsOcupacion } from "@/hooks/useAnalytics"
import { FiltrosOcupacionDto } from "@/Types/analytics"
import { TipoHabitacion } from "@/Types/enums/tiposHabitacion"
import { Home, Filter, BarChart3, TrendingUp, DollarSign, Users, Info, Trash } from "lucide-react"
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts'

export function OcupacionAnalytics() {
  const [filtros, setFiltros] = useState<FiltrosOcupacionDto>({
    agruparPor: 'mes'
  })
  
  const { data, loading, error } = useAnalyticsOcupacion(filtros)

  const handleFiltroChange = (campo: keyof FiltrosOcupacionDto, valor: string | TipoHabitacion | undefined) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor === 'TODOS' ? undefined : valor
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      agruparPor: 'mes'
    })
  }

  // Formatear datos para los gráficos
  const formatearDatosGrafico = () => {
    if (!data?.ocupacionPorPeriodo) return []
    
    // Ordenar los datos cronológicamente (ascendente) antes de formatear
    const datosOrdenados = [...data.ocupacionPorPeriodo].sort((a, b) => 
      new Date(a.periodo).getTime() - new Date(b.periodo).getTime()
    )
    
    return datosOrdenados.map(item => ({
      periodo: new Date(item.periodo).toLocaleDateString('es-ES', {
        month: 'short',
        year: '2-digit',
        ...(filtros.agruparPor === 'día' && { day: 'numeric' })
      }),
      tasaOcupacion: Number(item.tasaOcupacion.toFixed(1)),
      revpar: Number((item.revpar / 1000).toFixed(1)), // En miles para mejor visualización
      adr: Number((item.adr / 1000).toFixed(1)), // En miles para mejor visualización
      totalReservas: item.totalReservas,
      ingresosTotales: Number((item.ingresosTotales / 1000000).toFixed(2)) // En millones
    }))
  }

  const datosGrafico = formatearDatosGrafico()

  // Tooltip personalizado para los gráficos
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      value: number;
      dataKey: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`Período: ${label}`}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.dataKey === 'tasaOcupacion' && '%'}
              {(entry.dataKey === 'revpar' || entry.dataKey === 'adr') && 'K'}
              {entry.dataKey === 'ingresosTotales' && 'M'}
            </p>
          ))}
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
              Filtros de Ocupación
            </CardTitle>
            <CardDescription>
              Configure los parámetros para analizar la ocupación hotelera
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

              {/* Agrupar Por */}
              <div className="space-y-2">
                <Label>Agrupar Por</Label>
                <Select
                  value={filtros.agruparPor}
                  onValueChange={(value) => handleFiltroChange('agruparPor', value as 'día' | 'semana' | 'mes' | 'año')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="día">Día</SelectItem>
                    <SelectItem value="semana">Semana</SelectItem>
                    <SelectItem value="mes">Mes</SelectItem>
                    <SelectItem value="año">Año</SelectItem>
                  </SelectContent>
                </Select>
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
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Error al cargar datos:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Métricas Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">Ocupación Promedio</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">¿Qué es la Ocupación?</p>
                    <p className="text-sm">
                      Porcentaje de habitaciones ocupadas vs. habitaciones disponibles. 
                      <br/>
                      <strong>Ideal:</strong> 70-85% para máxima rentabilidad.
                      <br/>
                      <strong>Bajo (&lt;60%):</strong> Revisar estrategias de marketing.
                      <br/>
                      <strong>Alto (&gt;90%):</strong> Considerar aumentar tarifas.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    {data?.ocupacionPromedio?.toFixed(1) || 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {datosGrafico.length} períodos analizados
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">RevPAR Promedio</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">¿Qué es RevPAR?</p>
                    <p className="text-sm">
                      <strong>Revenue Per Available Room</strong> - Ingresos por habitación disponible.
                      <br/>
                      <strong>Cálculo:</strong> (Ingresos totales ÷ Total habitaciones)
                      <br/>
                      <strong>Interpretación:</strong> Mide la eficiencia en generar ingresos. Más alto = mejor performance del hotel.
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
                    ${data?.revparPromedio?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ingresos por habitación disponible
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">ADR Promedio</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">¿Qué es ADR?</p>
                    <p className="text-sm">
                      <strong>Average Daily Rate</strong> - Tarifa promedio diaria.
                      <br/>
                      <strong>Cálculo:</strong> (Ingresos ÷ Habitaciones vendidas)
                      <br/>
                      <strong>Interpretación:</strong> Precio promedio por noche. Comparar con competencia para optimizar precios.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    ${data?.adrPromedio?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tarifa promedio diaria
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico Principal - Evolución Temporal */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Evolución de Ocupación y Tarifas</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="font-semibold mb-1">¿Cómo interpretar esta gráfica?</p>
                  <p className="text-sm">
                    <strong>Área azul:</strong> % de ocupación (eje izquierdo, 0-100%)
                    <br/>
                    <strong>Línea verde:</strong> RevPAR en miles (eje derecho)
                    <br/>
                    <strong>Línea amarilla:</strong> ADR en miles (eje derecho)
                    <br/><br/>
                    <strong>Analiza:</strong> Correlación entre ocupación y tarifas. 
                    Si ocupación sube pero RevPAR no, considera ajustar precios.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardDescription>
              Análisis temporal de ocupación, RevPAR y ADR por {filtros.agruparPor}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : datosGrafico.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={datosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="periodo" 
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                    domain={[0, 100]}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {/* Área de ocupación */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="tasaOcupacion"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    name="Ocupación (%)"
                  />
                  
                  {/* Líneas de RevPAR y ADR */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revpar"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="RevPAR (K)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="adr"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    name="ADR (K)"
                  />
                </ComposedChart>
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

        {/* Gráfico de Reservas e Ingresos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Total de Reservas por Período</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">¿Qué mide esta gráfica?</p>
                    <p className="text-sm">
                      Número total de reservas por período.
                      <br/><br/>
                      <strong>Útil para:</strong> Identificar temporadas altas/bajas, 
                      planificar personal y evaluar efectividad de campañas de marketing.
                      <br/><br/>
                      <strong>Tendencia alta:</strong> Buena demanda
                      <br/>
                      <strong>Tendencia baja:</strong> Revisar estrategias
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>
                Número de reservas por {filtros.agruparPor}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : datosGrafico.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="periodo" 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <RechartsTooltip 
                      formatter={(value: number) => [value, 'Reservas']}
                      labelStyle={{ color: '#1f2937' }}
                    />
                    <Bar 
                      dataKey="totalReservas" 
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Sin datos de reservas</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Ingresos Totales por Período</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">¿Qué mide esta gráfica?</p>
                    <p className="text-sm">
                      Ingresos totales generados por período (en millones).
                      <br/><br/>
                      <strong>Interpretación:</strong> 
                      <br/>• Picos = temporadas altas exitosas
                      <br/>• Valles = oportunidades de mejora
                      <br/>• Tendencia = crecimiento del negocio
                      <br/><br/>
                      <strong>Compara con:</strong> Ocupación para evaliar eficiencia de precios.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>
                Ingresos en millones por {filtros.agruparPor}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : datosGrafico.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="periodo" 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <RechartsTooltip 
                      formatter={(value: number) => [`$${value}M`, 'Ingresos']}
                      labelStyle={{ color: '#1f2937' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ingresosTotales"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Sin datos de ingresos</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Datos Detallados */}
        {!loading && datosGrafico.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Datos Detallados</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="font-semibold mb-1">¿Cómo usar esta tabla?</p>
                    <p className="text-sm">
                      Datos precisos para análisis detallado:
                      <br/><br/>
                      <strong>Ocupación:</strong> % de habitaciones ocupadas
                      <br/>
                      <strong>RevPAR:</strong> Ingresos por habitación disponible
                      <br/>
                      <strong>ADR:</strong> Precio promedio por noche
                      <br/>
                      <strong>Reservas:</strong> Cantidad de reservas
                      <br/>
                      <strong>Ingresos:</strong> Total generado
                      <br/><br/>
                      <strong>Tip:</strong> Exporta estos datos para análisis externos.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>
                Información completa por período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Período</th>
                      <th className="text-right p-2 font-medium">Ocupación (%)</th>
                      <th className="text-right p-2 font-medium">RevPAR</th>
                      <th className="text-right p-2 font-medium">ADR</th>
                      <th className="text-right p-2 font-medium">Reservas</th>
                      <th className="text-right p-2 font-medium">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                      {data?.ocupacionPorPeriodo?.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          {new Date(item.periodo).toLocaleDateString('es-ES')}
                        </td>
                        <td className="text-right p-2 font-mono">
                          {item.tasaOcupacion.toFixed(1)}%
                        </td>
                        <td className="text-right p-2 font-mono">
                          ${item.revpar.toLocaleString()}
                        </td>
                        <td className="text-right p-2 font-mono">
                          ${item.adr.toLocaleString()}
                        </td>
                        <td className="text-right p-2 font-mono">
                          {item.totalReservas}
                        </td>
                        <td className="text-right p-2 font-mono">
                          ${item.ingresosTotales.toLocaleString()}
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