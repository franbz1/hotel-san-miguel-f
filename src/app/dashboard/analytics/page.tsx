"use client"

import { Header } from "@/components/layout/header"
import { OcupacionAnalytics } from "@/components/analytics/ocupacion-analytics"
import { DemografiaAnalytics } from "@/components/analytics/demografia-analytics"
import { ProcedenciaAnalytics } from "@/components/analytics/procedencia-analytics"
import { RendimientoAnalytics } from "@/components/analytics/rendimiento-analytics"
import { MotivosViajeAnalytics } from "@/components/analytics/motivos-viaje-analytics"
import { ForecastAnalytics } from "@/components/analytics/forecast-analytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart3, 
  Users, 
  Globe, 
  Home, 
  MapPin, 
  TrendingUp 
} from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Analytics Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Descripción */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Centro de Análisis de Datos
              </CardTitle>
              <CardDescription>
                Análisis detallado del rendimiento hotelero, demografía de huéspedes y predicciones de ocupación
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Tabs de Analytics */}
          <Tabs defaultValue="ocupacion" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="ocupacion" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Ocupación</span>
              </TabsTrigger>
              <TabsTrigger value="demografia" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Demografía</span>
              </TabsTrigger>
              <TabsTrigger value="procedencia" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Procedencia</span>
              </TabsTrigger>
              <TabsTrigger value="rendimiento" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Rendimiento</span>
              </TabsTrigger>
              <TabsTrigger value="motivos" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Motivos</span>
              </TabsTrigger>
              <TabsTrigger value="forecast" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Predicción</span>
              </TabsTrigger>
            </TabsList>

            {/* Contenido de cada tab */}
            <TabsContent value="ocupacion" className="mt-6">
              <OcupacionAnalytics />
            </TabsContent>

            <TabsContent value="demografia" className="mt-6">
              <DemografiaAnalytics />
            </TabsContent>

            <TabsContent value="procedencia" className="mt-6">
              <ProcedenciaAnalytics />
            </TabsContent>

            <TabsContent value="rendimiento" className="mt-6">
              <RendimientoAnalytics />
            </TabsContent>

            <TabsContent value="motivos" className="mt-6">
              <MotivosViajeAnalytics />
            </TabsContent>

            <TabsContent value="forecast" className="mt-6">
              <ForecastAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 