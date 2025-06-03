"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CalendarDays, 
  Search, 
  RefreshCw, 
  Filter,
  ChevronLeft, 
  ChevronRight
} from "lucide-react"
import { getReservas, ReservasResponse } from "@/lib/bookings/reservas-service"
import { Reserva } from "@/Types/Reserva"
import { EstadosReserva } from "@/Types/enums/estadosReserva"
import { ReservasList } from "@/components/reservas/reservas-list"
import { Header } from "@/components/layout/header"
import { toast } from "sonner"

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalReservas, setTotalReservas] = useState(0)
  const limit = 12
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("all")
  const [filteredReservas, setFilteredReservas] = useState<Reserva[]>([])

  // Función para cargar reservas
  const fetchReservas = async (page: number = 1, showToast: boolean = false) => {
    try {
      setLoading(true)
      setError(null)

      const response: ReservasResponse = await getReservas(page, limit)
      
      setReservas(response.data)
      setCurrentPage(page)
      setTotalReservas(response.meta.totalReservas)
      setTotalPages(response.meta.lastPage)
      
      if (showToast) {
        toast.success("Reservas actualizadas", {
          description: `Se cargaron ${response.data.length} reservas correctamente`
        })
      }
      
    } catch (error) {
      console.error('Error al cargar reservas:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(`Error al cargar las reservas: ${errorMessage}`)
      toast.error("Error al cargar reservas", {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...reservas]

    // Filtro por texto de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(reserva => {
        const huesped = reserva.huesped
        if (!huesped) return false
        
        return (
          huesped.nombres.toLowerCase().includes(searchLower) ||
          huesped.primer_apellido.toLowerCase().includes(searchLower) ||
          huesped.segundo_apellido?.toLowerCase().includes(searchLower) ||
          huesped.numero_documento.includes(searchTerm) ||
          reserva.pais_procedencia.toLowerCase().includes(searchLower) ||
          reserva.ciudad_procedencia.toLowerCase().includes(searchLower)
        )
      })
    }

    // Filtro por estado
    if (estadoFilter !== "all") {
      filtered = filtered.filter(reserva => reserva.estado === estadoFilter)
    }

    setFilteredReservas(filtered)
  }, [reservas, searchTerm, estadoFilter])

  // Cargar datos iniciales
  useEffect(() => {
    fetchReservas(1)
  }, [])

  // Navegación de páginas
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchReservas(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchReservas(currentPage + 1)
    }
  }

  // Función para refrescar datos
  const handleRefresh = () => {
    fetchReservas(currentPage, true)
  }

  // Función para reiniciar filtros
  const handleClearFilters = () => {
    setSearchTerm("")
    setEstadoFilter("all")
  }

  // Función para manejar eliminación de reserva
  const handleReservaDeleted = () => {
    fetchReservas(currentPage)
  }

  // Función para obtener color del badge de estado
  const getEstadoBadgeVariant = (estado: EstadosReserva) => {
    switch (estado) {
      case EstadosReserva.PENDIENTE:
        return "secondary"
      case EstadosReserva.RESERVADO:
        return "default"
      case EstadosReserva.FINALIZADO:
        return "outline"
      case EstadosReserva.CANCELADO:
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Calcular métricas avanzadas
  const getAnalytics = () => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    // Reservas de este mes
    const reservasEsteMes = reservas.filter(reserva => {
      const fechaCreacion = new Date(reserva.createdAt)
      return fechaCreacion >= startOfMonth && fechaCreacion <= endOfMonth
    })
    
    // Ingresos totales
    const ingresosTotales = reservas.reduce((total, reserva) => {
      if (reserva.estado !== EstadosReserva.CANCELADO) {
        return total + (reserva.costo || 0)
      }
      return total
    }, 0)
    
    // Ingresos de este mes
    const ingresosEsteMes = reservasEsteMes.reduce((total, reserva) => {
      if (reserva.estado !== EstadosReserva.CANCELADO) {
        return total + (reserva.costo || 0)
      }
      return total
    }, 0)
    
    // Duración promedio de estadía
    const duracionTotal = reservas.filter(r => r.estado !== EstadosReserva.CANCELADO).reduce((total, reserva) => {
      const inicio = new Date(reserva.fecha_inicio)
      const fin = new Date(reserva.fecha_fin)
      const duracion = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
      return total + duracion
    }, 0)
    
    const reservasValidas = reservas.filter(r => r.estado !== EstadosReserva.CANCELADO).length
    const duracionPromedio = reservasValidas > 0 ? Math.round(duracionTotal / reservasValidas) : 0
    
    // Huéspedes totales (incluyendo acompañantes)
    const huespedesTotal = reservas.filter(r => r.estado !== EstadosReserva.CANCELADO).reduce((total, reserva) => {
      return total + 1 + (reserva.numero_acompaniantes || 0)
    }, 0)
    
    // Países más frecuentes
    const paisesFrecuentes = reservas.reduce((acc, reserva) => {
      const pais = reserva.pais_procedencia
      acc[pais] = (acc[pais] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const paisMasFrecuente = Object.entries(paisesFrecuentes)
      .sort(([,a], [,b]) => b - a)[0]
    
    // Tasa de ocupación (simulada - asumiendo 20 habitaciones)
    const habitacionesDisponibles = 20
    const reservasActivas = reservas.filter(r => 
      r.estado === EstadosReserva.RESERVADO || r.estado === EstadosReserva.FINALIZADO
    ).length
    const tasaOcupacion = Math.round((reservasActivas / habitacionesDisponibles) * 100)
    
    // Porcentajes por estado
    const totalReservasValidas = reservas.length
    const porcentajes = Object.values(EstadosReserva).reduce((acc, estado) => {
      const count = reservas.filter(r => r.estado === estado).length
      acc[estado] = totalReservasValidas > 0 ? Math.round((count / totalReservasValidas) * 100) : 0
      return acc
    }, {} as Record<EstadosReserva, number>)

    return {
      reservasEsteMes: reservasEsteMes.length,
      ingresosTotales,
      ingresosEsteMes,
      duracionPromedio,
      huespedesTotal,
      paisMasFrecuente,
      tasaOcupacion,
      porcentajes
    }
  }

  const analytics = getAnalytics()

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Header de contenido */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <CalendarDays className="h-8 w-8 text-blue-600" />
              Gestión de Reservas
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra y consulta todas las reservas del hotel
            </p>
          </div>
          
          <div className="flex items-center gap-2">
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

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Reservas totales */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reservas</p>
                  <p className="text-2xl font-bold">{totalReservas}</p>
                  <p className="text-xs text-green-600 mt-1">
                    +{analytics.reservasEsteMes} este mes
                  </p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Ingresos totales */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                  <p className="text-2xl font-bold">{formatCurrency(analytics.ingresosTotales)}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {formatCurrency(analytics.ingresosEsteMes)} este mes
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">$</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ocupación */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasa de Ocupación</p>
                  <p className="text-2xl font-bold">{analytics.tasaOcupacion}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.huespedesTotal} huéspedes totales
                  </p>
                </div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  analytics.tasaOcupacion > 80 ? 'bg-red-100' : 
                  analytics.tasaOcupacion > 60 ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <span className={`font-bold text-sm ${
                    analytics.tasaOcupacion > 80 ? 'text-red-600' : 
                    analytics.tasaOcupacion > 60 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {analytics.tasaOcupacion}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadía promedio */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estadía Promedio</p>
                  <p className="text-2xl font-bold">{analytics.duracionPromedio}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.duracionPromedio === 1 ? 'día' : 'días'} por reserva
                  </p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">📅</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análisis por estados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  Análisis por Estados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.values(EstadosReserva).map((estado) => {
                  const count = reservas.filter(r => r.estado === estado).length
                  const porcentaje = analytics.porcentajes[estado]
                  
                  return (
                    <div key={estado} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={getEstadoBadgeVariant(estado)} className="text-xs">
                          {estado.toLowerCase()}
                        </Badge>
                        <span className="text-sm font-medium">{porcentaje}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{count}</span>
                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              estado === EstadosReserva.PENDIENTE ? 'bg-yellow-500' :
                              estado === EstadosReserva.RESERVADO ? 'bg-blue-500' :
                              estado === EstadosReserva.FINALIZADO ? 'bg-green-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* País más frecuente */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">País más frecuente</p>
                  <p className="text-xl font-bold">
                    {analytics.paisMasFrecuente ? analytics.paisMasFrecuente[0] : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.paisMasFrecuente ? analytics.paisMasFrecuente[1] : 0} reservas
                  </p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">🌍</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen del mes */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resumen del Mes</p>
                  <p className="text-xl font-bold">{analytics.reservasEsteMes} reservas</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(analytics.ingresosEsteMes)} generados
                  </p>
                </div>
                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por huésped, documento, ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por estado */}
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.values(EstadosReserva).map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado.charAt(0) + estado.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Botón limpiar filtros */}
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Limpiar Filtros
              </Button>
            </div>

            {/* Contador de resultados filtrados */}
            {(searchTerm || estadoFilter !== "all") && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">
                  {filteredReservas.length} de {reservas.length} reservas
                </Badge>
                {searchTerm && (
                  <span>• Búsqueda: &ldquo;{searchTerm}&rdquo;</span>
                )}
                {estadoFilter !== "all" && (
                  <span>• Estado: {estadoFilter}</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de reservas */}
        {error ? (
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">Error al cargar reservas</h3>
                <p className="text-sm">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => fetchReservas(currentPage)}
                  className="mt-4"
                >
                  Intentar de nuevo
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ReservasList
            reservas={filteredReservas}
            title={`Reservas ${searchTerm || estadoFilter !== "all" ? "Filtradas" : ""}`}
            emptyMessage={
              searchTerm || estadoFilter !== "all"
                ? "No se encontraron reservas con los filtros aplicados"
                : "No hay reservas registradas en el sistema"
            }
            onReservaDeleted={handleReservaDeleted}
            className="min-h-[600px]"
          />
        )}

        {/* Paginación */}
        {!searchTerm && estadoFilter === "all" && totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Página <span className="font-medium">{currentPage}</span> de{" "}
                  <span className="font-medium">{totalPages}</span> • {" "}
                  <span className="font-medium">{totalReservas}</span> reservas totales
                </p>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || loading}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                      if (pageNum > totalPages) return null
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => fetchReservas(pageNum)}
                          disabled={loading}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || loading}
                    className="flex items-center gap-1"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
} 