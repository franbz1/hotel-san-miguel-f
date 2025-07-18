'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LocationSelector from '@/components/ui/location-selector';
import { CountryCodeSelector } from '@/components/ui/country-code-selector';
import { HuespedSecundarioDto, huespedSecundarioSchema } from '@/lib/formulario/schemas/RegistroFormularioDto.schema';
import { TipoDocumentoHuespedSecundario } from '@/Types/enums/tipoDocumentoHuespedSecundario';
import { Genero } from '@/Types/enums/generos';
import { toast } from 'sonner';
import { ICity, ICountry, IState } from 'country-state-city';
import type { Level } from '@/hooks/formulario/locationPicker';

// UI Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { InfoIcon, Save, X, Trash2, User } from 'lucide-react';

interface AcompanianteFormProps {
  /** Datos iniciales para edición (opcional) */
  initialData?: Partial<HuespedSecundarioDto>;
  /** Callback cuando se guarda el acompañante */
  onSave: (data: HuespedSecundarioDto) => void;
  /** Callback cuando se cancela la edición */
  onCancel: () => void;
  /** Callback cuando se elimina el acompañante */
  onDelete?: (data: HuespedSecundarioDto) => void;
  /** Ubicacion de procedencia huesped Principal*/
  procedenciaLocation: ICity | null;
  /** Ubicacion de residencia huesped Principal*/
  residenciaLocation: ICity | null;
  /** Nacionalidad huesped Principal*/
  nacionalidad: string;
  /** Modo de operación */
  mode?: 'create' | 'edit';
}

