"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalyticsForecast } from "@/hooks/useAnalytics"
import { ForecastParamsDto } from "@/Types/analytics"
import { TrendingUp, Activity, Filter } from "lucide-react"

export function ForecastAnalytics() {
  const [filtros, setFiltros] = useState<ForecastParamsDto>({
    periodosAdelante: 6,
    tipoPeriodo: 'mes'
  })

  const { data, loading, error, refetch } = useAnalyticsForecast(filtros)

  const handleFiltroChange = (campo: keyof ForecastParamsDto, valor: string | number) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const aplicarFiltros = () => {
    refetch()
  }

  return (
    <div className="space-y-6">
      {/* Título */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Predicción de Ocupación
          </CardTitle>
          <CardDescription>
            Pronósticos de ocupación futura basados en patrones históricos
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Parámetros de Predicción
          </CardTitle>
          <CardDescription>
            Configure los parámetros para generar las predicciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fecha Inicio */}
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio (Históricos)</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
              />
            </div>

            {/* Fecha Fin */}
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin (Históricos)</Label>
              <Input
                id="fechaFin"
                type="date"
                value={filtros.fechaFin || ''}
                onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
              />
            </div>

            {/* Períodos Adelante */}
            <div className="space-y-2">
              <Label htmlFor="periodosAdelante">Períodos a Predecir (1-12)</Label>
              <Input
                id="periodosAdelante"
                type="number"
                min="1"
                max="12"
                value={filtros.periodosAdelante}
                onChange={(e) => handleFiltroChange('periodosAdelante', parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Tipo de Período */}
            <div className="space-y-2">
              <Label>Tipo de Período</Label>
              <Select
                value={filtros.tipoPeriodo}
                onValueChange={(value) => handleFiltroChange('tipoPeriodo', value as 'mes' | 'semana')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Semana</SelectItem>
                  <SelectItem value="mes">Mes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={aplicarFiltros} className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Generar Predicción
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Predicción de Ocupación Futura</CardTitle>
          <CardDescription>
            Predicción para los próximos {filtros.periodosAdelante} {filtros.tipoPeriodo === 'mes' ? 'meses' : 'semanas'}
          </CardDescription>
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
                <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-500 mb-2">Gráfico de Predicción</p>
                <p className="text-sm text-gray-400">
                  Gráfico de líneas con predicciones futuras
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Datos disponibles: {data?.length || 0} períodos predichos
                </p>
                <p className="text-xs text-gray-400">
                  Configuración: {filtros.periodosAdelante} {filtros.tipoPeriodo === 'mes' ? 'meses' : 'semanas'} adelante
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 