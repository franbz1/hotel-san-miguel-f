"use client"

import React, { ReactNode, useEffect } from "react"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"
import { toast } from "sonner"
import { createRegistroFormulario } from "@/lib/formulario/registro-formulario-service"

interface FormStepsWrapperProps {
  children: ReactNode
  currentStep: number
  formData: Partial<CreateRegistroFormulario>
  token: string
  isLastStep: boolean
}

export function FormStepsWrapper({ 
  children, 
  currentStep, 
  formData, 
  token,
  isLastStep
}: FormStepsWrapperProps) {
  // Handle form submission
  useEffect(() => {
    const submitForm = async () => {
      if (isLastStep) {
        try {
          await createRegistroFormulario(token, formData as CreateRegistroFormulario)
          
          console.log("Formulario enviado:", formData)
          
          toast.success("Registro completado", {
            description: "Sus datos han sido registrados correctamente",
          })
        } catch (error) {
          console.error("Error al enviar el formulario:", error)
          const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido."
          toast.error("Error al enviar el formulario", {
            description: errorMessage,
          })
        }
      }
    }

    if (isLastStep) {
      submitForm()
    }
  }, [isLastStep, formData, token])

  // Get the current step from children
  const childrenArray = React.Children.toArray(children);
  const currentChild = childrenArray[currentStep];

  return <>{currentChild}</>;
} 