"use client"

import React from 'react';
import { 
  useLocationPicker, 
  Level 
} from '@/hooks/formulario/locationPicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { ICountry, IState, ICity } from 'country-state-city';

export interface LocationSelectorProps {
  /** Nivel máximo de profundidad: 'country', 'state' o 'city' */
  maxLevel: Level;
  
  /** Valores iniciales */
  defaultValues?: {
    countryCode?: string;
    stateCode?: string;
    cityName?: string;
  };
  
  /** Callback cuando cambia la selección */
  onSelectionChange?: (selection: {
    level: Level;
    country?: ICountry;
    state?: IState;
    city?: ICity;
  }) => void;
  
  /** Textos personalizables */
  labels?: {
    country?: string;
    state?: string;
    city?: string;
  };
  
  /** Placeholders personalizables */
  placeholders?: {
    country?: string;
    state?: string;
    city?: string;
  };
  
  /** Textos de búsqueda personalizables */
  searchPlaceholders?: {
    country?: string;
    state?: string;
    city?: string;
  };
  
  /** Habilitar búsqueda */
  searchable?: boolean | {
    country?: boolean;
    state?: boolean;
    city?: boolean;
  };
  
  /** Deshabilitado */
  disabled?: boolean;
  
  /** Tamaño de los selects */
  size?: "sm" | "default";
  
  /** Clases CSS adicionales */
  className?: string;
  
