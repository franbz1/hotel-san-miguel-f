"use client"

import React, { ReactNode, useEffect, useState } from "react"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"
import { toast } from "sonner"
import { createRegistroFormulario } from "@/lib/formulario/registro-formulario-service"

interface FormStepsWrapperProps {
  children: ReactNode
  currentStep: number
  formData: Partial<CreateRegistroFormulario>
  token: string
  isLastStep: boolean
  onSubmitStatusChange?: (status: { isSubmitting: boolean; hasAttemptedSubmit: boolean; submitError: string | null }) => void
}

export function FormStepsWrapper({ 
  children, 
  currentStep, 
  formData, 
  token,
  isLastStep,
  onSubmitStatusChange
}: FormStepsWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
const ParseFormData = (formData: Partial<CreateRegistroFormulario>) : CreateRegistroFormulario => {
  // Convertir campos opcionales con cadenas vacías a null
  const cleanData = { ...formData };
  
  // Lista de campos opcionales que deben ser null en lugar de cadena vacía
  const optionalFields = [
    'segundo_apellido',
    'correo',
    'telefono',
  ];

  // Convertir cadenas vacías a null
  Object.keys(cleanData).forEach(key => {
    if (optionalFields.includes(key) && cleanData[key as keyof typeof cleanData] === '') {
      (cleanData as any)[key] = null;
    }
  });

  // Procesar acompañantes (huespedes_secundarios)
  if (cleanData.huespedes_secundarios && Array.isArray(cleanData.huespedes_secundarios)) {
    cleanData.huespedes_secundarios = cleanData.huespedes_secundarios.map(huesped => {
      const limpio = { ...huesped };
      
      // Aplicar la misma lógica a cada acompañante
      optionalFields.forEach(field => {
        if (field in limpio && (limpio as any)[field] === '') {
          (limpio as any)[field] = null;
        }
      });
      
      return limpio;
    });
  }
  
  return cleanData as CreateRegistroFormulario;
}

  // Handle form submission
  useEffect(() => {
    const submitForm = async () => {
      if (isLastStep && !hasAttemptedSubmit) {
        setIsSubmitting(true)
        setSubmitError(null)
        
        // Notificar al componente padre sobre el cambio de estado
        onSubmitStatusChange?.({ isSubmitting: true, hasAttemptedSubmit: true, submitError: null })
        
        try {
          // Verificar que todos los campos requeridos estén presentes
          const requiredFields = [
            'nombres', 'primer_apellido', 'tipo_documento', 'numero_documento',
            'nacionalidad', 'motivo_viaje', 'fecha_inicio', 'fecha_fin', 'costo'
          ];
          
          const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
          if (missingFields.length > 0) {
            throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
          }

          // Parsear datos antes de enviar
          await createRegistroFormulario(token, ParseFormData(formData))
          setSubmitError(null)
          toast.success("Registro completado", {
            description: "Sus datos han sido registrados correctamente",
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido."
          setSubmitError(errorMessage)
          
          toast.error("Error al enviar el formulario", {
            description: errorMessage,
          })
        } finally {
          setIsSubmitting(false)
          setHasAttemptedSubmit(true)
          
          // Notificar al componente padre sobre el cambio de estado
          onSubmitStatusChange?.({ 
            isSubmitting: false, 
            hasAttemptedSubmit: true, 
            submitError: submitError
          })
        }
      }
    }

    if (isLastStep) {
      submitForm()
    }
  }, [isLastStep, formData, token, hasAttemptedSubmit, submitError, onSubmitStatusChange])

  // Get the current step from children
  const childrenArray = React.Children.toArray(children);
  let currentChild = childrenArray[currentStep];
  
  // Si es el último paso (SuccessStep), inyectar las propiedades de estado del envío
  // pero solo si el elemento tiene las props esperadas (duck typing)
  if (isLastStep && React.isValidElement(currentChild)) {
    // Verifiquemos si el componente es SuccessStep y manejemos explícitamente sus props
    const componentName = (currentChild.type as any)?.name;
    if (componentName === 'SuccessStep') {
      currentChild = React.cloneElement(currentChild, {
        isSubmitting,
        hasAttemptedSubmit,
        submitError
      } as any);
    }
  }

  return <>{currentChild}</>;
}