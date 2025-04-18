"use client"

import { useState } from "react"
import { WelcomeStep } from "@/components/welcome-step"
import { PersonalInfoStep } from "@/components/personal-info-step"
import { CompanionsStep } from "@/components/companions-step"
import { SuccessStep } from "@/components/success-step"
import { LinkFormulario } from "@/Types/link-formulario"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"
import { useEffect } from "react"
import { createRegistroFormulario } from "@/lib/registro-formulario-service"
import { toast } from "sonner"

export default function RegistroFormulario({ linkFormulario }: { linkFormulario: LinkFormulario }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<CreateRegistroFormulario>>({
    fecha_inicio: linkFormulario.fechaInicio,
    fecha_fin: linkFormulario.fechaFin,
    costo: linkFormulario.costo,
    numero_habitacion: linkFormulario.numeroHabitacion,
    numero_acompaniantes: 0,
  })

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const updateFormData = (data: Partial<CreateRegistroFormulario>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  useEffect(() => {
    // Cuando llegamos al paso final, enviamos el formulario a la API
    const submitForm = async () => {
      if (currentStep === 3 && !isSubmitting) {
        try {
          setIsSubmitting(true)
          // Aquí enviaríamos los datos a tu API
          // await createRegistroFormulario(linkFormulario.token, formData as CreateRegistroFormulario)
          
          // Simulación de envío exitoso
          console.log("Formulario enviado:", formData)
          
          toast.success("Registro completado", {
            description: "Sus datos han sido registrados correctamente",
          })
        } catch (error) {
          console.error("Error al enviar el formulario:", error)
          toast.error("Error", {
            description: "Ocurrió un error al enviar el formulario. Por favor, intente nuevamente.",
          })
        } finally {
          setIsSubmitting(false)
        }
      }
    }

    submitForm()
  }, [currentStep, formData, linkFormulario, isSubmitting])

  const steps = [
    <WelcomeStep key="welcome" formData={formData} onNext={handleNext} />,
    <PersonalInfoStep 
      key="personal" 
      formData={formData} 
      updateFormData={updateFormData} 
      onNext={handleNext} 
    />,
    <CompanionsStep
      key="companions"
      formData={formData}
      updateFormData={updateFormData}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />,
    <SuccessStep key="success" formData={formData} />,
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <header className="px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Hotel San Miguel</h1>
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-help-circle"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </button>
        </header>

        {steps[currentStep]}
      </div>
    </div>
  )
}
