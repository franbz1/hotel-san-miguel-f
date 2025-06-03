import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Habitacion } from "@/Types/habitacion"

interface CleaningRecord {
  id: string
  fecha: string
  empleado: string
  tipo: 'limpieza' | 'desinfeccion'
  observaciones?: string
}

interface RoomCleaningHistoryProps {
  habitacion?: Habitacion | null
  loading: boolean
}

export function RoomCleaningHistory({ 
  // eslint-disable-next-line no-unused-vars
  habitacion, 
  loading 
}: RoomCleaningHistoryProps) {
  // El parámetro habitacion se usará en el futuro para cargar datos específicos de la habitación
  // Por ahora mostramos datos de ejemplo
  
  // Aquí se podría implementar la lógica para obtener el historial de limpieza
  // Por ahora usamos un arreglo vacío como ejemplo
  const cleaningHistory: CleaningRecord[] = []

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Historial de aseo</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : cleaningHistory.length > 0 ? (
          <div className="divide-y">
            {cleaningHistory.map((record) => (
              <div key={record.id} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium capitalize">{record.tipo}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(record.fecha).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">Empleado: {record.empleado}</p>
                {record.observaciones && (
                  <p className="text-sm text-muted-foreground mt-1">{record.observaciones}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <p>No hay registros de aseo para mostrar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 