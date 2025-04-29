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

// Mapeo para mostrar los motivos de viaje de forma más legible
const motivosViajesMap: Record<MotivosViajes, string> = {
  [MotivosViajes.NEGOCIOS_Y_MOTIVOS_PROFESIONALES]: "Negocios y motivos profesionales",
  [MotivosViajes.VACACIONES_RECREO_Y_OCIO]: "Vacaciones, recreo y ocio",
  [MotivosViajes.VISITAS_A_FAMILIARES_Y_AMIGOS]: "Visitas a familiares y amigos",
  [MotivosViajes.EDUCACION_Y_FORMACION]: "Educación y formación",
  [MotivosViajes.SALUD_Y_ATENCION_MEDICA]: "Salud y atención médica",
  [MotivosViajes.RELIGION_Y_PEREGRINACIONES]: "Religión y peregrinaciones",
  [MotivosViajes.COMPRAS]: "Compras",
  [MotivosViajes.TRANSITO]: "Tránsito",
  [MotivosViajes.OTROS_MOTIVOS]: "Otros motivos",
}

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
      <CardContent className="pt-4 sm:pt-6 grid gap-4 sm:gap-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:items-start sm:space-x-3">
            <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mb-2 sm:mb-0 sm:mt-0.5" />
            <div className="mt-1 sm:mt-0">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 text-sm sm:text-base">Fecha de estadía</h4>
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                {new Date(formData.fecha_inicio!).toLocaleDateString()} - {new Date(formData.fecha_fin!).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/30 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:items-start sm:space-x-3">
            <FileText className="h-5 w-5 text-green-500 dark:text-green-400 mb-2 sm:mb-0 sm:mt-0.5" />
            <div className="mt-1 sm:mt-0">
              <h4 className="font-medium text-green-700 dark:text-green-300 text-sm sm:text-base">Habitación</h4>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
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
                        {motivosViajesMap[value]}
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
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={onSubmit}
          >
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 