"use client"

import { useMemo, useState } from "react"
import { WelcomeStep } from "@/components/formulario-steps/welcome-step"
import { PersonalInfoStep } from "@/components/formulario-steps/personal-info-step"
import { CompanionsStep } from "@/components/formulario-steps/companions-step"
import { SuccessStep } from "@/components/formulario-steps/success-step"
import { LinkFormulario } from "@/Types/link-formulario"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"
import { FormLayout } from "./components/form-layout"
import { FormStepsWrapper } from "./components/form-steps-wrapper"
import { formSteps } from "../../lib/common/constants/form-steps"

export default function RegistroFormulario({ linkFormulario }: { linkFormulario: LinkFormulario }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<CreateRegistroFormulario>>({
    fecha_inicio: linkFormulario.fechaInicio,
    fecha_fin: linkFormulario.fechaFin,
    costo: linkFormulario.costo,
    numero_habitacion: linkFormulario.numeroHabitacion,
    numero_acompaniantes: 0,
  })
  const [submissionStatus, setSubmissionStatus] = useState({
    isSubmitting: false,
    hasAttemptedSubmit: false,
    submitError: null as string | null
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

  const isLastStep = currentStep === formSteps.length - 1

  return (
    <FormLayout 
      currentStep={currentStep} 
      steps={formSteps} 
      onHelp={handleHelp}
    >
      <FormStepsWrapper
        currentStep={currentStep}
        formData={formData}
        token={token}
        isLastStep={isLastStep}
        onSubmitStatusChange={setSubmissionStatus}
      >
        <WelcomeStep key="welcome" formData={formData} onNext={handleNext} />
        <PersonalInfoStep 
          key="personal" 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={handleNext} 
        />
        <CompanionsStep
          key="companions"
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
        <SuccessStep 
          key="success" 
          formData={formData}
          isSubmitting={submissionStatus.isSubmitting}
          hasAttemptedSubmit={submissionStatus.hasAttemptedSubmit}
          submitError={submissionStatus.submitError}
        />
      </FormStepsWrapper>
    </FormLayout>
  )
}
