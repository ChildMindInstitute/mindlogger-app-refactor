import { forwardRef, useImperativeHandle, useState } from 'react';

import StabilityTrackerTutorial from './StabilityTrackerTutorial';
import { MobileTutorials } from '../model';

export type StabilityTrackerTutorialViewerProps = {
  testIndex: 0 | 1;
};

export type ViewerRef = {
  next: (step?: number) => boolean;
  back: (step?: number) => boolean;
};

export const StabilityTrackerTutorialViewer = forwardRef<
  ViewerRef,
  StabilityTrackerTutorialViewerProps
>(({ testIndex }, ref) => {
  const [step, setStep] = useState(0);
  const stepsCount = MobileTutorials[testIndex].length as number;

  useImperativeHandle(
    ref,
    () => {
      return {
        next: () => {
          const nextStep = step + 1;

          const canMove = nextStep < stepsCount;

          if (canMove) {
            setStep(nextStep);
          }

          return canMove;
        },
        back: () => {
          const nextStep = step - 1;

          const canMove = nextStep >= 0;

          if (canMove) {
            setStep(nextStep);
          }

          return canMove;
        },
      };
    },
    [step, stepsCount],
  );

  return (
    <StabilityTrackerTutorial testIndex={testIndex} tutorialStepIndex={step} />
  );
});
