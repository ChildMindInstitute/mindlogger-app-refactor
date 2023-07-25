import React, { FC } from 'react';

import { YStack, Text } from '@shared/ui';

import styles from './StabilityTrackerItem.styles';

type Props = {
  score: number;
};

const Score: FC<Props> = ({ score }) => {
  return (
    <YStack style={styles.header}>
      <Text style={styles.score}>
        Score {'\n'} {Math.round(score)}
      </Text>
    </YStack>
  );
};

export default Score;
