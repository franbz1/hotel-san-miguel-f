"use client"

import { useState } from "react"
import { WelcomeStep } from "@/components/welcome-step"
import { PersonalInfoStep } from "@/components/personal-info-step"
import { CompanionsStep } from "@/components/companions-step"
import { SuccessStep } from "@/components/success-step"
import { LinkFormulario } from "@/Types/link-formulario"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"


export default function RegistroFormulario({ linkFormulario }: { linkFormulario: LinkFormulario }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<CreateRegistroFormulario>({})

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const steps = [
    <WelcomeStep key="welcome" formData={formData} onNext={handleNext} />,
    <PersonalInfoStep key="personal" formData={formData} updateFormData={updateFormData} onNext={handleNext} />,
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
