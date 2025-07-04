'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { LocationSelector } from '@/components/ui/location-selector';
import { CountryCodeSelector, useCountryCodeSelector } from '@/components/ui/country-code-selector';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

// Enums
import { TipoDoc } from '@/Types/enums/tiposDocumento';
import { Genero } from '@/Types/enums/generos';
import { MotivosViajes } from '@/Types/enums/motivosViajes';

// Tooltips
import tooltips from '@/lib/common/tooltips/formulario-tooltips.json';

export const PasoInformacionPersonal = () => {
  const { control, setValue } = useFormContext();

  // Estado para rastrear si el código fue cambiado manualmente
  const [isPhoneCodeManuallySet, setIsPhoneCodeManuallySet] = React.useState(false);

  // Hook para manejar el código de país del teléfono
  const {
    selectedCountry: phoneCountry,
    handleCountryCodeChange,
    setCountryByCode
  } = useCountryCodeSelector('CO');

  // Función para sincronizar código telefónico usando código ISO directamente
  const syncPhoneCodeWithResidence = React.useCallback((isoCode: string | null) => {
    if (isoCode && !isPhoneCodeManuallySet) {
      setCountryByCode(isoCode);
    }
  }, [isPhoneCodeManuallySet, setCountryByCode]);

  // Función para formatear los labels de los enums
  const formatEnumLabel = (value: string) => {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Componente para el label con icono de información
  const LabelWithTooltip = ({ label, tooltipText }: { label: string; tooltipText: string }) => (
    <div className="flex items-center gap-2">
      <FormLabel>{label}</FormLabel>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  // Componente para títulos de sección con tooltip
  const SectionTitleWithTooltip = ({ title, tooltipText }: { title: string; tooltipText: string }) => (
    <div className="flex items-center gap-2">
      <h4 className="text-md font-medium">{title}</h4>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <div className="space-y-8">

      {/* Información Personal */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Información Personal</h3>

        <div className="space-y-4">
          {/* Tipo de Documento */}
          <FormField
            control={control}
            name="tipo_documento"
            render={({ field }) => (
              <FormItem>
                <LabelWithTooltip 
                  label="Tipo de Documento *" 
                  tooltipText={tooltips.informacion_personal.tipo_documento} 
                />
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de documento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TipoDoc).map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Número de Documento */}
          <FormField
            control={control}
            name="numero_documento"
            render={({ field }) => (
              <FormItem>
                <LabelWithTooltip 
                  label="Número de Documento *" 
                  tooltipText={tooltips.informacion_personal.numero_documento} 
                />
                <FormControl>
                  <Input
                    placeholder="Ingrese el número de documento"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nombres */}
          <FormField
            control={control}
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <LabelWithTooltip 
                  label="Nombres *" 
                  tooltipText={tooltips.informacion_personal.nombres} 
                />
                <FormControl>
                  <Input
                    placeholder="Ingrese sus nombres"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="primer_apellido"
              render={({ field }) => (
                <FormItem>
                  <LabelWithTooltip 
                    label="Primer Apellido *" 
                    tooltipText={tooltips.informacion_personal.primer_apellido} 
                  />
                  <FormControl>
                    <Input
                      placeholder="Primer apellido"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="segundo_apellido"
              render={({ field }) => (
                <FormItem>
                  <LabelWithTooltip 
                    label="Segundo Apellido" 
                    tooltipText={tooltips.informacion_personal.segundo_apellido} 
                  />
                  <FormControl>
                    <Input
                      placeholder="Segundo apellido (opcional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fecha de Nacimiento */}
          <FormField
            control={control}
            name="fecha_nacimiento"
            render={({ field }) => (
              <FormItem>
                <LabelWithTooltip 
                  label="Fecha de Nacimiento *" 
                  tooltipText={tooltips.informacion_personal.fecha_nacimiento} 
                />
                <FormControl>
                  <Input
                    type="date"
                    max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                    min="1900-01-01" // No permitir fechas antes de 1900
                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                      field.onChange(dateValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Género */}
          <FormField
            control={control}
            name="genero"
            render={({ field }) => (
              <FormItem>
                <LabelWithTooltip 
                  label="Género *" 
                  tooltipText={tooltips.informacion_personal.genero} 
                />
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione su género" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Genero).map((genero) => (
                      <SelectItem key={genero} value={genero}>
                        {formatEnumLabel(genero)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ocupación */}
          <FormField
            control={control}
            name="ocupacion"
            render={({ field }) => (
              <FormItem>
                <LabelWithTooltip 
                  label="Ocupación *" 
                  tooltipText={tooltips.informacion_personal.ocupacion} 
                />
                <FormControl>
                  <Input
                    placeholder="Ingrese su ocupación"
                    maxLength={50}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Información de Contacto y Ubicación */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Información de Contacto y Ubicación</h3>

        <div className="space-y-6">
          {/* Nacionalidad */}
          <div className="space-y-2">
            <SectionTitleWithTooltip 
              title="Nacionalidad" 
              tooltipText={tooltips.contacto_ubicacion.nacionalidad} 
            />
            <FormField
              control={control}
              name="nacionalidad"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LocationSelector
                      level="country"
                      defaultCountryCode="CO" // Colombia por defecto
                      placeholder={{
                        country: "Seleccionar nacionalidad..."
                      }}
                      onCountryChange={(country) => {
                        field.onChange(country?.name || '');
                      }}
                      initialCountryCode={field.value ? undefined : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Procedencia */}
          <div className="space-y-2">
            <SectionTitleWithTooltip 
              title="Procedencia" 
              tooltipText={tooltips.contacto_ubicacion.procedencia} 
            />
            <FormField
              control={control}
              name="pais_procedencia"
              render={({ field: paisField }) => (
                <FormItem>
                  <FormControl>
                    <LocationSelector
                      level="city"
                      defaultCountryCode="CO" // Colombia por defecto
                      placeholder={{
                        country: "País de procedencia...",
                        state: "Estado/Departamento...",
                        city: "Ciudad de procedencia..."
                      }}
                      onLocationChange={(location) => {
                        // Actualizar los campos correspondientes
                        paisField.onChange(location.country?.name || '');
                        setValue('estado_procedencia', location.state?.name || '');
                        setValue('ciudad_procedencia', location.city?.name || '');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Residencia */}
          <div className="space-y-2">
            <SectionTitleWithTooltip 
              title="Residencia" 
              tooltipText={tooltips.contacto_ubicacion.residencia} 
            />
            <FormField
              control={control}
              name="pais_residencia"
              render={({ field: paisField }) => (
                <FormItem>
                  <FormControl>
                    <LocationSelector
                      level="city"
                      defaultCountryCode="CO" // Colombia por defecto
                      placeholder={{
                        country: "País de residencia...",
                        state: "Estado/Departamento...",
                        city: "Ciudad de residencia..."
                      }}
                      onLocationChange={(location) => {
                        // Actualizar los campos correspondientes
                        paisField.onChange(location.country?.name || '');
                        setValue('estado_residencia', location.state?.name || '');
                        setValue('ciudad_residencia', location.city?.name || '');
                      }}
                      onCountryISOChange={(isoCode) => {
                        // Sincronizar código telefónico con país de residencia usando ISO
                        syncPhoneCodeWithResidence(isoCode);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Destino */}
          <div className="space-y-2">
            <SectionTitleWithTooltip 
              title="Destino" 
              tooltipText={tooltips.contacto_ubicacion.destino} 
            />
            <FormField
              control={control}
              name="pais_destino"
              render={({ field: paisField }) => (
                <FormItem>
                  <FormControl>
                    <LocationSelector
                      level="city"
                      defaultCountryCode="CO" // Colombia por defecto
                      placeholder={{
                        country: "País de destino...",
                        state: "Estado/Departamento...",
                        city: "Ciudad de destino..."
                      }}
                      onLocationChange={(location) => {
                        paisField.onChange(location.country?.name || '');
                        setValue('ciudad_destino', location.city?.name || '');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Campos de contacto */}
          <div className="pt-4 border-t space-y-4">
            <h4 className="text-md font-medium">Información de Contacto</h4>

            {/* Teléfono */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Teléfono *</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{tooltips.contacto_ubicacion.telefono}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2">
                {/* Código de país */}
                <div className="w-48">
                  <CountryCodeSelector
                    defaultCountryCode="CO"
                    displayMode="code-only"
                    placeholder="+57"
                    value={phoneCountry?.code}
                    onCountryCodeChange={(country) => {
                      handleCountryCodeChange(country);
                      setValue('codigo_pais_telefono', country?.dial_code || '');
                      // Marcar que el código fue cambiado manualmente
                      setIsPhoneCodeManuallySet(true);
                    }}
                  />
                </div>

                {/* Número de teléfono */}
                <div className="flex-1">
                  <FormField
                    control={control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Número de teléfono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <LabelWithTooltip 
                    label="Email *" 
                    tooltipText={tooltips.contacto_ubicacion.email} 
                  />
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Información de la reserva */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información de la Reserva</h3>

        {/* Campo editable: Motivo de viaje */}
        <div className="max-w-md">
          <FormField
            control={control}
            name="motivo_viaje"
            render={({ field }) => (
              <FormItem>
                <LabelWithTooltip 
                  label="Motivo de Viaje *" 
                  tooltipText={tooltips.reserva.motivo_viaje} 
                />
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el motivo de su viaje" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(MotivosViajes).map((motivo) => (
                      <SelectItem key={motivo} value={motivo}>
                        {formatEnumLabel(motivo)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}; 