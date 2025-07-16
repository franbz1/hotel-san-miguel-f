import { useWizard, StepStatus, AnimationDirection } from "@/hooks/useWizard";
import React, { ReactNode, useState, useEffect, useRef } from "react";

export interface WizardStep<StepKey extends string> {
  key: StepKey;
  component: React.ComponentType<unknown>;
  /** opcional: label amigable para la barra de progreso */
  label?: string;
}

export interface WizardProps<StepKey extends string> {
  steps: WizardStep<StepKey>[];
  defaultStep?: StepKey;
  /** renderiza los botones; recibe flags y callbacks */
  renderButtons?: (opts: {
    isFirst: boolean;
    isLast: boolean;
    goBack: () => void;
    goNext: () => void;
  }) => ReactNode;
  /** renderiza la barra de progreso; recibe:
   * - progress: [{ key, status }]
   * - goToStep: función para saltar a un paso clave
   */
  renderProgress?: (opts: {
    progress: Array<{ key: StepKey; status: StepStatus }>;
    goToStep: (step: StepKey) => void;
  }) => ReactNode;
}

// Wrapper para detectar cuando un componente está montado
interface StepWrapperProps {
  children: ReactNode;
  onMounted: () => void;
  stepKey: string;
}

function StepWrapper({ children, onMounted, stepKey }: StepWrapperProps) {
  const mountedRef = useRef(false);

  useEffect(() => {
    // Resetear el estado cuando cambia el step
    mountedRef.current = false;
    
    // Usar requestAnimationFrame para asegurar que el componente esté completamente renderizado
    const frame = requestAnimationFrame(() => {
      if (!mountedRef.current) {
        mountedRef.current = true;
        onMounted();
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      mountedRef.current = false;
    };
  }, [stepKey, onMounted]);

  return <>{children}</>;
}

// Componente para manejar las animaciones del contenido del paso
interface AnimatedStepProps {
  children: ReactNode;
  animationDirection: AnimationDirection;
  stepKey: string;
}

function AnimatedStep({ children, animationDirection, stepKey }: AnimatedStepProps) {
  const [phase, setPhase] = useState<'stable' | 'exiting' | 'entering' | 'mounted'>('stable');
  const [displayContent, setDisplayContent] = useState(children);
  const [nextContent, setNextContent] = useState<ReactNode>(null);
  const [isNewComponentReady, setIsNewComponentReady] = useState(false);
  const currentStepKey = useRef(stepKey);

  // Detectar cuando cambia el step
  useEffect(() => {
    if (stepKey !== currentStepKey.current) {
      if (animationDirection === "none") {
        // Sin animación, cambio directo
        setDisplayContent(children);
        setPhase('stable');
      } else {
        // Iniciar animación de salida
        setPhase('exiting');
        setNextContent(children);
        setIsNewComponentReady(false);
      }
      currentStepKey.current = stepKey;
    }
  }, [stepKey, animationDirection, children]);

  // Manejar cuando el nuevo componente está listo
  const handleNewComponentReady = () => {
    setIsNewComponentReady(true);
  };

  // Manejar transición de salida a entrada
  useEffect(() => {
    if (phase === 'exiting' && isNewComponentReady) {
      // El nuevo componente está listo, cambiar a fase de entrada
      const timer = setTimeout(() => {
        setDisplayContent(nextContent);
        setPhase('entering');
      }, 150); // Duración de la animación de salida

      return () => clearTimeout(timer);
    }
  }, [phase, isNewComponentReady, nextContent]);

  // Finalizar animación de entrada
  useEffect(() => {
    if (phase === 'entering') {
      const timer = setTimeout(() => {
        setPhase('stable');
        setNextContent(null);
      }, 300); // Duración de la animación de entrada

      return () => clearTimeout(timer);
    }
  }, [phase]);

  const getAnimationClasses = () => {
    switch (phase) {
      case 'stable':
        return "opacity-100 translate-x-0";
      
      case 'exiting':
        return animationDirection === "forward" 
          ? "animate-out slide-out-to-left duration-150" 
          : "animate-out slide-out-to-right duration-150";
      
      case 'entering':
        return animationDirection === "forward"
          ? "animate-in slide-in-from-right duration-300 ease-out"
          : "animate-in slide-in-from-left duration-300 ease-out";
      
      default:
        return "opacity-100 translate-x-0";
    }
  };

  return (
    <div className="relative">
      {/* Contenido visible actual */}
      <div 
        className={`transition-all ${getAnimationClasses()}`}
        style={{ 
          visibility: phase === 'entering' ? 'visible' : 'visible',
        }}
      >
        {displayContent}
      </div>

      {/* Precargar el siguiente componente de manera invisible */}
      {nextContent && phase === 'exiting' && (
        <div 
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{ zIndex: -1 }}
        >
          <StepWrapper 
            stepKey={stepKey} 
            onMounted={handleNewComponentReady}
          >
            {nextContent}
          </StepWrapper>
        </div>
      )}
    </div>
  );
}

export function Wizard<StepKey extends string>(
  props: WizardProps<StepKey>
) {
  const { steps, defaultStep, renderButtons, renderProgress } = props;
  const keys = steps.map(s => s.key);

  // useWizard ahora devuelve también `.progress`, `.goToStep` y `.animationDirection`
  const {
    current,
    goNext,
    goBack,
    goToStep,
    isFirst,
    isLast,
    progress,
    animationDirection,
  } = useWizard<StepKey>({
    steps: keys,
    defaultStep,
  });

  // componente del paso actual
  const Step = steps.find(s => s.key === current)!.component;

  return (
    <div>
      {/* Barra de progreso: uso custom o default */}
      {renderProgress ? (
        renderProgress({ progress, goToStep })
      ) : (
        <ol style={{ display: "flex", listStyle: "none", padding: 0 }}>
          {progress.map(({ key, status }) => {
            const label =
              steps.find(s => s.key === key)!.label ?? key;
            return (
              <li
                key={key}
                onClick={() => goToStep(key)}
                style={{
                  flex: 1,
                  textAlign: "center",
                  cursor: status === "completed" ? "pointer" : "default",
                  fontWeight: status === "current" ? "bold" : "normal",
                  opacity: status === "upcoming" ? 0.5 : 1,
                }}
              >
                {label}
              </li>
            );
          })}
        </ol>
      )}

      {/* Contenedor del paso actual con animaciones */}
      <div className="relative overflow-hidden">
        <AnimatedStep 
          animationDirection={animationDirection} 
          stepKey={current}
        >
          <Step />
        </AnimatedStep>
      </div>

      {/* Botones: uso custom o default */}
      {renderButtons ? (
        renderButtons({ isFirst, isLast, goBack, goNext })
      ) : (
        <div style={{ marginTop: 16 }}>
          {!isFirst && <button onClick={goBack}>Atrás</button>}
          <button onClick={goNext} style={{ marginLeft: 8 }}>
            {isLast ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      )}
    </div>
  );
}
