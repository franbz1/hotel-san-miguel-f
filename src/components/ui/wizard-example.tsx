"use client"

import React from "react"
import { Wizard } from "../Wizard"
import { WizardProgress } from "./wizard-progress"
import { WizardControls } from "./wizard-controls"

// Ejemplos de pasos para el wizard
const PasoUno = () => (
  <div className="py-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Paso 1: Información Personal</h2>
    <p className="text-muted-foreground">
      Aquí recopilaremos tu información personal básica.
    </p>
    <div className="mt-6 p-4 bg-muted rounded-lg">
      <p className="text-sm">Contenido del formulario aquí...</p>
    </div>
  </div>
)

const PasoDos = () => (
  <div className="py-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Paso 2: Preferencias</h2>
    <p className="text-muted-foreground">
      Configura tus preferencias y opciones.
    </p>
    <div className="mt-6 p-4 bg-muted rounded-lg">
      <p className="text-sm">Opciones de configuración aquí...</p>
    </div>
  </div>
)

const PasoTres = () => (
  <div className="py-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Paso 3: Confirmación</h2>
    <p className="text-muted-foreground">
      Revisa y confirma toda la información.
    </p>
    <div className="mt-6 p-4 bg-muted rounded-lg">
      <p className="text-sm">Resumen de la información aquí...</p>
    </div>
  </div>
)

// Definición de tipos para los pasos
type WizardStepKeys = "informacion" | "preferencias" | "confirmacion"

export function WizardExample() {
  const [isLoading, setIsLoading] = React.useState(false)

  // Definición de los pasos del wizard
  const wizardSteps = [
    {
      key: "informacion" as const,
      component: PasoUno,
      label: "Información Personal",
    },
    {
      key: "preferencias" as const,
      component: PasoDos,
      label: "Preferencias",
    },
    {
      key: "confirmacion" as const,
      component: PasoTres,
      label: "Confirmación",
    },
  ]

  // Etiquetas personalizadas para los pasos
  const stepLabels: Record<WizardStepKeys, string> = {
    informacion: "Información Personal",
    preferencias: "Configurar Preferencias",
    confirmacion: "Revisar y Confirmar",
  }

  // Simulación de envío de datos
  const handleFinish = async () => {
    setIsLoading(true)
    // Simular una operación asíncrona
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    alert("¡Wizard completado exitosamente!")
  }

  const handleCancel = () => {
    if (confirm("¿Estás seguro de que quieres cancelar?")) {
      alert("Wizard cancelado")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Ejemplo de Wizard Moderno
        </h1>
        <p className="text-center text-muted-foreground">
          Implementación completa con componentes personalizados
        </p>
      </div>

      <div className="bg-card border rounded-lg shadow-sm p-6">
        <Wizard
          steps={wizardSteps}
          defaultStep="informacion"
          renderProgress={({ progress, goToStep }) => (
            <WizardProgress
              progress={progress}
              goToStep={goToStep}
              stepLabels={stepLabels}
            />
          )}
          renderButtons={({ isFirst, isLast, goBack, goNext }) => (
            <WizardControls
              isFirst={isFirst}
              isLast={isLast}
              goBack={goBack}
              goNext={isLast ? handleFinish : goNext}
              isLoading={isLoading}
              showCancel={true}
              onCancel={handleCancel}
              backLabel="Volver"
              nextLabel="Continuar"
              finishLabel="Completar Registro"
              cancelLabel="Cancelar Proceso"
            />
          )}
        />
      </div>

      {/* Información adicional */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Este ejemplo muestra cómo usar el wizard con componentes personalizados
          para progreso y controles.
        </p>
      </div>
    </div>
  )
}

// Ejemplo básico sin customización
export function SimpleWizardExample() {
  const wizardSteps = [
    { key: "step1" as const, component: PasoUno },
    { key: "step2" as const, component: PasoDos },
    { key: "step3" as const, component: PasoTres },
  ]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Wizard Básico</h1>
      
      <div className="bg-card border rounded-lg p-6">
        <Wizard steps={wizardSteps} defaultStep="step1" />
      </div>
    </div>
  )
} 