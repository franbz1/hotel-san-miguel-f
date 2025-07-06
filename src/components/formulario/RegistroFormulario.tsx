'use client';

import { useFormularioContext } from './FormularioWrapper';
import { PasoBienvenida } from './pasos/PasoBienvenida';
import { PasoInformacionPersonal } from './pasos/PasoInformacionPersonal';
import { PasoAcompaniantes } from './pasos/PasoAcompaniantes';
import { PasoConfirmacion } from './pasos/PasoConfirmacion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkFormulario } from '@/Types/link-formulario';

interface RegistroFormularioProps {
  linkFormulario: LinkFormulario;
  isSubmitting?: boolean;
}

/**
 * RegistroFormulario - Componente presentacional para el formulario de registro
 * 
 * RESPONSABILIDADES:
 * - Renderizar la interfaz del formulario paso a paso
 * - Mostrar indicadores de progreso y navegación
 * - Delegar la lógica de navegación al FormularioWrapper
 * - Presentar información del link (solo para mostrar al usuario)
 * - Manejar estados de UI (loading, disable buttons, etc.)
 * 
 * NO DEBE:
 * - Manejar lógica de validación (delegada al wrapper)
 * - Controlar navegación de pasos directamente
 * - Ejecutar mutaciones o llamadas a API
 * - Conocer detalles del negocio del formulario
 */
export const RegistroFormulario = ({ linkFormulario, isSubmitting = false }: RegistroFormularioProps) => {
  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    canAdvance,
    validateAndAdvance
  } = useFormularioContext();

  // ==========================================
  // RENDERIZADO DE PASOS
  // ==========================================

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PasoBienvenida />;
      case 3:
        return <PasoInformacionPersonal />;
      case 2:
        return <PasoAcompaniantes />;
      case 4:
        return <PasoConfirmacion />;
      default:
        return <PasoBienvenida />;
    }
  };

  // ==========================================
  // CONFIGURACIÓN DE PASOS
  // ==========================================

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Bienvenida';
      case 2:
        return 'Información Personal';
      case 3:
        return 'Acompañantes';
      case 4:
        return 'Confirmación';
      default:
        return 'Formulario de Registro';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'Información sobre el proceso de registro';
      case 2:
        return 'Complete sus datos personales y de contacto';
      case 3:
        return 'Registre los datos de sus acompañantes';
      case 4:
        return 'Revise y confirme la información antes de enviar';
      default:
        return '';
    }
  };

  // ==========================================
  // HANDLERS DE NAVEGACIÓN
  // ==========================================

  const handleNext = async () => {
    if (currentStep === 2 || currentStep === 3) {
      // Validar antes de avanzar en pasos con formularios
      await validateAndAdvance();
    } else {
      // Avanzar directamente en pasos sin validación
      nextStep();
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  // ==========================================
  // RENDERIZADO PRINCIPAL
  // ==========================================

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Indicador de progreso con información de reserva */}
      <div className="w-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Registro de Huésped</h1>
            <p className="text-muted-foreground">Hotel San Miguel</p>
            <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
              <span><strong>Habitación:</strong> {linkFormulario.numeroHabitacion}</span>
              <span><strong>Fechas:</strong> {new Date(linkFormulario.fechaInicio).toLocaleDateString()} - {new Date(linkFormulario.fechaFin).toLocaleDateString()}</span>
              <span><strong>Costo:</strong> ${linkFormulario.costo.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold">{getStepTitle()}</h2>
            <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
            <span className="text-xs text-muted-foreground mt-1 block">
              Paso {currentStep} de {totalSteps}
            </span>
          </div>
        </div>
        
        {/* Indicador de pasos numerados */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div key={stepNumber} className="flex items-center">
                {/* Número del paso */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-lg transition-all duration-200
                      ${isActive 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : isCompleted 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-muted bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {isCompleted ? '✓' : stepNumber.toString().padStart(2, '0')}
                  </div>
                  
                  {/* Título del paso */}
                  <div className="mt-2 text-center">
                    <p className={`
                      text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'text-primary' 
                        : isCompleted 
                        ? 'text-primary/70' 
                        : 'text-muted-foreground'
                      }
                    `}>
                      {stepNumber === 1 && 'Bienvenida'}
                      {stepNumber === 2 && 'Datos personales'}
                      {stepNumber === 3 && 'Datos acompañantes'}
                      {stepNumber === 4 && 'Confirmación'}
                    </p>
                  </div>
                </div>

                {/* Línea conectora */}
                {stepNumber < totalSteps && (
                  <div 
                    className={`
                      w-16 h-0.5 mx-4 transition-all duration-200
                      ${stepNumber < currentStep 
                        ? 'bg-primary' 
                        : 'bg-muted'
                      }
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <Card>
        <CardHeader>
          <CardTitle>{getStepTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Controles de navegación */}
      <div className="flex justify-between items-center pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep || isSubmitting}
        >
          Anterior
        </Button>

        {/* Espacio central */}
        <div className="hidden md:block" />

        {isLastStep ? (
          <Button
            type="submit"
            disabled={!canAdvance || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Enviando...
              </>
            ) : (
              'Confirmar Registro'
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance || isSubmitting}
            className="min-w-[120px]"
          >
            Siguiente
          </Button>
        )}
      </div>

      {/* Estado de envío */}
      {isSubmitting && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="animate-spin text-xl">⏳</span>
            <p className="text-amber-800">
              Procesando su registro... Por favor no cierre esta ventana.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 