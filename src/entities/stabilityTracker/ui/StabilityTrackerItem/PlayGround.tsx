import React, { FC } from 'react';

import { Rect } from 'react-native-svg';

import { colors } from './StabilityTrackerItem.styles';

type Props = {
  boundWasHit: boolean;
  boundHitAnimationDuration: number;
  boundHitAnimationDurationFromConfig: number;

  availableWidth: number;
  blockHeight: number;
  outerCircleRadius: number;
  blockWidth: number;
  center: number;
};

const PlayGround: FC<Props> = props => {
  const {
    boundWasHit,
    boundHitAnimationDuration,
    boundHitAnimationDurationFromConfig,

    availableWidth,
    blockHeight,
    outerCircleRadius,
    center,
    blockWidth,
  } = props;

  const getBackgroundColorBasedOnTimeline = (defaultColor: string) => {
    if (boundWasHit) {
      const timeProgress =
        (boundHitAnimationDuration /
          boundHitAnimationDurationFromConfig /
          1000) *
        4;
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
        width={availableWidth}
        height={availableWidth}
        fill={colors.playGroundBackground}
        id="playGroundWrapper"
      />

      <Rect
        y={0}
        x={-5}
        height={blockHeight - outerCircleRadius}
        width={availableWidth + 10}
        strokeWidth={0}
        fill={getBackgroundColorBasedOnTimeline('white')}
        id="playGroundTopBorder"
      />

      <Rect
        y={availableWidth - blockHeight + outerCircleRadius}
        x={-5}
        height={blockHeight - outerCircleRadius}
        width={availableWidth + 10}
        fill={getBackgroundColorBasedOnTimeline('white')}
        id="playGroundBottomBorder"
      />

      <Rect
        y={0}
        x={center - blockWidth / 2}
        height={blockHeight - outerCircleRadius}
        width={blockWidth}
        fill={getBackgroundColorBasedOnTimeline('green')}
        id="playGroundTopGreenElement"
      />

      <Rect
        y={availableWidth - blockHeight + outerCircleRadius}
        x={center - blockWidth / 2}
        height={blockHeight - outerCircleRadius}
        width={blockWidth}
        fill={getBackgroundColorBasedOnTimeline('green')}
        id="playGroundBottomGreenElement"
      />
    </>
  );
};

export default PlayGround;
