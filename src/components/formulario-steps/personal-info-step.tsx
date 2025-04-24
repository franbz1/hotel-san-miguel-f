"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { TipoDoc } from "@/Types/enums/tiposDocumento"
import { Genero } from "@/Types/enums/generos"
import { MotivosViajes } from "@/Types/enums/motivosViajes"
import { COUNTRY_CODES } from "@/lib/common/constants"

interface PersonalInfoStepProps {
  formData: Partial<CreateRegistroFormulario>
  updateFormData: (data: Partial<CreateRegistroFormulario>) => void
  onNext: () => void
}

// Schema de validación para los datos personales
const personalInfoSchema = z.object({
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
  departamento_residencia: z.string().min(2, {
    message: "El departamento de residencia es requerido",
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
  country_code: z.string().optional(),
  correo: z.string().email({
    message: "El correo electrónico es inválido",
  }).optional(),
  motivo_viaje: z.nativeEnum(MotivosViajes, {
    required_error: "Seleccione el motivo del viaje",
  }),
})

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

export function PersonalInfoStep({ formData, updateFormData, onNext }: PersonalInfoStepProps) {
  // Inicializar formulario con React Hook Form y Zod
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      tipo_documento: formData.tipo_documento || undefined,
      numero_documento: formData.numero_documento || "",
      primer_apellido: formData.primer_apellido || "",
      segundo_apellido: formData.segundo_apellido || "",
      nombres: formData.nombres || "",
      pais_residencia: formData.pais_residencia || "",
      departamento_residencia: formData.departamento_residencia || "",
      ciudad_residencia: formData.ciudad_residencia || "",
      ciudad_procedencia: formData.ciudad_procedencia || "",
      fecha_nacimiento: formData.fecha_nacimiento || undefined,
      nacionalidad: formData.nacionalidad || "",
      ocupacion: formData.ocupacion || "",
      genero: formData.genero || undefined,
      telefono: formData.telefono?.replace(/^\+\d+\s*/, '') || "",
      country_code: formData.telefono?.match(/^\+\d+/)?.[0] || "+57",
      correo: formData.correo || "",
      motivo_viaje: formData.motivo_viaje || undefined,
    },
  })

  function onSubmit(values: PersonalInfoFormValues) {
    // Combine country code with phone number for the final formData
    const combinedData = { ...values };
    if (values.telefono && values.country_code) {
      combinedData.telefono = `${values.country_code} ${values.telefono}`;
    }
    
    // Remove the temporary country_code field before updating
    delete combinedData.country_code;
    
    updateFormData(combinedData);
    onNext();
  }

  return (
    <div className="p-6 pt-0">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Información Personal</h2>
        <p className="text-gray-600">
          Por favor complete sus datos personales
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Información personal</h3>
              
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Información de contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Teléfono</FormLabel>
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <FormField
                        control={form.control}
                        name="country_code"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Código" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px]">
                              {COUNTRY_CODES.map(({ code, country }) => (
                                <SelectItem key={code} value={code}>
                                  <span className="whitespace-nowrap">
                                    {code} <span className="text-muted-foreground text-xs">{country}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
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
                  <FormMessage />
                </FormItem>

                <FormField
                  control={form.control}
                  name="correo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ingrese su correo electrónico" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Información de procedencia y destino</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nacionalidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nacionalidad</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ingrese su nacionalidad" />
                      </FormControl>
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
                        <Input {...field} placeholder="Ingrese su país de residencia" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departamento_residencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento de residencia</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ingrese su departamento de residencia" />
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
                        <Input {...field} placeholder="Ingrese su ciudad de residencia" />
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
                        <Input {...field} placeholder="Ingrese su ciudad de procedencia" />
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
                        <Input {...field} placeholder="Ingrese su ocupación" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg">
              Continuar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 