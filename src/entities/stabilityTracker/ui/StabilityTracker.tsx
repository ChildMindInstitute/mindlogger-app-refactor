import { FC } from 'react';

import { Box, BoxProps } from '@app/shared/ui';
import { StabilityTrackerConfig } from '@entities/activity';

import { StabilityTrackerItem } from './StabilityTrackerItem';
import { StabilityTrackerResponse, TestIndex } from '../lib';

type Props = {
  testIndex: TestIndex | null;
  onResponse?: (response: StabilityTrackerResponse) => void;
  onComplete: (response: StabilityTrackerResponse) => void;
  config: StabilityTrackerConfig;
} & BoxProps;

const StabilityTracker: FC<Props> = props => {
  const { onComplete } = props;

  const complete = (response: StabilityTrackerResponse) => {
    onComplete(response);
  };

  // @todo fix ts error when props are ready and clear

  return (
    <Box flex={1} justifyContent="center">
      {/*// @ts-ignore*/}
      <StabilityTrackerItem {...props} onComplete={complete} />
    </Box>
  );
};

export default StabilityTracker;
