'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Check, ChevronsUpDown, Phone } from 'lucide-react';
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
import { COUNTRY_CODES } from '@/lib/common/constants/codigosPais';

export interface CountryCode {
  name: string;
  dial_code: string;
  code: string;
}

export interface CountryCodeSelectorProps {
  // Código de país por defecto (ej: "CO" para Colombia)
  defaultCountryCode?: string;
  
  // Código de marcado por defecto (ej: "+57" para Colombia) - tiene prioridad sobre defaultCountryCode
  defaultDialCode?: string;
  
  // Valor inicial seleccionado por código ISO
  initialCountryCode?: string;
  
  // Valor inicial seleccionado por código de marcado (tiene prioridad sobre initialCountryCode)
  initialDialCode?: string;
  
  // Valor controlado externamente (puede ser código ISO o dial code)
  value?: string;
  
  // Callback cuando cambia la selección
  onCountryCodeChange?: (countryCode: CountryCode | null) => void;
  
  // Placeholder personalizado
  placeholder?: string;
  
  // Clases CSS
  className?: string;
  
  // Deshabilitado
  disabled?: boolean;
  
  // Mostrar solo el código o incluir el nombre del país
  displayMode?: 'code-only' | 'code-with-name' | 'name-with-code';
  
  // ID para asociar con un label
  id?: string;
}

export const CountryCodeSelector = ({
  defaultCountryCode,
  defaultDialCode,
  initialCountryCode,
  initialDialCode,
  value,
  onCountryCodeChange,
  placeholder = "Seleccionar código...",
  className,
  disabled = false,
  displayMode = 'code-with-name',
  id
}: CountryCodeSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  // Función helper para buscar país por código ISO o dial code
  const findCountryByCodeOrDialCode = (code: string): CountryCode | null => {
    // Primero intentar buscar por dial code (si empieza con +)
    if (code.startsWith('+')) {
      return COUNTRY_CODES.find(c => c.dial_code === code) || null;
    }
    // Si no es dial code, buscar por código ISO
    return COUNTRY_CODES.find(c => c.code === code) || null;
  };
  
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(() => {
    // Priorizar dialCode sobre countryCode
    if (initialDialCode) {
      return findCountryByCodeOrDialCode(initialDialCode);
    }
    if (initialCountryCode) {
      return findCountryByCodeOrDialCode(initialCountryCode);
    }
    return null;
  });

  // Ordenar países con el país por defecto primero
  const sortedCountries = useMemo(() => {
    // Priorizar defaultDialCode sobre defaultCountryCode
    let defaultCountry: CountryCode | undefined;
    
    if (defaultDialCode) {
      defaultCountry = COUNTRY_CODES.find(c => c.dial_code === defaultDialCode);
    } else if (defaultCountryCode) {
      defaultCountry = COUNTRY_CODES.find(c => c.code === defaultCountryCode);
    }
    
    if (defaultCountry) {
      const otherCountries = COUNTRY_CODES.filter(c => c.code !== defaultCountry!.code);
      return [defaultCountry, ...otherCountries];
    }
    
    return COUNTRY_CODES;
  }, [defaultCountryCode, defaultDialCode]);

  // Sincronizar con valor externo (para control desde fuera del componente)
  useEffect(() => {
    if (value && value !== selectedCountry?.code && value !== selectedCountry?.dial_code) {
      const country = findCountryByCodeOrDialCode(value);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [value, selectedCountry?.code, selectedCountry?.dial_code]);

  // Manejar selección
  const handleSelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setOpen(false);
    if (onCountryCodeChange) {
      onCountryCodeChange(country);
    }
  };

  // Función para formatear el display del país seleccionado
  const getDisplayText = (country: CountryCode | null) => {
    if (!country) return placeholder;
    
    switch (displayMode) {
      case 'code-only':
        return country.dial_code;
      case 'name-with-code':
        return `${country.name} (${country.dial_code})`;
      case 'code-with-name':
      default:
        return `${country.dial_code} ${country.name}`;
    }
  };

  // Función helper para determinar si un país es el por defecto
  const isDefaultCountry = (country: CountryCode): boolean => {
    if (defaultDialCode) {
      return country.dial_code === defaultDialCode;
    }
    return country.code === defaultCountryCode;
  };


  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 opacity-50" />
              <span className={cn(
                "truncate",
                !selectedCountry && "text-muted-foreground"
              )}>
                {getDisplayText(selectedCountry)}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar país o código..." />
            <CommandEmpty>No se encontró el código de país.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {sortedCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.dial_code} ${country.code}`}
                  onSelect={() => handleSelect(country)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCountry?.code === country.code
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-mono font-medium text-primary">
                      {country.dial_code}
                    </span>
                    <span className="truncate">
                      {country.name}
                    </span>
                    {isDefaultCountry(country) && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Por defecto
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Hook personalizado para usar con react-hook-form
export const useCountryCodeSelector = (
  defaultCountryCode?: string,
  defaultDialCode?: string, // Nuevo parámetro para dial code por defecto
  onCodeChange?: (dialCode: string, countryCode: string) => void
) => {
  // Función helper para buscar país por código ISO o dial code
  const findCountryByCodeOrDialCode = (code: string): CountryCode | null => {
    // Primero intentar buscar por dial code (si empieza con +)
    if (code.startsWith('+')) {
      return COUNTRY_CODES.find(c => c.dial_code === code) || null;
    }
    // Si no es dial code, buscar por código ISO
    return COUNTRY_CODES.find(c => c.code === code) || null;
  };

  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(() => {
    // Priorizar defaultDialCode sobre defaultCountryCode
    if (defaultDialCode) {
      return findCountryByCodeOrDialCode(defaultDialCode);
    }
    if (defaultCountryCode) {
      return findCountryByCodeOrDialCode(defaultCountryCode);
    }
    return null;
  });

  const handleCountryCodeChange = (country: CountryCode | null) => {
    setSelectedCountry(country);
    if (country && onCodeChange) {
      onCodeChange(country.dial_code, country.code);
    }
  };

  const setCountryByCode = (countryCode: string) => {
    const country = findCountryByCodeOrDialCode(countryCode);
    if (country) {
      setSelectedCountry(country);
      if (onCodeChange) {
        onCodeChange(country.dial_code, country.code);
      }
    }
  };

  // Nueva función para configurar por dial code específicamente
  const setCountryByDialCode = (dialCode: string) => {
    const country = COUNTRY_CODES.find(c => c.dial_code === dialCode);
    if (country) {
      setSelectedCountry(country);
      if (onCodeChange) {
        onCodeChange(country.dial_code, country.code);
      }
    }
  };

  return {
    selectedCountry,
    handleCountryCodeChange,
    setCountryByCode, // Maneja tanto ISO como dial codes
    setCountryByDialCode, // Específico para dial codes
    dialCode: selectedCountry?.dial_code || '',
    countryCode: selectedCountry?.code || ''
  };
}; 