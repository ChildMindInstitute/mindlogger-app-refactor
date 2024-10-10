import { useContext } from 'react';

import { range } from '@app/shared/lib/utils/common';
import { Box, XStack } from '@app/shared/ui/base';
import { HeaderProgressBar } from '@app/shared/ui/HeaderProgressBar';
import { ValuesContext } from '@app/shared/ui/Stepper/contexts';
import { useFlowStorageRecord } from '@app/widgets/survey/lib/useFlowStorageRecord';

type Props = {
  appletId: string;
  eventId: string;
  flowId?: string;
  targetSubjectId: string | null;
};

const getCurrentItemProgress = (
  currentIndex: number,
  activeItemIndex: number,
  activeItemProgress: number,
) => {
  if (currentIndex > activeItemIndex) {
    return 0;
  } else if (currentIndex === activeItemIndex) {
    return activeItemProgress;
  }

  return 100;
};

export function HeaderProgress({
  appletId,
  eventId,
  flowId,
  targetSubjectId,
}: Props) {
  const { flowStorageRecord } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId: flowId,
    targetSubjectId,
  });

  const { step: flowStep, pipeline } = flowStorageRecord!;

  const activitiesPassed = flowId
    ? pipeline.slice(0, flowStep).filter(o => o.type === 'Stepper').length
    : 0;

  const totalActivities = flowId
    ? pipeline.filter(o => o.type === 'Stepper').length
    : 1;

  const { getCurrentStep, stepsCount } = useContext(ValuesContext);

  const activeItemProgress = (getCurrentStep() + 1) / stepsCount;

  return (
    <XStack gap={10} px={10} pt={10}>
      {range(totalActivities).map(index => {
        const currentProgress = getCurrentItemProgress(
          index,
          activitiesPassed,
          activeItemProgress,
        );

        return (
          <Box flex={1} key={index}>
            <HeaderProgressBar progress={currentProgress} />
          </Box>
        );
      })}
    </XStack>
  );
}
