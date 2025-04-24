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
import { ChevronUp, Pencil, Trash2, Plus, UserPlus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface CompanionsStepProps {
  formData: Partial<CreateRegistroFormulario>
  updateFormData: (data: Partial<CreateRegistroFormulario>) => void
  onNext: () => void
  onPrevious: () => void
}

// Schema Zod que refleja CreateHuespedSecundarioWithoutIdDto
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
  pais_residencia: z.string().min(2, {
    message: "El país de residencia es requerido",
  }),
  ciudad_residencia: z.string().min(2, {
    message: "La ciudad de residencia es requerida",
  }),
  ciudad_procedencia: z.string().min(2, {
    message: "La ciudad de procedencia es requerida",
  }),
  fecha_nacimiento: z.date({
    required_error: "La fecha de nacimiento es requerida",
  })
    .max(new Date(), { message: "La fecha de nacimiento no puede ser futura" }),
  nacionalidad: z.string().min(2, {
    message: "La nacionalidad es requerida",
  }),
  ocupacion: z.string().min(2, {
    message: "La ocupación es requerida",
  }),
  genero: z.nativeEnum(Genero, {
    required_error: "Seleccione el género",
  }),
  telefono: z.string().optional(),
  correo: z.string().email({ message: "El correo electrónico es inválido" }).optional(),
})

type CompanionFormValue = z.infer<typeof companionSchema>

