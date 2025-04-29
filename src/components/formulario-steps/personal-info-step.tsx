"use client"

import { useState, useEffect } from "react"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCountrySelection } from "@/lib/formulario/use-country-selection"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"

// Import our extracted components
import { PersonalDataTab } from "./components/personal-info/personal-data-tab"
import { ContactTab } from "./components/personal-info/contact-tab"
import { LocationTab } from "./components/personal-info/location-tab"
import { TravelTab } from "./components/personal-info/travel-tab"
import { TabNav } from "./components/personal-info/tab-nav"
import { personalInfoSchema, PersonalInfoFormValues } from "../../Types/personal-info-types"
import { ICountry, IState, ICity } from "country-state-city"

interface PersonalInfoStepProps {
  formData: Partial<CreateRegistroFormulario>
  updateFormData: (data: Partial<CreateRegistroFormulario>) => void
  onNext: () => void
}

// Field groups for each tab
const personalFields = [
  "tipo_documento", "numero_documento", "primer_apellido", 
  "segundo_apellido", "nombres", "fecha_nacimiento", 
  "nacionalidad", "genero"
];

const contactFields = [
  "telefono", "country_code", "correo"
];

const ubicacionFields = [
  "pais_residencia", "ciudad_residencia", "pais_procedencia", 
  "ciudad_procedencia", "ocupacion"
];

const viajeFields = [
  "motivo_viaje"
];

export function PersonalInfoStep({ formData, updateFormData, onNext }: PersonalInfoStepProps) {
  const [activeTab, setActiveTab] = useState<string>("personal")
  const [tabErrors, setTabErrors] = useState<Record<string, boolean>>({})
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

  // Track errors in form
  const formState = form.formState;
  const { errors } = formState;

  // Update tab errors whenever form errors change
  useEffect(() => {
    const newTabErrors: Record<string, boolean> = {};
    
    // Check for errors in personal fields
    newTabErrors.personal = personalFields.some(field => !!errors[field as keyof PersonalInfoFormValues]);
    
    // Check for errors in contact fields
    newTabErrors.contacto = contactFields.some(field => !!errors[field as keyof PersonalInfoFormValues]);
    
    // Check for errors in location fields
    newTabErrors.ubicacion = ubicacionFields.some(field => !!errors[field as keyof PersonalInfoFormValues]);
    
    // Check for errors in travel fields
    newTabErrors.viaje = viajeFields.some(field => !!errors[field as keyof PersonalInfoFormValues]);
    
    setTabErrors(newTabErrors);
  }, [errors]);

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
    // Validate fields in current tab before proceeding
    form.trigger(getFieldsForTab(activeTab) as Array<keyof PersonalInfoFormValues>).then(isValid => {
      if (isValid) {
        const currentIndex = tabOrder.indexOf(activeTab)
        if (currentIndex < tabOrder.length - 1) {
          setActiveTab(tabOrder[currentIndex + 1])
        }
      } else {
        // Show a toast notification when there are errors
        toast.error("Por favor complete todos los campos requeridos correctamente")
      }
    });
  }

  // Helper function to get fields for a specific tab
  const getFieldsForTab = (tab: string): string[] => {
    switch (tab) {
      case "personal": return personalFields;
      case "contacto": return contactFields;
      case "ubicacion": return ubicacionFields;
      case "viaje": return viajeFields;
      default: return [];
    }
  };

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
            <TabNav activeTab={activeTab} tabErrors={tabErrors} />
            
            {/* Pestaña de Datos Personales */}
            <TabsContent value="personal">
              <PersonalDataTab form={form} onNext={goToNextTab} />
            </TabsContent>
            
            {/* Pestaña de Contacto */}
            <TabsContent value="contacto">
              <ContactTab form={form} onNext={goToNextTab} onPrevious={goToPrevTab} />
            </TabsContent>
            
            {/* Pestaña de Ubicación */}
            <TabsContent value="ubicacion">
              <LocationTab 
                form={form} 
                onNext={goToNextTab} 
                onPrevious={goToPrevTab}
                countries={countries as ICountry[]}
                residenciaStates={residenciaStates as IState[]}
                residenciaCities={residenciaCities as ICity[]}
                procedenciaStates={procedenciaStates as IState[]}
                procedenciaCities={procedenciaCities as ICity[]}
                handleCountryResidenciaChange={handleCountryResidenciaChange}
                handleStateResidenciaChange={handleStateResidenciaChange}
                handleCityResidenciaChange={handleCityResidenciaChange}
                handleCountryProcedenciaChange={handleCountryProcedenciaChange}
                handleStateProcedenciaChange={handleStateProcedenciaChange}
                handleCityProcedenciaChange={handleCityProcedenciaChange}
                handleNacionalidadChange={handleNacionalidadChange}
              />
            </TabsContent>
            
            {/* Pestaña de Viaje */}
            <TabsContent value="viaje">
              <TravelTab 
                form={form} 
                formData={formData}
                onPrevious={goToPrevTab}
                onSubmit={form.handleSubmit(onSubmit)}
              />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
} 