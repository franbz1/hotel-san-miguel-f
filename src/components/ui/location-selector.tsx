"use client";

import * as React from "react";
import { ChevronDown, MapPin, Globe, Building, Navigation } from "lucide-react";
import { cn } from "@/lib/common/utils";
import { useLocationPicker, Level } from "@/hooks/formulario/locationPicker";
import type { ICountry, IState, ICity } from "country-state-city";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LocationSelectorProps {
  /** Nivel inicial del selector */
  initialLevel?: Level;
  /** Valores iniciales para precargar el componente */
  initialValues?: {
    countryCode?: string;    // ISO code del país (ej: "CO", "US")
    stateCode?: string;      // ISO code del estado (ej: "ANT", "CA")
    cityName?: string;       // Nombre de la ciudad (ej: "Medellín")
  };
  /** Placeholder personalizado */
  placeholder?: string;
  /** Clase CSS adicional */
  className?: string;
  /** Si está deshabilitado */
  disabled?: boolean;
  /** Callback cuando cambia la selección */
  onSelectionChange?: (selection: {
    level: Level;
    country?: ICountry;
    state?: IState;
    city?: ICity;
  }) => void;
  /** @deprecated Use initialValues.countryCode instead */
  defaultCountry?: string;
  /** @deprecated Use initialValues.stateCode instead */
  defaultState?: string;
  /** @deprecated Use initialValues.cityName instead */
  defaultCity?: string;
}

export function LocationSelector({
  initialLevel = "country",
  initialValues,
  placeholder = "Seleccionar ubicación...",
  className,
  disabled = false,
  onSelectionChange,
  // Props deprecated para retrocompatibilidad
  defaultCountry,
  defaultState,
  defaultCity,
}: LocationSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Consolidar valores iniciales con retrocompatibilidad
  const consolidatedInitialValues = React.useMemo(() => {
    return {
      countryCode: initialValues?.countryCode || defaultCountry || "",
      stateCode: initialValues?.stateCode || defaultState || "",
      cityName: initialValues?.cityName || defaultCity || "",
    };
  }, [initialValues, defaultCountry, defaultState, defaultCity]);

  const {
    level,
    setLevel,
    countries,
    states,
    cities,
    selectedCountry,
    setSelectedCountry,
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    clearSelection,
    // clearFromLevel, // No usado actualmente
  } = useLocationPicker({
    initialLevel,
    initialValues: consolidatedInitialValues,
    onChange: onSelectionChange,
  });

  // Obtener los elementos filtrados según la búsqueda
  const getFilteredItems = () => {
    const search = searchValue.toLowerCase();
    
    switch (level) {
      case "country":
        return countries.filter((country) =>
          country.name.toLowerCase().includes(search)
        );
      case "state":
        return states.filter((state) =>
          state.name.toLowerCase().includes(search)
        );
      case "city":
        return cities.filter((city) =>
          city.name.toLowerCase().includes(search)
        );
      default:
        return [];
    }
  };

  // Obtener el texto que se muestra en el trigger
  const getDisplayText = () => {
    const parts = [];
    
    if (selectedCountry) {
      const country = countries.find((c) => c.isoCode === selectedCountry);
      if (country) parts.push(country.name);
    }
    
    if (selectedState && level !== "country") {
      const state = states.find((s) => s.isoCode === selectedState);
      if (state) parts.push(state.name);
    }
    
    if (selectedCity && level === "city") {
      const city = cities.find((c) => c.name === selectedCity);
      if (city) parts.push(city.name);
    }
    
    return parts.length > 0 ? parts.join(", ") : placeholder;
  };

  // Manejar selección de elemento
  const handleSelect = (item: ICountry | IState | ICity) => {
    switch (level) {
      case "country":
        const country = item as ICountry;
        setSelectedCountry(country.isoCode);
        if (states.length > 0) {
          setLevel("state");
        }
        break;
      case "state":
        const state = item as IState;
        setSelectedState(state.isoCode);
        if (cities.length > 0) {
          setLevel("city");
        }
        break;
      case "city":
        const city = item as ICity;
        setSelectedCity(city.name);
        setOpen(false);
        break;
    }
    setSearchValue("");
  };

  // Obtener icono según el nivel actual
  const getLevelIcon = () => {
    switch (level) {
      case "country":
        return <Globe className="h-4 w-4" />;
      case "state":
        return <Building className="h-4 w-4" />;
      case "city":
        return <Navigation className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  // Obtener título del nivel actual
  const getLevelTitle = () => {
    switch (level) {
      case "country":
        return "Seleccionar País";
      case "state":
        return "Seleccionar Estado/Provincia";
      case "city":
        return "Seleccionar Ciudad";
      default:
        return "Seleccionar Ubicación";
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !selectedCountry && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{getDisplayText()}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Buscar ${level === "country" ? "país" : level === "state" ? "estado" : "ciudad"}...`}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup heading={getLevelTitle()}>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={level === "country" ? (item as ICountry).isoCode 
                        : level === "state" ? (item as IState).isoCode 
                        : (item as ICity).name}
                    value={item.name}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-2"
                  >
                    {getLevelIcon()}
                    <span>{item.name}</span>
                    {level === "state" && (
                      <span className="text-muted-foreground text-xs ml-auto">
                        {(item as IState).countryCode}
                      </span>
                    )}
                    {level === "city" && (
                      <span className="text-muted-foreground text-xs ml-auto">
                        {(item as ICity).stateCode}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          
          {/* Navegación de niveles */}
          <div className="border-t p-2">
            <div className="flex gap-1 justify-between">
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLevel("country")}
                  disabled={level === "country"}
                  className="flex items-center gap-1 text-xs"
                >
                  <Globe className="h-3 w-3" />
                  País
                </Button>
                {selectedCountry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLevel("state")}
                    disabled={level === "state" || states.length === 0}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Building className="h-3 w-3" />
                    Estado
                  </Button>
                )}
                {selectedState && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLevel("city")}
                    disabled={level === "city" || cities.length === 0}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Navigation className="h-3 w-3" />
                    Ciudad
                  </Button>
                )}
              </div>
              
              {/* Botón para limpiar selección */}
              {(selectedCountry || selectedState || selectedCity) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 