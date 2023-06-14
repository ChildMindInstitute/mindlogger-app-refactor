import { forwardRef, useImperativeHandle, useState } from 'react';

import GyroscopeTutorial from './GyroscopeTutorial';
import { MobileTutorials } from '../model';

export type GyroscopeTutorialViewerProps = {
  testIndex: 0 | 1;
};

export type ViewerRef = {
  next: (step?: number) => boolean;
  back: (step?: number) => boolean;
};

export const GyroscopeTutorialViewer = forwardRef<
  ViewerRef,
  GyroscopeTutorialViewerProps
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

  return <GyroscopeTutorial testIndex={testIndex} tutorialStepIndex={step} />;
});
