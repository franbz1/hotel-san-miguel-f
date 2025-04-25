import { useEffect, useState } from "react";
import { Country, State, City, ICountry, IState, ICity } from "country-state-city";
import { UseFormReturn } from "react-hook-form";

interface UseCountrySelectionProps {
  form: UseFormReturn<any>;
  defaultCountryCode?: string;
}

export const useCountrySelection = ({ 
  form, 
  defaultCountryCode = 'CO' 
}: UseCountrySelectionProps) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [residenciaStates, setResidenciaStates] = useState<IState[]>([]);
  const [residenciaCities, setResidenciaCities] = useState<ICity[]>([]);
  const [procedenciaStates, setProcedenciaStates] = useState<IState[]>([]);
  const [procedenciaCities, setProcedenciaCities] = useState<ICity[]>([]);

  // Cargar países al iniciar con Colombia primero
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    
    // Ordenar para que Colombia (o el país por defecto) aparezca primero
    const defaultCountry = allCountries.find(country => country.isoCode === defaultCountryCode);
    let sortedCountries = [...allCountries];
    
    if (defaultCountry) {
      sortedCountries = [
        defaultCountry,
        ...allCountries.filter(country => country.isoCode !== defaultCountryCode)
      ];
    }
    
    setCountries(sortedCountries);
  }, [defaultCountryCode]);

  // Actualizar estados/departamentos cuando cambia el país de residencia
  useEffect(() => {
    const paisCode = form.watch('pais_residencia_code');
    if (paisCode) {
      const states = State.getStatesOfCountry(paisCode);
      setResidenciaStates(states);
      // Limpiar ciudades al cambiar el país
      setResidenciaCities([]);
      form.setValue('ciudad_residencia', '');
      form.setValue('ciudad_residencia_code', '');
    }
  }, [form.watch('pais_residencia_code')]);

  // Actualizar estados/departamentos cuando cambia el país de procedencia
  useEffect(() => {
    const paisCode = form.watch('pais_procedencia_code');
    if (paisCode) {
      const states = State.getStatesOfCountry(paisCode);
      setProcedenciaStates(states);
      // Limpiar ciudades al cambiar el país
      setProcedenciaCities([]);
      form.setValue('ciudad_procedencia', '');
      form.setValue('ciudad_procedencia_code', '');
    }
  }, [form.watch('pais_procedencia_code')]);

  // Actualizar ciudades cuando cambia el estado/departamento de residencia
  useEffect(() => {
    const paisCode = form.watch('pais_residencia_code');
    const stateCode = form.watch('ciudad_residencia_code');
    if (paisCode && stateCode) {
      const cities = City.getCitiesOfState(paisCode, stateCode);
      setResidenciaCities(cities);
    }
  }, [form.watch('ciudad_residencia_code')]);

  // Actualizar ciudades cuando cambia el estado/departamento de procedencia
  useEffect(() => {
    const paisCode = form.watch('pais_procedencia_code');
    const stateCode = form.watch('ciudad_procedencia_code');
    if (paisCode && stateCode) {
      const cities = City.getCitiesOfState(paisCode, stateCode);
      setProcedenciaCities(cities);
    }
  }, [form.watch('ciudad_procedencia_code')]);

  // Funciones para manejar cambios de ubicación
  const handleCountryResidenciaChange = (countryCode: string) => {
    const selectedCountry = countries.find(c => c.isoCode === countryCode);
    if (selectedCountry) {
      form.setValue('pais_residencia', selectedCountry.name);
      form.setValue('pais_residencia_code', selectedCountry.isoCode);
    }
  };

  const handleStateResidenciaChange = (stateCode: string) => {
    const selectedState = residenciaStates.find(s => s.isoCode === stateCode);
    if (selectedState) {
      form.setValue('ciudad_residencia', selectedState.name);
      form.setValue('ciudad_residencia_code', selectedState.isoCode);
    }
  };

  const handleCityResidenciaChange = (cityName: string) => {
    form.setValue('ciudad_residencia', cityName);
  };

  const handleCountryProcedenciaChange = (countryCode: string) => {
    const selectedCountry = countries.find(c => c.isoCode === countryCode);
    if (selectedCountry) {
      form.setValue('pais_procedencia', selectedCountry.name);
      form.setValue('pais_procedencia_code', selectedCountry.isoCode);
    }
  };

  const handleStateProcedenciaChange = (stateCode: string) => {
    const selectedState = procedenciaStates.find(s => s.isoCode === stateCode);
    if (selectedState) {
      form.setValue('ciudad_procedencia', selectedState.name);
      form.setValue('ciudad_procedencia_code', selectedState.isoCode);
    }
  };

  const handleCityProcedenciaChange = (cityName: string) => {
    form.setValue('ciudad_procedencia', cityName);
  };

  const handleNacionalidadChange = (countryCode: string) => {
    const selectedCountry = countries.find(c => c.isoCode === countryCode);
    if (selectedCountry) {
      form.setValue('nacionalidad', selectedCountry.name);
      form.setValue('nacionalidad_code', selectedCountry.isoCode);
    }
  };

  // Buscar código de país por nombre (útil al editar datos)
  const findCountryCodeByName = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    return country?.isoCode || "";
  };

  return {
    countries,
    residenciaStates,
    residenciaCities,
    procedenciaStates,
    procedenciaCities,
    handleCountryResidenciaChange,
    handleStateResidenciaChange,
    handleCityResidenciaChange,
    handleCountryProcedenciaChange,
    handleStateProcedenciaChange,
    handleCityProcedenciaChange,
    handleNacionalidadChange,
    findCountryCodeByName
  };
}; 