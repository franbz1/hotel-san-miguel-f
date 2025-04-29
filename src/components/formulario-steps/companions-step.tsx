"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"
import { CreateHuespedSecundarioWithoutIdDto } from "@/Types/huesped-secundario-sin-id-Dto"
import { companionSchema, CompanionFormValue } from "@/Types/companions-info-types"
import { toast } from "sonner"
import { useCountrySelection } from "@/lib/formulario/use-country-selection"

// Importar los componentes desacoplados
import { CompanionsList } from "./components/companions/CompanionsList"
import { CompanionForm } from "./components/companions/CompanionForm"
import { CompanionCheckbox } from "./components/companions/CompanionCheckbox"
import { NavigationButtons } from "./components/companions/NavigationButtons"

interface CompanionsStepProps {
  formData: Partial<CreateRegistroFormulario>
  updateFormData: (data: Partial<CreateRegistroFormulario>) => void
  onNext: () => void
  onPrevious: () => void
}

export function CompanionsStep({ formData, updateFormData, onNext, onPrevious }: CompanionsStepProps) {
  // Estado para controlar si tiene acompañantes
  const [hasCompanions, setHasCompanions] = useState(
    formData.huespedes_secundarios ? formData.huespedes_secundarios.length > 0 : false
  )
  
  // Estado para los acompañantes
  const [companions, setCompanions] = useState<CreateHuespedSecundarioWithoutIdDto[]>(
    formData.huespedes_secundarios || []
  )
  
  // Estados de UI para manejar el formulario
  const [isAddingCompanion, setIsAddingCompanion] = useState(false)
  const [editingCompanionIndex, setEditingCompanionIndex] = useState<number | null>(null)
  
  // Inicializar formulario con React Hook Form y Zod
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

  // Usar hook de selección de países
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

  // Cuando cambia el checkbox, limpiar acompañantes si se desmarca
  useEffect(() => {
    if (!hasCompanions) {
      setCompanions([])
      // Solo actualizar formData si realmente hay un cambio
      if (formData.huespedes_secundarios?.length) {
        updateFormData({ 
          huespedes_secundarios: [],
          numero_acompaniantes: 0 
        })
      }
    }
  }, [hasCompanions, updateFormData, formData.huespedes_secundarios?.length])

  // Actualizar formData cuando cambia el estado de companions
  useEffect(() => {
    if (hasCompanions && companions.length > 0) {
      // Solo actualizar formData si realmente hay un cambio
      if (formData.huespedes_secundarios?.length !== companions.length || 
          JSON.stringify(formData.huespedes_secundarios) !== JSON.stringify(companions)) {
        updateFormData({ 
          huespedes_secundarios: companions,
          numero_acompaniantes: companions.length 
        })
      }
    }
  }, [companions, hasCompanions, updateFormData, formData.huespedes_secundarios])

  // Resetear formulario al salir del modo añadir/editar
  const resetForm = () => {
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
  }

  // Manejar el añadir un nuevo acompañante
  const handleAddCompanion = () => {
    setIsAddingCompanion(true)
    resetForm()
  }

  // Manejar el guardar un acompañante (añadir o editar)
  const handleSubmitCompanion = (values: CompanionFormValue) => {
    // Limpiar valores antes de guardar
    const cleanedValues = { ...values } as CreateHuespedSecundarioWithoutIdDto
    
    // Remover campos temporales usados solo en el formulario
    const tempFormFields: Array<keyof CompanionFormValue> = [
      'pais_residencia_code',
      'ciudad_residencia_code',
      'pais_procedencia_code',
      'ciudad_procedencia_code',
      'nacionalidad_code'
    ]
    
    // Eliminar campos temporales
    tempFormFields.forEach(field => {
      if (field in cleanedValues) {
        delete (cleanedValues as Record<string, unknown>)[field]
      }
    })

    if (editingCompanionIndex !== null) {
      // Actualizar acompañante existente
      const updatedCompanions = [...companions]
      updatedCompanions[editingCompanionIndex] = cleanedValues
      setCompanions(updatedCompanions)
      toast.success("Acompañante actualizado correctamente")
    } else {
      // Añadir nuevo acompañante
      setCompanions([...companions, cleanedValues])
      toast.success("Acompañante agregado correctamente")
    }

    // Resetear estado de UI
    setIsAddingCompanion(false)
    setEditingCompanionIndex(null)
    resetForm()
  }

  // Manejar la edición de un acompañante existente
  const handleEditCompanion = (index: number) => {
    const companion = companions[index]
    
    // Establecer valores del formulario para edición
    form.reset({
      ...companion,
      // Añadir campos de código que podrían ser necesarios
      pais_residencia_code: "",
      ciudad_residencia_code: "",
      pais_procedencia_code: "",
      ciudad_procedencia_code: "",
      nacionalidad_code: "",
    } as CompanionFormValue)
    
    setEditingCompanionIndex(index)
    setIsAddingCompanion(true)
  }

  // Manejar la eliminación de un acompañante
  const handleDeleteCompanion = (index: number) => {
    const updatedCompanions = companions.filter((_, i) => i !== index)
    setCompanions(updatedCompanions)
    toast.success("Acompañante eliminado correctamente")
  }

  // Cancelar añadir/editar un acompañante
  const handleCancelCompanion = () => {
    setIsAddingCompanion(false)
    setEditingCompanionIndex(null)
    resetForm()
  }

  // Manejar el submit del formulario para avanzar
  const handleSubmit = () => {
    // Actualizar formData con la lista final de acompañantes
    updateFormData({
      huespedes_secundarios: companions,
      numero_acompaniantes: companions.length
    })
    onNext()
  }

  // Manejar cambio en checkbox de acompañantes
  const handleCompanionCheckboxChange = (checked: boolean) => {
    setHasCompanions(checked)
  }

  return (
    <div className="p-6 pt-0">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Acompañantes</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Indique si viaja con acompañantes y proporcione sus datos.
        </p>
      </div>

                    <div className="space-y-6">
        {/* Checkbox para indicar si tiene acompañantes */}
        <CompanionCheckbox 
          hasCompanions={hasCompanions} 
          onChange={handleCompanionCheckboxChange} 
        />

        {/* Lista de acompañantes */}
        {hasCompanions && !isAddingCompanion && (
          <CompanionsList 
            companions={companions}
            onAddCompanion={handleAddCompanion}
            onEditCompanion={handleEditCompanion}
            onDeleteCompanion={handleDeleteCompanion}
          />
        )}

        {/* Formulario para añadir/editar acompañante */}
        {hasCompanions && isAddingCompanion && (
          <CompanionForm 
            form={form}
            isEditing={editingCompanionIndex !== null}
            onSubmit={handleSubmitCompanion}
            onCancel={handleCancelCompanion}
            countries={countries}
            residenciaStates={residenciaStates}
            residenciaCities={residenciaCities}
            procedenciaStates={procedenciaStates}
            procedenciaCities={procedenciaCities}
            handleCountryResidenciaChange={handleCountryResidenciaChange}
            handleStateResidenciaChange={handleStateResidenciaChange}
            handleCityResidenciaChange={handleCityResidenciaChange}
            handleCountryProcedenciaChange={handleCountryProcedenciaChange}
            handleStateProcedenciaChange={handleStateProcedenciaChange}
            handleCityProcedenciaChange={handleCityProcedenciaChange}
            handleNacionalidadChange={handleNacionalidadChange}
          />
        )}

        {/* Botones de navegación */}
        <NavigationButtons 
          onNext={handleSubmit} 
          onPrevious={onPrevious} 
        />
      </div>
    </div>
  )
} 