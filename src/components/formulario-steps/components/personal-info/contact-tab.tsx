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
}

export function ContactTab({ form, onNext, onPrevious }: ContactTabProps) {
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
      <CardContent className="pt-6 grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormItem className="flex flex-col space-y-2">
              <FormLabel>Teléfono</FormLabel>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <CountrySelector
                    form={form}
                    name="country_code"
                    label=""
                    placeholder="Código"
                    countries={phoneCountryCodes}
                    onCountryChange={() => {}}
                    className="mt-0"
                  />
                </div>
                <div className="w-2/3">
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
              <p className="text-sm text-muted-foreground">
                Su número será utilizado solo para comunicaciones relacionadas con su reserva
              </p>
              <FormMessage />
            </FormItem>
          </div>

          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
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