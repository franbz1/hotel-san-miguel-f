"use client"

import { useState, useEffect, useCallback } from 'react'
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAnalytics } from '@/hooks/useAnalytics'
import { FacturaCompleta, AnalisisPeriodo } from '@/Types/analytics-types'
import { CalendarIcon, BarChart3, Table, RefreshCw, Loader2, DollarSign, Receipt, TrendingUp, FilterX } from "lucide-react"
import { AnalyticsCharts } from '@/components/analytics/analytics-charts'
import { ExcelExport } from '@/components/analytics/excel-export'

export default function AnalyticsPage() {
  // Estados para fechas en formato string (zona horaria local para la UI)
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const hoy = new Date()
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    // Mostrar en zona horaria local
    return primerDia.toLocaleDateString('en-CA') // formato YYYY-MM-DD
  })
  
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const hoy = new Date()
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
    // Mostrar en zona horaria local
    return ultimoDia.toLocaleDateString('en-CA') // formato YYYY-MM-DD
  })

  // Hook de analytics
  const { 
    obtenerFacturasPorRango,
    analizarPeriodo,
    loading,
    error,
    limpiarError
  } = useAnalytics()

  // Estados locales para los datos
  const [facturas, setFacturas] = useState<FacturaCompleta[] | null>(null)
  const [analisisPeriodo, setAnalisisPeriodo] = useState<AnalisisPeriodo | null>(null)

  // Función para convertir fecha local a UTC para el backend
  const convertirFechaLocalAUTC = (fechaLocal: string): string => {
    const fecha = new Date(fechaLocal + 'T00:00:00') // Asegurar que sea medianoche local
    return fecha.toISOString().split('T')[0] // Retornar solo la fecha en UTC
  }

  // Función para cargar datos del período seleccionado
  const cargarDatosPeriodo = useCallback(async () => {
    try {
      // Convertir fechas locales a UTC para enviar al backend
      const fechaInicioUTC = convertirFechaLocalAUTC(fechaInicio)
      const fechaFinUTC = convertirFechaLocalAUTC(fechaFin)

      const [facturasPeriodo, analisisDatos] = await Promise.all([
        obtenerFacturasPorRango(fechaInicioUTC, fechaFinUTC),
        analizarPeriodo(fechaInicioUTC, fechaFinUTC)
      ])

      setFacturas(facturasPeriodo)
      setAnalisisPeriodo(analisisDatos)
    } catch (err) {
      console.error('Error al cargar datos del período:', err)
    }
  }, [fechaInicio, fechaFin, obtenerFacturasPorRango, analizarPeriodo])

  // Cargar datos cuando cambie el período
  useEffect(() => {
    cargarDatosPeriodo()
  }, [cargarDatosPeriodo])

  // Función para establecer período del mes actual
  const establecerMesActual = () => {
    const hoy = new Date()
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
    
    // Mostrar en zona horaria local
    setFechaInicio(primerDia.toLocaleDateString('en-CA'))
    setFechaFin(ultimoDia.toLocaleDateString('en-CA'))
  }

  // Función para establecer período de los últimos 30 días
  const establecerUltimos30Dias = () => {
    const hoy = new Date()
    const hace30Dias = new Date()
    hace30Dias.setDate(hoy.getDate() - 30)
    
    // Mostrar en zona horaria local
    setFechaInicio(hace30Dias.toLocaleDateString('en-CA'))
    setFechaFin(hoy.toLocaleDateString('en-CA'))
  }

  // Función para limpiar filtros y establecer período por defecto
  const limpiarFiltros = () => {
    const hoy = new Date()
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
    
    setFechaInicio(primerDia.toLocaleDateString('en-CA'))
    setFechaFin(ultimoDia.toLocaleDateString('en-CA'))
    setFacturas(null)
    setAnalisisPeriodo(null)
  }

  // Función para formatear moneda
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor)
  }

  // Función para formatear fecha en zona horaria local para mostrar
  const formatearFechaLocal = (fechaString: string): string => {
    const fecha = new Date(fechaString + 'T00:00:00')
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  }

  return (
    <div>
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header de la página con controles de período */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analíticas del Hotel</h1>
              <p className="text-gray-600 mt-1">
                Análisis detallado de ingresos y operaciones
              </p>
            </div>
          </div>

          {/* Controles de período */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div>
                    <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                    <Input
                      id="fechaInicio"
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fechaFin">Fecha de Fin</Label>
                    <Input
                      id="fechaFin"
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={establecerMesActual}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Mes Actual
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={establecerUltimos30Dias}
                  >
                    Últimos 30 días
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={limpiarFiltros}
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Limpiar
                  </Button>
                  <Button
                    onClick={cargarDatosPeriodo}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Actualizar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manejo de errores */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-red-700 text-sm">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={limpiarError}
                  >
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contenido principal con tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Resumen</span>
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Gráficos</span>
              </TabsTrigger>
              <TabsTrigger value="facturas" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                <span className="hidden sm:inline">Facturas</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Botón de exportación */}
            <ExcelExport 
              facturas={facturas}
              analisisPeriodo={analisisPeriodo}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
            />
          </div>

          {/* Tab de Resumen */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Ingresos</p>
                        <p className="text-2xl font-bold">
                          {analisisPeriodo ? formatearMoneda(analisisPeriodo.totalIngresos) : "$0"}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Facturas</p>
                        <p className="text-2xl font-bold">
                          {analisisPeriodo ? analisisPeriodo.totalFacturas : 0}
                        </p>
                      </div>
                      <Receipt className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Promedio/Factura</p>
                        <p className="text-2xl font-bold">
                          {analisisPeriodo ? formatearMoneda(analisisPeriodo.promedioPorFactura) : "$0"}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                                 <Card>
                   <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm font-medium text-muted-foreground">Período</p>
                         <p className="text-lg font-bold">
                           {formatearFechaLocal(fechaInicio)} - {formatearFechaLocal(fechaFin)}
                         </p>
                       </div>
                       <CalendarIcon className="h-8 w-8 text-gray-600" />
                     </div>
                   </CardContent>
                 </Card>
              </div>

              {loading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando datos...</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab de Gráficos */}
          <TabsContent value="charts">
            <AnalyticsCharts 
              facturas={facturas}
              analisisPeriodo={analisisPeriodo}
              loading={loading}
            />
          </TabsContent>

          {/* Tab de Facturas */}
          <TabsContent value="facturas">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Facturas del Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando facturas...</p>
                  </div>
                ) : !facturas || facturas.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No hay facturas en el período seleccionado</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Fecha</th>
                          <th className="text-left p-2">Huésped</th>
                          <th className="text-left p-2">Documento</th>
                          <th className="text-left p-2">Estado</th>
                          <th className="text-right p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                                                 {facturas.map((factura) => (
                           <tr key={factura.id} className="border-b hover:bg-gray-50">
                             <td className="p-2">
                               {new Date(factura.fecha_factura).toLocaleDateString('es-ES', {
                                 day: '2-digit',
                                 month: '2-digit',
                                 year: 'numeric',
                                 hour: '2-digit',
                                 minute: '2-digit'
                               })}
                             </td>
                            <td className="p-2">
                              <a 
                                href={`/dashboard/huesped/${factura.huesped.id}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {factura.huesped.nombres} {factura.huesped.primer_apellido}
                              </a>
                            </td>
                            <td className="p-2 text-sm text-gray-600">
                              {factura.huesped.numero_documento}
                            </td>
                            <td className="p-2">
                              {factura.reserva.estado}
                            </td>
                            <td className="p-2 text-right font-medium">
                              {formatearMoneda(factura.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 