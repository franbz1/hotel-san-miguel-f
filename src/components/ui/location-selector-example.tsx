"use client"

import React, { useState } from 'react';
import LocationSelector from './location-selector';
import { ICountry, IState, ICity } from 'country-state-city';
import { Level } from '@/hooks/formulario/locationPicker';

interface SelectionState {
  level: Level;
  country?: ICountry;
  state?: IState;
  city?: ICity;
}

const LocationSelectorExample: React.FC = () => {
  const [countrySelection, setCountrySelection] = useState<SelectionState | null>(null);
  const [stateSelection, setStateSelection] = useState<SelectionState | null>(null);
  const [citySelection, setCitySelection] = useState<SelectionState | null>(null);

  const handleCountryChange = (selection: {
    level: Level;
    country?: ICountry;
    state?: IState;
    city?: ICity;
  }) => {
    setCountrySelection(selection);
    console.log('Selección de país:', selection);
  };

  const handleStateChange = (selection: {
    level: Level;
    country?: ICountry;
    state?: IState;
    city?: ICity;
  }) => {
    setStateSelection(selection);
    console.log('Selección de estado:', selection);
  };

  const handleCityChange = (selection: {
    level: Level;
    country?: ICountry;
    state?: IState;
    city?: ICity;
  }) => {
    setCitySelection(selection);
    console.log('Selección de ciudad:', selection);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-6">
        Ejemplos de LocationSelector
      </h1>

      {/* Ejemplo 1: Solo País */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Ejemplo 1: Selector de País únicamente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LocationSelector
              maxLevel="country"
              onSelectionChange={handleCountryChange}
              placeholders={{
                country: 'Elige tu país'
              }}
            />
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Selección actual:</h3>
            <pre className="text-sm text-gray-600">
              {JSON.stringify(countrySelection, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Ejemplo 2: País + Estado */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Ejemplo 2: Selector de País y Estado
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LocationSelector
              maxLevel="state"
              onSelectionChange={handleStateChange}
              labels={{
                country: 'País de residencia',
                state: 'Departamento/Estado'
              }}
              defaultValues={{
                countryCode: 'CO' // Colombia por defecto
              }}
              size="sm"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Selección actual:</h3>
            <pre className="text-sm text-gray-600">
              {JSON.stringify(stateSelection, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Ejemplo 3: País + Estado + Ciudad */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Ejemplo 3: Selector Completo (País, Estado y Ciudad)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LocationSelector
              maxLevel="city"
              onSelectionChange={handleCityChange}
              labels={{
                country: 'País',
                state: 'Estado/Provincia',
                city: 'Ciudad de residencia'
              }}
              placeholders={{
                country: 'Seleccione su país',
                state: 'Seleccione su estado',
                city: 'Seleccione su ciudad'
              }}
              className="space-y-3"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Selección actual:</h3>
            <pre className="text-sm text-gray-600">
              {JSON.stringify(citySelection, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Ejemplo 4: Selector deshabilitado */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Ejemplo 4: Selector Deshabilitado
        </h2>
        <div className="w-full md:w-1/2">
          <LocationSelector
            maxLevel="state"
            disabled={true}
            defaultValues={{
              countryCode: 'US',
              stateCode: 'CA'
            }}
            labels={{
              country: 'País (deshabilitado)',
              state: 'Estado (deshabilitado)'
            }}
          />
        </div>
      </div>

            {/* Ejemplo 5: Con búsqueda habilitada */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Ejemplo 5: Con Búsqueda Habilitada
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LocationSelector
              maxLevel="city"
              searchable={true}
              onSelectionChange={(selection) => {
                console.log('Selección con búsqueda:', selection);
              }}
              labels={{
                country: 'País (con búsqueda)',
                state: 'Estado (con búsqueda)',
                city: 'Ciudad (con búsqueda)'
              }}
              searchPlaceholders={{
                country: 'Escriba para buscar país...',
                state: 'Escriba para buscar estado...',
                city: 'Escriba para buscar ciudad...'
              }}
            />
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Características:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Búsqueda en tiempo real</li>
              <li>• Filtrado inteligente</li>
              <li>• Navegación con teclado</li>
              <li>• Banderas de países</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ejemplo 6: Búsqueda selectiva por nivel */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Ejemplo 6: Búsqueda Selectiva por Nivel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LocationSelector
              maxLevel="city"
              searchable={{
                country: true,  // Solo país con búsqueda
                state: false,   // Estado sin búsqueda
                city: true      // Solo ciudad con búsqueda
              }}
              onSelectionChange={(selection) => {
                console.log('Selección mixta:', selection);
              }}
              labels={{
                country: 'País (con búsqueda)',
                state: 'Estado (selector normal)',
                city: 'Ciudad (con búsqueda)'
              }}
              defaultValues={{
                countryCode: 'US'
              }}
            />
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Configuración mixta:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• País: con búsqueda ✓</li>
              <li>• Estado: selector normal</li>
              <li>• Ciudad: con búsqueda ✓</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Información de uso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-blue-800">
          Instrucciones de Uso
        </h2>
        <div className="text-blue-700 space-y-2">
          <p><strong>maxLevel:</strong> Define la profundidad máxima del selector</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code>&quot;country&quot;</code>: Solo muestra selector de país</li>
            <li><code>&quot;state&quot;</code>: Muestra país y estado</li>
            <li><code>&quot;city&quot;</code>: Muestra país, estado y ciudad</li>
          </ul>
          <p><strong>searchable:</strong> Habilita búsqueda (boolean o objeto por nivel)</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code>true/false</code>: Habilita/deshabilita para todos los niveles</li>
            <li><code>{`{country: true, state: false, city: true}`}</code>: Configuración por nivel</li>
          </ul>
          <p><strong>onSelectionChange:</strong> Callback que se ejecuta cada vez que cambia la selección</p>
          <p><strong>defaultValues:</strong> Valores iniciales para preseleccionar opciones</p>
          <p><strong>labels/placeholders:</strong> Textos personalizables para cada selector</p>
          <p><strong>searchPlaceholders:</strong> Textos de búsqueda personalizables</p>
        </div>
      </div>
    </div>
  );
};

export default LocationSelectorExample; 