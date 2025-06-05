"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalyticsMotivosViaje } from "@/hooks/useAnalytics"
import { Globe, Target } from "lucide-react"

export function MotivosViajeAnalytics() {
  const { data, loading, error } = useAnalyticsMotivosViaje()

  return (
    <div className="space-y-6">
      {/* Título */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Motivos de Viaje
          </CardTitle>
          <CardDescription>
            Segmentación de reservas por motivos de viaje y duración de estancia
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Gráfico Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Motivos de Viaje</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Error al cargar datos: {error}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-500 mb-2">Gráfico de Motivos</p>
                <p className="text-sm text-gray-400">
                  Gráfico de dona con segmentación por motivos
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Datos disponibles: {data?.length || 0} motivos
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 