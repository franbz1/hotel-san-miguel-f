"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/common/utils"

export interface WizardControlsProps {
  isFirst: boolean
  isLast: boolean
  goBack: () => void
  goNext: () => void
  isLoading?: boolean
  className?: string
  backLabel?: string
  nextLabel?: string
  finishLabel?: string
  onCancel?: () => void
  cancelLabel?: string
  showCancel?: boolean
}

export function WizardControls({
  isFirst,
  isLast,
  goBack,
  goNext,
  isLoading = false,
  className,
  backLabel = "Atrás",
  nextLabel = "Siguiente", 
  finishLabel = "Finalizar",
  onCancel,
  cancelLabel = "Cancelar",
  showCancel = false,
}: WizardControlsProps) {
  return (
    <div
      className={cn(
        // Cambios responsive: en móvil, apilar vertical y full width, y poner el bloque de acciones a la izquierda al final
        "flex flex-col-reverse gap-2 pt-2 border-t sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className
      )}
    >
      {/* Lado izquierdo - Botón Anterior y Cancelar (en móvil, Cancelar va al final) */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
        {showCancel && onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
        )}
        {!isFirst && (
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={isLoading}
            className="min-w-0 w-full sm:w-auto sm:min-w-24"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            {backLabel}
          </Button>
        )}
      </div>

      {/* Lado derecho - Botón Siguiente/Finalizar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
        <Button
          type="button"
          onClick={goNext}
          disabled={isLoading}
          className={cn(
            "min-w-0 w-full sm:w-auto sm:min-w-28 font-medium",
            isLast && "bg-green-600 hover:bg-green-700 focus:ring-green-500"
          )}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Procesando...
            </>
          ) : isLast ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1" />
              {finishLabel}
            </>
          ) : (
            <>
              {nextLabel}
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export interface WizardControlsExtendedProps extends WizardControlsProps {
  // Props adicionales para casos de uso más avanzados
  customLeftActions?: React.ReactNode
  customRightActions?: React.ReactNode
  hideDefaultControls?: boolean
}

export function WizardControlsExtended({
  customLeftActions,
  customRightActions,
  hideDefaultControls = false,
  ...props
}: WizardControlsExtendedProps) {
  if (hideDefaultControls) {
    return (
      <div className={cn("flex items-center justify-between gap-4 pt-6 border-t", props.className)}>
        <div className="flex items-center gap-2">
          {customLeftActions}
        </div>
        <div className="flex items-center gap-2">
          {customRightActions}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-between gap-4 pt-6 border-t", props.className)}>
      {/* Lado izquierdo */}
      <div className="flex items-center gap-2">
        {customLeftActions}
        
        {props.showCancel && props.onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={props.onCancel}
            disabled={props.isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            {props.cancelLabel}
          </Button>
        )}
        
        {!props.isFirst && (
          <Button
            type="button"
            variant="outline"
            onClick={props.goBack}
            disabled={props.isLoading}
            className="min-w-24"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            {props.backLabel}
          </Button>
        )}
      </div>

      {/* Lado derecho */}
      <div className="flex items-center gap-2">
        {customRightActions}
        
        <Button
          type="button"
          onClick={props.goNext}
          disabled={props.isLoading}
          className={cn(
            "min-w-28 font-medium",
            props.isLast && "bg-green-600 hover:bg-green-700 focus:ring-green-500"
          )}
        >
          {props.isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Procesando...
            </>
          ) : props.isLast ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1" />
              {props.finishLabel}
            </>
          ) : (
            <>
              {props.nextLabel}
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 