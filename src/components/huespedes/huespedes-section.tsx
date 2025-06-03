"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Search, Users, Calendar } from "lucide-react"
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

  // Función para generar iniciales del avatar
  const getInitials = (nombres: string, primerApellido: string) => {
    const firstInitial = nombres.charAt(0).toUpperCase()
    const lastInitial = primerApellido.charAt(0).toUpperCase()
    return `${firstInitial}${lastInitial}`
  }

  // Función para generar color del avatar basado en las iniciales
  const getAvatarColor = (nombres: string, primerApellido: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500'
    ]
    const charCode = nombres.charCodeAt(0) + primerApellido.charCodeAt(0)
    return colors[charCode % colors.length]
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Huéspedes
          </CardTitle>
          <Badge variant="secondary" className="font-medium">
            {totalHuespedes} registrados
          </Badge>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar huésped..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-200 border-t-blue-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-600 font-medium">Cargando huéspedes...</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {filteredHuespedes.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center text-gray-500">
                      <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Users className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-700">No se encontraron huéspedes</p>
                      {searchTerm && (
                        <p className="text-sm text-gray-500 mt-1">Intenta con otros términos de búsqueda</p>
                      )}
                    </div>
                  </div>
                ) : (
                  filteredHuespedes.map((huesped) => (
                    <div key={huesped.id} className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
                         onClick={() => handleViewDetails(huesped.id)}>
                      <div className="flex items-center gap-4">
                        {/* Avatar con iniciales */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(huesped.nombres, huesped.primer_apellido)} shadow-sm`}>
                          {getInitials(huesped.nombres, huesped.primer_apellido)}
                        </div>
                        
                        {/* Información del huésped */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors truncate">
                            {huesped.nombres} {huesped.primer_apellido}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {huesped.tipo_documento} {huesped.numero_documento}
                          </p>
                        </div>
                        
                        {/* Badge de reservas y botón de acción */}
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={huesped.reservas && huesped.reservas.length > 0 ? 'default' : 'secondary'} 
                            className="flex items-center gap-1.5 px-2.5 py-1"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              {huesped.reservas ? huesped.reservas.length : 0} reservas
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Paginación mejorada */}
            {!searchTerm && totalPages > 1 && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span> páginas
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || loading}
                      className="h-8 px-3 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="px-3 py-1 text-sm text-gray-600 bg-gray-50 rounded">
                      {currentPage}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || loading}
                      className="h-8 px-3 disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
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