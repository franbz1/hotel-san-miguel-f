"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, FileText, Globe, Info } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { PersonalInfoFormValues } from "../../../../Types/personal-info-types"
import { MotivosViajes } from "@/Types/enums/motivosViajes"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"

interface TravelTabProps {
  form: UseFormReturn<PersonalInfoFormValues>
  formData: Partial<CreateRegistroFormulario>
  onPrevious: () => void
  onSubmit: () => void
}

export function TravelTab({ form, formData, onPrevious, onSubmit }: TravelTabProps) {
  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center text-lg">
          <Globe className="mr-2 h-5 w-5" />
          Información del Viaje
        </CardTitle>
        <CardDescription>
          Detalles sobre su estadía y motivo de viaje
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-700 dark:text-blue-300">Fecha de estadía</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {new Date(formData.fecha_inicio!).toLocaleDateString()} - {new Date(formData.fecha_fin!).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg flex items-start space-x-3">
            <FileText className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-300">Habitación</h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                Número {formData.numero_habitacion}
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="motivo_viaje"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo del viaje</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione motivo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(MotivosViajes).map((value) => (
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
            type="submit" 
            size="lg" 
            className="min-w-[200px]"
            onClick={onSubmit}
          >
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 