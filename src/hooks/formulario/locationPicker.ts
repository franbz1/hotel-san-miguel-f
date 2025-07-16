import { useState, useEffect, useCallback, useRef } from 'react';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';

export type Level = 'country' | 'state' | 'city';

export interface UseLocationPickerParams {
  /** Nivel inicial */
  initialLevel?: Level;
  /** Valores iniciales */
  initialValues?: {
    countryCode?: string;    // ISO code del país
    stateCode?: string;      // ISO code del estado
    cityName?: string;       // Nombre de la ciudad
  };
  /** Callback en cada cambio de selección */
  onChange?: (selection: {
    level: Level;
    country?: ICountry;
    state?: IState;
    city?: ICity;
  }) => void;
}

export interface UseLocationPickerResult {
  level: Level;
  setLevel: (lvl: Level) => void;

  countries: ICountry[];
  states: IState[];
  cities: ICity[];

  selectedCountry: string;
  setSelectedCountry: (code: string) => void;

  selectedState: string;
  setSelectedState: (code: string) => void;

  selectedCity: string;
  setSelectedCity: (name: string) => void;

  // Métodos para limpiar selecciones
  clearSelection: () => void;
  clearFromLevel: (fromLevel: Level) => void;
}

export function useLocationPicker({
  initialLevel = 'country',
  initialValues,
  onChange,
}: UseLocationPickerParams = {}): UseLocationPickerResult {
  const [level, setLevel] = useState<Level>(initialLevel);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [selectedCountry, setSelectedCountry] = useState(initialValues?.countryCode || '');
  const [selectedState, setSelectedState] = useState(initialValues?.stateCode || '');
  const [selectedCity, setSelectedCity] = useState(initialValues?.cityName || '');

  // Ref para saber si es la primera carga
  const isInitialLoad = useRef(true);

  // Cargo países una sola vez
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Cuando cambia país → recargo estados, limpio selección inferior
  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
      
      // Solo limpiar en cambios posteriores, no en carga inicial
      if (!isInitialLoad.current) {
        setSelectedState('');
        setCities([]);
        setSelectedCity('');
      }
    } else {
      setStates([]);
      setSelectedState('');
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedCountry]);

  // Cuando cambia estado → recargo ciudades, limpio ciudad
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(stateCities);
      
      // Solo limpiar en cambios posteriores, no en carga inicial
      if (!isInitialLoad.current) {
        setSelectedCity('');
      }
    } else {
      setCities([]);
      if (!isInitialLoad.current) {
        setSelectedCity('');
      }
    }
  }, [selectedState, selectedCountry]);

  // Establecer nivel inicial basado en valores iniciales (solo una vez)
  useEffect(() => {
    if (initialValues && isInitialLoad.current) {
      if (initialValues.cityName && initialValues.stateCode && initialValues.countryCode) {
        setLevel('city');
      } else if (initialValues.stateCode && initialValues.countryCode) {
        setLevel('state');
      } else if (initialValues.countryCode) {
        setLevel('country');
      }
    }
  }, []); // Sin dependencias para que solo se ejecute una vez

  // Marcar que ya no es carga inicial después de que se carguen los países
  useEffect(() => {
    if (countries.length > 0 && isInitialLoad.current) {
      // Pequeño delay para permitir que se configuren los valores iniciales
      const timer = setTimeout(() => {
        isInitialLoad.current = false;
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [countries.length]);

  // Callback de cambios - optimizado con useCallback
  const notifyChange = useCallback(() => {
    if (!onChange || isInitialLoad.current) return;

    const countryObj = countries.find(c => c.isoCode === selectedCountry);
    const stateObj = states.find(s => s.isoCode === selectedState);
    const cityObj = cities.find(c => c.name === selectedCity && c.stateCode === selectedState);

    onChange({
      level,
      country: countryObj,
      state: stateObj,
      city: cityObj,
    });
  }, [level, selectedCountry, selectedState, selectedCity, countries, states, cities, onChange]);

  // Ejecutar callback cuando cambian las selecciones
  useEffect(() => {
    notifyChange();
  }, [notifyChange]);

  // Métodos auxiliares
  const clearSelection = useCallback(() => {
    setSelectedCountry('');
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);
    setLevel('country');
  }, []);

  const clearFromLevel = useCallback((fromLevel: Level) => {
    switch (fromLevel) {
      case 'country':
        setSelectedCountry('');
        setSelectedState('');
        setSelectedCity('');
        setStates([]);
        setCities([]);
        setLevel('country');
        break;
      case 'state':
        setSelectedState('');
        setSelectedCity('');
        setCities([]);
        setLevel('state');
        break;
      case 'city':
        setSelectedCity('');
        setLevel('city');
        break;
    }
  }, []);

  return {
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
    clearFromLevel,
  };
}
