import { useWizard, StepStatus } from "@/hooks/useWizard";
import React, { ReactNode } from "react";

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

export function Wizard<StepKey extends string>(
  props: WizardProps<StepKey>
) {
  const { steps, defaultStep, renderButtons, renderProgress } = props;
  const keys = steps.map(s => s.key);

  // useWizard ahora devuelve también `.progress` y `.goToStep`
  const {
    current,
    goNext,
    goBack,
    goToStep,
    isFirst,
    isLast,
    progress,
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

      {/* Paso actual */}
      <Step />

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
