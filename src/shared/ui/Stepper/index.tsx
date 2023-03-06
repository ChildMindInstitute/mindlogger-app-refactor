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

  onStartReached?: () => void;
  onEndReached?: () => void;
}>;

function Stepper({
  startFrom,
  stepsCount,

  onNext,
  onBack,
  onUndo,

  onBeforeNext,
  onBeforeBack,

  onStartReached,
  onEndReached,

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

  const onStartReachedRef = useRef(onStartReached);
  onStartReachedRef.current = onStartReached;

  const onEndReachedRef = useRef(onEndReached);
  onEndReachedRef.current = onEndReached;

  const viewSliderRef = useRef<ViewSliderRef>(null);

  const [step, setStep] = useState(startFrom ?? 0);

  const next = useCallback(() => {
    const stepShift = onBeforeNextRef.current?.(step) ?? 1;
    const nextStep = step + stepShift;

    const moved = viewSliderRef.current?.next(stepShift);

    if (moved) {
      setStep(nextStep);
      onNextRef.current?.(nextStep);
    } else if (nextStep >= stepsCount) {
      onEndReachedRef.current?.();
    }
  }, [step, stepsCount]);

  const back = useCallback(() => {
    const stepShift = onBeforeBackRef.current?.(step) ?? 1;
    const nextStep = step - stepShift;

    const moved = viewSliderRef.current?.back(stepShift);

    if (moved) {
      setStep(nextStep);
      onBackRef.current?.(nextStep);
    } else {
      onStartReachedRef.current?.();
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
