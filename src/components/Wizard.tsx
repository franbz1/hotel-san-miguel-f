import { useWizard } from "@/hooks/useWizard";
import React, { ReactNode } from "react";

export interface WizardStep<StepKey extends string> {
  key: StepKey;
  component: React.ComponentType<unknown>;
}

export interface WizardProps<StepKey extends string> {
  steps: WizardStep<StepKey>[];
  defaultStep?: StepKey;
  renderButtons?: (opts: {
    isFirst: boolean;
    isLast: boolean;
    goBack: () => void;
    goNext: () => void;
  }) => ReactNode;
}

export function Wizard<StepKey extends string>(
  props: WizardProps<StepKey>
) {
  const { steps, defaultStep, renderButtons } = props;
  const keys = steps.map(s => s.key);
  const { current, goNext, goBack, isFirst, isLast } = useWizard<StepKey>({
    steps: keys,
    defaultStep,
  });

  // Busca el componente del paso actual
  const Step = steps.find(s => s.key === current)!.component;

  return (
    <div>
      <Step />
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