  /** IDs base para generar IDs únicos para cada selector */
  idPrefix?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  maxLevel,
  defaultValues,
  onSelectionChange,
  labels = {
    country: 'País',
    state: 'Estado/Provincia',
    city: 'Ciudad'
  },
  placeholders = {
    country: 'Selecciona un país',
    state: 'Selecciona un estado',
    city: 'Selecciona una ciudad'
  },
  searchPlaceholders = {
    country: 'Buscar país...',
    state: 'Buscar estado...',
    city: 'Buscar ciudad...'
  },
  searchable = false,
  disabled = false,
  size = "default",
  className = "",
  idPrefix = "location"
}) => {
  const {
    countries,
    states,
    cities,
    selectedCountry,
    setSelectedCountry,
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
  } = useLocationPicker({
    initialLevel: 'country',
    initialValues: defaultValues,
    onChange: onSelectionChange,
  });

  // Estados para controlar la apertura de los popovers de búsqueda
  const [countryOpen, setCountryOpen] = React.useState(false);
  const [stateOpen, setStateOpen] = React.useState(false);
  const [cityOpen, setCityOpen] = React.useState(false);

  // Determinar qué selectores mostrar según el maxLevel
  const showCountrySelect = maxLevel === 'country' || maxLevel === 'state' || maxLevel === 'city';
  const showStateSelect = (maxLevel === 'state' || maxLevel === 'city') && selectedCountry;
  const showCitySelect = maxLevel === 'city' && selectedCountry && selectedState;

  // Generar IDs únicos para cada selector
  const countryId = `${idPrefix}-country`;
  const stateId = `${idPrefix}-state`;
  const cityId = `${idPrefix}-city`;

  // Determinar si usar búsqueda para cada nivel
  const isSearchableConfig = typeof searchable === 'object' ? searchable : { country: searchable, state: searchable, city: searchable };
  const isCountrySearchable = isSearchableConfig.country ?? false;
  const isStateSearchable = isSearchableConfig.state ?? false;
  const isCitySearchable = isSearchableConfig.city ?? false;

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setCountryOpen(false);
  };

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    setStateOpen(false);
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    setCityOpen(false);
  };

  // Componente SearchableSelector para búsqueda
  interface SearchableSelectorProps {
    items: Array<{ code: string; name: string; flag?: string }>;
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    searchPlaceholder: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    disabled?: boolean;
    emptyMessage?: string;
    id?: string;
  }

  const SearchableSelector: React.FC<SearchableSelectorProps> = ({
    items,
    value,
    onValueChange,
    placeholder,
    searchPlaceholder,
    open,
    onOpenChange,
    disabled = false,
    emptyMessage = "No se encontraron resultados",
    id
  }) => {
    const selectedItem = items.find(item => item.code === value);

    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${size === "sm" ? "h-8" : "h-9"}`}
            disabled={disabled}
          >
            {selectedItem ? (
              <span className="flex items-center gap-2">
                {selectedItem.flag && <span className="text-lg">{selectedItem.flag}</span>}
                {selectedItem.name}
              </span>
            ) : (
              placeholder
            )}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.code}
                    value={item.name}
                    onSelect={() => onValueChange(item.code)}
                  >
                    <CheckIcon
                      className={`mr-2 h-4 w-4 ${
                        value === item.code ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span className="flex items-center gap-2">
                      {item.flag && <span className="text-lg">{item.flag}</span>}
                      {item.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selector de País */}
      {showCountrySelect && (
        <div className="space-y-2">
          <label htmlFor={countryId} className="text-sm font-medium text-gray-700">
            {labels.country}
          </label>
          {isCountrySearchable ? (
            <SearchableSelector
              items={countries.map(country => ({
                code: country.isoCode,
                name: country.name,
                flag: country.flag
              }))}
              value={selectedCountry}
              onValueChange={handleCountryChange}
              placeholder={placeholders.country!}
              searchPlaceholder={searchPlaceholders.country!}
              open={countryOpen}
              onOpenChange={setCountryOpen}
              disabled={disabled}
              emptyMessage="No se encontraron países"
              id={countryId}
            />
          ) : (
            <Select
              value={selectedCountry}
              onValueChange={handleCountryChange}
              disabled={disabled}
            >
              <SelectTrigger id={countryId} size={size} className="w-full">
                <SelectValue placeholder={placeholders.country} />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem 
                    key={country.isoCode} 
                    value={country.isoCode}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      {country.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Selector de Estado */}
      {showStateSelect && (
        <div className="space-y-2">
          <label htmlFor={stateId} className="text-sm font-medium text-gray-700">
            {labels.state}
          </label>
          {isStateSearchable ? (
            <SearchableSelector
              items={states.map(state => ({
                code: state.isoCode,
                name: state.name
              }))}
              value={selectedState}
              onValueChange={handleStateChange}
              placeholder={placeholders.state!}
              searchPlaceholder={searchPlaceholders.state!}
              open={stateOpen}
              onOpenChange={setStateOpen}
              disabled={disabled || !selectedCountry}
              emptyMessage="No se encontraron estados"
              id={stateId}
            />
          ) : (
            <Select
              value={selectedState}
              onValueChange={handleStateChange}
              disabled={disabled || !selectedCountry}
            >
              <SelectTrigger id={stateId} size={size} className="w-full">
                <SelectValue placeholder={placeholders.state} />
              </SelectTrigger>
              <SelectContent>
                {states.length === 0 ? (
                  <SelectItem value="" disabled>
                    No hay estados disponibles
                  </SelectItem>
                ) : (
                  states.map((state) => (
                    <SelectItem 
                      key={`${state.countryCode}-${state.isoCode}`} 
                      value={state.isoCode}
                    >
                      {state.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Selector de Ciudad */}
      {showCitySelect && (
        <div className="space-y-2">
          <label htmlFor={cityId} className="text-sm font-medium text-gray-700">
            {labels.city}
          </label>
          {isCitySearchable ? (
            <SearchableSelector
              items={cities.map(city => ({
                code: city.name,
                name: city.name
              }))}
              value={selectedCity}
              onValueChange={handleCityChange}
              placeholder={placeholders.city!}
              searchPlaceholder={searchPlaceholders.city!}
              open={cityOpen}
              onOpenChange={setCityOpen}
              disabled={disabled || !selectedCountry || !selectedState}
              emptyMessage="No se encontraron ciudades"
              id={cityId}
            />
          ) : (
            <Select
              value={selectedCity}
              onValueChange={handleCityChange}
              disabled={disabled || !selectedCountry || !selectedState}
            >
              <SelectTrigger id={cityId} size={size} className="w-full">
                <SelectValue placeholder={placeholders.city} />
              </SelectTrigger>
              <SelectContent>
                {cities.length === 0 ? (
                  <SelectItem value="" disabled>
                    No hay ciudades disponibles
                  </SelectItem>
                ) : (
                  cities.map((city) => (
                    <SelectItem 
                      key={`${city.countryCode}-${city.stateCode}-${city.name}`} 
                      value={city.name}
                    >
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
