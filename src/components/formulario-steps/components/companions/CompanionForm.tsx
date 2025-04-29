"use client"

import { CompanionFormValue } from "@/Types/companions-info-types"
import { PersonalInfoFormValues } from "@/Types/personal-info-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { ICity, ICountry, IState } from "country-state-city"
import { X } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { PersonalDataTab } from "../personal-info/personal-data-tab"
import { ContactTab } from "../personal-info/contact-tab"
import { LocationTab } from "../personal-info/location-tab"

interface CompanionFormProps {
  form: UseFormReturn<CompanionFormValue>
  isEditing: boolean
  onSubmit: (values: CompanionFormValue) => void
  onCancel: () => void
  countries: ICountry[]
  residenciaStates: IState[]
  residenciaCities: ICity[]
  procedenciaStates: IState[]
  procedenciaCities: ICity[]
  handleCountryResidenciaChange: (countryCode: string) => void
  handleStateResidenciaChange: (stateCode: string) => void
  handleCityResidenciaChange: (cityCode: string) => void
  handleCountryProcedenciaChange: (countryCode: string) => void
  handleStateProcedenciaChange: (stateCode: string) => void
  handleCityProcedenciaChange: (cityCode: string) => void
  handleNacionalidadChange: (countryCode: string) => void
}

export function CompanionForm({ 
  form, 
  isEditing, 
  onSubmit, 
  onCancel,
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
}: CompanionFormProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            {isEditing ? "Editar acompañante" : "Agregar acompañante"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Ingrese los datos del acompañante
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Data Section - Datos requeridos */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <h3 className="text-base font-semibold text-primary">Datos Personales</h3>
                <span className="text-xs text-muted-foreground">(Obligatorio)</span>
              </div>
              <PersonalDataTab 
                form={form as unknown as UseFormReturn<PersonalInfoFormValues>} 
                onNext={() => {}} 
                hideButtons={true}
              />
            </div>

            {/* Location Section - Datos requeridos */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <h3 className="text-base font-semibold text-primary">Ubicación</h3>
                <span className="text-xs text-muted-foreground">(Obligatorio)</span>
              </div>
              <LocationTab 
                form={form as unknown as UseFormReturn<PersonalInfoFormValues>} 
                onNext={() => {}} 
                onPrevious={() => {}}
                hideButtons={true}
                countries={countries}
                residenciaStates={residenciaStates}
                residenciaCities={residenciaCities}
                procedenciaStates={procedenciaStates}
                procedenciaCities={procedenciaCities}
                handleCountryResidenciaChange={handleCountryResidenciaChange}
                handleStateResidenciaChange={handleStateResidenciaChange}
                handleCityResidenciaChange={handleCityResidenciaChange}
                handleCountryProcedenciaChange={handleCountryProcedenciaChange}
                handleStateProcedenciaChange={handleStateProcedenciaChange}
                handleCityProcedenciaChange={handleCityProcedenciaChange}
                handleNacionalidadChange={handleNacionalidadChange}
              />
            </div>

            {/* Contact Section - Completamente opcional */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <h3 className="text-base font-semibold text-muted-foreground">Contacto</h3>
                <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">Opcional</span>
              </div>
              <p className="text-sm text-muted-foreground italic mb-2">
                Los datos de contacto para acompañantes son opcionales. Solo complete estos campos si desea registrar información de contacto para este acompañante.
              </p>
              <ContactTab 
                form={form as unknown as UseFormReturn<PersonalInfoFormValues>} 
                onNext={() => {}} 
                onPrevious={() => {}}
                hideButtons={true}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Actualizar" : "Guardar"} acompañante
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 