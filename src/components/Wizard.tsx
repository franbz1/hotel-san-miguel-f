import { useWizard, StepStatus, AnimationDirection } from "@/hooks/useWizard";
import React, { ReactNode, useState, useEffect } from "react";

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

// Componente para manejar las animaciones del contenido del paso
interface AnimatedStepProps {
  children: ReactNode;
  animationDirection: AnimationDirection;
  stepKey: string;
}

function AnimatedStep({ children, animationDirection, stepKey }: AnimatedStepProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayContent, setDisplayContent] = useState(children);

  useEffect(() => {
    if (animationDirection === "none") {
      setDisplayContent(children);
      return;
    }

    setIsAnimating(true);
    
    // Pequeño delay para permitir que la animación de salida termine
    const timer = setTimeout(() => {
      setDisplayContent(children);
      setIsAnimating(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [stepKey, animationDirection, children]);

  const getAnimationClasses = () => {
    if (animationDirection === "none") {
      return "opacity-100 translate-x-0";
    }

    if (isAnimating) {
      // Animación de salida
      return animationDirection === "forward" 
        ? "animate-out slide-out-to-left duration-150" 
        : "animate-out slide-out-to-right duration-150";
    } else {
      // Animación de entrada
      return animationDirection === "forward"
        ? "animate-in slide-in-from-right duration-300 ease-out"
        : "animate-in slide-in-from-left duration-300 ease-out";
    }
  };

  return (
    <div 
      className={`transition-all ${getAnimationClasses()}`}
      key={`${stepKey}-${animationDirection}`}
    >
      {displayContent}
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
