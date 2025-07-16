import { useState, useCallback } from "react";

export interface UseWizardOptions<StepKey extends string> {
  steps: StepKey[];               // Keys o identificadores de pasos
  defaultStep?: StepKey;          // Paso inicial (por defecto, el primero)
}

export function useWizard<StepKey extends string>(
  options: UseWizardOptions<StepKey>
) {
  const { steps, defaultStep } = options;
  const [current, setCurrent] = useState<StepKey>(defaultStep ?? steps[0]);

  const goNext = useCallback(() => {
    const idx = steps.indexOf(current);
    if (idx < 0) return;
    const next = steps[idx + 1];
    if (next) setCurrent(next);
  }, [steps, current]);

  const goBack = useCallback(() => {
    const idx = steps.indexOf(current);
    if (idx < 1) return;
    setCurrent(steps[idx - 1]);
  }, [steps, current]);

  const isFirst = current === steps[0];
  const isLast = current === steps[steps.length - 1];

  return { current, goNext, goBack, isFirst, isLast, steps };
}
