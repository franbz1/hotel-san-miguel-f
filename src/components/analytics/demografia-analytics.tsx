"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, Wrench } from "lucide-react"

export function DemografiaAnalytics() {
  return (
    <div className="space-y-6">
      {/* Título */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Demografía de Huéspedes
          </CardTitle>
          <CardDescription>
            Análisis demográfico de huéspedes por nacionalidad e ingresos
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Mensaje de Desarrollo */}
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <Wrench className="h-16 w-16 text-green-500 animate-pulse" />
              <Clock className="h-8 w-8 text-orange-500 absolute -bottom-2 -right-2" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Funcionalidad en Desarrollo
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                El análisis demográfico estará disponible próximamente
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
                <p className="text-sm text-green-700">
                  <strong>Próximamente incluirá:</strong>
                  <br />• Distribución por nacionalidades
                  <br />• Análisis de ingresos por demografía
                  <br />• Métricas de diversidad de huéspedes
                  <br />• Gráficos interactivos de distribución
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 