'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  FileText, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  Building,
  Search,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { 
  useReporteAseo, 
  useUpdateReporteAseo, 
  useDeleteReporteAseo 
} from '@/hooks/aseo/useReportesAseo';
import { 
  CreateReporteAseoDiarioDto, 
  UpdateReporteAseoDiarioDto 
} from '@/Types/aseo/ReporteAseoDiario';
import ReporteAseoForm from '@/components/aseo/reporte-aseo-form';
import ReporteRegistrosTabla from '@/components/aseo/reporte-registros-tabla';

export default function ReporteAseoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const reporteId = parseInt(params.id as string);

  // Hooks para manejar el reporte
  const { 
    reporte, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useReporteAseo(reporteId);

  const { 
    updateReporte, 
    isUpdating, 
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
    reset: resetUpdate 
  } = useUpdateReporteAseo();

  const { 
    deleteReporte, 
    isDeleting, 
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    error: deleteError,
    reset: resetDelete 
  } = useDeleteReporteAseo();

  // Efectos para manejar éxito/error de operaciones
  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success('Reporte actualizado exitosamente');
      setIsEditing(false);
      resetUpdate();
      refetch();
    }
  }, [isUpdateSuccess, resetUpdate, refetch]);

  useEffect(() => {
    if (isUpdateError && updateError) {
      toast.error(`Error al actualizar reporte: ${updateError}`);
    }
  }, [isUpdateError, updateError]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success('Reporte eliminado exitosamente');
      resetDelete();
      router.push('/aseo');
    }
  }, [isDeleteSuccess, resetDelete, router]);

  useEffect(() => {
    if (isDeleteError && deleteError) {
      toast.error(`Error al eliminar reporte: ${deleteError}`);
    }
  }, [isDeleteError, deleteError]);

  // Manejadores de eventos
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetUpdate();
  };

  const handleUpdate = (data: CreateReporteAseoDiarioDto | UpdateReporteAseoDiarioDto) => {
    updateReporte(reporteId, data as UpdateReporteAseoDiarioDto);
  };

  const handleDelete = () => {
    deleteReporte(reporteId);
    setShowDeleteDialog(false);
  };

  const handleBack = () => {
    router.push('/aseo/reportes');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Cargando reporte...</p>
        </div>
      </div>
    );
  }

  if (isError || !reporte) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Error al cargar reporte</h3>
            <p className="text-muted-foreground">
              {error || 'No se pudo cargar la información del reporte'}
            </p>
          </div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Reportes
          </Button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            onClick={handleCancelEdit} 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar Edición
          </Button>
        </div>
        
        <ReporteAseoForm
          reporte={reporte}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
          mode="edit"
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Reportes
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Reporte de Aseo Diario
            </h1>
            <p className="text-muted-foreground">
              {format(new Date(reporte.fecha), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleEdit} disabled={isUpdating}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Eliminar Reporte?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente este reporte de aseo.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <LoadingSpinner />
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Información del reporte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Fecha del Reporte</span>
              <p className="font-semibold">
                {format(new Date(reporte.fecha), "dd/MM/yyyy")}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Creado</span>
              <p className="font-semibold">
                {format(new Date(reporte.createdAt), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Última Actualización</span>
              <p className="font-semibold">
                {format(new Date(reporte.updatedAt), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de actividades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Resumen de Actividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {reporte.datos.resumen.total_habitaciones_aseadas}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Users className="h-4 w-4" />
                Habitaciones Aseadas
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {reporte.datos.resumen.total_zonas_comunes_aseadas}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Building className="h-4 w-4" />
                Zonas Comunes Aseadas
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {reporte.datos.resumen.objetos_perdidos_encontrados}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Search className="h-4 w-4" />
                Objetos Perdidos
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {reporte.datos.resumen.rastros_animales_encontrados}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Rastros de Animales
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elementos y materiales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Elementos de Aseo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {reporte.elementos_aseo.map((elemento, index) => (
                <Badge key={index} variant="secondary">
                  {elemento}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Elementos de Protección</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {reporte.elementos_proteccion.map((elemento, index) => (
                <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                  {elemento}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Productos Químicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {reporte.productos_quimicos.map((producto, index) => (
                <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                  {producto}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Procedimientos */}
      <Card>
        <CardHeader>
          <CardTitle>Procedimientos de Aseo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">Procedimiento Aseo Habitación</h4>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm whitespace-pre-line">
                  {reporte.procedimiento_aseo_habitacion}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-600">Procedimiento Desinfección Habitación</h4>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm whitespace-pre-line">
                  {reporte.procedimiento_desinfeccion_habitacion}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Procedimiento Limpieza Zona Común</h4>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm whitespace-pre-line">
                  {reporte.procedimiento_limpieza_zona_comun}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-orange-600">Procedimiento Desinfección Zona Común</h4>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm whitespace-pre-line">
                  {reporte.procedimiento_desinfeccion_zona_comun}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de registros de aseo */}
      <ReporteRegistrosTabla 
        habitaciones={reporte.datos.habitaciones}
        zonasComunes={reporte.datos.zonas_comunes}
      />
    </div>
  );
} 