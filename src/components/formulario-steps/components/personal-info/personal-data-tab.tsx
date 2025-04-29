"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, ChevronRight, User } from "lucide-react"
import { TipoDoc } from "@/Types/enums/tiposDocumento"
import { Genero } from "@/Types/enums/generos"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { PersonalInfoFormValues } from "../../../../Types/personal-info-types"

interface PersonalDataTabProps {
  form: UseFormReturn<PersonalInfoFormValues>
  onNext: () => void
  hideButtons?: boolean
}

export function PersonalDataTab({ form, onNext, hideButtons = false }: PersonalDataTabProps) {
  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center text-lg">
          <User className="mr-2 h-5 w-5" />
          Datos Personales
        </CardTitle>
        <CardDescription>
          Información básica de identificación
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tipo_documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de documento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo de documento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TipoDoc).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numero_documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de documento</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ingrese su número de documento" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-2" />
        <h3 className="text-sm font-medium text-muted-foreground">Nombre completo</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ingrese sus nombres" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primer_apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primer apellido</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ingrese su primer apellido" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="segundo_apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segundo apellido</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ingrese su segundo apellido (opcional)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fecha_nacimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''} 
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : undefined
                        field.onChange(date)
                      }}
                      className="pl-10"
                    />
                  </FormControl>
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Género</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione género" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Genero).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ocupacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ocupación</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese su ocupación o profesión" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!hideButtons && (
          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              onClick={onNext}
              className="flex items-center gap-2"
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