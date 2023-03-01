import {
  PropsWithChildren,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

import { ViewSliderRef } from '@app/shared/ui';

import BackButton from './BackButton';
import { RefContext, HandlersContext, ValuesContext } from './contexts';
import NavigationPanel from './NavigationPanel';
import NextButton from './NextButton';
import Progress from './Progress';
import UndoButton from './UndoButton';
import ViewList from './ViewList';

type Props = PropsWithChildren<{
  startFrom: number;
  stepsCount: number;

  onNext?: (step: number) => void;
  onBack?: (step: number) => void;
  onUndo?: (step: number) => void;

  onBeforeNext?: (step: number) => number;
  onBeforeBack?: (step: number) => number;
}>;

function Stepper({
  startFrom,
  stepsCount,

  onNext,
  onBack,
  onUndo,

  onBeforeNext,
  onBeforeBack,

  children,
}: Props) {
  const onBeforeNextRef = useRef(onBeforeNext);
  onBeforeNextRef.current = onBeforeNext;

  const onBeforeBackRef = useRef(onBeforeBack);
  onBeforeBackRef.current = onBeforeBack;

  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  const onUndoRef = useRef(onUndo);
  onUndoRef.current = onUndo;

  const viewSliderRef = useRef<ViewSliderRef>(null);

  const [step, setStep] = useState(startFrom ?? 0);

  const next = useCallback(() => {
    const stepShift = onBeforeNextRef.current?.(step) || 1;

    const moved = viewSliderRef.current?.next(stepShift);

    if (moved) {
      setStep(prevStep => prevStep + stepShift);
      onNextRef.current?.(step + stepShift);
    }
  }, [step]);

  const back = useCallback(() => {
    const stepShift = onBeforeBackRef.current?.(step) || 1;

    const moved = viewSliderRef.current?.back(stepShift);

    if (moved) {
      setStep(prevStep => prevStep - stepShift);
      onBackRef.current?.(step - stepShift);
    }
  }, [step]);

  const undo = useCallback(() => {
    onUndoRef.current?.(step);
  }, [step]);

  const handlersContext = useMemo(
    () => ({
      next,
      back,
      undo,
    }),
    [back, next, undo],
  );

  const valuesContext = useMemo(
    () => ({
      currentStep: step,
      stepsCount,
    }),
    [step, stepsCount],
  );

  return (
    <HandlersContext.Provider value={handlersContext}>
      <RefContext.Provider value={viewSliderRef}>
        <ValuesContext.Provider value={valuesContext}>
          {children}
        </ValuesContext.Provider>
      </RefContext.Provider>
    </HandlersContext.Provider>
  );
}

Stepper.Progress = Progress;
Stepper.ViewList = ViewList;
Stepper.NavigationPanel = NavigationPanel;

Stepper.BackButton = BackButton;
Stepper.NextButton = NextButton;
Stepper.UndoButton = UndoButton;

export default Stepper;
