import React, { FC } from 'react';
import { GestureResponderEvent } from 'react-native';

import { YStack, Text } from '@shared/ui';

import styles from './StabilityTrackerItem.styles';
import { PLAYGROUND_WIDTH, OUTER_CIRCLE_RADIUS, BLOCK_HEIGHT } from '../lib';

type Props = {
  isTestRunning: boolean;
  showControlBar: boolean;
  onStartTouch: (event: GestureResponderEvent) => void;
  onReleaseTouch: (event: GestureResponderEvent) => void;
  onMove: (event: GestureResponderEvent) => void;
};

const ControlBar: FC<Props> = (props) => {
  const {
    isTestRunning,
    onStartTouch,
    onReleaseTouch,
    onMove,
    showControlBar,
  } = props;

  return (
    <YStack
      style={[
        {
          height: PLAYGROUND_WIDTH - BLOCK_HEIGHT * 2 + OUTER_CIRCLE_RADIUS * 2,
          top: BLOCK_HEIGHT - OUTER_CIRCLE_RADIUS,
        },
        styles.controlBarWrapper,
      ]}
    >
      {showControlBar && (
        <YStack
          justifyContent="center"
          alignItems="center"
          style={{
            width: PLAYGROUND_WIDTH,
            height: PLAYGROUND_WIDTH / 10,
            transform: [
              { rotate: '90deg' },
              { translateY: PLAYGROUND_WIDTH / 2 - PLAYGROUND_WIDTH / 20 },
              { translateX: PLAYGROUND_WIDTH / 2 - PLAYGROUND_WIDTH / 12 },
            ],
          }}
        >
          <Text>Tap here to {isTestRunning ? 'restart' : 'start'}</Text>
        </YStack>
      )}

      <YStack
        style={styles.controlBarMask}
        onStartShouldSetResponder={() => true}
        onResponderGrant={onStartTouch}
        onResponderMove={onMove}
        onResponderRelease={onReleaseTouch}
      />
    </YStack>
  );
};

export default ControlBar;
