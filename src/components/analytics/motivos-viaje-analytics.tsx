"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Clock, Wrench } from "lucide-react"

export function MotivosViajeAnalytics() {
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

      {/* Mensaje de Desarrollo */}
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <Wrench className="h-16 w-16 text-purple-500 animate-pulse" />
              <Clock className="h-8 w-8 text-orange-500 absolute -bottom-2 -right-2" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Funcionalidad en Desarrollo
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                El análisis de motivos de viaje estará disponible próximamente
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md">
                <p className="text-sm text-purple-700">
                  <strong>Próximamente incluirá:</strong>
                  <br />• Segmentación por propósito del viaje
                  <br />• Análisis de duración de estancia
                  <br />• Gráficos de distribución detallados
                  <br />• Comparativas por temporadas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* 
// CÓDIGO ORIGINAL COMENTADO - MANTENER PARA DESARROLLO FUTURO
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalyticsMotivosViaje } from "@/hooks/useAnalytics"
import { Globe, Target } from "lucide-react"

export function MotivosViajeAnalytics() {
  const { data, loading, error } = useAnalyticsMotivosViaje()

  return (
    <div className="space-y-6">
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
*/ 