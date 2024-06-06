import { useContext } from 'react';

import { range } from '@shared/lib';
import { Box, HeaderProgressBar, ValuesContext, XStack } from '@shared/ui';
import { useFlowStorageRecord } from '@widgets/survey';

type Props = {
  appletId: string;
  eventId: string;
  flowId?: string;
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

function HeaderProgress({ appletId, eventId, flowId }: Props) {
  const { flowStorageRecord } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId: flowId,
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

export default HeaderProgress;
