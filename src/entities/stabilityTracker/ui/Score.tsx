import React, { FC } from 'react';

import { YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

import { styles } from './StabilityTracker.styles';

type Props = {
  score: number;
};

export const Score: FC<Props> = ({ score }) => {
  return (
    <YStack style={styles.header}>
      <Text style={styles.score}>
        Score {'\n'} {Math.round(score)}
      </Text>
    </YStack>
  );
};
