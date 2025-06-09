"use client"

import { useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDashboardDiario } from '@/hooks/useAnalytics'
import { Loader2, RefreshCw, DollarSign, Receipt, TrendingUp, AlertCircle, LucideIcon } from 'lucide-react'

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "text-emerald-600",
  isLoading = false 
}: { 
  title: string
  value: string
  icon?: LucideIcon
  color?: string
  isLoading?: boolean
}) => {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-2">
          {Icon && <Icon className={`w-4 h-4 ${color}`} />}
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        ) : (
          <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardAnalytics() {
  const { datos, loading, error, cargarDashboard, limpiarError } = useDashboardDiario()

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDashboard()
  }, [cargarDashboard])

  // Función para formatear moneda
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor)
  }

  // Función para recargar datos
  const handleRecargar = async () => {
    try {
      await cargarDashboard()
    } catch {
      // Error ya manejado por el hook
    }
  }

  // Si hay error, mostrar estado de error
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="md:col-span-4">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Error al cargar las métricas: {error}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={limpiarError}
              >
                Cerrar
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleRecargar}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Ingresos del día */}
      <StatCard
        title="Ingresos Hoy"
        value={datos.ingresosDiarios ? formatearMoneda(datos.ingresosDiarios.totalRevenue) : "$0"}
        icon={DollarSign}
        color="text-emerald-600"
        isLoading={loading}
      />

      {/* Número de facturas */}
      <StatCard
        title="Facturas Hoy"
        value={datos.ingresosDiarios ? datos.ingresosDiarios.invoiceCount.toString() : "0"}
        icon={Receipt}
        color="text-blue-600"
        isLoading={loading}
      />

      {/* Promedio por factura */}
      <StatCard
        title="Promedio/Factura"
        value={datos.ingresosDiarios ? formatearMoneda(datos.ingresosDiarios.averagePerInvoice) : "$0"}
        icon={TrendingUp}
        color="text-purple-600"
        isLoading={loading}
      />

             {/* Botón de análisis detallado */}
       <Card>
         <CardContent className="p-6 flex flex-col items-center justify-center">
           <p className="text-sm font-medium text-muted-foreground mb-3">Análisis Detallado</p>
           <div className="flex flex-col gap-2 w-full">
             <Button
               variant="outline"
               size="sm"
               onClick={handleRecargar}
               disabled={loading}
               className="w-full"
             >
               {loading ? (
                 <>
                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                   Cargando...
                 </>
               ) : (
                 <>
                   <RefreshCw className="w-4 h-4 mr-2" />
                   Actualizar
                 </>
               )}
             </Button>
           </div>
           {datos.ingresosDiarios && (
             <p className="text-xs text-muted-foreground mt-2 text-center">
               Última actualización: {new Date().toLocaleTimeString('es-CO')}
             </p>
           )}
         </CardContent>
       </Card>
    </div>
  )
} 