interface CompanionCardProps {
  companion: CreateHuespedSecundarioWithoutIdDto
  index: number
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

function CompanionCard({ companion, index, onEdit, onDelete }: CompanionCardProps) {
  return (
    <Card className="mb-4 hover:bg-gray-50 transition-colors">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{companion.nombres} {companion.primer_apellido}</h4>
              <Badge variant="outline">{companion.tipo_documento}</Badge>
            </div>
            <p className="text-sm text-gray-500">
              Documento: {companion.numero_documento}
            </p>
            <p className="text-sm text-gray-500">
              Fecha de nacimiento: {companion.fecha_nacimiento instanceof Date
                ? companion.fecha_nacimiento.toLocaleDateString()
                : new Date(companion.fecha_nacimiento).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(index)}
              className="hover:bg-gray-100"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(index)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CompanionsStep({ formData, updateFormData, onNext, onPrevious }: CompanionsStepProps) {
  const [companions, setCompanions] = useState<CreateHuespedSecundarioWithoutIdDto[]>(
    formData.huespedes_secundarios || []
  )
  const [hasCompanions, setHasCompanions] = useState<boolean>(companions.length > 0)
  const [isAddingCompanion, setIsAddingCompanion] = useState<boolean>(false)
  const [editingIndex, setEditingIndex] = useState<number>(-1)
  const [useSameInfoAsPrimary, setUseSameInfoAsPrimary] = useState<boolean>(false)

  const form = useForm<CompanionFormValue>({
    resolver: zodResolver(companionSchema),
    defaultValues: {
      tipo_documento: undefined,
      numero_documento: "",
      primer_apellido: "",
      segundo_apellido: "",
      nombres: "",
      pais_residencia: "",
      ciudad_residencia: "",
      ciudad_procedencia: "",
      fecha_nacimiento: undefined,
      nacionalidad: "",
      ocupacion: "",
      genero: undefined,
      telefono: "",
      correo: "",
    },
  })

  const handleSameInfoChange = (checked: boolean) => {
    setUseSameInfoAsPrimary(checked)
    if (checked) {
      form.setValue('pais_residencia', formData.pais_residencia || '', { shouldValidate: true })
      form.setValue('ciudad_residencia', formData.ciudad_residencia || '', { shouldValidate: true })
      form.setValue('nacionalidad', formData.nacionalidad || '', { shouldValidate: true })
      form.setValue('ciudad_procedencia', formData.ciudad_procedencia || '', { shouldValidate: true })
    } else {
      form.setValue('pais_residencia', '', { shouldValidate: true })
      form.setValue('ciudad_residencia', '', { shouldValidate: true })
      form.setValue('nacionalidad', '', { shouldValidate: true })
      form.setValue('ciudad_procedencia', '', { shouldValidate: true })
    }
  }

  const resetCompanionForm = () => {
    form.reset({
      tipo_documento: undefined,
      numero_documento: "",
      primer_apellido: "",
      segundo_apellido: "",
      nombres: "",
      pais_residencia: "",
      ciudad_residencia: "",
      ciudad_procedencia: "",
      fecha_nacimiento: undefined,
      nacionalidad: "",
      ocupacion: "",
      genero: undefined,
      telefono: "",
      correo: "",
    })
    setUseSameInfoAsPrimary(false)
  }

  const handleAddCompanion = () => {
    resetCompanionForm()
    setEditingIndex(-1)
    setIsAddingCompanion(true)
  }

  const handleEditCompanion = (index: number) => {
    const companion = companions[index]
    const primaryData = formData

    const isSame = !!primaryData.pais_residencia &&
      companion.pais_residencia === primaryData.pais_residencia &&
      companion.ciudad_residencia === primaryData.ciudad_residencia &&
      companion.nacionalidad === primaryData.nacionalidad &&
      companion.ciudad_procedencia === primaryData.ciudad_procedencia

    setUseSameInfoAsPrimary(isSame)

    form.reset({
      ...companion,
      fecha_nacimiento: companion.fecha_nacimiento instanceof Date
        ? companion.fecha_nacimiento
        : new Date(companion.fecha_nacimiento),
      segundo_apellido: companion.segundo_apellido || "",
      telefono: companion.telefono || "",
      correo: companion.correo || "",
    })

    setEditingIndex(index)
    setIsAddingCompanion(true)
  }

  const handleDeleteCompanion = (index: number) => {
    const updatedCompanions = companions.filter((_, i) => i !== index)
    setCompanions(updatedCompanions)
    if (updatedCompanions.length === 0) {
      setHasCompanions(false)
      setIsAddingCompanion(false)
      setEditingIndex(-1)
      resetCompanionForm()
    } else if (editingIndex === index) {
      setIsAddingCompanion(false)
      setEditingIndex(-1)
      resetCompanionForm()
    }
  }

  const onSubmit = (data: CompanionFormValue) => {
    const finalData = useSameInfoAsPrimary
      ? {
        ...data,
        pais_residencia: formData.pais_residencia || data.pais_residencia,
        ciudad_residencia: formData.ciudad_residencia || data.ciudad_residencia,
        nacionalidad: formData.nacionalidad || data.nacionalidad,
        ciudad_procedencia: formData.ciudad_procedencia || data.ciudad_procedencia,
      }
      : data

    if (editingIndex >= 0) {
      const updatedCompanions = [...companions]
      updatedCompanions[editingIndex] = finalData as CreateHuespedSecundarioWithoutIdDto
      setCompanions(updatedCompanions)
    } else {
      setCompanions([...companions, finalData as CreateHuespedSecundarioWithoutIdDto])
    }

    resetCompanionForm()
    setIsAddingCompanion(false)
    setEditingIndex(-1)
  }

  const handleSubmit = () => {
    updateFormData({
      huespedes_secundarios: companions,
      numero_acompaniantes: companions.length,
    })
    onNext()
  }

  const handleHasCompanionsChange = (checked: boolean) => {
    setHasCompanions(checked)
    if (!checked) {
      setCompanions([])
      setIsAddingCompanion(false)
      setEditingIndex(-1)
      resetCompanionForm()
    }
  }

  return (
    <div className="p-6 pt-0">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Información de Acompañantes</h2>
        <p className="text-gray-600">
          Por favor complete los datos de las personas que le acompañan
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              id="has-companions"
              checked={hasCompanions}
              onCheckedChange={handleHasCompanionsChange}
            />
            <label
              htmlFor="has-companions"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ¿Está viajando con uno o más acompañantes?
            </label>
          </div>

          {hasCompanions && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Número de acompañantes: <span className="text-primary font-bold">{companions.length}</span>
                  </p>
                  {!isAddingCompanion && (
                    <Button
                      onClick={handleAddCompanion}
                      className="gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Agregar Acompañante
                    </Button>
                  )}
                </div>
              </div>

              {companions.length === 0 && !isAddingCompanion && (
                <Alert className="mb-4">
                  <AlertTitle>No hay acompañantes registrados</AlertTitle>
                  <AlertDescription>
                    Haga clic en &quot;Agregar Acompañante&quot; para registrar a las personas que le acompañan.
                  </AlertDescription>
                </Alert>
              )}

              {companions.length > 0 && (
                <ScrollArea className="h-48 rounded-md border p-4 mb-4">
                  {companions.map((companion, index) => (
                    <CompanionCard
                      key={index}
                      companion={companion}
                      index={index}
                      onEdit={handleEditCompanion}
                      onDelete={handleDeleteCompanion}
                    />
                  ))}
                </ScrollArea>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {isAddingCompanion && (
        <Card className="mb-6 border-primary">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {editingIndex >= 0 ? "Editar acompañante" : "Agregar acompañante"}
                </h3>
                <p className="text-sm text-gray-500">
                  Complete los datos del acompañante
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsAddingCompanion(false)
                  setEditingIndex(-1)
                  resetCompanionForm()
                }}
                className="hover:bg-gray-100"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="col-span-1 md:col-span-3 flex items-center space-x-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <Checkbox
                    id="same-info-checkbox"
                    checked={useSameInfoAsPrimary}
                    onCheckedChange={handleSameInfoChange}
                    disabled={!formData.pais_residencia}
                  />
                  <label
                    htmlFor="same-info-checkbox"
                    className={`text-sm font-medium ${!formData.pais_residencia ? 'text-gray-400 cursor-not-allowed' : ''}`}
                  >
                    Usar la misma información de residencia y nacionalidad que el huésped principal
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <FormField
                    control={form.control}
                    name="pais_residencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País de residencia</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ingrese país" disabled={useSameInfoAsPrimary} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ciudad_residencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad de residencia</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ingrese ciudad" disabled={useSameInfoAsPrimary} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nacionalidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nacionalidad</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ingrese nacionalidad" disabled={useSameInfoAsPrimary} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ocupacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ocupación</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ingrese ocupación" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ciudad_procedencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad de procedencia</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ciudad, País" disabled={useSameInfoAsPrimary} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ingrese teléfono (opcional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="correo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ingrese correo (opcional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsAddingCompanion(false)
                      setEditingIndex(-1)
                      resetCompanionForm()
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" />
                    {editingIndex >= 0 ? "Actualizar" : "Guardar"} Acompañante
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

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