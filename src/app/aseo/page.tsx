'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  ClipboardList, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3,
  Settings,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useHabitacionesAseoDashboard } from '@/hooks/aseo/useHabitacionesAseo';
import { useReportesAseoDashboard } from '@/hooks/aseo/useReportesAseo';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/auth-context';

export default function AseoDashboardPage() {
  const {
    habitacionesAseoHoy,
    countAseoHoy,
    countDesinfeccionHoy,
    countRotacionColchones,
    isLoading: isLoadingHabitaciones,
    hasError: hasErrorHabitaciones,
    error: errorHabitaciones
  } = useHabitacionesAseoDashboard();

  const {
    existeReporteHoy,
    reporteHoy,
    isLoadingReporteHoy,
    generarReporteHoy,
    isGenerating
  } = useReportesAseoDashboard();

  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Aseo</h1>
          <p className="text-muted-foreground">
            Monitorea y gestiona las actividades de aseo del hotel
          </p>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Habitaciones Requieren Aseo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {isLoadingHabitaciones ? <LoadingSpinner /> : countAseoHoy}
            </div>
            <p className="text-xs text-muted-foreground">
              Pendientes para hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Desinfección Pendiente
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {isLoadingHabitaciones ? <LoadingSpinner /> : countDesinfeccionHoy}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren desinfección
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rotación de Colchones
            </CardTitle>
            <Settings className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {isLoadingHabitaciones ? <LoadingSpinner /> : countRotacionColchones}
            </div>
            <p className="text-xs text-muted-foreground">
              Colchones por rotar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reporte diario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Reporte Diario
            </CardTitle>
            <CardDescription>
              Estado del reporte de aseo de hoy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingReporteHoy ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                <span className="text-sm">Verificando reporte...</span>
              </div>
            ) : existeReporteHoy ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Reporte generado</span>
                </div>
                <Link href={`/aseo/reportes/${reporteHoy?.id}`}>
                  <Button variant="outline" size="sm">
                    Ver Reporte
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Reporte pendiente</span>
                </div>
                <Button 
                  onClick={generarReporteHoy} 
                  disabled={isGenerating}
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Generar Reporte
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accesos directos a funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/aseo/habitaciones" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Gestionar Habitaciones
              </Button>
            </Link>
            
            <Link href="/aseo/registros" className="block">
              <Button variant="outline" className="w-full justify-start">
                <ClipboardList className="h-4 w-4 mr-2" />
                Registros de Aseo
              </Button>
            </Link>
            
            <Link href="/aseo/reportes" className="block">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Reportes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Lista de habitaciones prioritarias */}
      {!isLoadingHabitaciones && countAseoHoy > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Habitaciones Prioritarias</CardTitle>
            <CardDescription>
              Habitaciones que requieren atención inmediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasErrorHabitaciones ? (
              <p className="text-destructive text-sm">
                Error al cargar habitaciones: {errorHabitaciones}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {habitacionesAseoHoy.slice(0, 6).map((habitacion) => (
                    <div key={habitacion.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Link href={`/aseo/habitaciones/registrar?habitacionId=${habitacion.id}&usuarioId=${user?.id || 1}&usuarioNombre=${user?.nombre || ''}&numeroHabitacion=${habitacion.numero_habitacion}`}>
                          <span className="font-medium hover:underline">Hab. {habitacion.numero_habitacion}</span>
                          <Badge variant="secondary">{habitacion.tipo}</Badge>
                        </Link>
                      </div>
                      <div className="flex gap-1">
                        {habitacion.requerido_aseo_hoy && (
                          <Badge variant="destructive" className="text-xs">Aseo</Badge>
                        )}
                        {habitacion.requerido_desinfeccion_hoy && (
                          <Badge variant="outline" className="text-xs">Desinfección</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {countAseoHoy > 6 && (
                  <div className="pt-2">
                    <Link href="/aseo/habitaciones?filter=aseo_hoy">
                      <Button variant="ghost" size="sm">
                        Ver todas las habitaciones ({countAseoHoy})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 