"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalyticsRendimiento } from "@/hooks/useAnalytics"
import { BarChart3, TrendingUp } from "lucide-react"

export function RendimientoAnalytics() {
  const { data, loading, error } = useAnalyticsRendimiento()

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

      {/* Gráfico Placeholder */}
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