"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Search, 
  RefreshCw, 
  Filter,
} from "lucide-react"
import { getHuespedes, HuespedesResponse } from "@/lib/huespedes/huesped-service"
import { Huesped } from "@/Types/huesped"
import { TipoDoc } from "@/Types/enums/tiposDocumento"
import { HuespedesTable } from "@/components/huespedes/huespedes-table"
import { HuespedesExcelExport } from "@/components/huespedes/huespedes-excel-export"
import { Header } from "@/components/layout/header"
import { toast } from "sonner"
import { AdminOnly } from "@/components/auth/permission-guard"

export default function HuespedesPage() {
  const [huespedes, setHuespedes] = useState<Huesped[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Paginación del servidor (solo para la carga inicial)
  const limit = 50 // Cargar más huéspedes para que la tabla tenga más datos para paginar
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoDocFilter, setTipoDocFilter] = useState<string>("all")
  const [filteredHuespedes, setFilteredHuespedes] = useState<Huesped[]>([])

  // Función para cargar huéspedes
  const fetchHuespedes = async (showToast: boolean = false) => {
    try {
      setLoading(true)
      setError(null)

      const response: HuespedesResponse = await getHuespedes(1, limit)
      
      setHuespedes(response.data)
      
      if (showToast) {
        toast.success("Huéspedes actualizados", {
          description: `Se cargaron ${response.data.length} huéspedes correctamente`
        })
      }
      
    } catch (error) {
      console.error('Error al cargar huéspedes:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(`Error al cargar los huéspedes: ${errorMessage}`)
      toast.error("Error al cargar huéspedes", {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...huespedes]

    // Filtro por texto de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(huesped => {
        return (
          huesped.nombres.toLowerCase().includes(searchLower) ||
          huesped.primer_apellido.toLowerCase().includes(searchLower) ||
          huesped.segundo_apellido?.toLowerCase().includes(searchLower) ||
          huesped.numero_documento.includes(searchTerm) ||
          (huesped.correo && huesped.correo.toLowerCase().includes(searchLower)) ||
          (huesped.telefono && huesped.telefono.includes(searchTerm)) ||
          huesped.ciudad_residencia.toLowerCase().includes(searchLower) ||
          huesped.pais_residencia.toLowerCase().includes(searchLower)
        )
      })
    }

    // Filtro por tipo de documento
    if (tipoDocFilter !== "all") {
      filtered = filtered.filter(huesped => huesped.tipo_documento === tipoDocFilter)
    }

    setFilteredHuespedes(filtered)
  }, [huespedes, searchTerm, tipoDocFilter])

  // Cargar datos iniciales
  useEffect(() => {
    fetchHuespedes()
  }, [])

  // Función para refrescar datos
  const handleRefresh = () => {
    fetchHuespedes(true)
  }

  // Función para reiniciar filtros
  const handleClearFilters = () => {
    setSearchTerm("")
    setTipoDocFilter("all")
  }

  // Función para manejar eliminación de huésped
  const handleHuespedDeleted = () => {
    fetchHuespedes()
  }

  return (
    <div>
      <Header />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Header de contenido */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Gestión de Huéspedes
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra y consulta todos los huéspedes registrados en el hotel
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <AdminOnly>
            <HuespedesExcelExport
              huespedes={huespedes}
              filteredHuespedes={filteredHuespedes}
              searchTerm={searchTerm}
              tipoDocFilter={tipoDocFilter}
            />
            </AdminOnly>
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
                  placeholder="Buscar por nombre, documento, email, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Filtro por tipo de documento */}
              <Select value={tipoDocFilter} onValueChange={setTipoDocFilter}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Filtrar por tipo documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los documentos</SelectItem>
                  {Object.values(TipoDoc).map((tipoDoc) => (
                    <SelectItem key={tipoDoc} value={tipoDoc}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {tipoDoc}
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
            {(searchTerm || tipoDocFilter !== "all") && (
              <div className="flex items-center gap-2 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                <Badge variant="outline" className="bg-white">
                  {filteredHuespedes.length} de {huespedes.length} huéspedes
                </Badge>
                {searchTerm && (
                  <span className="text-blue-700">• Búsqueda: &ldquo;{searchTerm}&rdquo;</span>
                )}
                {tipoDocFilter !== "all" && (
                  <span className="text-blue-700">• Documento: {tipoDocFilter}</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabla de huéspedes */}
        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">Error al cargar huéspedes</h3>
                <p className="text-sm">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => fetchHuespedes()}
                  className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
                >
                  Intentar de nuevo
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <HuespedesTable
            huespedes={filteredHuespedes}
            title={`Huéspedes ${searchTerm || tipoDocFilter !== "all" ? "Filtrados" : ""}`}
            emptyMessage={
              searchTerm || tipoDocFilter !== "all"
                ? "No se encontraron huéspedes con los filtros aplicados"
                : "No hay huéspedes registrados en el sistema"
            }
            onHuespedDeleted={handleHuespedDeleted}
            className="min-h-[600px]"
            itemsPerPage={10}
            showSearch={false} // No mostrar búsqueda en la tabla ya que la tenemos arriba
          />
        )}
      </main>
    </div>
  )
} 