import React, { FC } from 'react';

import { Rect } from 'react-native-svg';

import { colors } from './StabilityTrackerItem.styles';
import {
  BOUND_HIT_ANIMATION_DURATION,
  PLAYGROUND_WIDTH,
  CENTER,
  OUTER_CIRCLE_RADIUS,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
} from '../../lib';

type Props = {
  boundWasHit: boolean;
  boundHitAnimationDuration: number;
};

const PlayGround: FC<Props> = props => {
  const { boundWasHit, boundHitAnimationDuration } = props;

  const getBackgroundColorBasedOnTimeline = (defaultColor: string) => {
    if (boundWasHit) {
      const timeProgress =
        (boundHitAnimationDuration / BOUND_HIT_ANIMATION_DURATION / 1000) * 4;
      const mixRate = [
        timeProgress - Math.floor(timeProgress),
        Math.floor(timeProgress) + 1 - timeProgress,
      ];
      const updatedColors = [
        Math.floor(mixRate[0] * 255),
        Math.floor(mixRate[1] * 255),
      ];

      if (Math.floor(timeProgress) % 2) {
        return `rgb(${updatedColors[0]}, ${updatedColors[1]}, 0)`;
      } else {
        return `rgb(${updatedColors[1]}, ${updatedColors[0]}, 0)`;
      }
    }

    return defaultColor;
  };

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={PLAYGROUND_WIDTH}
        height={PLAYGROUND_WIDTH}
        fill={colors.playGroundBackground}
        id="playGroundWrapper"
      />

      <Rect
        y={0}
        x={-5}
        height={BLOCK_HEIGHT - OUTER_CIRCLE_RADIUS}
        width={PLAYGROUND_WIDTH + 10}
        strokeWidth={0}
        fill={getBackgroundColorBasedOnTimeline('white')}
        id="playGroundTopBorder"
      />

      <Rect
        y={PLAYGROUND_WIDTH - BLOCK_HEIGHT + OUTER_CIRCLE_RADIUS}
        x={-5}
        height={BLOCK_HEIGHT - OUTER_CIRCLE_RADIUS}
        width={PLAYGROUND_WIDTH + 10}
        fill={getBackgroundColorBasedOnTimeline('white')}
        id="playGroundBottomBorder"
      />

      <Rect
        y={0}
        x={CENTER - BLOCK_WIDTH / 2}
        height={BLOCK_HEIGHT - OUTER_CIRCLE_RADIUS}
        width={BLOCK_WIDTH}
        fill={getBackgroundColorBasedOnTimeline('green')}
        id="playGroundTopGreenElement"
      />

      <Rect
        y={PLAYGROUND_WIDTH - BLOCK_HEIGHT + OUTER_CIRCLE_RADIUS}
        x={CENTER - BLOCK_WIDTH / 2}
        height={BLOCK_HEIGHT - OUTER_CIRCLE_RADIUS}
        width={BLOCK_WIDTH}
        fill={getBackgroundColorBasedOnTimeline('green')}
        id="playGroundBottomGreenElement"
      />
    </>
  );
};

export default PlayGround;
