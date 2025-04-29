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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <header className="px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Hotel San Miguel</h1>
          <button className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={onHelp}>
            <HelpCircle className="h-6 w-6" />
          </button>
        </header>
        
        <div className="py-6">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {children}
      </div>
    </div>
  )
} 