"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, User, Eye } from "lucide-react"
import { Habitacion } from "@/Types/habitacion"
import { useRegistrosAseoHabitacion } from "@/hooks/aseo/useRegistrosAseoHabitacion"
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface RoomCleaningHistoryProps {
  habitacion?: Habitacion | null
  loading: boolean
}

export function RoomCleaningHistory({
  habitacion,
  loading
}: RoomCleaningHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null)
  const pageSize = 5
  const router = useRouter()

  // Obtener registros de aseo de la habitación con paginación
  const {
    registros,
    meta,
    isLoading: registrosLoading,
    isError,
    error,
    refetch
  } = useRegistrosAseoHabitacion(
    pageSize,
    currentPage,
    habitacion?.id ? { habitacionId: habitacion.id } : undefined
  )

  const isDataLoading = loading || registrosLoading

  // Colores coherentes con la página de detalles
  const getTipoAseoBadgeColor = (tipo: TiposAseo) => {
    switch (tipo) {
      case TiposAseo.LIMPIEZA:
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case TiposAseo.DESINFECCION:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case TiposAseo.ROTACION_COLCHONES:
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case TiposAseo.LIMPIEZA_BANIO:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case TiposAseo.DESINFECCION_BANIO:
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Función para formatear el tipo de aseo
  const formatTipoAseo = (tipo: TiposAseo) => {
    switch (tipo) {
      case TiposAseo.LIMPIEZA:
        return "Limpieza"
      case TiposAseo.DESINFECCION:
        return "Desinfección"
      case TiposAseo.ROTACION_COLCHONES:
        return "Rotación Colchones"
      case TiposAseo.LIMPIEZA_BANIO:
        return "Limpieza Baño"
      case TiposAseo.DESINFECCION_BANIO:
        return "Desinfección Baño"
      default:
        return tipo
    }
  }

  // Función para formatear fecha
  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
  }

  // Manejo de paginación
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (meta && currentPage < meta.lastPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Toggle para expandir/contraer registro
  const toggleExpanded = (recordId: number) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId)
  }

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Historial de Aseo</CardTitle>
          {habitacion && (
            <Badge variant="outline" className="text-xs">
              Habitación {habitacion.numero_habitacion}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {isDataLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm mb-2">Error al cargar el historial</p>
            <p className="text-xs text-muted-foreground mb-3">{error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
            >
              Reintentar
            </Button>
          </div>
        ) : registros && registros.length > 0 ? (
          <>
            <div className="space-y-3 mb-4">
              {registros.map((registro) => (
                <div
                  key={registro.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/aseo/habitaciones/registros/${registro.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      router.push(`/aseo/habitaciones/registros/${registro.id}`)
                    }
                  }}
                  className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  title="Ver detalles del registro"
                >
                  {/* Header del registro */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatDate(registro.fecha_registro)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpanded(registro.id)
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Tipos de aseo realizados */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {registro.tipos_realizados.map((tipo, index) => (
                      <Badge
                        key={index}
                        className={`text-xs ${getTipoAseoBadgeColor(tipo)}`}
                      >
                        {formatTipoAseo(tipo)}
                      </Badge>
                    ))}
                  </div>

                  {/* Usuario */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>
                      {registro.usuario.nombre}
                    </span>
                  </div>

                  {/* Alertas de objetos perdidos o rastros de animales */}
                  {(registro.objetos_perdidos || registro.rastros_de_animales) && (
                    <div className="flex gap-1 mt-2">
                      {registro.objetos_perdidos && (
                        <Badge variant="destructive" className="text-xs">
                          Objetos perdidos
                        </Badge>
                      )}
                      {registro.rastros_de_animales && (
                        <Badge variant="destructive" className="text-xs">
                          Rastros de animales
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Detalles expandidos */}
                  {expandedRecord === registro.id && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      {registro.areas_intervenidas.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Áreas intervenidas:
                          </p>
                          <p className="text-xs">
                            {registro.areas_intervenidas.join(", ")}
                          </p>
                        </div>
                      )}

                      {registro.areas_intervenidas_banio.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Áreas del baño:
                          </p>
                          <p className="text-xs">
                            {registro.areas_intervenidas_banio.join(", ")}
                          </p>
                        </div>
                      )}

                      {registro.procedimiento_rotacion_colchones && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Procedimiento rotación colchones:
                          </p>
                          <p className="text-xs">
                            {registro.procedimiento_rotacion_colchones}
                          </p>
                        </div>
                      )}

                      {registro.observaciones && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Observaciones:
                          </p>
                          <p className="text-xs">
                            {registro.observaciones}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Paginación */}
            {meta && meta.lastPage > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Página {meta.page} de {meta.lastPage}
                  ({meta.total} registros)
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={currentPage >= meta.lastPage}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No hay registros de aseo para esta habitación.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 