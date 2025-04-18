"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { TipoDoc } from "@/Types/enums/tiposDocumento"
import { Genero } from "@/Types/enums/generos"
import { CreateHuespedSecundarioWithoutIdDto } from "@/Types/huesped-secundario-sin-id-Dto"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CompanionsStepProps {
  formData: Partial<CreateRegistroFormulario>
  updateFormData: (data: Partial<CreateRegistroFormulario>) => void
  onNext: () => void
  onPrevious: () => void
}

// Schema para cada acompañante
const companionSchema = z.object({
  tipo_documento: z.nativeEnum(TipoDoc, {
    required_error: "Seleccione el tipo de documento",
  }),
  numero_documento: z.string().min(5, {
    message: "El número de documento debe tener al menos 5 caracteres",
  }),
  primer_apellido: z.string().min(2, {
    message: "El primer apellido es requerido",
  }),
  segundo_apellido: z.string().optional(),
  nombres: z.string().min(2, {
    message: "El nombre es requerido",
  }),
  fecha_nacimiento: z.date({
    required_error: "La fecha de nacimiento es requerida",
  }),
  genero: z.nativeEnum(Genero, {
    required_error: "Seleccione el género",
  }),
})

// Tipo para el formulario de acompañantes
type CompanionFormValue = z.infer<typeof companionSchema>

export function CompanionsStep({ formData, updateFormData, onNext, onPrevious }: CompanionsStepProps) {
  const [companions, setCompanions] = useState<CreateHuespedSecundarioWithoutIdDto[]>(
    formData.huespedes_secundarios || []
  )
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

  // Form para el acompañante actual
  const form = useForm<CompanionFormValue>({
    resolver: zodResolver(companionSchema),
    defaultValues: {
      tipo_documento: undefined,
      numero_documento: "",
      primer_apellido: "",
      segundo_apellido: "",
      nombres: "",
      fecha_nacimiento: undefined,
      genero: undefined,
    },
  })

  const addCompanion = (data: CompanionFormValue) => {
    if (isEditing && currentIndex >= 0) {
      // Actualizar acompañante existente
      const updatedCompanions = [...companions]
      updatedCompanions[currentIndex] = data as CreateHuespedSecundarioWithoutIdDto
      setCompanions(updatedCompanions)
    } else {
      // Agregar nuevo acompañante
      setCompanions([...companions, data as CreateHuespedSecundarioWithoutIdDto])
    }

    // Reset form and state
    form.reset()
    setIsEditing(false)
    setCurrentIndex(-1)
  }

  const editCompanion = (index: number) => {
    const companion = companions[index]
    form.reset(companion)
    setIsEditing(true)
    setCurrentIndex(index)
  }

  const removeCompanion = (index: number) => {
    const updatedCompanions = companions.filter((_, i) => i !== index)
    setCompanions(updatedCompanions)
  }

  const handleSubmit = () => {
    updateFormData({
      huespedes_secundarios: companions,
      numero_acompaniantes: companions.length,
    })
    onNext()
  }

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Información de Acompañantes</h2>
        <p className="text-gray-600">
          Por favor complete los datos de las personas que le acompañan
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
            1
          </div>
          <div className="text-sm text-gray-600 font-medium">Datos personales</div>
          <div className="h-0.5 w-10 bg-gray-200"></div>
          <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
            2
          </div>
          <div className="text-sm font-medium">Datos acompañantes</div>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Checkbox id="has-companions" checked={companions.length > 0} disabled />
            <label
              htmlFor="has-companions"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ¿Está viajando con uno o más acompañantes?
            </label>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Número de acompañantes</p>
            <Input 
              type="number" 
              value={companions.length} 
              readOnly
              className="w-full md:w-64" 
            />
          </div>
          
          {companions.length > 0 && (
            <ScrollArea className="h-48 rounded-md border p-4 mb-4">
              {companions.map((companion, index) => (
                <div key={index} className="flex justify-between items-center mb-2 p-2 border-b">
                  <div>
                    <p className="font-medium">{companion.nombres} {companion.primer_apellido}</p>
                    <p className="text-sm text-gray-500">
                      {companion.tipo_documento}: {companion.numero_documento}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => editCompanion(index)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeCompanion(index)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Editar acompañante" : "Agregar acompañante"}
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(addCompanion)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipo_documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de documento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                        <Input {...field} placeholder="Ingrese número de documento" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nombres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ingrese nombres" />
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
                        <Input {...field} placeholder="Ingrese primer apellido" />
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
                        <Input {...field} placeholder="Ingrese segundo apellido (opcional)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_nacimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de nacimiento</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''} 
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined
                            field.onChange(date)
                          }}
                        />
                      </FormControl>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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

              <div className="flex justify-end">
                <Button type="submit">
                  {isEditing ? "Actualizar" : "Agregar"} Acompañante
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Anterior
        </Button>
        <Button onClick={handleSubmit}>
          Finalizar Registro
        </Button>
      </div>
    </div>
  )
} 