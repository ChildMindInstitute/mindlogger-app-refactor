import React, { FC } from 'react';
import { GestureResponderEvent } from 'react-native';

import { YStack, Text } from '@shared/ui';

import styles from './StabilityTrackerItem.styles';

type Props = {
  isMoving: boolean;
  showControlBar: boolean;
  onStartTouch: (event: GestureResponderEvent) => void;
  onReleaseTouch: (event: GestureResponderEvent) => void;
  onMove: (event: GestureResponderEvent) => void;

  availableWidth: number;
  blockHeight: number;
  outerCircleRadius: number;
};

const ControlBar: FC<Props> = props => {
  const {
    availableWidth,
    blockHeight,
    outerCircleRadius,
    isMoving,
    onStartTouch,
    onReleaseTouch,
    onMove,
    showControlBar,
  } = props;

  return (
    <YStack
      style={[
        {
          height: availableWidth - blockHeight * 2 + outerCircleRadius * 2,
          top: blockHeight - outerCircleRadius,
        },
        styles.controlBarWrapper,
      ]}
    >
      {showControlBar && (
        <YStack
          justifyContent="center"
          alignItems="center"
          style={{
            width: availableWidth,
            height: availableWidth / 10,
            transform: [
              { rotate: '90deg' },
              { translateY: availableWidth / 2 - availableWidth / 20 },
              { translateX: availableWidth / 2 - availableWidth / 12 },
            ],
          }}
        >
          <Text>Tap here to {isMoving ? 'restart' : 'start'}</Text>
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
