'use client';

import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/common/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCountryStateCity, SelectedLocation } from '@/hooks/formulario/useCountryStateCity';
import { ICountry, IState, ICity } from 'country-state-city';

export type LocationLevel = 'country' | 'state' | 'city';

export interface LocationSelectorProps {
  // Nivel de detalle requerido
  level: LocationLevel;
  
  // País por defecto que aparece primero
  defaultCountryCode?: string;
  
  // Valores iniciales
  initialCountryCode?: string;
  initialStateCode?: string;
  initialCityCode?: string;
  
  // Callbacks de cambio
  onLocationChange?: (location: SelectedLocation) => void;
  onCountryChange?: (country: ICountry | null) => void;
  onStateChange?: (state: IState | null) => void;
  onCityChange?: (city: ICity | null) => void;
  
  // Callback específico para código ISO del país (útil para sincronizar con códigos telefónicos)
  onCountryISOChange?: (isoCode: string | null) => void;
  
  // Personalización
  placeholder?: {
    country?: string;
    state?: string;
    city?: string;
  };
  
  // Clases CSS
  className?: string;
  
  // Deshabilitado
  disabled?: boolean;
}

export const LocationSelector = ({
  level,
  defaultCountryCode,
  initialCountryCode,
  initialStateCode,
  initialCityCode,
  onLocationChange,
  onCountryChange,
  onStateChange,
  onCityChange,
  onCountryISOChange,
  placeholder = {},
  className,
  disabled = false
}: LocationSelectorProps) => {
  // Estados para controlar los popovers
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  // Hook de ubicaciones
  const {
    selected,
    countries,
    states,
    cities,
    selectCountry,
    selectState,
    selectCity,
    isLoading
  } = useCountryStateCity({
    initialCountryCode,
    initialStateCode,
    initialCityCode,
    enableFiltering: true,
    onLocationChange
  });

  // Ordenar países con el país por defecto primero
  const sortedCountries = React.useMemo(() => {
    if (!defaultCountryCode) return countries;
    
    const defaultCountry = countries.find(c => c.isoCode === defaultCountryCode);
    const otherCountries = countries.filter(c => c.isoCode !== defaultCountryCode);
    
    return defaultCountry ? [defaultCountry, ...otherCountries] : countries;
  }, [countries, defaultCountryCode]);

  // Efectos para callbacks individuales
  useEffect(() => {
    if (onCountryChange) {
      onCountryChange(selected.country);
    }
    if (onCountryISOChange) {
      onCountryISOChange(selected.country?.isoCode || null);
    }
  }, [selected.country, onCountryChange, onCountryISOChange]);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(selected.state);
    }
  }, [selected.state, onStateChange]);

  useEffect(() => {
    if (onCityChange) {
      onCityChange(selected.city);
    }
  }, [selected.city, onCityChange]);

  // Manejadores de selección
  const handleCountrySelect = (country: ICountry) => {
    selectCountry(country);
    setCountryOpen(false);
    // Resetear estados dependientes cuando cambia el país
    if (level !== 'country') {
      setStateOpen(false);
      setCityOpen(false);
    }
  };

  const handleStateSelect = (state: IState) => {
    selectState(state);
    setStateOpen(false);
    // Resetear ciudad cuando cambia el estado
    if (level === 'city') {
      setCityOpen(false);
    }
  };

  const handleCitySelect = (city: ICity) => {
    selectCity(city);
    setCityOpen(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selector de País */}
      <div className="space-y-2">
        <label className="text-sm font-medium">País *</label>
        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={countryOpen}
              className="w-full justify-between"
              disabled={disabled}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 opacity-50" />
                {selected.country ? (
                  <span>{selected.country.name}</span>
                ) : (
                  <span className="text-muted-foreground">
                    {placeholder.country || "Seleccionar país..."}
                  </span>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Buscar país..." />
              <CommandEmpty>No se encontró el país.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {sortedCountries.map((country) => (
                  <CommandItem
                    key={country.isoCode}
                    value={country.name}
                    onSelect={() => handleCountrySelect(country)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.country?.isoCode === country.isoCode
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {country.name}
                    {country.isoCode === defaultCountryCode && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Por defecto
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selector de Estado/Provincia */}
      {(level === 'state' || level === 'city') && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado/Provincia *</label>
          <Popover open={stateOpen} onOpenChange={setStateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={stateOpen}
                className="w-full justify-between"
                disabled={disabled || !selected.country}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 opacity-50" />
                  {selected.state ? (
                    <span>{selected.state.name}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      {!selected.country 
                        ? "Primero selecciona un país"
                        : placeholder.state || "Seleccionar estado..."
                      }
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar estado..." />
                <CommandEmpty>No se encontró el estado.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {states.map((state) => (
                    <CommandItem
                      key={state.isoCode}
                      value={state.name}
                      onSelect={() => handleStateSelect(state)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.state?.isoCode === state.isoCode
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {state.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Selector de Ciudad */}
      {level === 'city' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Ciudad *</label>
          <Popover open={cityOpen} onOpenChange={setCityOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={cityOpen}
                className="w-full justify-between"
                disabled={disabled || !selected.state}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 opacity-50" />
                  {selected.city ? (
                    <span>{selected.city.name}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      {!selected.state 
                        ? "Primero selecciona un estado"
                        : placeholder.city || "Seleccionar ciudad..."
                      }
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar ciudad..." />
                <CommandEmpty>No se encontró la ciudad.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {cities.map((city) => (
                    <CommandItem
                      key={`${city.stateCode}-${city.name}`}
                      value={city.name}
                      onSelect={() => handleCitySelect(city)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.city?.name === city.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {city.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Indicador de carga */}
      {isLoading && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          Cargando ubicaciones...
        </div>
      )}
    </div>
  );
}; 