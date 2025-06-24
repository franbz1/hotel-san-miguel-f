import { useState, useEffect, useCallback, useMemo } from 'react';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';

export interface SelectedLocation {
  country: ICountry | null;
  state: IState | null;
  city: ICity | null;
}

export interface LocationCodes {
  countryCode: string;
  stateCode: string;
  cityCode: string;
}

export interface UseCountryStateCityOptions {
  // Códigos iniciales para pre-seleccionar ubicaciones
  initialCountryCode?: string;
  initialStateCode?: string;
  initialCityCode?: string;
  // Permitir autocompletado/filtrado
  enableFiltering?: boolean;
  // Callback cuando cambia la selección completa
  onLocationChange?: (location: SelectedLocation) => void;
}

export interface UseCountryStateCityReturn {
  // Estados de selección
  selected: SelectedLocation;
  
  // Listas disponibles
  countries: ICountry[];
  states: IState[];
  cities: ICity[];
  
  // Listas filtradas (si enableFiltering está activo)
  filteredCountries: ICountry[];
  filteredStates: IState[];
  filteredCities: ICity[];
  
  // Funciones de selección
  selectCountry: (country: ICountry | null) => void;
  selectState: (state: IState | null) => void;
  selectCity: (city: ICity | null) => void;
  
  // Funciones de búsqueda/filtrado
  searchCountries: (query: string) => void;
  searchStates: (query: string) => void;
  searchCities: (query: string) => void;
  
  // Funciones de utilidad
  resetSelection: () => void;
  resetFromCountry: () => void;
  resetFromState: () => void;
  
  // Funciones para obtener por código
  getCountryByCode: (code: string) => ICountry | undefined;
  getStateByCode: (countryCode: string, stateCode: string) => IState | undefined;
  getCityByCode: (stateCode: string, cityCode: string) => ICity | undefined;
  
  // Estados de carga y validación
  isLoading: boolean;
  hasValidSelection: boolean;
  
  // Códigos de la selección actual
  currentCodes: LocationCodes;
}

export const useCountryStateCity = (
  options: UseCountryStateCityOptions = {}
): UseCountryStateCityReturn => {
  const {
    initialCountryCode,
    initialStateCode,
    initialCityCode,
    enableFiltering = false,
    onLocationChange
  } = options;

  // Estados principales
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

  // Estados para filtrado
  const [countryQuery, setCountryQuery] = useState('');
  const [stateQuery, setStateQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');

  // Estado de carga (reservado para futuras implementaciones async)
  const isLoading = false;

  // Listas base memoizadas
  const countries = useMemo(() => Country.getAllCountries(), []);
  
  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode);
  }, [selectedCountry]);

  const cities = useMemo(() => {
    if (!selectedState) return [];
    return City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode);
  }, [selectedState]);

  // Listas filtradas
  const filteredCountries = useMemo(() => {
    if (!enableFiltering || !countryQuery) return countries;
    return countries.filter(country =>
      country.name.toLowerCase().includes(countryQuery.toLowerCase())
    );
  }, [countries, countryQuery, enableFiltering]);

  const filteredStates = useMemo(() => {
    if (!enableFiltering || !stateQuery) return states;
    return states.filter(state =>
      state.name.toLowerCase().includes(stateQuery.toLowerCase())
    );
  }, [states, stateQuery, enableFiltering]);

  const filteredCities = useMemo(() => {
    if (!enableFiltering || !cityQuery) return cities;
    return cities.filter(city =>
      city.name.toLowerCase().includes(cityQuery.toLowerCase())
    );
  }, [cities, cityQuery, enableFiltering]);

  // Funciones de utilidad para obtener por código
  const getCountryByCode = useCallback((code: string): ICountry | undefined => {
    return countries.find(country => country.isoCode === code);
  }, [countries]);

  const getStateByCode = useCallback((countryCode: string, stateCode: string): IState | undefined => {
    const countryStates = State.getStatesOfCountry(countryCode);
    return countryStates.find(state => state.isoCode === stateCode);
  }, []);

  const getCityByCode = useCallback((stateCode: string, cityCode: string): ICity | undefined => {
    const stateCities = City.getCitiesOfState(selectedCountry?.isoCode || '', stateCode);
    return stateCities.find(city => city.name === cityCode);
  }, [selectedCountry]);

  // Funciones de selección
  const selectCountry = useCallback((country: ICountry | null) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    setStateQuery('');
    setCityQuery('');
  }, []);

  const selectState = useCallback((state: IState | null) => {
    setSelectedState(state);
    setSelectedCity(null);
    setCityQuery('');
  }, []);

  const selectCity = useCallback((city: ICity | null) => {
    setSelectedCity(city);
  }, []);

  // Funciones de búsqueda/filtrado
  const searchCountries = useCallback((query: string) => {
    setCountryQuery(query);
  }, []);

  const searchStates = useCallback((query: string) => {
    setStateQuery(query);
  }, []);

  const searchCities = useCallback((query: string) => {
    setCityQuery(query);
  }, []);

  // Funciones de reset
  const resetSelection = useCallback(() => {
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setCountryQuery('');
    setStateQuery('');
    setCityQuery('');
  }, []);

  const resetFromCountry = useCallback(() => {
    setSelectedState(null);
    setSelectedCity(null);
    setStateQuery('');
    setCityQuery('');
  }, []);

  const resetFromState = useCallback(() => {
    setSelectedCity(null);
    setCityQuery('');
  }, []);

  // Inicialización con códigos iniciales
  useEffect(() => {
    if (initialCountryCode && !selectedCountry) {
      const country = getCountryByCode(initialCountryCode);
      if (country) {
        setSelectedCountry(country);

        if (initialStateCode) {
          const state = getStateByCode(initialCountryCode, initialStateCode);
          if (state) {
            setSelectedState(state);

            if (initialCityCode) {
              const city = getCityByCode(initialStateCode, initialCityCode);
              if (city) {
                setSelectedCity(city);
              }
            }
          }
        }
      }
    }
  }, [initialCountryCode, initialStateCode, initialCityCode, getCountryByCode, getStateByCode, getCityByCode, selectedCountry]);

  // Callback cuando cambia la ubicación
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({
        country: selectedCountry,
        state: selectedState,
        city: selectedCity
      });
    }
  }, [selectedCountry, selectedState, selectedCity, onLocationChange]);

  // Códigos actuales
  const currentCodes = useMemo((): LocationCodes => ({
    countryCode: selectedCountry?.isoCode || '',
    stateCode: selectedState?.isoCode || '',
    cityCode: selectedCity?.name || ''
  }), [selectedCountry, selectedState, selectedCity]);

  // Validación de selección completa
  const hasValidSelection = useMemo(() => {
    return !!(selectedCountry && selectedState && selectedCity);
  }, [selectedCountry, selectedState, selectedCity]);

  return {
    // Estados de selección
    selected: {
      country: selectedCountry,
      state: selectedState,
      city: selectedCity
    },
    
    // Listas disponibles
    countries,
    states,
    cities,
    
    // Listas filtradas
    filteredCountries,
    filteredStates,
    filteredCities,
    
    // Funciones de selección
    selectCountry,
    selectState,
    selectCity,
    
    // Funciones de búsqueda/filtrado
    searchCountries,
    searchStates,
    searchCities,
    
    // Funciones de utilidad
    resetSelection,
    resetFromCountry,
    resetFromState,
    getCountryByCode,
    getStateByCode,
    getCityByCode,
    
    // Estados de carga y validación
    isLoading,
    hasValidSelection,
    
    // Códigos de la selección actual
    currentCodes
  };
}; 