// Debe ser un componente que se pueda re usar en el gestor de acompañantes
// Debe notificar al gestor, la creacion, edicion o eliminacion de un acompañante
// Debe registrar los campos propios del acompañante
// Debe permitir re usar los datos de procedencia, nacionalidad y residencia del huesped principal si el usuario lo desea
// Debe usar location selector para seleccionar la ubicacion de procedencia, residencia y destino solo si el usuario no desea re usar los datos del huesped principal
// Debe pre cargar automaticamente el codigo de telefono con respescto a la procedencia seleccionada
export const AcompanianteForm = ({
  initialData,
  onSave,
  onCancel,
  onDelete,
  procedenciaLocation,
  residenciaLocation,
  nacionalidad,
  mode = 'create'
}: AcompanianteFormProps) => {
  // Estados para reutilizar información del huésped principal
  const [reutilizarNacionalidad, setReutilizarNacionalidad] = useState(true);
  const [reutilizarProcedencia, setReutilizarProcedencia] = useState(true);
  const [reutilizarResidencia, setReutilizarResidencia] = useState(true);

  // Estados para ubicaciones seleccionadas
  const [, setSelectedProcedenciaLocation] = useState<ICity | null>(null);
  const [, setSelectedResidenciaLocation] = useState<ICity | null>(null);
  const [, setSelectedDestinoLocation] = useState<ICity | null>(null);

  // Función para convertir Date a string formato yyyy-MM-dd
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    if (typeof date === 'string') return date; // Ya está en formato string
    return date.toISOString().split('T')[0]; // Convierte Date a yyyy-MM-dd
  };

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm<HuespedSecundarioDto>({
    resolver: zodResolver(huespedSecundarioSchema),
    defaultValues: {
      tipo_documento: initialData?.tipo_documento || TipoDocumentoHuespedSecundario.CC,
      numero_documento: initialData?.numero_documento || '',
      nombres: initialData?.nombres || '',
      primer_apellido: initialData?.primer_apellido || '',
      segundo_apellido: initialData?.segundo_apellido || '',
      fecha_nacimiento: initialData?.fecha_nacimiento || undefined,
      genero: initialData?.genero || Genero.MASCULINO,
      ocupacion: initialData?.ocupacion || '',
      nacionalidad: reutilizarNacionalidad ? nacionalidad : (initialData?.nacionalidad || ''),
      pais_procedencia: reutilizarProcedencia ? procedenciaLocation?.countryCode || '' : (initialData?.pais_procedencia || ''),
      ciudad_procedencia: reutilizarProcedencia ? procedenciaLocation?.name || '' : (initialData?.ciudad_procedencia || ''),
      pais_residencia: reutilizarResidencia ? residenciaLocation?.countryCode || '' : (initialData?.pais_residencia || ''),
      ciudad_residencia: reutilizarResidencia ? residenciaLocation?.name || '' : (initialData?.ciudad_residencia || ''),
      pais_destino: initialData?.pais_destino || '',
      ciudad_destino: initialData?.ciudad_destino || '',
      telefono: initialData?.telefono || '',
      correo: initialData?.correo || ''
    }
  });

  // Observar el país de residencia para sincronizar el código de teléfono
  const paisResidencia = watch('pais_residencia');

  // Efectos para actualizar campos cuando se cambian las opciones de reutilizar
  useEffect(() => {
    if (reutilizarNacionalidad && nacionalidad) {
      setValue('nacionalidad', nacionalidad);
    }
  }, [reutilizarNacionalidad, nacionalidad, setValue]);

  useEffect(() => {
    if (reutilizarProcedencia && procedenciaLocation) {
      setValue('pais_procedencia', procedenciaLocation.countryCode);
      setValue('ciudad_procedencia', procedenciaLocation.name);
      setSelectedProcedenciaLocation(procedenciaLocation);
    }
  }, [reutilizarProcedencia, procedenciaLocation, setValue]);

  useEffect(() => {
    if (reutilizarResidencia && residenciaLocation) {
      setValue('pais_residencia', residenciaLocation.countryCode);
      setValue('ciudad_residencia', residenciaLocation.name);
      setSelectedResidenciaLocation(residenciaLocation);
    }
  }, [reutilizarResidencia, residenciaLocation, setValue]);

  // Handlers para LocationSelector
  const handleNacionalidadChange = useCallback(
    (selection: {
      level: Level;
      country?: ICountry;
      state?: IState;
      city?: ICity;
    }) => {
      if (selection.country) {
        setValue('nacionalidad', selection.country.isoCode);
      }
    },
    [setValue]
  );

  const handleProcedenciaChange = useCallback(
    (selection: {
      level: Level;
      country?: ICountry;
      state?: IState;
      city?: ICity;
    }) => {
      if (selection.country) {
        setValue('pais_procedencia', selection.country.isoCode);
      }
      if (selection.city) {
        setValue('ciudad_procedencia', selection.city.name);
        setSelectedProcedenciaLocation(selection.city);
      }
    },
    [setValue]
  );

  const handleResidenciaChange = useCallback(
    (selection: {
      level: Level;
      country?: ICountry;
      state?: IState;
      city?: ICity;
    }) => {
      if (selection.country) {
        setValue('pais_residencia', selection.country.isoCode);
      }
      if (selection.city) {
        setValue('ciudad_residencia', selection.city.name);
        setSelectedResidenciaLocation(selection.city);
      }
    },
    [setValue]
  );

  const handleDestinoChange = useCallback(
    (selection: {
      level: Level;
      country?: ICountry;
      state?: IState;
      city?: ICity;
    }) => {
      if (selection.country) {
        setValue('pais_destino', selection.country.isoCode);
      }
      if (selection.city) {
        setValue('ciudad_destino', selection.city.name);
        setSelectedDestinoLocation(selection.city);
      }
    },
    [setValue]
  );

  // Función para obtener defaultValues basado en el modo
  const getNacionalidadDefaultValues = useMemo(() => {
    if (reutilizarNacionalidad && nacionalidad) {
      return { countryCode: nacionalidad };
    }
    return initialData?.nacionalidad ? { countryCode: initialData.nacionalidad } : undefined;
  }, [reutilizarNacionalidad, nacionalidad, initialData?.nacionalidad]);

  const getProcedenciaDefaultValues = useMemo(() => {
    if (reutilizarProcedencia && procedenciaLocation) {
      return {
        countryCode: procedenciaLocation.countryCode,
        stateCode: procedenciaLocation.stateCode,
        cityName: procedenciaLocation.name,
      };
    } else if (initialData?.pais_procedencia || initialData?.ciudad_procedencia) {
      return {
        countryCode: initialData.pais_procedencia,
        cityName: initialData.ciudad_procedencia,
      };
    }
    return undefined;
  }, [reutilizarProcedencia, procedenciaLocation, initialData]);

  const getResidenciaDefaultValues = useMemo(() => {
    if (reutilizarResidencia && residenciaLocation) {
      return {
        countryCode: residenciaLocation.countryCode,
        stateCode: residenciaLocation.stateCode,
        cityName: residenciaLocation.name,
      };
    } else if (initialData?.pais_residencia || initialData?.ciudad_residencia) {
      return {
        countryCode: initialData.pais_residencia,
        cityName: initialData.ciudad_residencia,
      };
    }
    return undefined;
  }, [reutilizarResidencia, residenciaLocation, initialData]);

  const getDestinoDefaultValues = useMemo(() => {
    if (initialData?.pais_destino || initialData?.ciudad_destino) {
      return {
        countryCode: initialData.pais_destino,
        cityName: initialData.ciudad_destino,
      };
    }
    return undefined;
  }, [initialData]);

  // Componente TooltipWrapper
  const TooltipWrapper = ({
    children,
    tooltip,
  }: {
    children: React.ReactNode;
    tooltip: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='flex items-center gap-1'>
            {children}
            <InfoIcon className='h-4 w-4 text-muted-foreground hover:text-primary cursor-help' />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className='max-w-xs'>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Componente ErrorMessage
  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className='text-sm text-red-600 mt-1'>{message}</p>;
  };

  // Handler para envío del formulario
  const onSubmit = async (data: HuespedSecundarioDto) => {
    try {
      await onSave(data);
      toast.success(mode === 'create' ? 'Acompañante agregado exitosamente' : 'Acompañante actualizado exitosamente');
      if (mode === 'create') {
        reset();
      }
    } catch (error) {
      toast.error('Error al guardar el acompañante');
    }
  };

  // Handler para eliminar
  const handleDelete = () => {
    if (onDelete && initialData) {
      onDelete(initialData as HuespedSecundarioDto);
      toast.success('Acompañante eliminado exitosamente');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-semibold text-primary flex items-center gap-2'>
            <User className='h-5 w-5' />
            {mode === 'create' ? 'Nuevo Acompañante' : 'Editar Acompañante'}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Información Personal */}
          <div className='space-y-4'>
            <h4 className='text-md font-medium text-foreground'>📋 Información Personal</h4>
            
            {/* Tipo y Número de Documento */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <TooltipWrapper tooltip='Seleccione el tipo de documento de identidad'>
                  <Label htmlFor='tipo_documento'>Tipo de Documento *</Label>
                </TooltipWrapper>
                <Controller
                  name='tipo_documento'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccionar tipo de documento' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TipoDocumentoHuespedSecundario.CC}>
                          Cédula de Ciudadanía (CC)
                        </SelectItem>
                        <SelectItem value={TipoDocumentoHuespedSecundario.CE}>
                          Cédula de Extranjería (CE)
                        </SelectItem>
                        <SelectItem value={TipoDocumentoHuespedSecundario.PASAPORTE}>
                          Pasaporte
                        </SelectItem>
                        <SelectItem value={TipoDocumentoHuespedSecundario.TI}>Tarjeta de Identidad (TI)</SelectItem>
                        <SelectItem value={TipoDocumentoHuespedSecundario.REGISTRO_CIVIL}>Registro Civil (RC)</SelectItem>
                        <SelectItem value={TipoDocumentoHuespedSecundario.PEP}>
                          Permiso Especial de Permanencia (PEP)
                        </SelectItem>
                        <SelectItem value={TipoDocumentoHuespedSecundario.DNI}>
                          Documento Nacional de Identidad (DNI)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage message={errors.tipo_documento?.message} />
              </div>

              <div className='space-y-2'>
                <TooltipWrapper tooltip='Ingrese el número del documento seleccionado'>
                  <Label htmlFor='numero_documento'>Número de Documento *</Label>
                </TooltipWrapper>
                <Input
                  id='numero_documento'
                  {...register('numero_documento')}
                  placeholder='Ingrese número de documento'
                />
                <ErrorMessage message={errors.numero_documento?.message} />
              </div>
            </div>

            {/* Nombres y Apellidos */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <TooltipWrapper tooltip='Nombres completos del acompañante'>
                  <Label htmlFor='nombres'>Nombres *</Label>
                </TooltipWrapper>
                <Input
                  id='nombres'
                  {...register('nombres')}
                  placeholder='Nombres completos'
                />
                <ErrorMessage message={errors.nombres?.message} />
              </div>

              <div className='space-y-2'>
                <TooltipWrapper tooltip='Primer apellido del acompañante'>
                  <Label htmlFor='primer_apellido'>Primer Apellido *</Label>
                </TooltipWrapper>
                <Input
                  id='primer_apellido'
                  {...register('primer_apellido')}
                  placeholder='Primer apellido'
                />
                <ErrorMessage message={errors.primer_apellido?.message} />
              </div>

              <div className='space-y-2'>
                <TooltipWrapper tooltip='Segundo apellido del acompañante (opcional)'>
                  <Label htmlFor='segundo_apellido'>Segundo Apellido</Label>
                </TooltipWrapper>
                <Input
                  id='segundo_apellido'
                  {...register('segundo_apellido')}
                  placeholder='Segundo apellido (opcional)'
                />
                <ErrorMessage message={errors.segundo_apellido?.message} />
              </div>
            </div>

            {/* Fecha de Nacimiento, Género y Ocupación */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <TooltipWrapper tooltip='Fecha de nacimiento del acompañante'>
                  <Label htmlFor='fecha_nacimiento'>Fecha de Nacimiento *</Label>
                </TooltipWrapper>
                <Controller
                  name='fecha_nacimiento'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='fecha_nacimiento'
                      type='date'
                      value={formatDateForInput(field.value)}
                      onChange={(e) => {
                        const dateValue = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                        field.onChange(dateValue);
                      }}
                    />
                  )}
                />
                <ErrorMessage message={errors.fecha_nacimiento?.message} />
              </div>

              <div className='space-y-2'>
                <TooltipWrapper tooltip='Género del acompañante'>
                  <Label htmlFor='genero'>Género *</Label>
                </TooltipWrapper>
                <Controller
                  name='genero'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccionar género' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Genero.MASCULINO}>Masculino</SelectItem>
                        <SelectItem value={Genero.FEMENINO}>Femenino</SelectItem>
                        <SelectItem value={Genero.OTRO}>Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage message={errors.genero?.message} />
              </div>

              <div className='space-y-2'>
                <TooltipWrapper tooltip='Profesión u ocupación del acompañante'>
                  <Label htmlFor='ocupacion'>Ocupación *</Label>
                </TooltipWrapper>
                <Input
                  id='ocupacion'
                  {...register('ocupacion')}
                  placeholder='Profesión u ocupación'
                />
                <ErrorMessage message={errors.ocupacion?.message} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de Ubicación */}
          <div className='space-y-4'>
            <h4 className='text-md font-medium text-foreground'>🌍 Información de Ubicación</h4>
            
            {/* Nacionalidad */}
            <div className='space-y-2'>
              <div className='flex items-center space-x-3 mb-2'>
                <Checkbox
                  id='reutilizar-nacionalidad'
                  checked={reutilizarNacionalidad}
                  onCheckedChange={(checked) => setReutilizarNacionalidad(checked === true)}
                />
                <Label htmlFor='reutilizar-nacionalidad' className='text-sm'>
                  Usar misma nacionalidad del huésped principal
                </Label>
              </div>
              
              {!reutilizarNacionalidad && (
                <>
                  <TooltipWrapper tooltip='Nacionalidad del acompañante'>
                    <Label>Nacionalidad *</Label>
                  </TooltipWrapper>
                  <LocationSelector
                    searchable={true}
                    maxLevel='country'
                    placeholders={{
                      country: 'Seleccionar país de nacionalidad',
                    }}
                    onSelectionChange={handleNacionalidadChange}
                    defaultValues={getNacionalidadDefaultValues}
                  />
                  <ErrorMessage message={errors.nacionalidad?.message} />
                </>
              )}
            </div>

            {/* Procedencia */}
            <div className='space-y-2'>
              <div className='flex items-center space-x-3 mb-2'>
                <Checkbox
                  id='reutilizar-procedencia'
                  checked={reutilizarProcedencia}
                  onCheckedChange={(checked) => setReutilizarProcedencia(checked === true)}
                />
                <Label htmlFor='reutilizar-procedencia' className='text-sm'>
                  Usar misma procedencia del huésped principal
                </Label>
              </div>
              
              {!reutilizarProcedencia && (
                <>
                  <TooltipWrapper tooltip='Ciudad de procedencia del acompañante'>
                    <Label>Ciudad de Procedencia *</Label>
                  </TooltipWrapper>
                  <LocationSelector
                    searchable={true}
                    maxLevel='city'
                    placeholders={{
                      country: 'Seleccionar país de procedencia',
                      state: 'Seleccionar estado de procedencia',
                      city: 'Seleccionar ciudad de procedencia',
                    }}
                    onSelectionChange={handleProcedenciaChange}
                    defaultValues={getProcedenciaDefaultValues}
                  />
                  <ErrorMessage message={errors.pais_procedencia?.message} />
                  <ErrorMessage message={errors.ciudad_procedencia?.message} />
                </>
              )}
            </div>

            {/* Residencia */}
            <div className='space-y-2'>
              <div className='flex items-center space-x-3 mb-2'>
                <Checkbox
                  id='reutilizar-residencia'
                  checked={reutilizarResidencia}
                  onCheckedChange={(checked) => setReutilizarResidencia(checked === true)}
                />
                <Label htmlFor='reutilizar-residencia' className='text-sm'>
                  Usar misma residencia del huésped principal
                </Label>
              </div>
              
              {!reutilizarResidencia && (
                <>
                  <TooltipWrapper tooltip='Ciudad de residencia del acompañante'>
                    <Label>Ciudad de Residencia *</Label>
                  </TooltipWrapper>
                  <LocationSelector
                    searchable={true}
                    maxLevel='city'
                    placeholders={{
                      country: 'Seleccionar país de residencia',
                      state: 'Seleccionar estado de residencia',
                      city: 'Seleccionar ciudad de residencia',
                    }}
                    onSelectionChange={handleResidenciaChange}
                    defaultValues={getResidenciaDefaultValues}
                  />
                  <ErrorMessage message={errors.pais_residencia?.message} />
                  <ErrorMessage message={errors.ciudad_residencia?.message} />
                </>
              )}
            </div>

            {/* Destino */}
            <div className='space-y-2'>
              <TooltipWrapper tooltip='Ciudad de destino del acompañante'>
                <Label>Ciudad de Destino *</Label>
              </TooltipWrapper>
              <LocationSelector
                searchable={true}
                maxLevel='city'
                placeholders={{
                  country: 'Seleccionar país de destino',
                  state: 'Seleccionar estado de destino',
                  city: 'Seleccionar ciudad de destino',
                }}
                onSelectionChange={handleDestinoChange}
                defaultValues={getDestinoDefaultValues}
              />
              <ErrorMessage message={errors.pais_destino?.message} />
              <ErrorMessage message={errors.ciudad_destino?.message} />
            </div>
          </div>

          <Separator />

          {/* Información de Contacto */}
          <div className='space-y-4'>
            <h4 className='text-md font-medium text-foreground'>📞 Información de Contacto</h4>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <TooltipWrapper tooltip='Número de teléfono del acompañante (opcional)'>
                  <Label>Teléfono</Label>
                </TooltipWrapper>
                <div className='flex gap-2'>
                  <div className='w-40'>
                    <CountryCodeSelector
                      value={paisResidencia}
                      placeholder='Código'
                    />
                  </div>
                  <div className='flex-1'>
                    <Input
                      {...register('telefono')}
                      placeholder='Número de teléfono'
                      type='tel'
                    />
                  </div>
                </div>
                <ErrorMessage message={errors.telefono?.message} />
              </div>

              <div className='space-y-2'>
                <TooltipWrapper tooltip='Correo electrónico del acompañante (opcional)'>
                  <Label htmlFor='correo'>Correo Electrónico</Label>
                </TooltipWrapper>
                <Input
                  id='correo'
                  type='email'
                  {...register('correo')}
                  placeholder='correo@ejemplo.com'
                />
                <ErrorMessage message={errors.correo?.message} />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className='flex justify-end gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className='h-4 w-4 mr-2' />
              Cancelar
            </Button>
            
            {mode === 'edit' && onDelete && (
              <Button
                type='button'
                variant='destructive'
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Eliminar
              </Button>
            )}
            
            <Button type='submit' disabled={isSubmitting}>
              <Save className='h-4 w-4 mr-2' />
              {isSubmitting ? 'Guardando...' : (mode === 'create' ? 'Agregar' : 'Actualizar')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}; 