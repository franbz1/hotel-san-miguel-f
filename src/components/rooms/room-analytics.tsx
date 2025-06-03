import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Habitacion } from "@/Types/habitacion"

interface RoomAnalyticsProps {
  habitacion?: Habitacion | null
  loading: boolean
}

export function RoomAnalytics({ 
  // eslint-disable-next-line no-unused-vars
  habitacion,
  loading 
}: RoomAnalyticsProps) {
  // El parámetro habitacion se usará en el futuro para cargar datos específicos de la habitación
  // Por ahora mostramos datos de ejemplo
  
  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Analítica</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="space-y-4">
            <div className="text-center text-muted-foreground mb-4">
              <p>Datos de ocupación</p>
            </div>
            
            {/* Ejemplo de métricas básicas */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted/50 p-2 rounded-md">
                <div className="text-muted-foreground">Ocupación</div>
                <div className="font-medium">65%</div>
              </div>
              <div className="bg-muted/50 p-2 rounded-md">
                <div className="text-muted-foreground">Ingresos</div>
                <div className="font-medium">1.2M</div>
              </div>
              <div className="bg-muted/50 p-2 rounded-md">
                <div className="text-muted-foreground">Noches</div>
                <div className="font-medium">42</div>
              </div>
              <div className="bg-muted/50 p-2 rounded-md">
                <div className="text-muted-foreground">Limpieza</div>
                <div className="font-medium">12</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 