"use client"

import { useMemo, useState } from "react"
import { WelcomeStep } from "@/components/formulario-steps/welcome-step"
import { PersonalInfoStep } from "@/components/formulario-steps/personal-info-step"
import { CompanionsStep } from "@/components/formulario-steps/companions-step"
import { SuccessStep } from "@/components/formulario-steps/success-step"
import { LinkFormulario } from "@/Types/link-formulario"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"
import { useEffect } from "react"
import { createRegistroFormulario } from "@/lib/formulario/registro-formulario-service"
import { toast } from "sonner"
import { Check, Circle, HelpCircle, User, Users } from "lucide-react"
import clsx from "clsx"

// Definición de los pasos del formulario
const formSteps = [
  { name: "Bienvenida", icon: Circle },
  { name: "Datos Personales", icon: User },
  { name: "Acompañantes", icon: Users },
  { name: "Confirmación", icon: Check },
]

// Componente para el indicador de pasos
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-8 px-4">
      {formSteps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <div key={step.name} className="flex items-center">
            {index > 0 && (
              <div className={clsx(
                "h-0.5 w-8 md:w-12 transition-colors duration-300 ease-in-out",
                isCompleted || isCurrent ? "bg-primary" : "bg-gray-200"
              )}></div>
            )}
            <div className="flex flex-col items-center space-y-1">
              <div
                className={clsx(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ease-in-out",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 scale-110"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4 md:h-5" /> : index + 1}
              </div>
              <span 
                className={clsx(
                  "text-xs md:text-sm text-center transition-colors duration-300 ease-in-out",
                  isCurrent ? "text-primary font-semibold" : "text-gray-600"
                )}
              >
                {step.name}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function RegistroFormulario({ linkFormulario }: { linkFormulario: LinkFormulario }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<CreateRegistroFormulario>>({
    fecha_inicio: linkFormulario.fechaInicio,
    fecha_fin: linkFormulario.fechaFin,
    costo: linkFormulario.costo,
    numero_habitacion: linkFormulario.numeroHabitacion,
    numero_acompaniantes: 0,
  })

  const token = useMemo(() => {
    const token = linkFormulario.url.split('/').pop()
    if (!token) {
      throw new Error("Token no encontrado en la URL")
    }
    return token
  }, [linkFormulario.url])

  const handleNext = () => {
    setCurrentStep((prev) => (prev < formSteps.length - 1 ? prev + 1 : prev))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const updateFormData = (data: Partial<CreateRegistroFormulario>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleHelp = () => {
    window.open("https://wa.me/573216611888", "_blank")
  }

  useEffect(() => {
    const submitForm = async () => {
      if (currentStep === formSteps.length - 1 && !isSubmitting && !hasAttemptedSubmit) {
        setSubmitError(null)
        try {
          setIsSubmitting(true)
          setHasAttemptedSubmit(true)
          await createRegistroFormulario(token, formData as CreateRegistroFormulario)
          
          console.log("Formulario enviado:", formData)
          
          toast.success("Registro completado", {
            description: "Sus datos han sido registrados correctamente",
          })
        } catch (error) {
          console.error("Error al enviar el formulario:", error)
          const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido."
          setSubmitError(errorMessage)
          toast.error("Error al enviar el formulario", {
            description: errorMessage,
          })
        } finally {
          setIsSubmitting(false)
        }
      }
    }

    submitForm()
  }, [currentStep, formData, linkFormulario, isSubmitting, token, hasAttemptedSubmit])

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
    <SuccessStep 
      key="success" 
      formData={formData} 
      isSubmitting={isSubmitting} 
      hasAttemptedSubmit={hasAttemptedSubmit}
      submitError={submitError}
    />,
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <header className="px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Hotel San Miguel</h1>
          <button className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={handleHelp}>
            <HelpCircle className="h-6 w-6" />
          </button>
        </header>
        
        <div className="py-6">
          <StepIndicator currentStep={currentStep} />
        </div>

        {steps[currentStep]}
      </div>
    </div>
  )
}
