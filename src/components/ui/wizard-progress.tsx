"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/common/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"
import { StepStatus } from "@/hooks/useWizard"

export interface WizardProgressProps<StepKey extends string> {
  progress: Array<{ key: StepKey; status: StepStatus }>
  goToStep: (step: StepKey) => void
  stepLabels?: Record<StepKey, string>
  className?: string
}

export function WizardProgress<StepKey extends string>({
  progress,
  goToStep,
  stepLabels = {} as Record<StepKey, string>,
  className,
}: WizardProgressProps<StepKey>) {
  const totalSteps = progress.length

  return (
    <div className={cn("w-full py-6", className)}>
      <div className="flex items-center justify-between relative">
        {/* Línea de progreso de fondo */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted transform -translate-y-1/2 z-0" />
        
        {/* Línea de progreso activa */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary transform -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
          style={{
            width: `${(progress.findIndex(p => p.status === 'current') / (totalSteps - 1)) * 100}%`
          }}
        />

        {progress.map((step, index) => {
          const isClickable = step.status === 'completed'
          const stepNumber = index + 1
          const label = stepLabels[step.key] || step.key

          return (
            <Tooltip key={step.key} delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => isClickable && goToStep(step.key)}
                  disabled={!isClickable}
                  className={cn(
                    "relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 transform",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    {
                      // Paso completado
                      "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer": 
                        step.status === 'completed',
                      
                      // Paso actual
                      "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20 scale-110": 
                        step.status === 'current',
                      
                      // Paso futuro
                      "bg-muted text-muted-foreground cursor-not-allowed": 
                        step.status === 'upcoming',
                    }
                  )}
                  aria-label={`Paso ${stepNumber}: ${label}`}
                >
                  {step.status === 'completed' ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{stepNumber}</span>
                  )}
                </button>
              </TooltipTrigger>
              
              <TooltipContent side="bottom" className="max-w-48">
                <div className="text-center">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs opacity-80 mt-1">
                    {step.status === 'completed' && 'Completado ✓'}
                    {step.status === 'current' && 'Paso actual'}
                    {step.status === 'upcoming' && 'Pendiente'}
                  </div>
                  {isClickable && (
                    <div className="text-xs opacity-60 mt-1">
                      Clic para volver a este paso
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {/* Etiquetas de los pasos - versión móvil */}
      <div className="md:hidden mt-6">
        <div className="text-center">
          <div className="text-sm font-medium text-foreground">
            {stepLabels[progress.find(p => p.status === 'current')?.key as StepKey] || 
              progress.find(p => p.status === 'current')?.key}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Paso {progress.findIndex(p => p.status === 'current') + 1} de {totalSteps}
          </div>
        </div>
      </div>

      {/* Etiquetas de los pasos - versión desktop */}
      <div className="hidden md:flex justify-between mt-4">
        {progress.map((step) => {
          const label = stepLabels[step.key] || step.key
          return (
            <div key={step.key} className="flex-1 text-center">
              <div 
                className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  {
                    "text-primary": step.status === 'current',
                    "text-foreground": step.status === 'completed',
                    "text-muted-foreground": step.status === 'upcoming',
                  }
                )}
              >
                {label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 