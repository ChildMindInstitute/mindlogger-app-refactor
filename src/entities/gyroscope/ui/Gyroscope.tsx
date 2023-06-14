import { FC } from 'react';

import { Box, BoxProps } from '@app/shared/ui';
import { GyroscopeConfig } from '@entities/activity';

import { StabilityTracker } from './StabilityTracker';
import { GyroscopeResponse, TestIndex } from '../lib';

type Props = {
  testIndex: TestIndex | null;
  onResponse?: (response: GyroscopeResponse) => void;
  onComplete: (response: GyroscopeResponse) => void;
  config: GyroscopeConfig;
} & BoxProps;

const Gyroscope: FC<Props> = props => {
  const { onComplete } = props;

  const complete = (response: GyroscopeResponse) => {
    onComplete(response);
  };

  // @todo fix ts error when props are ready and clear

  return (
    <Box flex={1} justifyContent="center">
      {/*// @ts-ignore*/}
      <StabilityTracker {...props} onComplete={complete} />
    </Box>
  );
};

export default Gyroscope;
