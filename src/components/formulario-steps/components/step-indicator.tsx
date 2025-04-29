"use client"

import clsx from "clsx"
import { Check } from "lucide-react"
import { FormStep } from "../../../lib/common/constants/form-steps"

interface StepIndicatorProps {
  steps: FormStep[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-8 px-4">
      {steps.map((step, index) => {
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