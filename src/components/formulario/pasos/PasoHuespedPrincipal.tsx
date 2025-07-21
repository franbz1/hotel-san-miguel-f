'use client'

import React, { useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import LocationSelector from '@/components/ui/location-selector'
import type { Level } from '@/hooks/formulario/locationPicker'
import type { ICountry, IState, ICity } from 'country-state-city'
import { CountryCodeSelector } from '@/components/ui/country-code-selector'

// UI Components
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { InfoIcon } from 'lucide-react'

// Enums
import { TipoDoc } from '@/Types/enums/tiposDocumento'
import { Genero } from '@/Types/enums/generos'
import { MotivosViajes } from '@/Types/enums/motivosViajes'

// Tooltips
import tooltips from '@/lib/common/tooltips/formulario-tooltips.json'

// Paso 2: Aqui se maneja la informacion del huesped principal, ademas de la informacion general del viaje.
export const PasoHuespedPrincipal = ({
  selectedProcedenciaLocation,
  setSelectedProcedenciaLocation,
  selectedResidenciaLocation,
  setSelectedResidenciaLocation,
  selectedNacionalidad,
  setSelectedNacionalidad,
  selectedDestinoLocation,
  setSelectedDestinoLocation,
}: {
  selectedProcedenciaLocation: ICity | null
  setSelectedProcedenciaLocation: (location: ICity | null) => void
  selectedResidenciaLocation: ICity | null
  setSelectedResidenciaLocation: (location: ICity | null) => void
  selectedNacionalidad: ICountry | null
  setSelectedNacionalidad: (country: ICountry | null) => void
  selectedDestinoLocation: ICity | null
  setSelectedDestinoLocation: (location: ICity | null) => void
}) => {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
  } = useFormContext()

  // Observar valores actuales para defaultValues
  const paisResidencia = watch('pais_residencia')
  const nacionalidad = watch('nacionalidad')
  const paisProcedencia = watch('pais_procedencia')
  const ciudadProcedencia = watch('ciudad_procedencia')
  const ciudadResidencia = watch('ciudad_residencia')
  const paisDestino = watch('pais_destino')
  const ciudadDestino = watch('ciudad_destino')

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
    if (fullPhone && !dialCode && !number) {
      const m = fullPhone.match(/^(\+\d+)\s*(.*)$/)
      if (m && m[1] && m[2]) {
        setValue('telefono_dial_code', m[1], { shouldValidate: false })
        setValue('telefono_number', m[2], { shouldValidate: false })
      }
    }
    // Si tenemos campos auxiliares pero no teléfono completo, combinar
    else if (dialCode && number && !fullPhone) {
      setValue('telefono', `${dialCode}${number}`, { shouldValidate: false })
    }
  }, []) // Solo al montar - sin dependencias que cambien

  // Crear callbacks memoizados para evitar re-creaciones constantes
  const handleNacionalidadChange = React.useCallback(
    (selection: {
      level: Level
      country?: ICountry
      state?: IState
      city?: ICity
    }) => {
      if (selection.country) {
        setValue('nacionalidad', selection.country.isoCode)
        // Almacenar el país completo para retrocompatibilidad
        setSelectedNacionalidad(selection.country)
      }
    },
    [setValue, setSelectedNacionalidad]
  )

  const handleProcedenciaChange = React.useCallback(
    (selection: {
      level: Level
      country?: ICountry
      state?: IState
      city?: ICity
    }) => {
      // Actualizar los campos del formulario
      if (selection.country) {
        setValue('pais_procedencia', selection.country.isoCode)
      }
      if (selection.city) {
        setValue('ciudad_procedencia', selection.city.name)
        // Almacenar la ICity completa para retrocompatibilidad
        setSelectedProcedenciaLocation(selection.city)
      }
    },
    [setValue, setSelectedProcedenciaLocation]
  )

  const handleResidenciaChange = React.useCallback(
    (selection: {
      level: Level
      country?: ICountry
      state?: IState
      city?: ICity
    }) => {
      // Actualizar los campos del formulario
      if (selection.country) {
        setValue('pais_residencia', selection.country.isoCode)
      }
      if (selection.city) {
        setValue('ciudad_residencia', selection.city.name)
        // Almacenar la ICity completa para retrocompatibilidad
        setSelectedResidenciaLocation(selection.city)
      }
    },
    [setValue, setSelectedResidenciaLocation]
  )

  const handleDestinoChange = React.useCallback(
    (selection: {
      level: Level
      country?: ICountry
      state?: IState
      city?: ICity
    }) => {
      // Actualizar los campos del formulario
      if (selection.country) {
        setValue('pais_destino', selection.country.isoCode)
      }
      if (selection.city) {
        setValue('ciudad_destino', selection.city.name)
        // Almacenar la ICity completa para retrocompatibilidad
        setSelectedDestinoLocation(selection.city)
      }
    },
    [setValue, setSelectedDestinoLocation]
  )

  // Función para obtener defaultValues del LocationSelector basado en ICity almacenada o valores del formulario
  const getProcedenciaDefaultValues = React.useMemo(() => {
    if (selectedProcedenciaLocation) {
      // Si tenemos la ICity completa, usarla para obtener todos los códigos
      return {
        countryCode: selectedProcedenciaLocation.countryCode,
        stateCode: selectedProcedenciaLocation.stateCode,
        cityName: selectedProcedenciaLocation.name,
      }
    } else if (paisProcedencia || ciudadProcedencia) {
      // Fallback a los valores individuales del formulario
      return {
        countryCode: paisProcedencia,
        cityName: ciudadProcedencia,
      }
    }
    return undefined
  }, [selectedProcedenciaLocation, paisProcedencia, ciudadProcedencia])

  const getResidenciaDefaultValues = React.useMemo(() => {
    if (selectedResidenciaLocation) {
      // Si tenemos la ICity completa, usarla para obtener todos los códigos
      return {
        countryCode: selectedResidenciaLocation.countryCode,
        stateCode: selectedResidenciaLocation.stateCode,
        cityName: selectedResidenciaLocation.name,
      }
    } else if (paisResidencia || ciudadResidencia) {
      // Fallback a los valores individuales del formulario
      return {
        countryCode: paisResidencia,
        cityName: ciudadResidencia,
      }
    }
    return undefined
  }, [selectedResidenciaLocation, paisResidencia, ciudadResidencia])

  const getNacionalidadDefaultValues = React.useMemo(() => {
    if (selectedNacionalidad) {
      return {
        countryCode: selectedNacionalidad.isoCode,
      }
    } else if (nacionalidad) {
      return {
        countryCode: nacionalidad,
      }
    }
    return undefined
  }, [selectedNacionalidad, nacionalidad])

  const getDestinoDefaultValues = React.useMemo(() => {
    if (selectedDestinoLocation) {
      // Si tenemos la ICity completa, usarla para obtener todos los códigos
      return {
        countryCode: selectedDestinoLocation.countryCode,
        stateCode: selectedDestinoLocation.stateCode,
        cityName: selectedDestinoLocation.name,
      }
    } else if (paisDestino || ciudadDestino) {
      // Fallback a los valores individuales del formulario
      return {
        countryCode: paisDestino,
        cityName: ciudadDestino,
      }
    }
    return undefined
  }, [selectedDestinoLocation, paisDestino, ciudadDestino])

  const TooltipWrapper = ({
    children,
    tooltip,
  }: {
    children: React.ReactNode
    tooltip: string
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
  )

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null
    return <p className='text-sm text-red-600 mt-1'>{message}</p>
  }

  return (
    <div className='space-y-8 max-w-4xl mx-auto'>
      {/* Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold text-primary'>
            📋 Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Tipo y Número de Documento */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <TooltipWrapper
                tooltip={tooltips.informacion_personal.tipo_documento}
              >
                <Label htmlFor='tipo_documento'>Tipo de Documento *</Label>
              </TooltipWrapper>
              <Controller
                name='tipo_documento'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger id='tipo_documento'>
                      <SelectValue placeholder='Seleccionar tipo de documento' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TipoDoc.CC}>
                        Cédula de Ciudadanía (CC)
                      </SelectItem>
                      <SelectItem value={TipoDoc.CE}>
                        Cédula de Extranjería (CE)
                      </SelectItem>
                      <SelectItem value={TipoDoc.PASAPORTE}>
                        Pasaporte
                      </SelectItem>
                      <SelectItem value={TipoDoc.PPT}>PPT</SelectItem>
                      <SelectItem value={TipoDoc.PEP}>
                        Permiso Especial de Permanencia (PEP)
                      </SelectItem>
                      <SelectItem value={TipoDoc.DNI}>
                        Documento Nacional de Identidad (DNI)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage
                message={errors.tipo_documento?.message as string}
              />
            </div>

            <div className='space-y-2'>
              <TooltipWrapper
                tooltip={tooltips.informacion_personal.numero_documento}
              >
                <Label htmlFor='numero_documento'>Número de Documento *</Label>
              </TooltipWrapper>
              <Input
                id='numero_documento'
                {...register('numero_documento')}
                placeholder='Ingrese número de documento'
              />
              <ErrorMessage
                message={errors.numero_documento?.message as string}
              />
            </div>
          </div>

          {/* Nombres y Apellidos */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <TooltipWrapper tooltip={tooltips.informacion_personal.nombres}>
                <Label htmlFor='nombres'>Nombres *</Label>
              </TooltipWrapper>
              <Input
                id='nombres'
                {...register('nombres')}
                placeholder='Nombres completos'
              />
              <ErrorMessage message={errors.nombres?.message as string} />
            </div>

            <div className='space-y-2'>
              <TooltipWrapper
                tooltip={tooltips.informacion_personal.primer_apellido}
              >
                <Label htmlFor='primer_apellido'>Primer Apellido *</Label>
              </TooltipWrapper>
              <Input
                id='primer_apellido'
                {...register('primer_apellido')}
                placeholder='Primer apellido'
              />
              <ErrorMessage
                message={errors.primer_apellido?.message as string}
              />
            </div>

            <div className='space-y-2'>
              <TooltipWrapper
                tooltip={tooltips.informacion_personal.segundo_apellido}
              >
                <Label htmlFor='segundo_apellido'>Segundo Apellido</Label>
              </TooltipWrapper>
              <Input
                id='segundo_apellido'
                {...register('segundo_apellido')}
                placeholder='Segundo apellido (opcional)'
              />
              <ErrorMessage
                message={errors.segundo_apellido?.message as string}
              />
            </div>
          </div>

          {/* Fecha de Nacimiento, Género y Ocupación */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <TooltipWrapper
                tooltip={tooltips.informacion_personal.fecha_nacimiento}
              >
                <Label htmlFor='fecha_nacimiento'>Fecha de Nacimiento *</Label>
              </TooltipWrapper>
              <Input
                id='fecha_nacimiento'
                type='date'
                {...register('fecha_nacimiento')}
              />
              <ErrorMessage
                message={errors.fecha_nacimiento?.message as string}
              />
            </div>

            <div className='space-y-2'>
              <TooltipWrapper tooltip={tooltips.informacion_personal.genero}>
                <Label htmlFor='genero'>Género *</Label>
              </TooltipWrapper>
              <Controller
                name='genero'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger id='genero'>
                      <SelectValue placeholder='Seleccionar género' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Genero.MASCULINO}>
                        Masculino
                      </SelectItem>
                      <SelectItem value={Genero.FEMENINO}>Femenino</SelectItem>
                      <SelectItem value={Genero.OTRO}>Otro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage message={errors.genero?.message as string} />
            </div>

            <div className='space-y-2'>
              <TooltipWrapper tooltip={tooltips.informacion_personal.ocupacion}>
                <Label htmlFor='ocupacion'>Ocupación *</Label>
              </TooltipWrapper>
              <Input
                id='ocupacion'
                {...register('ocupacion')}
                placeholder='Profesión u ocupación'
              />
              <ErrorMessage message={errors.ocupacion?.message as string} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Contacto y Ubicación */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold text-primary'>
            🌍 Información de Contacto y Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Nacionalidad */}
          <div className='space-y-2'>
            <TooltipWrapper tooltip={tooltips.contacto_ubicacion.nacionalidad}>
              <Label htmlFor='nacionalidad-country'>Nacionalidad *</Label>
            </TooltipWrapper>
            <LocationSelector
              idPrefix='nacionalidad'
              searchable={true}
              maxLevel='country'
              placeholders={{
                country: 'Seleccionar país de nacionalidad',
              }}
              onSelectionChange={handleNacionalidadChange}
              defaultValues={getNacionalidadDefaultValues}
            />
            <ErrorMessage message={errors.nacionalidad?.message as string} />
          </div>

          {/* Procedencia */}
          <div className='space-y-2'>
            <TooltipWrapper tooltip={tooltips.contacto_ubicacion.procedencia}>
              <Label htmlFor='procedencia-country'>
                Ciudad de Procedencia *
              </Label>
            </TooltipWrapper>
            <LocationSelector
              idPrefix='procedencia'
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
            <div className='text-xs text-muted-foreground'>
              Navegue hasta seleccionar la ciudad específica de donde viene
            </div>
            <ErrorMessage
              message={errors.pais_procedencia?.message as string}
            />
            <ErrorMessage
              message={errors.ciudad_procedencia?.message as string}
            />
          </div>

          {/* Residencia */}
          <div className='space-y-2'>
            <TooltipWrapper tooltip={tooltips.contacto_ubicacion.residencia}>
              <Label htmlFor='residencia-country'>Ciudad de Residencia *</Label>
            </TooltipWrapper>
            <LocationSelector
              idPrefix='residencia'
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
            <div className='text-xs text-muted-foreground'>
              Navegue hasta seleccionar la ciudad donde reside habitualmente
            </div>
            <ErrorMessage message={errors.pais_residencia?.message as string} />
            <ErrorMessage
              message={errors.ciudad_residencia?.message as string}
            />
          </div>

          {/* Destino */}
          <div className='space-y-2'>
            <TooltipWrapper tooltip={tooltips.contacto_ubicacion.destino}>
              <Label htmlFor='destino-country'>Ciudad de Destino *</Label>
            </TooltipWrapper>
            <LocationSelector
              idPrefix='destino'
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
            <div className='text-xs text-muted-foreground'>
              Navegue hasta seleccionar la ciudad de destino
            </div>
            <ErrorMessage message={errors.pais_destino?.message as string} />
            <ErrorMessage message={errors.ciudad_destino?.message as string} />
          </div>

          {/* Contacto */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <TooltipWrapper tooltip={tooltips.contacto_ubicacion.telefono}>
                <Label>Teléfono *</Label>
              </TooltipWrapper>
              <div className='flex gap-2'>
                <div className='w-40'>
                  <Label
                    htmlFor='telefono_dial_code'
                    className='sr-only'
                  >
                    Código de país
                  </Label>
                  <Controller
                    name='telefono_dial_code'
                    control={control}
                    render={({ field }) => (
                      <CountryCodeSelector
                        id='telefono_dial_code'
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
                  <ErrorMessage
                    message={errors.telefono_dial_code?.message as string}
                  />
                </div>
                <div className='flex-1'>
                  <Label
                    htmlFor='telefono_number'
                    className='sr-only'
                  >
                    Teléfono *
                  </Label>
                  <Input
                    id='telefono_number'
                    {...register('telefono_number')}
                    placeholder='Número de teléfono'
                    type='tel'
                    onBlur={handlePhoneBlur}
                  />
                </div>
              </div>
              <ErrorMessage
                message={errors.telefono_number?.message as string}
              />
            </div>
            <ErrorMessage message={errors.telefono?.message as string} />

            <div className='space-y-2'>
              <TooltipWrapper tooltip={tooltips.contacto_ubicacion.email}>
                <Label htmlFor='correo'>Correo Electrónico *</Label>
              </TooltipWrapper>
              <Input
                id='correo'
                type='email'
                {...register('correo')}
                placeholder='correo@ejemplo.com'
              />
              <ErrorMessage message={errors.correo?.message as string} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de la Reserva */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold text-primary'>
            🏨 Información de la Reserva
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <TooltipWrapper tooltip={tooltips.reserva.motivo_viaje}>
              <Label htmlFor='motivo_viaje'>Motivo del Viaje *</Label>
            </TooltipWrapper>
            <Controller
              name='motivo_viaje'
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger id='motivo_viaje'>
                    <SelectValue placeholder='Seleccionar motivo del viaje' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={MotivosViajes.NEGOCIOS_Y_MOTIVOS_PROFESIONALES}
                    >
                      Negocios y Motivos Profesionales
                    </SelectItem>
                    <SelectItem value={MotivosViajes.VACACIONES_RECREO_Y_OCIO}>
                      Vacaciones, Recreo y Ocio
                    </SelectItem>
                    <SelectItem
                      value={MotivosViajes.VISITAS_A_FAMILIARES_Y_AMIGOS}
                    >
                      Visitas a Familiares y Amigos
                    </SelectItem>
                    <SelectItem value={MotivosViajes.EDUCACION_Y_FORMACION}>
                      Educación y Formación
                    </SelectItem>
                    <SelectItem value={MotivosViajes.SALUD_Y_ATENCION_MEDICA}>
                      Salud y Atención Médica
                    </SelectItem>
                    <SelectItem
                      value={MotivosViajes.RELIGION_Y_PEREGRINACIONES}
                    >
                      Religión y Peregrinaciones
                    </SelectItem>
                    <SelectItem value={MotivosViajes.COMPRAS}>
                      Compras
                    </SelectItem>
                    <SelectItem value={MotivosViajes.TRANSITO}>
                      Tránsito
                    </SelectItem>
                    <SelectItem value={MotivosViajes.OTROS_MOTIVOS}>
                      Otros Motivos
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <ErrorMessage message={errors.motivo_viaje?.message as string} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
