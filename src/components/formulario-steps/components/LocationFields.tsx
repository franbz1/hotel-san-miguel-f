import { ICountry, IState, ICity } from "country-state-city";
import { Path, UseFormReturn } from "react-hook-form";
import { CountrySelector } from "./CountrySelector";
import { StateSelector } from "./StateSelector";
import { CitySelector } from "./CitySelector";

interface LocationFieldsProps<TFieldValues extends Record<string, unknown>> {
  form: UseFormReturn<TFieldValues>;
  countries: ICountry[];
  states: IState[];
  cities: ICity[];
  countryCodeName: Path<TFieldValues>;
  stateCodeName: Path<TFieldValues>;
  cityName: Path<TFieldValues>;
  countryLabel: string;
  stateLabel: string;
  cityLabel: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const LocationFields = <TFieldValues extends Record<string, unknown>>({
  form,
  countries,
  states,
  cities,
  countryCodeName,
  stateCodeName,
  cityName,
  countryLabel,
  stateLabel,
  cityLabel,
  onCountryChange,
  onStateChange,
  onCityChange,
  disabled = false,
  className
}: LocationFieldsProps<TFieldValues>) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className || ''}`}>
      <CountrySelector
        form={form}
        name={countryCodeName}
        label={countryLabel}
        countries={countries}
        onCountryChange={onCountryChange}
        disabled={disabled}
      />
      
      <StateSelector
        form={form}
        name={stateCodeName}
        label={stateLabel}
        states={states}
        onStateChange={onStateChange}
        disabled={disabled || !form.watch(countryCodeName)}
      />
      
      <CitySelector
        form={form}
        name={cityName}
        label={cityLabel}
        cities={cities}
        onCityChange={onCityChange}
        disabled={disabled || !form.watch(stateCodeName)}
      />
    </div>
  );
}; 