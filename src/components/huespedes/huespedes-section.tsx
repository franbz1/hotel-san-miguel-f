"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Search, Users, Eye, Calendar, Crown, UserCheck, Filter } from "lucide-react"
import { getHuespedes, getHuespedesSecundarios } from "@/lib/huespedes/huesped-service"
import { Huesped } from "@/Types/huesped"
import { HuespedSecundario } from "@/Types/huespedSecundario"
import { Reserva } from "@/Types/Reserva"

// Tipo unificado para mostrar ambos tipos de huéspedes
type HuespedUnificado = {
  id: number
  tipo: 'principal' | 'secundario'
  tipo_documento: string
  numero_documento: string
  primer_apellido: string
  segundo_apellido?: string
  nombres: string
  pais_residencia: string
  ciudad_residencia: string
  nacionalidad: string
  genero: string
  telefono?: string | null
  correo?: string | null
  createdAt: Date
  // Campos específicos de principales
  reservas?: Reserva[]
  huespedesSecundarios?: HuespedSecundario[]
  // Campos específicos de secundarios
  huesped_id?: number
}

type TipoFiltro = 'todos' | 'principales' | 'secundarios'

export function HuespedesSection() {
  const [huespedesUnificados, setHuespedesUnificados] = useState<HuespedUnificado[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalHuespedes, setTotalHuespedes] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('todos')
  const [error, setError] = useState<string | null>(null)

  const limit = 6

  const fetchAllHuespedes = async (page: number) => {
    try {
      setLoading(true)
      setError(null)

      // Obtener huéspedes principales y secundarios en paralelo
      const [principalesResponse, secundariosResponse] = await Promise.all([
        getHuespedes(page, Math.ceil(limit / 2)),
        getHuespedesSecundarios(page, Math.ceil(limit / 2))
      ])

      // Convertir huéspedes principales al formato unificado
      const principales: HuespedUnificado[] = principalesResponse.data.map((huesped: Huesped) => ({
        id: huesped.id,
        tipo: 'principal' as const,
        tipo_documento: huesped.tipo_documento,
        numero_documento: huesped.numero_documento,
        primer_apellido: huesped.primer_apellido,
        segundo_apellido: huesped.segundo_apellido,
        nombres: huesped.nombres,
        pais_residencia: huesped.pais_residencia,
        ciudad_residencia: huesped.ciudad_residencia,
        nacionalidad: huesped.nacionalidad,
        genero: huesped.genero,
        telefono: huesped.telefono,
        correo: huesped.correo,
        createdAt: huesped.createdAt,
        reservas: huesped.reservas,
        huespedesSecundarios: huesped.huespedesSecundarios
      }))

      // Convertir huéspedes secundarios al formato unificado
      const secundarios: HuespedUnificado[] = secundariosResponse.data.map((huesped: HuespedSecundario) => ({
        id: huesped.id,
        tipo: 'secundario' as const,
        tipo_documento: huesped.tipo_documento,
        numero_documento: huesped.numero_documento,
        primer_apellido: huesped.primer_apellido,
        segundo_apellido: huesped.segundo_apellido,
        nombres: huesped.nombres,
        pais_residencia: huesped.pais_residencia,
        ciudad_residencia: huesped.ciudad_residencia,
        nacionalidad: huesped.nacionalidad,
        genero: huesped.genero,
        telefono: huesped.telefono,
        correo: huesped.correo,
        createdAt: huesped.createdAt,
        huesped_id: huesped.huesped_id
      }))

      // Combinar y ordenar por fecha de creación
      const todosLosHuespedes = [...principales, ...secundarios]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setHuespedesUnificados(todosLosHuespedes)
      setCurrentPage(page)
      
      // Calcular totales combinados
      const totalCombinado = principalesResponse.meta.total + secundariosResponse.meta.total
      
      setTotalHuespedes(totalCombinado)
      setTotalPages(Math.ceil(totalCombinado / limit))
      
    } catch (error) {
      console.error('Error al cargar huéspedes:', error)
      setError('Error al cargar los huéspedes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllHuespedes(1)
  }, [])

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchAllHuespedes(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchAllHuespedes(currentPage + 1)
    }
  }

  const filteredHuespedes = huespedesUnificados.filter(huesped => {
    // Filtro por tipo
    if (tipoFiltro === 'principales' && huesped.tipo !== 'principal') return false
    if (tipoFiltro === 'secundarios' && huesped.tipo !== 'secundario') return false
    
    // Filtro por búsqueda
    return huesped.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
           huesped.primer_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
           huesped.numero_documento.includes(searchTerm)
  })

  // Calcular estadísticas para mostrar en badges
  const estadisticas = {
    total: huespedesUnificados.length,
    principales: huespedesUnificados.filter(h => h.tipo === 'principal').length,
    secundarios: huespedesUnificados.filter(h => h.tipo === 'secundario').length
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES')
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Huéspedes
          </CardTitle>
          <Badge variant="secondary">
            {totalHuespedes} registros
          </Badge>
        </div>
        
        {/* Filtros por tipo */}
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 mr-2">Filtrar por:</span>
          <div className="flex gap-2">
            <Button
              variant={tipoFiltro === 'todos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTipoFiltro('todos')}
              className="text-xs"
            >
              Todos ({estadisticas.total})
            </Button>
            <Button
              variant={tipoFiltro === 'principales' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTipoFiltro('principales')}
              className="text-xs flex items-center gap-1"
            >
              <Crown className="h-3 w-3" />
              Principales ({estadisticas.principales})
            </Button>
            <Button
              variant={tipoFiltro === 'secundarios' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTipoFiltro('secundarios')}
              className="text-xs flex items-center gap-1"
            >
              <UserCheck className="h-3 w-3" />
              Secundarios ({estadisticas.secundarios})
            </Button>
          </div>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, apellido o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Cargando huéspedes...</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4 min-h-[300px] max-h-[300px]">
              <div className="space-y-3">
                {filteredHuespedes.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No se encontraron huéspedes</p>
                      {searchTerm && (
                        <p className="text-sm">Intenta con otros términos de búsqueda</p>
                      )}
                      {tipoFiltro !== 'todos' && !searchTerm && (
                        <p className="text-sm">No hay huéspedes {tipoFiltro} en esta página</p>
                      )}
                    </div>
                  </div>
                ) : (
                  filteredHuespedes.map((huesped) => (
                    <div key={`${huesped.tipo}-${huesped.id}`} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {huesped.nombres} {huesped.primer_apellido} {huesped.segundo_apellido || ''}
                            </h3>
                            <Badge 
                              variant={huesped.tipo === 'principal' ? 'default' : 'outline'}
                              className="text-xs flex items-center gap-1"
                            >
                              {huesped.tipo === 'principal' ? (
                                <>
                                  <Crown className="h-3 w-3" />
                                  Principal
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-3 w-3" />
                                  Secundario
                                </>
                              )}
                            </Badge>
                          </div>
                          
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Documento:</span> {huesped.tipo_documento} {huesped.numero_documento}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Género:</span> {huesped.genero}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Nacionalidad:</span> {huesped.nacionalidad}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Residencia:</span> {huesped.ciudad_residencia}, {huesped.pais_residencia}
                            </p>
                            {huesped.telefono && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Teléfono:</span> {huesped.telefono}
                              </p>
                            )}
                            {huesped.correo && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span> {huesped.correo}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Registro:</span> {formatDate(huesped.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex flex-col items-end gap-2">
                          {/* Badge de reservas solo para principales */}
                          {huesped.tipo === 'principal' && (
                            <Badge variant={huesped.reservas && huesped.reservas.length > 0 ? 'default' : 'secondary'} className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {huesped.reservas ? huesped.reservas.length : 0} reservas
                            </Badge>
                          )}
                          
                          {/* Badge de acompañantes solo para principales */}
                          {huesped.tipo === 'principal' && huesped.huespedesSecundarios && huesped.huespedesSecundarios.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +{huesped.huespedesSecundarios.length} acompañantes
                            </Badge>
                          )}
                          
                          {/* ID del huésped principal para secundarios */}
                          {huesped.tipo === 'secundario' && huesped.huesped_id && (
                            <Badge variant="outline" className="text-xs">
                              Principal ID: {huesped.huesped_id}
                            </Badge>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Paginación */}
            {!searchTerm && totalPages > 1 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages} ({totalHuespedes} huéspedes)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || loading}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
} 