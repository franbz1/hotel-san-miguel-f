"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { PersonalInfoFormValues } from "../../../../Types/personal-info-types"
import { LocationFields } from "../LocationFields"
import { cn } from "@/lib/common/utils"
import { ICountry, IState, ICity } from "country-state-city"
import { CountrySelector } from "../CountrySelector"

interface LocationTabProps {
  form: UseFormReturn<PersonalInfoFormValues>
  onNext: () => void
  onPrevious: () => void
  countries: ICountry[]
  residenciaStates: IState[]
  residenciaCities: ICity[]
  procedenciaStates: IState[]
  procedenciaCities: ICity[]
  handleCountryResidenciaChange: (value: string) => void
  handleStateResidenciaChange: (value: string) => void
  handleCityResidenciaChange: (value: string) => void
  handleCountryProcedenciaChange: (value: string) => void
  handleStateProcedenciaChange: (value: string) => void
  handleCityProcedenciaChange: (value: string) => void
  handleNacionalidadChange: (value: string) => void
}

export function LocationTab({ 
  form, 
  onNext, 
  onPrevious,
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
  handleNacionalidadChange
}: LocationTabProps) {
  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center text-lg">
          <MapPin className="mr-2 h-5 w-5" />
          Información de Ubicación
        </CardTitle>
        <CardDescription>
          Datos de residencia y procedencia
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 grid gap-6">
        <div className="space-y-4">
          <CountrySelector
            form={form}
            name="nacionalidad_code"
            label="Nacionalidad"
            countries={countries}
            onCountryChange={handleNacionalidadChange}
          />

          {/* Sección de residencia */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary">Lugar de residencia</h3>
            <div className={cn(
              "rounded-lg border border-muted p-4",
              "transition-all duration-200 hover:border-muted-foreground/50"
            )}>
              <LocationFields
                form={form}
                countries={countries}
                states={residenciaStates}
                cities={residenciaCities}
                countryCodeName="pais_residencia_code"
                stateCodeName="ciudad_residencia_code"
                cityName="ciudad_residencia"
                countryLabel="País de residencia"
                stateLabel="Estado/Departamento"
                cityLabel="Ciudad"
                onCountryChange={handleCountryResidenciaChange}
                onStateChange={handleStateResidenciaChange}
                onCityChange={handleCityResidenciaChange}
              />
            </div>
          </div>

          {/* Sección de procedencia */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary">Lugar de procedencia</h3>
            <div className={cn(
              "rounded-lg border border-muted p-4",
              "transition-all duration-200 hover:border-muted-foreground/50"
            )}>
              <LocationFields
                form={form}
                countries={countries}
                states={procedenciaStates}
                cities={procedenciaCities}
                countryCodeName="pais_procedencia_code"
                stateCodeName="ciudad_procedencia_code"
                cityName="ciudad_procedencia"
                countryLabel="País de procedencia"
                stateLabel="Estado/Departamento"
                cityLabel="Ciudad"
                onCountryChange={handleCountryProcedenciaChange}
                onStateChange={handleStateProcedenciaChange}
                onCityChange={handleCityProcedenciaChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button 
            type="button" 
            onClick={onNext}
            className="flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 