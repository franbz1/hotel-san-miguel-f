'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LocationSelector from '@/components/ui/location-selector';
import { CountryCodeSelector } from '@/components/ui/country-code-selector';
import { HuespedSecundarioDtoConAuxiliares, huespedSecundarioSchemaConAuxiliares } from '@/lib/formulario/schemas/RegistroFormularioDto.schema';
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
  initialData?: Partial<HuespedSecundarioDtoConAuxiliares>;
  /** Callback cuando se guarda el acompañante */
  onSave: (data: HuespedSecundarioDtoConAuxiliares) => void;
  /** Callback cuando se cancela la edición */
  onCancel: () => void;
  /** Callback cuando se elimina el acompañante */
  onDelete?: (data: HuespedSecundarioDtoConAuxiliares) => void;
  /** Ubicacion de procedencia huesped Principal*/
  procedenciaLocation: ICity | null;
  /** Ubicacion de residencia huesped Principal*/
  residenciaLocation: ICity | null;
  /** Ubicacion de destino huesped Principal*/
  destinoLocation: ICity | null;
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
  destinoLocation,
  nacionalidad,
  mode = 'create'
}: AcompanianteFormProps) => {
  // Estado general para reutilizar información del huésped principal
  const [reutilizarDatosHuespedPrincipal, setReutilizarDatosHuespedPrincipal] = useState(false);

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
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset
  } = useForm<HuespedSecundarioDtoConAuxiliares>({
    resolver: zodResolver(huespedSecundarioSchemaConAuxiliares),
    defaultValues: {
      tipo_documento: initialData?.tipo_documento || undefined,
      numero_documento: initialData?.numero_documento || undefined,
      nombres: initialData?.nombres || undefined,
      primer_apellido: initialData?.primer_apellido || undefined,
      segundo_apellido: initialData?.segundo_apellido || undefined,
      fecha_nacimiento: initialData?.fecha_nacimiento || undefined,
      genero: initialData?.genero || undefined,
      ocupacion: initialData?.ocupacion || undefined,
      nacionalidad: reutilizarDatosHuespedPrincipal ? nacionalidad : (initialData?.nacionalidad || undefined),
      pais_procedencia: reutilizarDatosHuespedPrincipal ? procedenciaLocation?.countryCode || undefined : (initialData?.pais_procedencia || undefined),
      ciudad_procedencia: reutilizarDatosHuespedPrincipal ? procedenciaLocation?.name || undefined : (initialData?.ciudad_procedencia || undefined),
      pais_residencia: reutilizarDatosHuespedPrincipal ? residenciaLocation?.countryCode || undefined : (initialData?.pais_residencia || undefined),
      ciudad_residencia: reutilizarDatosHuespedPrincipal ? residenciaLocation?.name || undefined : (initialData?.ciudad_residencia || undefined),
      pais_destino: reutilizarDatosHuespedPrincipal ? destinoLocation?.countryCode || undefined : (initialData?.pais_destino || undefined),
      ciudad_destino: reutilizarDatosHuespedPrincipal ? destinoLocation?.name || undefined : (initialData?.ciudad_destino || undefined),
      telefono: initialData?.telefono || undefined,
      correo: initialData?.correo || undefined,

      // Campos auxiliares de teléfono
      telefono_dial_code: initialData?.telefono_dial_code || undefined,
      telefono_number: initialData?.telefono_number || undefined,
    }
  });

  // Función para combinar teléfono solo cuando se pierde el foco o cambian los campos auxiliares
  const handlePhoneBlur = React.useCallback(() => {
    const dialCode = getValues('telefono_dial_code')
    const number = getValues('telefono_number')

    if (dialCode && number && dialCode.trim() !== '' && number.trim() !== '') {
      const full = `${dialCode}${number}`
      const currentTelefono = getValues('telefono')

      // Solo actualizar si el valor ha cambiado realmente
      if (currentTelefono !== full) {
        setValue('telefono', full, { shouldValidate: false })
      }
    } else if (dialCode && dialCode.trim() !== '' && (!number || number.trim() === '')) {
      // Si solo tenemos dial code, limpiar el teléfono completo
      setValue('telefono', '', { shouldValidate: false })
    }
  }, [setValue, getValues])

  // Al montar el componente, verificar si hay valores que inicializar (solo una vez)
  useEffect(() => {
    const dialCode = getValues('telefono_dial_code')
    const number = getValues('telefono_number')
    const fullPhone = getValues('telefono')
    
    // Si tenemos teléfono completo pero no los campos auxiliares, descomponer
    if (fullPhone && (!dialCode || !number)) {
      // Buscar pattern +código seguido de número
      const m = fullPhone.match(/^(\+\d{1,4})(.*)$/)
      if (m && m[1] && m[2]) {
        setValue('telefono_dial_code', m[1], { shouldValidate: false })
        setValue('telefono_number', m[2], { shouldValidate: false })
      } else {
        // Si no hay código, asumir +57 (Colombia) como default
        setValue('telefono_dial_code', '+57', { shouldValidate: false })
        setValue('telefono_number', fullPhone, { shouldValidate: false })
      }
    }
    // Si tenemos campos auxiliares pero no teléfono completo, combinar
    else if (dialCode && number && !fullPhone) {
      setValue('telefono', `${dialCode}${number}`, { shouldValidate: false })
    }
    // Si tenemos initialData pero ningún campo está lleno, inicializar con defaults
    else if (!fullPhone && !dialCode && !number && initialData?.telefono) {
      const m = initialData.telefono.match(/^(\+\d{1,4})(.*)$/)
      if (m && m[1] && m[2]) {
        setValue('telefono_dial_code', m[1], { shouldValidate: false })
        setValue('telefono_number', m[2], { shouldValidate: false })
        setValue('telefono', initialData.telefono, { shouldValidate: false })
      }
    }
  }, [setValue, getValues, initialData?.telefono]) // Incluir dependencias necesarias

  // Efecto para actualizar todos los campos cuando se cambia la opción de reutilizar
  useEffect(() => {
    if (reutilizarDatosHuespedPrincipal) {
      // Aplicar datos del huésped principal
      if (nacionalidad) setValue('nacionalidad', nacionalidad);
      if (procedenciaLocation) {
        setValue('pais_procedencia', procedenciaLocation.countryCode);
        setValue('ciudad_procedencia', procedenciaLocation.name);
        setSelectedProcedenciaLocation(procedenciaLocation);
      }
      if (residenciaLocation) {
        setValue('pais_residencia', residenciaLocation.countryCode);
        setValue('ciudad_residencia', residenciaLocation.name);
        setSelectedResidenciaLocation(residenciaLocation);
      }
      if (destinoLocation) {
        setValue('pais_destino', destinoLocation.countryCode);
        setValue('ciudad_destino', destinoLocation.name);
        setSelectedDestinoLocation(destinoLocation);
      }
    }
  }, [
    reutilizarDatosHuespedPrincipal,
    nacionalidad,
    procedenciaLocation,
    residenciaLocation,
    destinoLocation,
    setValue
  ]);

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
    if (reutilizarDatosHuespedPrincipal && nacionalidad) {
      return { countryCode: nacionalidad };
    }
    return initialData?.nacionalidad ? { countryCode: initialData.nacionalidad } : undefined;
  }, [reutilizarDatosHuespedPrincipal, nacionalidad, initialData?.nacionalidad]);

  const getProcedenciaDefaultValues = useMemo(() => {
    if (reutilizarDatosHuespedPrincipal && procedenciaLocation) {
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
  }, [reutilizarDatosHuespedPrincipal, procedenciaLocation, initialData]);

  const getResidenciaDefaultValues = useMemo(() => {
    if (reutilizarDatosHuespedPrincipal && residenciaLocation) {
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
  }, [reutilizarDatosHuespedPrincipal, residenciaLocation, initialData]);

  const getDestinoDefaultValues = useMemo(() => {
    if (reutilizarDatosHuespedPrincipal && destinoLocation) {
      return {
        countryCode: destinoLocation.countryCode,
        stateCode: destinoLocation.stateCode,
        cityName: destinoLocation.name,
      };
    } else if (initialData?.pais_destino || initialData?.ciudad_destino) {
      return {
        countryCode: initialData.pais_destino,
        cityName: initialData.ciudad_destino,
      };
    }
    return undefined;
  }, [reutilizarDatosHuespedPrincipal, destinoLocation, initialData]);

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
  const onSubmit = async (data: HuespedSecundarioDtoConAuxiliares) => {
    try {
      await onSave(data);
      toast.success(mode === 'create' ? 'Acompañante agregado exitosamente' : 'Acompañante actualizado exitosamente');
      if (mode === 'create') {
        reset();
      }
    } catch {
      toast.error('Error al guardar el acompañante');
    }
  };

  // Handler para eliminar
  const handleDelete = () => {
    if (onDelete && initialData) {
      onDelete(initialData as HuespedSecundarioDtoConAuxiliares);
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
                      <SelectTrigger id='tipo_documento'>
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
                      <SelectTrigger id='genero'>
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
            
            {/* Switch principal para reutilizar datos del huésped principal */}
            <div className='flex items-center space-x-3 p-4 border rounded-lg bg-muted/50'>
              <Checkbox
                id='reutilizar-datos-huesped-principal'
                checked={reutilizarDatosHuespedPrincipal}
                onCheckedChange={(checked) => setReutilizarDatosHuespedPrincipal(checked === true)}
              />
              <TooltipWrapper
                tooltip='Marque esta opción para usar la misma nacionalidad, procedencia, residencia y destino del huésped principal'
              >
                <label 
                  htmlFor='reutilizar-datos-huesped-principal'
                  className='text-sm font-medium cursor-pointer'
                >
                  Usar la misma información de ubicación del huésped principal
                </label>
              </TooltipWrapper>
            </div>

            {/* Mensaje informativo cuando se reutilizan datos */}
            {reutilizarDatosHuespedPrincipal && (
              <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <p className='text-sm text-blue-800'>
                  ✅ Se utilizarán automáticamente los mismos datos de nacionalidad, procedencia, residencia y destino del huésped principal.
                </p>
              </div>
            )}

            {/* Formularios de ubicación cuando NO se reutilizan datos */}
            {!reutilizarDatosHuespedPrincipal && (
              <div className='space-y-4'>
                {/* Nacionalidad */}
                <div className='space-y-2'>
                  <TooltipWrapper tooltip='Nacionalidad del acompañante'>
                    <Label htmlFor='acompaniante-nacionalidad-country'>Nacionalidad *</Label>
                  </TooltipWrapper>
                  <LocationSelector
                    idPrefix='acompaniante-nacionalidad'
                    searchable={true}
                    maxLevel='country'
                    placeholders={{
                      country: 'Seleccionar país de nacionalidad',
                    }}
                    onSelectionChange={handleNacionalidadChange}
                    defaultValues={getNacionalidadDefaultValues}
                  />
                  <ErrorMessage message={errors.nacionalidad?.message} />
                </div>

                {/* Procedencia */}
                <div className='space-y-2'>
                  <TooltipWrapper tooltip='Ciudad de procedencia del acompañante'>
                    <Label htmlFor='acompaniante-procedencia-country'>Ciudad de Procedencia *</Label>
                  </TooltipWrapper>
                  <LocationSelector
                    idPrefix='acompaniante-procedencia'
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
                </div>

                {/* Residencia */}
                <div className='space-y-2'>
                  <TooltipWrapper tooltip='Ciudad de residencia del acompañante'>
                    <Label htmlFor='acompaniante-residencia-country'>Ciudad de Residencia *</Label>
                  </TooltipWrapper>
                  <LocationSelector
                    idPrefix='acompaniante-residencia'
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
                </div>

                {/* Destino */}
                <div className='space-y-2'>
                  <TooltipWrapper tooltip='Ciudad de destino del acompañante'>
                    <Label htmlFor='acompaniante-destino-country'>Ciudad de Destino *</Label>
                  </TooltipWrapper>
                  <LocationSelector
                    idPrefix='acompaniante-destino'
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
            )}
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
                    <Label htmlFor='telefono_dial_code_acompaniante' className='sr-only'>
                      Código de país del acompañante
                    </Label>
                    <Controller
                      name='telefono_dial_code'
                      control={control}
                      render={({ field }) => (
                        <CountryCodeSelector
                          id='telefono_dial_code_acompaniante'
                          placeholder='Código'
                          displayMode='code-only'
                          value={field.value || ''}
                          onCountryCodeChange={(country) => {
                            const newDialCode = country?.dial_code || ''
                            field.onChange(newDialCode)
                            // Combinar teléfono cuando cambie el código (solo si hay número)
                            const currentNumber = getValues('telefono_number')
                            if (currentNumber && currentNumber.trim() !== '') {
                              setTimeout(handlePhoneBlur, 0)
                            }
                          }}
                          defaultDialCode='+57'
                        />
                      )}
                    />
                    <ErrorMessage message={errors.telefono_dial_code?.message} />
                  </div>
                  <div className='flex-1'>
                    <Label htmlFor='telefono_number_acompaniante' className='sr-only'>
                      Número de teléfono del acompañante
                    </Label>
                    <Input
                      id='telefono_number_acompaniante'
                      {...register('telefono_number')}
                      placeholder='Número de teléfono'
                      type='tel'
                      onBlur={handlePhoneBlur}
                    />
                  </div>
                </div>
                <ErrorMessage message={errors.telefono_number?.message} />
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