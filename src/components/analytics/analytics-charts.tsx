"use client"

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BarChart3, TrendingUp, PieChart } from "lucide-react"
import { FacturaCompleta, AnalisisPeriodo } from '@/Types/analytics-types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

interface AnalyticsChartsProps {
  facturas: FacturaCompleta[] | null
  analisisPeriodo: AnalisisPeriodo | null
  loading: boolean
}

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function AnalyticsCharts({ facturas, analisisPeriodo, loading }: AnalyticsChartsProps) {
  // Función para formatear moneda
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor)
  }

  // Datos para gráfico de ingresos por día
  const datosIngresosPorDia = useMemo(() => {
    if (!facturas || facturas.length === 0) return []

    const ingresosPorDia = facturas.reduce((acc, factura) => {
      const fecha = new Date(factura.fecha_factura).toLocaleDateString('es-ES')
      acc[fecha] = (acc[fecha] || 0) + factura.total
      return acc
    }, {} as Record<string, number>)

    return Object.entries(ingresosPorDia)
      .map(([fecha, total]) => ({
        fecha,
        ingresos: total,
        ingresosFormateados: formatearMoneda(total)
      }))
      .sort((a, b) => new Date(a.fecha.split('/').reverse().join('-')).getTime() - 
                     new Date(b.fecha.split('/').reverse().join('-')).getTime())
  }, [facturas])

  // Datos para gráfico de facturas por día
  const datosFacturasPorDia = useMemo(() => {
    if (!facturas || facturas.length === 0) return []

    const facturasPorDia = facturas.reduce((acc, factura) => {
      const fecha = new Date(factura.fecha_factura).toLocaleDateString('es-ES')
      acc[fecha] = (acc[fecha] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(facturasPorDia)
      .map(([fecha, cantidad]) => ({
        fecha,
        facturas: cantidad
      }))
      .sort((a, b) => new Date(a.fecha.split('/').reverse().join('-')).getTime() - 
                     new Date(b.fecha.split('/').reverse().join('-')).getTime())
  }, [facturas])

  // Datos para gráfico de distribución por huéspedes (top 10)
  const datosDistribucionHuespedes = useMemo(() => {
    if (!facturas || facturas.length === 0) return []

    const ingresosPorHuesped = facturas.reduce((acc, factura) => {
      const nombreHuesped = `${factura.huesped.nombres} ${factura.huesped.primer_apellido}`
      acc[nombreHuesped] = (acc[nombreHuesped] || 0) + factura.total
      return acc
    }, {} as Record<string, number>)

    return Object.entries(ingresosPorHuesped)
      .map(([nombre, total]) => ({
        nombre: nombre.length > 15 ? nombre.substring(0, 15) + '...' : nombre,
        valor: total,
        valorFormateado: formatearMoneda(total)
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10) // Top 10
  }, [facturas])

  // Datos combinados para gráfico de línea
  const datosCombinados = useMemo(() => {
    if (!datosIngresosPorDia.length || !datosFacturasPorDia.length) return []

    return datosIngresosPorDia.map((ingresoData) => {
      const facturaData = datosFacturasPorDia.find(f => f.fecha === ingresoData.fecha)
      return {
        fecha: ingresoData.fecha,
        ingresos: ingresoData.ingresos,
        facturas: facturaData?.facturas || 0
      }
    })
  }, [datosIngresosPorDia, datosFacturasPorDia])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando gráfico...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!facturas || facturas.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No hay datos para mostrar gráficos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Primera fila: Gráficos de barras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ingresos por Día */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ingresos por Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosIngresosPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatearMoneda(value), 'Ingresos']}
                />
                <Bar dataKey="ingresos" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Facturas por Día */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Facturas por Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosFacturasPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="facturas" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segunda fila: Gráfico de línea y pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Tendencia Combinada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendencia de Ingresos y Facturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosCombinados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis yAxisId="ingresos" orientation="left" fontSize={12} />
                <YAxis yAxisId="facturas" orientation="right" fontSize={12} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'ingresos' ? formatearMoneda(value) : value,
                    name === 'ingresos' ? 'Ingresos' : 'Facturas'
                  ]}
                />
                <Line 
                  yAxisId="ingresos"
                  type="monotone" 
                  dataKey="ingresos" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="facturas"
                  type="monotone" 
                  dataKey="facturas" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico Circular: Top 10 Huéspedes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top 10 Huéspedes por Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={datosDistribucionHuespedes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                  nameKey="nombre"
                  label={(entry) => `${entry.nombre}: ${((entry.valor / datosDistribucionHuespedes.reduce((sum, item) => sum + item.valor, 0)) * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {datosDistribucionHuespedes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatearMoneda(value), 'Ingresos']}
                  labelFormatter={(label) => `Huésped: ${label}`}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={60}
                  fontSize={11}
                  wrapperStyle={{
                    paddingTop: '10px'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumen estadístico */}
      {analisisPeriodo && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Días</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.ceil((new Date(analisisPeriodo.periodo.fechaFin).getTime() - 
                             new Date(analisisPeriodo.periodo.fechaInicio).getTime()) / 
                             (1000 * 60 * 60 * 24)) + 1}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Promedio Diario</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatearMoneda(analisisPeriodo.totalIngresos / 
                    Math.max(1, Math.ceil((new Date(analisisPeriodo.periodo.fechaFin).getTime() - 
                                          new Date(analisisPeriodo.periodo.fechaInicio).getTime()) / 
                                          (1000 * 60 * 60 * 24)) + 1))}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Facturas/Día</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(analisisPeriodo.totalFacturas / 
                    Math.max(1, Math.ceil((new Date(analisisPeriodo.periodo.fechaFin).getTime() - 
                                          new Date(analisisPeriodo.periodo.fechaInicio).getTime()) / 
                                          (1000 * 60 * 60 * 24)) + 1)).toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Huéspedes Únicos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(facturas?.map(f => f.huesped.id) || []).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 