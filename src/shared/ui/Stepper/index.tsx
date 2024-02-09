import { PropsWithChildren, useMemo, useRef, useCallback } from 'react';

import { ViewSliderRef } from '@app/shared/ui';

import BackButton from './BackButton';
import { RefContext, HandlersContext, ValuesContext } from './contexts';
import NavigationPanel from './NavigationPanel';
import NextButton from './NextButton';
import Progress from './Progress';
import UndoButton from './UndoButton';
import { undoPressed } from './useOnUndo';
import ViewList from './ViewList';

export * from './contexts';

export { default as useOnUndo } from './useOnUndo';

type Props = PropsWithChildren<{
  startFrom: number;
  stepsCount: number;

  onNext?: (step: number, isForced: boolean) => void;
  onBack?: (step: number) => void;
  onUndo?: (step: number) => void;

  onBeforeNext?: (step: number) => number;
  onBeforeBack?: (step: number) => number;

  onStartReached?: () => void;
  onEndReached?: (isForced: boolean) => void;
}>;

export function Stepper({
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

  const stepRef = useRef(startFrom ?? 0);

  const next = useCallback(
    ({ isForced, shouldAutoSubmit }: { isForced: boolean; shouldAutoSubmit: boolean }) => {
      const step = stepRef.current;
      const stepShift = onBeforeNextRef.current?.(step) ?? 1;
      const nextStep = step + stepShift;

      const moved = viewSliderRef.current?.next(stepShift);

      if (moved) {
        stepRef.current = nextStep;
        onNextRef.current?.(nextStep, isForced);
      } else if (nextStep >= stepsCount) {
        if (isForced && !shouldAutoSubmit) {
          return;
        }

        onEndReachedRef.current?.(isForced);
      }
    },
    [stepsCount],
  );

  const back = useCallback(() => {
    const step = stepRef.current;
    const stepShift = onBeforeBackRef.current?.(step) ?? 1;
    const nextStep = step - stepShift;

    const moved = viewSliderRef.current?.back(stepShift);

    if (moved) {
      stepRef.current = nextStep;
      onBackRef.current?.(nextStep);
    } else {
      onStartReachedRef.current?.();
    }
  }, []);

  const undo = useCallback(() => {
    onUndoRef.current?.(stepRef.current);
    undoPressed();
  }, []);

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
      getCurrentStep: () => stepRef.current,
      stepsCount,
    }),
    [stepsCount],
  );

  return (
    <HandlersContext.Provider value={handlersContext}>
      <RefContext.Provider value={viewSliderRef}>
        <ValuesContext.Provider value={valuesContext}>{children}</ValuesContext.Provider>
      </RefContext.Provider>
    </HandlersContext.Provider>
  );
}

export type StepperProps = Props;

Stepper.Progress = Progress;
Stepper.ViewList = ViewList;
Stepper.NavigationPanel = NavigationPanel;

Stepper.BackButton = BackButton;
Stepper.NextButton = NextButton;
Stepper.UndoButton = UndoButton;
