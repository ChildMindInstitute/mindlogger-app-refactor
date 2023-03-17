import { useRef, useState } from 'react';

import { Box, Stepper, XStack } from '@shared/ui';

import ActivityItem from './ActivityItem';
import TutorialViewerItem, { TutorialViewerRef } from './TutorialViewerItem';
import { getAbTrailsPipeline } from '../model';

const mockPipelineItems = getAbTrailsPipeline('Phone');

type Props = {
  onClose: () => void;
  onFinish: () => void;
};

function ActivityStepper({ onClose, onFinish }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tempState, setTempState] = useState<Record<string, unknown>>({});

  const currentPipelineItem = mockPipelineItems[currentStep];

  const tutorialViewerRef = useRef<TutorialViewerRef>(null);

  const isTutorial = currentPipelineItem.type === 'Tutorial';
  const isLastStep = currentStep === mockPipelineItems.length - 1;

  const canMoveNext =
    isTutorial || currentPipelineItem.isSkippable || !!tempState[currentStep];
  const canMoveBack = currentPipelineItem.isAbleToMoveToPrevious;
  const canReset = currentPipelineItem.canBeReset;
  const showTopNavigation = currentPipelineItem.hasTopNavigation;
  const showBottomNavigation = !showTopNavigation;

  const onNext = (nextStep: number) => {
    setCurrentStep(nextStep);
  };
  const onBack = (nextStep: number) => {
    setCurrentStep(nextStep);
  };

  const onBeforeNext = (): number => {
    if (isTutorial) {
      const moved = tutorialViewerRef.current?.next();

      return moved ? 0 : 1;
    }

    return 1;
  };
  const onBeforeBack = (): number => {
    if (isTutorial) {
      const moved = tutorialViewerRef.current?.back();

      return moved ? 0 : 1;
    }

    return 1;
  };

  return (
    <Box flex={1}>
      <Stepper
        stepsCount={mockPipelineItems.length}
        startFrom={0}
        onNext={onNext}
        onBack={onBack}
        onBeforeNext={onBeforeNext}
        onBeforeBack={onBeforeBack}
        onStartReached={onClose}
        onEndReached={onFinish}
      >
        {showTopNavigation && (
          <Stepper.NavigationPanel position="absolute" mx={16}>
            {canMoveBack && <Stepper.BackButton isIcon />}
            {canReset && <Stepper.UndoButton isIcon />}
            {canMoveNext && <Stepper.NextButton isIcon />}
          </Stepper.NavigationPanel>
        )}

        <Stepper.ViewList
          renderItem={({ index }) => {
            const pipelineItem = mockPipelineItems[index];

            return (
              <XStack flex={1} key={index} alignItems="center">
                <>
                  {pipelineItem.type === 'Tutorial' && (
                    <TutorialViewerItem
                      {...pipelineItem.payload}
                      ref={tutorialViewerRef}
                    />
                  )}

                  {pipelineItem.type !== 'Tutorial' && (
                    <ActivityItem
                      pipelineItem={mockPipelineItems[index]}
                      onResponse={response => {
                        setTempState(prev => ({ ...prev, [index]: response }));
                      }}
                    />
                  )}
                </>
              </XStack>
            );
          }}
        />

        <Stepper.Progress />

        {showBottomNavigation && (
          <Stepper.NavigationPanel mt={16} minHeight={24}>
            {canMoveBack && <Stepper.BackButton>Return</Stepper.BackButton>}
            {canReset && <Stepper.UndoButton>Undo</Stepper.UndoButton>}

            {canMoveNext && (
              <Stepper.NextButton>
                {isLastStep ? 'Done' : 'Next'}
              </Stepper.NextButton>
            )}
          </Stepper.NavigationPanel>
        )}
      </Stepper>
    </Box>
  );
}

export default ActivityStepper;
