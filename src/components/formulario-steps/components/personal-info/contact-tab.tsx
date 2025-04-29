"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { PersonalInfoFormValues } from "../../../../Types/personal-info-types"
import { COUNTRY_CODES } from "@/lib/common/constants/constants"
import { CountrySelector } from "../CountrySelector"
import { ICountry } from "country-state-city"

// Convert COUNTRY_CODES to ICountry format for the CountrySelector
const phoneCountryCodes: ICountry[] = COUNTRY_CODES.map(({ code, country }) => ({
  isoCode: code,
  name: `${code} ${country}`,
  phonecode: code.replace('+', ''),
  flag: '',
  currency: '',
  latitude: '',
  longitude: '',
  timezones: []
}));

interface ContactTabProps {
  form: UseFormReturn<PersonalInfoFormValues>
  onNext: () => void
  onPrevious: () => void
  hideButtons?: boolean
}

export function ContactTab({ form, onNext, onPrevious, hideButtons = false }: ContactTabProps) {
  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center text-lg">
          <Phone className="mr-2 h-5 w-5" />
          Información de Contacto
        </CardTitle>
        <CardDescription>
          Datos para poder comunicarnos con usted
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 grid gap-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo de teléfono */}
          <div>
            <FormItem className="flex flex-col">
              <FormLabel className="mb-2">Teléfono</FormLabel>
              
              {/* Contenedor para el teléfono con espaciado consistente */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Selector de código de país */}
                <div className="w-full sm:w-1/3">
                  <CountrySelector
                    form={form}
                    name="country_code"
                    label=""
                    placeholder="Código"
                    countries={phoneCountryCodes}
                    onCountryChange={() => {}}
                    className="gap-0"
                  />
                </div>
                
                {/* Número de teléfono */}
                <div className="w-full sm:w-2/3">
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormControl>
                        <Input {...field} placeholder="Número de teléfono" />
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              
              {/* Texto informativo */}
              <p className="text-sm text-muted-foreground mt-2">
                Su número será utilizado solo para comunicaciones relacionadas con su reserva
              </p>
              <FormMessage className="mt-1" />
            </FormItem>
          </div>

          {/* Campo de correo electrónico */}
          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2">Correo electrónico</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Ingrese su correo electrónico" 
                      className="pl-10"
                    />
                  </FormControl>
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Enviaremos la confirmación de su reserva a este correo
                </p>
                <FormMessage className="mt-1" />
              </FormItem>
            )}
          />
        </div>

        {!hideButtons && (
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onPrevious}
              className="flex items-center gap-2 justify-center w-full sm:w-auto sm:min-w-[120px]"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button 
              type="button" 
              onClick={onNext}
              className="flex items-center gap-2 justify-center w-full sm:w-auto sm:min-w-[120px]"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 