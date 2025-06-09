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
  Users,
  Clock,
  TrendingUp
} from "lucide-react"
import { getReservas, ReservasResponse } from "@/lib/bookings/reservas-service"
import { Reserva } from "@/Types/Reserva"
import { EstadosReserva } from "@/Types/enums/estadosReserva"
import { ReservasTable } from "@/components/reservas/reservas-table"
import { Header } from "@/components/layout/header"
import { toast } from "sonner"

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Paginación del servidor (solo para la carga inicial)
  const [totalReservas, setTotalReservas] = useState(0)
  const limit = 50 // Cargar más reservas para que la tabla tenga más datos para paginar
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("all")
  const [filteredReservas, setFilteredReservas] = useState<Reserva[]>([])

  // Función para cargar reservas
  const fetchReservas = async (showToast: boolean = false) => {
    try {
      setLoading(true)
      setError(null)

      const response: ReservasResponse = await getReservas(1, limit)
      
      setReservas(response.data)
      setTotalReservas(response.meta.totalReservas)
      
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
    fetchReservas()
  }, [])



  // Función para refrescar datos
  const handleRefresh = () => {
    fetchReservas(true)
  }

  // Función para reiniciar filtros
  const handleClearFilters = () => {
    setSearchTerm("")
    setEstadoFilter("all")
  }

  // Función para manejar eliminación de reserva
  const handleReservaDeleted = () => {
    fetchReservas()
  }

  // Cálculos básicos para indicadores
  const reservasActivas = reservas.filter(r => r.estado === EstadosReserva.RESERVADO).length
  const reservasPendientes = reservas.filter(r => r.estado === EstadosReserva.PENDIENTE).length
  const reservasFinalizadas = reservas.filter(r => r.estado === EstadosReserva.FINALIZADO).length

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

  return (
    <div className="min-h-screen bg-gray-50">
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
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 hover:bg-blue-50 border-blue-200"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Indicadores básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total de reservas */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total de Reservas</p>
                  <p className="text-3xl font-bold text-blue-900">{totalReservas}</p>
                  <p className="text-xs text-blue-600 mt-1">En el sistema</p>
                </div>
                <CalendarDays className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Reservas activas */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Reservas Activas</p>
                  <p className="text-3xl font-bold text-green-900">{reservasActivas}</p>
                  <p className="text-xs text-green-600 mt-1">Confirmadas</p>
                </div>
                <Users className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Reservas pendientes */}
          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-900">{reservasPendientes}</p>
                  <p className="text-xs text-yellow-600 mt-1">Por confirmar</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          {/* Reservas finalizadas */}
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Finalizadas</p>
                  <p className="text-3xl font-bold text-purple-900">{reservasFinalizadas}</p>
                  <p className="text-xs text-purple-600 mt-1">Completadas</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda mejorados */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-blue-600" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda mejorada */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por huésped, documento, ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Filtro por estado mejorado */}
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.values(EstadosReserva).map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      <div className="flex items-center gap-2">
                        <Badge variant={getEstadoBadgeVariant(estado)} className="text-xs">
                          {estado.charAt(0) + estado.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Botón limpiar filtros mejorado */}
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex items-center gap-2 hover:bg-gray-50 border-gray-300"
              >
                <RefreshCw className="h-4 w-4" />
                Limpiar Filtros
              </Button>
            </div>

            {/* Contador de resultados filtrados mejorado */}
            {(searchTerm || estadoFilter !== "all") && (
              <div className="flex items-center gap-2 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                <Badge variant="outline" className="bg-white">
                  {filteredReservas.length} de {reservas.length} reservas
                </Badge>
                {searchTerm && (
                  <span className="text-blue-700">• Búsqueda: &ldquo;{searchTerm}&rdquo;</span>
                )}
                {estadoFilter !== "all" && (
                  <span className="text-blue-700">• Estado: {estadoFilter}</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabla de reservas */}
        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">Error al cargar reservas</h3>
                <p className="text-sm">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => fetchReservas()}
                  className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
                >
                  Intentar de nuevo
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ReservasTable
            reservas={filteredReservas}
            title={`Reservas ${searchTerm || estadoFilter !== "all" ? "Filtradas" : ""}`}
            emptyMessage={
              searchTerm || estadoFilter !== "all"
                ? "No se encontraron reservas con los filtros aplicados"
                : "No hay reservas registradas en el sistema"
            }
            onReservaDeleted={handleReservaDeleted}
            className="min-h-[600px]"
            itemsPerPage={10}
          />
        )}


      </main>
    </div>
  )
} 