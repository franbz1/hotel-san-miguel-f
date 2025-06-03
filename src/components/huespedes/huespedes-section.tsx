"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Search, Users, Eye, Calendar, Crown } from "lucide-react"
import { getHuespedes } from "@/lib/huespedes/huesped-service"
import { Huesped } from "@/Types/huesped"
import { useRouter } from "next/navigation"

export function HuespedesSection() {
  const router = useRouter()
  const [huespedes, setHuespedes] = useState<Huesped[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalHuespedes, setTotalHuespedes] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  const limit = 6

  const fetchHuespedes = async (page: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getHuespedes(page, limit)
      
      setHuespedes(response.data)
      setCurrentPage(page)
      setTotalHuespedes(response.meta.total)
      setTotalPages(Math.ceil(response.meta.total / limit))
      
    } catch (error) {
      console.error('Error al cargar huéspedes:', error)
      setError('Error al cargar los huéspedes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHuespedes(1)
  }, [])

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchHuespedes(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchHuespedes(currentPage + 1)
    }
  }

  const filteredHuespedes = huespedes.filter(huesped => {
    return huesped.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
           huesped.primer_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
           huesped.numero_documento.includes(searchTerm)
  })

  const handleViewDetails = (huespedId: number) => {
    router.push(`/dashboard/huesped/${huespedId}`)
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES')
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Huéspedes Principales
          </CardTitle>
          <Badge variant="secondary">
            {totalHuespedes} registros
          </Badge>
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
                    </div>
                  </div>
                ) : (
                  filteredHuespedes.map((huesped) => (
                    <div key={huesped.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {huesped.nombres} {huesped.primer_apellido} {huesped.segundo_apellido || ''}
                            </h3>
                            <Badge 
                              variant="default"
                              className="text-xs flex items-center gap-1"
                            >
                              <Crown className="h-3 w-3" />
                              Principal
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
                          {/* Badge de reservas */}
                          <Badge variant={huesped.reservas && huesped.reservas.length > 0 ? 'default' : 'secondary'} className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {huesped.reservas ? huesped.reservas.length : 0} reservas
                          </Badge>
                          
                          {/* Badge de acompañantes */}
                          {huesped.huespedes_secundarios && huesped.huespedes_secundarios.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +{huesped.huespedes_secundarios.length} acompañantes
                            </Badge>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 cursor-pointer"
                            onClick={() => handleViewDetails(huesped.id)}
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