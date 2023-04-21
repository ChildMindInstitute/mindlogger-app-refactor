import { forwardRef, useImperativeHandle, useState } from 'react';

import AbTutorial from './AbTutorial';
import { DeviceType, TestIndex } from '../lib';
import { MobileTutorials, TabletTutorials } from '../model';

export type AbTutorialViewerProps = {
  testIndex: TestIndex;
  deviceType: DeviceType;
};

export type ViewerRef = {
  next: (step?: number) => boolean;
  back: (step?: number) => boolean;
};

export const AbTutorialViewer = forwardRef<ViewerRef, AbTutorialViewerProps>(
  ({ testIndex, deviceType }, ref) => {
    const [step, setStep] = useState(0);
    const tutorials =
      deviceType === 'Phone' ? MobileTutorials : TabletTutorials;
    const stepsCount = tutorials[testIndex].length;

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
      <AbTutorial
        testIndex={testIndex}
        deviceType={deviceType}
        tutorialStepIndex={step}
      />
    );
  },
);
