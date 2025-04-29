"use client"

import { ReactNode } from "react"
import { HelpCircle } from "lucide-react"
import { StepIndicator } from "./step-indicator"
import { FormStep } from "../../../lib/common/constants/form-steps"

interface FormLayoutProps {
  children: ReactNode
  currentStep: number
  steps: FormStep[]
  onHelp: () => void
}

export function FormLayout({ children, currentStep, steps, onHelp }: FormLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden w-full">
        <header className="px-4 sm:px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Hotel San Miguel</h1>
          <button className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={onHelp}>
            <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </header>
        
        <div className="py-4 sm:py-6 px-2 sm:px-0">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {children}
      </div>
    </div>
  )
} 