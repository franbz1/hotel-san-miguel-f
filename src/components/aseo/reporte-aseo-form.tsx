'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Save, FileText, Shield } from 'lucide-react';
import { 
  CreateReporteAseoDiarioDto, 
  UpdateReporteAseoDiarioDto,
  ReporteAseoDiario 
} from '@/Types/aseo/ReporteAseoDiario';
import { 
  createReporteAseoDiarioDtoSchema
} from '@/lib/aseo/schemas/ReporteAseoDiario.schema';
import { format } from 'date-fns';

interface ReporteAseoFormProps {
  reporte?: ReporteAseoDiario;
  onSubmit: (data: CreateReporteAseoDiarioDto | UpdateReporteAseoDiarioDto) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  onCancel?: () => void;
}

export default function ReporteAseoForm({
  reporte,
  onSubmit,
  isLoading = false,
  mode,
  onCancel
}: ReporteAseoFormProps) {
  const isEditMode = mode === 'edit';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateReporteAseoDiarioDto>({
    // Validamos siempre con el esquema de creación para tener un shape completo del formulario
    resolver: zodResolver(createReporteAseoDiarioDtoSchema),
    defaultValues: reporte ? {
      fecha: format(new Date(reporte.fecha), 'yyyy-MM-dd'),
      elementos_aseo: reporte.elementos_aseo,
      elementos_proteccion: reporte.elementos_proteccion,
      productos_quimicos: reporte.productos_quimicos,
      procedimiento_aseo_habitacion: reporte.procedimiento_aseo_habitacion,
      procedimiento_desinfeccion_habitacion: reporte.procedimiento_desinfeccion_habitacion,
      procedimiento_limpieza_zona_comun: reporte.procedimiento_limpieza_zona_comun,
      procedimiento_desinfeccion_zona_comun: reporte.procedimiento_desinfeccion_zona_comun,
      datos: reporte.datos
    } : {
      fecha: format(new Date(), 'yyyy-MM-dd'),
      elementos_aseo: [''],
      elementos_proteccion: [''],
      productos_quimicos: [''],
      procedimiento_aseo_habitacion: '',
      procedimiento_desinfeccion_habitacion: '',
      procedimiento_limpieza_zona_comun: '',
      procedimiento_desinfeccion_zona_comun: '',
      datos: {
        habitaciones: [],
        zonas_comunes: [],
        resumen: {
          total_habitaciones_aseadas: 0,
          total_zonas_comunes_aseadas: 0,
          objetos_perdidos_encontrados: 0,
          rastros_animales_encontrados: 0
        }
      }
    }
  });

  const elementosAseoValues = watch('elementos_aseo') || [];
  const elementosProteccionValues = watch('elementos_proteccion') || [];
  const productosQuimicosValues = watch('productos_quimicos') || [];

  const handleFormSubmit = (data: CreateReporteAseoDiarioDto) => {
    // Limpiar arrays de strings vacíos y convertir fecha
    const cleanData = {
      ...data,
      fecha: data.fecha ? new Date(data.fecha + 'T00:00:00.000Z').toISOString() : new Date().toISOString(),
      elementos_aseo: data.elementos_aseo?.filter(item => item.trim() !== ''),
      elementos_proteccion: data.elementos_proteccion?.filter(item => item.trim() !== ''),
      productos_quimicos: data.productos_quimicos?.filter(item => item.trim() !== '')
    };
    
    onSubmit(cleanData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isEditMode ? 'Editar Reporte de Aseo' : 'Crear Reporte de Aseo'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha del Reporte *</Label>
                  <Input
                    id="fecha"
                    type="date"
                    {...register('fecha')}
                    className="bg-gray-50"
                  />
                  {errors.fecha && (
                    <p className="text-sm text-red-600">{errors.fecha.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Elementos de Aseo */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Elementos de Aseo</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('elementos_aseo', [...elementosAseoValues, ''])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              
              <div className="space-y-2">
                {elementosAseoValues.map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      {...register(`elementos_aseo.${index}` as const)}
                      placeholder="Ej: Escoba, Trapeador, Aspiradora..."
                      className="bg-gray-50"
                    />
                    {elementosAseoValues.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setValue('elementos_aseo', elementosAseoValues.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.elementos_aseo && (
                <p className="text-sm text-red-600">{errors.elementos_aseo.message}</p>
              )}
            </div>

            <Separator />

            {/* Elementos de Protección */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Elementos de Protección
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('elementos_proteccion', [...elementosProteccionValues, ''])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              
              <div className="space-y-2">
                {elementosProteccionValues.map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      {...register(`elementos_proteccion.${index}` as const)}
                      placeholder="Ej: Guantes, Mascarilla, Gafas de protección..."
                      className="bg-gray-50"
                    />
                    {elementosProteccionValues.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setValue('elementos_proteccion', elementosProteccionValues.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.elementos_proteccion && (
                <p className="text-sm text-red-600">{errors.elementos_proteccion.message}</p>
              )}
            </div>

            <Separator />

            {/* Productos Químicos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Productos Químicos</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('productos_quimicos', [...productosQuimicosValues, ''])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              
              <div className="space-y-2">
                {productosQuimicosValues.map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      {...register(`productos_quimicos.${index}` as const)}
                      placeholder="Ej: Detergente, Desinfectante, Limpiador multiusos..."
                      className="bg-gray-50"
                    />
                    {productosQuimicosValues.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setValue('productos_quimicos', productosQuimicosValues.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.productos_quimicos && (
                <p className="text-sm text-red-600">{errors.productos_quimicos.message}</p>
              )}
            </div>

            <Separator />

            {/* Procedimientos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Procedimientos de Aseo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="procedimiento_aseo_habitacion">Procedimiento Aseo Habitación *</Label>
                  <Textarea
                    id="procedimiento_aseo_habitacion"
                    {...register('procedimiento_aseo_habitacion')}
                    placeholder="Describa el procedimiento de aseo para habitaciones..."
                    rows={4}
                    className="bg-gray-50"
                  />
                  {errors.procedimiento_aseo_habitacion && (
                    <p className="text-sm text-red-600">{errors.procedimiento_aseo_habitacion.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procedimiento_desinfeccion_habitacion">Procedimiento Desinfección Habitación *</Label>
                  <Textarea
                    id="procedimiento_desinfeccion_habitacion"
                    {...register('procedimiento_desinfeccion_habitacion')}
                    placeholder="Describa el procedimiento de desinfección para habitaciones..."
                    rows={4}
                    className="bg-gray-50"
                  />
                  {errors.procedimiento_desinfeccion_habitacion && (
                    <p className="text-sm text-red-600">{errors.procedimiento_desinfeccion_habitacion.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procedimiento_limpieza_zona_comun">Procedimiento Limpieza Zona Común *</Label>
                  <Textarea
                    id="procedimiento_limpieza_zona_comun"
                    {...register('procedimiento_limpieza_zona_comun')}
                    placeholder="Describa el procedimiento de limpieza para zonas comunes..."
                    rows={4}
                    className="bg-gray-50"
                  />
                  {errors.procedimiento_limpieza_zona_comun && (
                    <p className="text-sm text-red-600">{errors.procedimiento_limpieza_zona_comun.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procedimiento_desinfeccion_zona_comun">Procedimiento Desinfección Zona Común *</Label>
                  <Textarea
                    id="procedimiento_desinfeccion_zona_comun"
                    {...register('procedimiento_desinfeccion_zona_comun')}
                    placeholder="Describa el procedimiento de desinfección para zonas comunes..."
                    rows={4}
                    className="bg-gray-50"
                  />
                  {errors.procedimiento_desinfeccion_zona_comun && (
                    <p className="text-sm text-red-600">{errors.procedimiento_desinfeccion_zona_comun.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información del reporte existente */}
            {isEditMode && reporte && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Resumen del Reporte</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {reporte.datos.resumen.total_habitaciones_aseadas}
                      </div>
                      <div className="text-sm text-gray-600">Habitaciones</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {reporte.datos.resumen.total_zonas_comunes_aseadas}
                      </div>
                      <div className="text-sm text-gray-600">Zonas Comunes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {reporte.datos.resumen.objetos_perdidos_encontrados}
                      </div>
                      <div className="text-sm text-gray-600">Objetos Perdidos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {reporte.datos.resumen.rastros_animales_encontrados}
                      </div>
                      <div className="text-sm text-gray-600">Rastros Animales</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEditMode ? 'Actualizando...' : 'Creando...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {isEditMode ? 'Actualizar Reporte' : 'Crear Reporte'}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 