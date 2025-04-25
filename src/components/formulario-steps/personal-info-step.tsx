"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useCountrySelection } from "@/lib/formulario/use-country-selection"
import { LocationFields } from "./components/LocationFields"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, ChevronLeft, ChevronRight, FileText, Globe, Info, Mail, MapPin, Phone, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/common/utils"
import { useState } from "react"

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
  pais_residencia_code: z.string().optional(),
  ciudad_residencia: z.string().min(2, {
    message: "La ciudad de residencia es requerida",
  }),
  ciudad_residencia_code: z.string().optional(),
  pais_procedencia: z.string().min(2, {
    message: "El país de procedencia es requerido",
  }),
  pais_procedencia_code: z.string().optional(),
  ciudad_procedencia: z.string().min(2, {
    message: "La ciudad de procedencia es requerida",
  }),
  ciudad_procedencia_code: z.string().optional(),
  fecha_nacimiento: z.date({
    required_error: "La fecha de nacimiento es requerida",
  })
  .max(new Date(), { message: "La fecha de nacimiento no puede ser futura" }),
  nacionalidad: z.string().min(2, {
    message: "La nacionalidad es requerida",
  }),
  nacionalidad_code: z.string().optional(),
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
  const [activeTab, setActiveTab] = useState<string>("personal")
  const tabOrder = ["personal", "contacto", "ubicacion", "viaje"]

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
      pais_residencia_code: "",
      ciudad_residencia: formData.ciudad_residencia || "",
      ciudad_residencia_code: "",
      pais_procedencia: formData.pais_procedencia || "",
      pais_procedencia_code: "",
      ciudad_procedencia: formData.ciudad_procedencia || "",
      ciudad_procedencia_code: "",
      fecha_nacimiento: formData.fecha_nacimiento || undefined,
      nacionalidad: formData.nacionalidad || "",
      nacionalidad_code: "",
      ocupacion: formData.ocupacion || "",
      genero: formData.genero || undefined,
      telefono: formData.telefono?.replace(/^\+\d+\s*/, '') || "",
      country_code: formData.telefono?.match(/^\+\d+/)?.[0] || "+57",
      correo: formData.correo || "",
      motivo_viaje: formData.motivo_viaje || undefined,
    },
  })

  // Usar nuestro custom hook para la selección de países
  const {
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
  } = useCountrySelection({ form });

  function onSubmit(values: PersonalInfoFormValues) {
    // Combine country code with phone number for the final formData
    const combinedData = { ...values };
    if (values.telefono && values.country_code) {
      combinedData.telefono = `${values.country_code} ${values.telefono}`;
    }
    
    // Remove the temporary country_code field and location codes before updating
    delete combinedData.country_code;
    delete combinedData.pais_residencia_code;
    delete combinedData.ciudad_residencia_code;
    delete combinedData.pais_procedencia_code;
    delete combinedData.ciudad_procedencia_code;
    delete combinedData.nacionalidad_code;
    
    updateFormData(combinedData);
    onNext();
  }

  // Función para ir a la siguiente pestaña
  const goToNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1])
    }
  }

  // Función para ir a la pestaña anterior
  const goToPrevTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1])
    }
  }

  return (
    <div className="p-6 pt-0">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Información Personal</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Por favor complete sus datos personales. Esta información es necesaria para el registro en nuestro hotel y cumplir con los requisitos legales.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Datos Personales</span>
              </TabsTrigger>
              <TabsTrigger value="contacto" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Contacto</span>
              </TabsTrigger>
              <TabsTrigger value="ubicacion" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Ubicación</span>
              </TabsTrigger>
              <TabsTrigger value="viaje" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Viaje</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Pestaña de Datos Personales */}
            <TabsContent value="personal">
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

                  <div className="flex justify-end mt-4">
                    <Button 
                      type="button" 
                      onClick={goToNextTab}
                      className="flex items-center gap-2"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Pestaña de Contacto */}
            <TabsContent value="contacto">
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
                      onClick={goToPrevTab}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button 
                      type="button" 
                      onClick={goToNextTab}
                      className="flex items-center gap-2"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Pestaña de Ubicación */}
            <TabsContent value="ubicacion">
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
                    <FormField
                      control={form.control}
                      name="nacionalidad_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nacionalidad</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleNacionalidadChange(value);
                            }} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione nacionalidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px]">
                              {countries.map((country) => (
                                <SelectItem key={country.isoCode} value={country.isoCode}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
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
                      onClick={goToPrevTab}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button 
                      type="button" 
                      onClick={goToNextTab}
                      className="flex items-center gap-2"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Pestaña de Viaje */}
            <TabsContent value="viaje">
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
                      onClick={goToPrevTab}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button type="submit" size="lg" className="min-w-[200px]">
                      Continuar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
} 