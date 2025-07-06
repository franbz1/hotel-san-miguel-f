'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationSelector } from '@/components/ui/location-selector';
import { huespedSecundarioSchema } from '@/lib/formulario/schemas/RegistroFormularioDto.schema';
import { TipoDocumentoHuespedSecundario } from '@/Types/enums/tipoDocumentoHuespedSecundario';
import { Genero } from '@/Types/enums/generos';
import { toast } from 'sonner';
import { z } from 'zod';
import { X } from 'lucide-react';

type HuespedSecundarioFormData = z.infer<typeof huespedSecundarioSchema>;

interface AcompanianteFormProps {
  /** Datos iniciales para edición (opcional) */
  initialData?: Partial<HuespedSecundarioFormData>;
  /** Callback cuando se guarda el acompañante */
  onSave: (data: HuespedSecundarioFormData) => void;
  /** Callback cuando se cancela la edición */
  onCancel: () => void;
  /** Título del formulario */
  title?: string;
  /** Modo de operación */
  mode?: 'create' | 'edit';
}

export const AcompanianteForm = ({
  initialData,
  onSave,
  onCancel,
  title = 'Información del Acompañante',
  mode = 'create'
}: AcompanianteFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm<HuespedSecundarioFormData>({
    resolver: zodResolver(huespedSecundarioSchema),
    mode: 'onChange',
    defaultValues: {
      tipo_documento: initialData?.tipo_documento || undefined,
      numero_documento: initialData?.numero_documento || '',
      primer_apellido: initialData?.primer_apellido || '',
      segundo_apellido: initialData?.segundo_apellido || '',
      nombres: initialData?.nombres || '',
      pais_residencia: initialData?.pais_residencia || '',
      ciudad_residencia: initialData?.ciudad_residencia || '',
      pais_procedencia: initialData?.pais_procedencia || '',
      ciudad_procedencia: initialData?.ciudad_procedencia || '',
      pais_destino: initialData?.pais_destino || '',
      ciudad_destino: initialData?.ciudad_destino || '',
      fecha_nacimiento: initialData?.fecha_nacimiento || undefined,
      nacionalidad: initialData?.nacionalidad || '',
      ocupacion: initialData?.ocupacion || '',
      genero: initialData?.genero || undefined,
      telefono: initialData?.telefono || '',
      correo: initialData?.correo || ''
    }
  });

  const handleFormSubmit = async (data: HuespedSecundarioFormData) => {
    try {
      // Validar con el schema antes de enviar
      const validatedData = huespedSecundarioSchema.parse(data);
      
      onSave(validatedData);
      toast.success(mode === 'create' ? 'Acompañante agregado correctamente' : 'Acompañante actualizado correctamente');
      
      // Limpiar formulario si es creación
      if (mode === 'create') {
        reset();
      }
    } catch (error) {
      console.error('Error al procesar acompañante:', error);
      toast.error('Error al procesar la información del acompañante');
    }
  };

  const handleCancel = () => {
    if (mode === 'create') {
      reset();
    }
    onCancel();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Información de Documento */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Información de Documento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de Documento */}
              <div className="space-y-2">
                <Label htmlFor="tipo_documento">Tipo de Documento *</Label>
                <Select
                  value={watch('tipo_documento')}
                  onValueChange={(value) => setValue('tipo_documento', value as TipoDocumentoHuespedSecundario)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TipoDocumentoHuespedSecundario.CC}>Cédula de Ciudadanía</SelectItem>
                    <SelectItem value={TipoDocumentoHuespedSecundario.TI}>Tarjeta de Identidad</SelectItem>
                    <SelectItem value={TipoDocumentoHuespedSecundario.PASAPORTE}>Pasaporte</SelectItem>
                    <SelectItem value={TipoDocumentoHuespedSecundario.CE}>Cédula de Extranjería</SelectItem>
                    <SelectItem value={TipoDocumentoHuespedSecundario.REGISTRO_CIVIL}>Registro Civil</SelectItem>
                    <SelectItem value={TipoDocumentoHuespedSecundario.PEP}>PEP</SelectItem>
                    <SelectItem value={TipoDocumentoHuespedSecundario.DNI}>DNI</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo_documento && (
                  <p className="text-sm text-red-600">{errors.tipo_documento.message}</p>
                )}
              </div>

              {/* Número de Documento */}
              <div className="space-y-2">
                <Label htmlFor="numero_documento">Número de Documento *</Label>
                <Input
                  id="numero_documento"
                  {...register('numero_documento')}
                  placeholder="Ingrese el número de documento"
                />
                {errors.numero_documento && (
                  <p className="text-sm text-red-600">{errors.numero_documento.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Información Personal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Nombres */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  {...register('nombres')}
                  placeholder="Ingrese los nombres completos"
                />
                {errors.nombres && (
                  <p className="text-sm text-red-600">{errors.nombres.message}</p>
                )}
              </div>

              {/* Primer Apellido */}
              <div className="space-y-2">
                <Label htmlFor="primer_apellido">Primer Apellido *</Label>
                <Input
                  id="primer_apellido"
                  {...register('primer_apellido')}
                  placeholder="Ingrese el primer apellido"
                />
                {errors.primer_apellido && (
                  <p className="text-sm text-red-600">{errors.primer_apellido.message}</p>
                )}
              </div>

              {/* Segundo Apellido */}
              <div className="space-y-2">
                <Label htmlFor="segundo_apellido">Segundo Apellido</Label>
                <Input
                  id="segundo_apellido"
                  {...register('segundo_apellido')}
                  placeholder="Ingrese el segundo apellido (opcional)"
                />
                {errors.segundo_apellido && (
                  <p className="text-sm text-red-600">{errors.segundo_apellido.message}</p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                  min="1900-01-01" // No permitir fechas antes de 1900
                  value={(() => {
                    const fechaValue = watch('fecha_nacimiento');
                    return fechaValue ? new Date(fechaValue).toISOString().split('T')[0] : '';
                  })()}
                  onChange={(e) => {
                    const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                    setValue('fecha_nacimiento', dateValue);
                  }}
                />
                {errors.fecha_nacimiento && (
                  <p className="text-sm text-red-600">{errors.fecha_nacimiento.message}</p>
                )}
              </div>

              {/* Género */}
              <div className="space-y-2">
                <Label htmlFor="genero">Género *</Label>
                <Select
                  value={watch('genero')}
                  onValueChange={(value) => setValue('genero', value as Genero)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Genero.MASCULINO}>Masculino</SelectItem>
                    <SelectItem value={Genero.FEMENINO}>Femenino</SelectItem>
                    <SelectItem value={Genero.OTRO}>Otro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.genero && (
                  <p className="text-sm text-red-600">{errors.genero.message}</p>
                )}
              </div>

              {/* Nacionalidad */}
              <div className="space-y-2">
                <Label>Nacionalidad *</Label>
                <LocationSelector
                  level="country"
                  defaultCountryCode="CO"
                  placeholder={{
                    country: "Seleccionar nacionalidad..."
                  }}
                  onCountryChange={(country) => {
                    setValue('nacionalidad', country?.name || '');
                  }}
                />
                {errors.nacionalidad && (
                  <p className="text-sm text-red-600">{errors.nacionalidad.message}</p>
                )}
              </div>

              {/* Ocupación */}
              <div className="space-y-2">
                <Label htmlFor="ocupacion">Ocupación *</Label>
                <Input
                  id="ocupacion"
                  {...register('ocupacion')}
                  placeholder="Ingrese la ocupación"
                />
                {errors.ocupacion && (
                  <p className="text-sm text-red-600">{errors.ocupacion.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Ubicación */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Información de Ubicación</h4>
            <div className="space-y-6">
              {/* Residencia */}
              <div className="space-y-2">
                <Label>Residencia *</Label>
                <LocationSelector
                  level="city"
                  defaultCountryCode="CO"
                  placeholder={{
                    country: "País de residencia...",
                    state: "Estado/Departamento...",
                    city: "Ciudad de residencia..."
                  }}
                  onLocationChange={(location) => {
                    setValue('pais_residencia', location.country?.name || '');
                    setValue('ciudad_residencia', location.city?.name || '');
                  }}
                />
                {(errors.pais_residencia || errors.ciudad_residencia) && (
                  <p className="text-sm text-red-600">
                    {errors.pais_residencia?.message || errors.ciudad_residencia?.message}
                  </p>
                )}
              </div>

              {/* Procedencia */}
              <div className="space-y-2">
                <Label>Procedencia *</Label>
                <LocationSelector
                  level="city"
                  defaultCountryCode="CO"
                  placeholder={{
                    country: "País de procedencia...",
                    state: "Estado/Departamento...",
                    city: "Ciudad de procedencia..."
                  }}
                  onLocationChange={(location) => {
                    setValue('pais_procedencia', location.country?.name || '');
                    setValue('ciudad_procedencia', location.city?.name || '');
                  }}
                />
                {(errors.pais_procedencia || errors.ciudad_procedencia) && (
                  <p className="text-sm text-red-600">
                    {errors.pais_procedencia?.message || errors.ciudad_procedencia?.message}
                  </p>
                )}
              </div>

              {/* Destino */}
              <div className="space-y-2">
                <Label>Destino *</Label>
                <LocationSelector
                  level="city"
                  defaultCountryCode="CO"
                  placeholder={{
                    country: "País de destino...",
                    state: "Estado/Departamento...",
                    city: "Ciudad de destino..."
                  }}
                  onLocationChange={(location) => {
                    setValue('pais_destino', location.country?.name || '');
                    setValue('ciudad_destino', location.city?.name || '');
                  }}
                />
                {(errors.pais_destino || errors.ciudad_destino) && (
                  <p className="text-sm text-red-600">
                    {errors.pais_destino?.message || errors.ciudad_destino?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Información de Contacto (Opcional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  {...register('telefono')}
                  placeholder="Ingrese el número de teléfono"
                />
                {errors.telefono && (
                  <p className="text-sm text-red-600">{errors.telefono.message}</p>
                )}
              </div>

              {/* Correo Electrónico */}
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  {...register('correo')}
                  placeholder="Ingrese el correo electrónico"
                />
                {errors.correo && (
                  <p className="text-sm text-red-600">{errors.correo.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
            >
              {mode === 'create' ? 'Agregar Acompañante' : 'Actualizar Acompañante'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 