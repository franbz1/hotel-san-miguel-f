"use client"

import { useState, useEffect } from "react"
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
import { ChevronUp, Pencil, Trash2, Plus, UserPlus, Info, MapPin, ChevronRight, ChevronLeft, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Country, State, City, ICountry, IState, ICity } from "country-state-city"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-medium">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{companion.nombres} {companion.primer_apellido}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{companion.tipo_documento}</Badge>
                  <span className="text-xs text-gray-500">#{companion.numero_documento}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 ml-10">
              <div className="flex items-center gap-1">
                <span className="font-medium">Edad:</span> 
                {calculateAge(companion.fecha_nacimiento)} años
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Género:</span> {companion.genero}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Nacionalidad:</span> {companion.nacionalidad}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Ocupación:</span> {companion.ocupacion}
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(index)}
              className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(index)}
              className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Función auxiliar para calcular la edad
function calculateAge(birthDate: Date | string): number {
  const today = new Date();
  const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function CompanionsStep({ formData, updateFormData, onNext, onPrevious }: CompanionsStepProps) {
  const [companions, setCompanions] = useState<CreateHuespedSecundarioWithoutIdDto[]>(
    formData.huespedes_secundarios || []
  )
  const [hasCompanions, setHasCompanions] = useState<boolean>(companions.length > 0)
  const [isAddingCompanion, setIsAddingCompanion] = useState<boolean>(false)
  const [editingIndex, setEditingIndex] = useState<number>(-1)
  const [useSameInfoAsPrimary, setUseSameInfoAsPrimary] = useState<boolean>(false)
  
  // Estados para country-state-city
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [residenciaStates, setResidenciaStates] = useState<IState[]>([]);
  const [residenciaCities, setResidenciaCities] = useState<ICity[]>([]);
  const [procedenciaStates, setProcedenciaStates] = useState<IState[]>([]);
  const [procedenciaCities, setProcedenciaCities] = useState<ICity[]>([]);

  // Estado adicional para las pestañas dentro del formulario de acompañante
  const [activeTab, setActiveTab] = useState<string>("personal")

  const form = useForm<CompanionFormValue>({
    resolver: zodResolver(companionSchema),
    defaultValues: {
      tipo_documento: undefined,
      numero_documento: "",
      primer_apellido: "",
      segundo_apellido: "",
      nombres: "",
      pais_residencia: "",
      pais_residencia_code: "",
      ciudad_residencia: "",
      ciudad_residencia_code: "",
      pais_procedencia: "",
      pais_procedencia_code: "",
      ciudad_procedencia: "",
      ciudad_procedencia_code: "",
      fecha_nacimiento: undefined,
      nacionalidad: "",
      nacionalidad_code: "",
      ocupacion: "",
      genero: undefined,
      telefono: "",
      correo: "",
    },
  })

  // Cargar países al iniciar
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    
    // Ordenar para que Colombia aparezca primero
    const colombia = allCountries.find(country => country.isoCode === 'CO');
    let sortedCountries = [...allCountries];
    
    if (colombia) {
      sortedCountries = [
        colombia,
        ...allCountries.filter(country => country.isoCode !== 'CO')
      ];
    }
    
    setCountries(sortedCountries);
  }, []);

  // Actualizar estados/departamentos cuando cambia el país de residencia
  useEffect(() => {
    const paisCode = form.watch('pais_residencia_code');
    if (paisCode) {
      const states = State.getStatesOfCountry(paisCode);
      setResidenciaStates(states);
      // Limpiar ciudades al cambiar el país
      setResidenciaCities([]);
      form.setValue('ciudad_residencia', '');
      form.setValue('ciudad_residencia_code', '');
    }
  }, [form.watch('pais_residencia_code')]);

  // Actualizar estados/departamentos cuando cambia el país de procedencia
  useEffect(() => {
    const paisCode = form.watch('pais_procedencia_code');
    if (paisCode) {
      const states = State.getStatesOfCountry(paisCode);
      setProcedenciaStates(states);
      // Limpiar ciudades al cambiar el país
      setProcedenciaCities([]);
      form.setValue('ciudad_procedencia', '');
      form.setValue('ciudad_procedencia_code', '');
    }
  }, [form.watch('pais_procedencia_code')]);

  // Actualizar ciudades cuando cambia el estado/departamento de residencia
  useEffect(() => {
    const paisCode = form.watch('pais_residencia_code');
    const stateCode = form.watch('ciudad_residencia_code');
    if (paisCode && stateCode) {
      const cities = City.getCitiesOfState(paisCode, stateCode);
      setResidenciaCities(cities);
    }
  }, [form.watch('ciudad_residencia_code')]);

  // Actualizar ciudades cuando cambia el estado/departamento de procedencia
  useEffect(() => {
    const paisCode = form.watch('pais_procedencia_code');
    const stateCode = form.watch('ciudad_procedencia_code');
    if (paisCode && stateCode) {
      const cities = City.getCitiesOfState(paisCode, stateCode);
      setProcedenciaCities(cities);
    }
  }, [form.watch('ciudad_procedencia_code')]);

  // Funciones de manejo para location selectors
  const handleCountryResidenciaChange = (countryCode: string) => {
    const selectedCountry = countries.find(c => c.isoCode === countryCode);
    if (selectedCountry) {
      form.setValue('pais_residencia', selectedCountry.name);
      form.setValue('pais_residencia_code', selectedCountry.isoCode);
    }
  };

  const handleStateResidenciaChange = (stateCode: string) => {
    const selectedState = residenciaStates.find(s => s.isoCode === stateCode);
    if (selectedState) {
      form.setValue('ciudad_residencia', selectedState.name);
      form.setValue('ciudad_residencia_code', selectedState.isoCode);
    }
  };

  const handleCityResidenciaChange = (cityName: string) => {
    form.setValue('ciudad_residencia', cityName);
  };

  const handleCountryProcedenciaChange = (countryCode: string) => {
    const selectedCountry = countries.find(c => c.isoCode === countryCode);
    if (selectedCountry) {
      form.setValue('pais_procedencia', selectedCountry.name);
      form.setValue('pais_procedencia_code', selectedCountry.isoCode);
    }
  };

  const handleStateProcedenciaChange = (stateCode: string) => {
    const selectedState = procedenciaStates.find(s => s.isoCode === stateCode);
    if (selectedState) {
      form.setValue('ciudad_procedencia', selectedState.name);
      form.setValue('ciudad_procedencia_code', selectedState.isoCode);
    }
  };

  const handleCityProcedenciaChange = (cityName: string) => {
    form.setValue('ciudad_procedencia', cityName);
  };

  const handleNacionalidadChange = (countryCode: string) => {
    const selectedCountry = countries.find(c => c.isoCode === countryCode);
    if (selectedCountry) {
      form.setValue('nacionalidad', selectedCountry.name);
      form.setValue('nacionalidad_code', selectedCountry.isoCode);
    }
  };

  const handleSameInfoChange = (checked: boolean) => {
    setUseSameInfoAsPrimary(checked)
    if (checked) {
      // Establecer valores directamente sin códigos
      form.setValue('pais_residencia', formData.pais_residencia || '', { shouldValidate: true })
      form.setValue('ciudad_residencia', formData.ciudad_residencia || '', { shouldValidate: true })
      form.setValue('nacionalidad', formData.nacionalidad || '', { shouldValidate: true })
      form.setValue('pais_procedencia', formData.pais_procedencia || '', { shouldValidate: true })
      form.setValue('ciudad_procedencia', formData.ciudad_procedencia || '', { shouldValidate: true })
      
      // Buscar y establecer los códigos correspondientes si existen
      if (formData.pais_residencia) {
        const countryCode = countries.find(c => c.name === formData.pais_residencia)?.isoCode;
        if (countryCode) form.setValue('pais_residencia_code', countryCode);
      }
      
      if (formData.pais_procedencia) {
        const countryCode = countries.find(c => c.name === formData.pais_procedencia)?.isoCode;
        if (countryCode) form.setValue('pais_procedencia_code', countryCode);
      }
      
      if (formData.nacionalidad) {
        const countryCode = countries.find(c => c.name === formData.nacionalidad)?.isoCode;
        if (countryCode) form.setValue('nacionalidad_code', countryCode);
      }
    } else {
      // Limpiar todos los campos relacionados
      form.setValue('pais_residencia', '', { shouldValidate: true })
      form.setValue('ciudad_residencia', '', { shouldValidate: true })
      form.setValue('nacionalidad', '', { shouldValidate: true })
      form.setValue('pais_procedencia', '', { shouldValidate: true })
      form.setValue('ciudad_procedencia', '', { shouldValidate: true })
      form.setValue('pais_residencia_code', '')
      form.setValue('ciudad_residencia_code', '')
      form.setValue('nacionalidad_code', '')
      form.setValue('pais_procedencia_code', '')
      form.setValue('ciudad_procedencia_code', '')
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
      pais_residencia_code: "",
      ciudad_residencia: "",
      ciudad_residencia_code: "",
      pais_procedencia: "",
      pais_procedencia_code: "",
      ciudad_procedencia: "",
      ciudad_procedencia_code: "",
      fecha_nacimiento: undefined,
      nacionalidad: "",
      nacionalidad_code: "",
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

    // Buscar códigos de país por nombre
    const findCountryCode = (countryName: string) => {
      const country = countries.find(c => c.name === countryName);
      return country?.isoCode || "";
    };

    // Cargar estado y ciudades correspondientes cuando editamos
    const paisResidenciaCode = findCountryCode(companion.pais_residencia);
    const paisProcedenciaCode = findCountryCode(companion.pais_procedencia);
    const nacionalidadCode = findCountryCode(companion.nacionalidad);

    // Actualizar estados para el país seleccionado
    if (paisResidenciaCode) {
      const states = State.getStatesOfCountry(paisResidenciaCode);
      setResidenciaStates(states);
    }
    if (paisProcedenciaCode) {
      const states = State.getStatesOfCountry(paisProcedenciaCode);
      setProcedenciaStates(states);
    }

    form.reset({
      ...companion,
      fecha_nacimiento: companion.fecha_nacimiento instanceof Date
        ? companion.fecha_nacimiento
        : new Date(companion.fecha_nacimiento),
      segundo_apellido: companion.segundo_apellido || "",
      telefono: companion.telefono || "",
      correo: companion.correo || "",
      pais_residencia_code: paisResidenciaCode,
      pais_procedencia_code: paisProcedenciaCode,
      nacionalidad_code: nacionalidadCode,
      ciudad_residencia_code: "",  // No podemos recuperar el código del estado
      ciudad_procedencia_code: "",  // No podemos recuperar el código del estado
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
        pais_procedencia: formData.pais_procedencia || data.pais_procedencia,
        ciudad_procedencia: formData.ciudad_procedencia || data.ciudad_procedencia,
      }
      : data

    // Remove code fields before saving
    const cleanedData = {...finalData};
    delete cleanedData.pais_residencia_code;
    delete cleanedData.ciudad_residencia_code;
    delete cleanedData.pais_procedencia_code;
    delete cleanedData.ciudad_procedencia_code;
    delete cleanedData.nacionalidad_code;

    if (editingIndex >= 0) {
      const updatedCompanions = [...companions]
      updatedCompanions[editingIndex] = cleanedData as CreateHuespedSecundarioWithoutIdDto
      setCompanions(updatedCompanions)
    } else {
      setCompanions([...companions, cleanedData as CreateHuespedSecundarioWithoutIdDto])
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
                  <div>
                    <p className="text-sm font-medium">
                      Acompañantes registrados: <span className="text-primary font-bold">{companions.length}</span>
                    </p>
                    {companions.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Los acompañantes aparecerán en la lista a continuación
                      </p>
                    )}
                  </div>
                  {!isAddingCompanion && (
                    <Button
                      onClick={handleAddCompanion}
                      className="gap-2"
                      size="sm"
                    >
                      <UserPlus className="h-4 w-4" />
                      Agregar Acompañante
                    </Button>
                  )}
                </div>
              </div>

              {companions.length === 0 && !isAddingCompanion && (
                <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
                  <AlertTitle className="flex items-center gap-2 text-amber-800">
                    <Info className="h-4 w-4" /> No hay acompañantes registrados
                  </AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Haga clic en el botón &quot;Agregar Acompañante&quot; para registrar a las personas que le acompañan.
                  </AlertDescription>
                </Alert>
              )}

              {companions.length > 0 && (
                <div className="border rounded-md overflow-hidden mb-4">
                  <div className="bg-muted/50 px-4 py-2 border-b">
                    <h4 className="font-medium text-sm">Lista de acompañantes</h4>
                  </div>
                  <ScrollArea className="h-64 rounded-b-md p-4">
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
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {isAddingCompanion && (
        <Card className="mb-6 border-primary shadow-sm">
          <div className="bg-primary-50 px-6 py-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">
                {editingIndex >= 0 ? "Editar acompañante" : "Nuevo acompañante"}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAddingCompanion(false)
                setEditingIndex(-1)
                resetCompanionForm()
              }}
              className="hover:bg-primary-100"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
          <CardContent className="pt-6">
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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full mb-6">
                    <TabsTrigger value="personal" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Datos personales</span>
                    </TabsTrigger>
                    <TabsTrigger value="ubicacion" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Nacionalidad y residencia</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-6">
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

                    <div className="flex justify-end mt-6">
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab("ubicacion")}
                        className="flex items-center gap-2"
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="ubicacion" className="space-y-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="nacionalidad_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nacionalidad</FormLabel>
                            {useSameInfoAsPrimary ? (
                              <div className="cursor-not-allowed flex items-center">
                                <Input 
                                  value={formData.nacionalidad || ""} 
                                  disabled 
                                  className="bg-muted/50 text-muted-foreground"
                                />
                              </div>
                            ) : (
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
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-primary">Lugar de residencia</h3>
                        <div className="rounded-lg border border-muted p-4 space-y-4">
                          <FormField
                            control={form.control}
                            name="pais_residencia_code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>País de residencia</FormLabel>
                                {useSameInfoAsPrimary ? (
                                  <div className="cursor-not-allowed flex items-center">
                                    <Input 
                                      value={formData.pais_residencia || ""} 
                                      disabled 
                                      className="bg-muted/50 text-muted-foreground"
                                    />
                                  </div>
                                ) : (
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      handleCountryResidenciaChange(value);
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione país" />
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
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!useSameInfoAsPrimary && (
                              <FormField
                                control={form.control}
                                name="ciudad_residencia_code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Estado/Departamento</FormLabel>
                                    <Select 
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        handleStateResidenciaChange(value);
                                      }} 
                                      value={field.value}
                                      disabled={!form.watch('pais_residencia_code')}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Seleccione estado/departamento" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="max-h-[200px]">
                                        {residenciaStates.map((state) => (
                                          <SelectItem key={state.isoCode} value={state.isoCode}>
                                            {state.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            <FormField
                              control={form.control}
                              name="ciudad_residencia"
                              render={({ field }) => (
                                <FormItem className={useSameInfoAsPrimary ? "col-span-2" : ""}>
                                  <FormLabel>Ciudad</FormLabel>
                                  {useSameInfoAsPrimary ? (
                                    <div className="cursor-not-allowed flex items-center">
                                      <Input 
                                        value={formData.ciudad_residencia || ""} 
                                        disabled 
                                        className="bg-muted/50 text-muted-foreground"
                                      />
                                    </div>
                                  ) : (
                                    residenciaCities.length > 0 ? (
                                      <Select 
                                        onValueChange={(value) => {
                                          field.onChange(value);
                                          handleCityResidenciaChange(value);
                                        }} 
                                        value={field.value}
                                        disabled={!form.watch('ciudad_residencia_code')}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Seleccione ciudad" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[200px]">
                                          {residenciaCities.map((city) => (
                                            <SelectItem key={city.name} value={city.name}>
                                              {city.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          placeholder="Ingrese ciudad de residencia" 
                                          disabled={!form.watch('pais_residencia_code')}
                                        />
                                      </FormControl>
                                    )
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-primary">Lugar de procedencia</h3>
                        <div className="rounded-lg border border-muted p-4 space-y-4">
                          <FormField
                            control={form.control}
                            name="pais_procedencia_code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>País de procedencia</FormLabel>
                                {useSameInfoAsPrimary ? (
                                  <div className="cursor-not-allowed flex items-center">
                                    <Input 
                                      value={formData.pais_procedencia || ""} 
                                      disabled 
                                      className="bg-muted/50 text-muted-foreground"
                                    />
                                  </div>
                                ) : (
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      handleCountryProcedenciaChange(value);
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione país" />
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
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!useSameInfoAsPrimary && (
                              <FormField
                                control={form.control}
                                name="ciudad_procedencia_code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Estado/Departamento</FormLabel>
                                    <Select 
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        handleStateProcedenciaChange(value);
                                      }} 
                                      value={field.value}
                                      disabled={!form.watch('pais_procedencia_code')}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Seleccione estado/departamento" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="max-h-[200px]">
                                        {procedenciaStates.map((state) => (
                                          <SelectItem key={state.isoCode} value={state.isoCode}>
                                            {state.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            <FormField
                              control={form.control}
                              name="ciudad_procedencia"
                              render={({ field }) => (
                                <FormItem className={useSameInfoAsPrimary ? "col-span-2" : ""}>
                                  <FormLabel>Ciudad</FormLabel>
                                  {useSameInfoAsPrimary ? (
                                    <div className="cursor-not-allowed flex items-center">
                                      <Input 
                                        value={formData.ciudad_procedencia || ""} 
                                        disabled 
                                        className="bg-muted/50 text-muted-foreground"
                                      />
                                    </div>
                                  ) : (
                                    procedenciaCities.length > 0 ? (
                                      <Select 
                                        onValueChange={(value) => {
                                          field.onChange(value);
                                          handleCityProcedenciaChange(value);
                                        }} 
                                        value={field.value}
                                        disabled={!form.watch('ciudad_procedencia_code')}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Seleccione ciudad" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[200px]">
                                          {procedenciaCities.map((city) => (
                                            <SelectItem key={city.name} value={city.name}>
                                              {city.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          placeholder="Ingrese ciudad de procedencia" 
                                          disabled={!form.watch('pais_procedencia_code')}
                                        />
                                      </FormControl>
                                    )
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("personal")}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      
                      <div className="flex space-x-2">
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
                    </div>
                  </TabsContent>
                </Tabs>
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