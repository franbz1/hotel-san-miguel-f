import { useState, useCallback, useMemo } from "react";

export type StepStatus = "completed" | "current" | "upcoming";
export type AnimationDirection = "forward" | "backward" | "none";

export interface UseWizardOptions<StepKey extends string> {
  steps: StepKey[];               // Identificadores de pasos
  defaultStep?: StepKey;          // Paso inicial (por defecto, el primero)
}

export interface UseWizardReturn<StepKey extends string> {
  current: StepKey;
  currentIndex: number;
  isFirst: boolean;
  isLast: boolean;
  goNext: () => void;
  goBack: () => void;
  goToStep: (stepKey: StepKey) => void;
  /** Array de { key, status } en orden de pasos */
  progress: Array<{ key: StepKey; status: StepStatus }>;
  /** Lista original de keys, por si la UI la necesita */
  steps: StepKey[];
  /** Dirección de la animación basada en el último movimiento */
  animationDirection: AnimationDirection;
}

export function useWizard<StepKey extends string>(
  options: UseWizardOptions<StepKey>
): UseWizardReturn<StepKey> {
  const { steps, defaultStep } = options;
  const [current, setCurrent] = useState<StepKey>(
    defaultStep ?? steps[0]
  );
  const [animationDirection, setAnimationDirection] = useState<AnimationDirection>("none");

  const currentIndex = useMemo(
    () => {
      const idx = steps.indexOf(current);
      if (idx === -1) {
        throw new Error(
          `El paso actual "${current}" no existe en la lista de pasos.`
        );
      }
      return idx;
    },
    [steps, current]
  );

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  const goNext = useCallback(() => {
    if (!isLast) {
      setAnimationDirection("forward");
      setCurrent(steps[currentIndex + 1]);
    }
  }, [currentIndex, isLast, steps]);

  const goBack = useCallback(() => {
    if (!isFirst) {
      setAnimationDirection("backward");
      setCurrent(steps[currentIndex - 1]);
    }
  }, [currentIndex, isFirst, steps]);

  const goToStep = useCallback(
    (stepKey: StepKey) => {
      if (steps.includes(stepKey)) {
        const targetIndex = steps.indexOf(stepKey);
        if (targetIndex > currentIndex) {
          setAnimationDirection("forward");
        } else if (targetIndex < currentIndex) {
          setAnimationDirection("backward");
        } else {
          setAnimationDirection("none");
        }
        setCurrent(stepKey);
      }
    },
    [steps, currentIndex]
  );

  const progress = useMemo(
    () =>
      steps.map((key, idx) => {
        let status: StepStatus;
        if (idx < currentIndex) status = "completed";
        else if (idx === currentIndex) status = "current";
        else status = "upcoming";
        return { key, status };
      }),
    [steps, currentIndex]
  );

  return {
    current,
    currentIndex,
    isFirst,
    isLast,
    goNext,
    goBack,
    goToStep,
    progress,
    steps,
    animationDirection,
  };
}
