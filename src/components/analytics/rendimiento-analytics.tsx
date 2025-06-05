"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock, Wrench } from "lucide-react"

export function RendimientoAnalytics() {
  return (
    <div className="space-y-6">
      {/* Título */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Rendimiento de Habitaciones
          </CardTitle>
          <CardDescription>
            Análisis del rendimiento financiero y ocupacional por tipo de habitación
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Mensaje de Desarrollo */}
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <Wrench className="h-16 w-16 text-red-500 animate-pulse" />
              <Clock className="h-8 w-8 text-orange-500 absolute -bottom-2 -right-2" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Funcionalidad en Desarrollo
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                El análisis de rendimiento de habitaciones estará disponible próximamente
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
                <p className="text-sm text-red-700">
                  <strong>Próximamente incluirá:</strong>
                  <br />• Rendimiento por tipo de habitación
                  <br />• Análisis financiero y ocupacional
                  <br />• Comparativas de eficiencia
                  <br />• Métricas de rentabilidad por habitación
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
import { useAnalyticsRendimiento } from "@/hooks/useAnalytics"
import { BarChart3, TrendingUp } from "lucide-react"

export function RendimientoAnalytics() {
  const { data, loading, error } = useAnalyticsRendimiento()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Rendimiento de Habitaciones
          </CardTitle>
          <CardDescription>
            Análisis del rendimiento financiero y ocupacional por tipo de habitación
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Tipo de Habitación</CardTitle>
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
                <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-500 mb-2">Gráfico de Rendimiento</p>
                <p className="text-sm text-gray-400">
                  Gráfico de barras comparativo por tipo de habitación
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Datos disponibles: {data?.length || 0} tipos de habitación
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