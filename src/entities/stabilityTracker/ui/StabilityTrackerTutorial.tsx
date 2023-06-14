import { FC } from 'react';

import { Box, BoxProps, MarkdownMessage } from '@app/shared/ui';

import { TestIndex } from '../lib';
import { MobileTutorials } from '../model';

type Props = {
  testIndex: TestIndex;
  tutorialStepIndex: number;
} & BoxProps;

const StabilityTrackerTutorial: FC<Props> = props => {
  const { testIndex, tutorialStepIndex } = props;

  const tutorialRecord = MobileTutorials[testIndex][tutorialStepIndex];

  return (
    <Box flex={1}>
      {!!tutorialRecord && (
        <MarkdownMessage flex={1} mx={10} content={tutorialRecord} />
      )}
    </Box>
  );
};

export default StabilityTrackerTutorial;
