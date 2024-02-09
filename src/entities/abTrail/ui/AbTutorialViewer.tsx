import { forwardRef, useImperativeHandle, useState } from 'react';

import { AbTutorialPayload } from '@app/abstract/lib';

import AbTutorial from './AbTutorial';

export type AbTutorialViewerProps = AbTutorialPayload;

export type ViewerRef = {
  next: (step?: number) => boolean;
  back: (step?: number) => boolean;
};

export const AbTutorialViewer = forwardRef<ViewerRef, AbTutorialViewerProps>((props, ref) => {
  const [step, setStep] = useState(0);

  const stepsCount = props.tutorials.length;

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

  return <AbTutorial tutorialPayload={props} tutorialStepIndex={step} />;
});
