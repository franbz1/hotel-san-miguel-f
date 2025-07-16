"use client";

import { useState } from "react";
import { LocationSelector } from "./location-selector";
import type { ICountry, IState, ICity } from "country-state-city";
import { Level } from "@/hooks/formulario/locationPicker";

export function LocationSelectorExample() {
  const [selectedLocation, setSelectedLocation] = useState<{
    level: Level;
    country?: ICountry;
    state?: IState;
    city?: ICity;
  } | null>(null);

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Selector de Ubicación</h2>
        <p className="text-muted-foreground">
          Ejemplos de uso del componente LocationSelector con diferentes configuraciones.
        </p>
      </div>

      {/* Ejemplo básico */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ejemplo básico</h3>
        <LocationSelector
          placeholder="Selecciona tu ubicación..."
          onSelectionChange={(selection) => {
            console.log("Ubicación seleccionada:", selection);
            setSelectedLocation(selection);
          }}
        />
      </div>

      {/* Ejemplo con valores iniciales completos usando ISO codes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Con valores iniciales completos (ISO)</h3>
        <p className="text-sm text-muted-foreground">
          País: CO (Colombia), Estado: ANT (Antioquia), Ciudad: Medellín
        </p>
        <LocationSelector
          initialValues={{
            countryCode: "CO",      // Colombia
            stateCode: "ANT",       // Antioquia 
            cityName: "Medellín"    // Medellín
          }}
          placeholder="Ubicación precargada..."
          onSelectionChange={(selection) => {
            console.log("Ubicación con valores iniciales:", selection);
          }}
        />
      </div>

      {/* Ejemplo con solo país y estado */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Solo país y estado inicial</h3>
        <p className="text-sm text-muted-foreground">
          País: US (Estados Unidos), Estado: CA (California)
        </p>
        <LocationSelector
          initialValues={{
            countryCode: "US",      // Estados Unidos
            stateCode: "CA",        // California
          }}
          placeholder="Selecciona ciudad en California..."
          onSelectionChange={(selection) => {
            console.log("Ubicación US-CA:", selection);
          }}
        />
      </div>

      {/* Ejemplo con valores por defecto (método anterior - retrocompatibilidad) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Método anterior (retrocompatibilidad)</h3>
        <LocationSelector
          defaultCountry="MX" // México
          initialLevel="state"
          placeholder="Ubicación en México..."
          onSelectionChange={(selection) => {
            console.log("Ubicación en México:", selection);
          }}
        />
      </div>

      {/* Ejemplo solo países */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Solo países</h3>
        <LocationSelector
          initialLevel="country"
          placeholder="Selecciona un país..."
          onSelectionChange={(selection) => {
            console.log("País seleccionado:", selection);
          }}
        />
      </div>

      {/* Ejemplo deshabilitado con valores */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Deshabilitado con valores</h3>
        <LocationSelector
          disabled
          initialValues={{
            countryCode: "ES",      // España
            stateCode: "M",         // Madrid
            cityName: "Madrid"      // Madrid
          }}
          placeholder="Selector deshabilitado..."
        />
      </div>

      {/* Mostrar resultado */}
      {selectedLocation && (
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold">Ubicación seleccionada:</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Nivel:</strong> {selectedLocation.level}</p>
            {selectedLocation.country && (
              <p><strong>País:</strong> {selectedLocation.country.name} ({selectedLocation.country.isoCode})</p>
            )}
            {selectedLocation.state && (
              <p><strong>Estado:</strong> {selectedLocation.state.name} ({selectedLocation.state.isoCode})</p>
            )}
            {selectedLocation.city && (
              <p><strong>Ciudad:</strong> {selectedLocation.city.name}</p>
            )}
          </div>
          
          {/* Valores para guardar en base de datos */}
          <div className="p-3 bg-background rounded border">
            <h4 className="font-semibold text-sm mb-2">Valores para base de datos:</h4>
            <pre className="text-xs">
{JSON.stringify({
  countryCode: selectedLocation.country?.isoCode || null,
  stateCode: selectedLocation.state?.isoCode || null,
  cityName: selectedLocation.city?.name || null
}, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Documentación de uso */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Uso en formularios - Nuevos valores iniciales</h3>
        <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
{`import { LocationSelector } from "@/components/ui/location-selector";

function MiFormulario() {
  // Datos del usuario existente
  const userData = {
    country: "CO",
    state: "ANT", 
    city: "Medellín"
  };

  return (
    <LocationSelector
      initialValues={{
        countryCode: userData.country,    // ISO code del país
        stateCode: userData.state,        // ISO code del estado
        cityName: userData.city           // Nombre de la ciudad
      }}
      placeholder="Selecciona tu ubicación..."
      onSelectionChange={(selection) => {
        // Guardar en formulario
        if (selection.country) {
          form.setValue("country", selection.country.isoCode);
        }
        if (selection.state) {
          form.setValue("state", selection.state.isoCode);
        }
        if (selection.city) {
          form.setValue("city", selection.city.name);
        }
      }}
    />
  );
}`}
        </pre>
      </div>

      {/* Códigos ISO comunes */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Códigos ISO comunes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Países:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>🇨🇴 Colombia: CO</li>
              <li>🇺🇸 Estados Unidos: US</li>
              <li>🇲🇽 México: MX</li>
              <li>🇪🇸 España: ES</li>
              <li>🇦🇷 Argentina: AR</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Estados Colombia:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>Antioquia: ANT</li>
              <li>Cundinamarca: CUN</li>
              <li>Valle del Cauca: VAC</li>
              <li>Atlántico: ATL</li>
              <li>Bolívar: BOL</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 