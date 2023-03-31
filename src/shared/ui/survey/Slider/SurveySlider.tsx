import { FC } from 'react';

import { Box, XStack, YStack, Text, Image, Slider } from '@shared/ui';

import { SliderProps } from './types';

const THUMB_SIZE = 22;

const SurveySlider: FC<SliderProps> = ({ config, ...props }) => {
  const {
    leftTitle,
    rightTitle,
    minValue,
    maxValue,
    showTickMarks = true,
    showTickLabels = true,
    isContinuousSlider = false,
    leftImageUrl,
    rightImageUrl,
  } = config;
  const { onChange, onRelease, onPress, initialValue = minValue } = props;

  const onValueChange = (arrayOfValues: number[]) => {
    const [value] = arrayOfValues;
    const roundedValue = Math.round(value * 100) / 100;
    onChange(roundedValue);
  };

  const items = [];
  for (let i = minValue; i <= maxValue; i++) {
    items.push(i);
  }

  return (
    <YStack>
      <Slider
        defaultValue={[initialValue]}
        onResponderRelease={onRelease}
        onResponderStart={onPress}
        onValueChange={onValueChange}
        size={THUMB_SIZE}
        max={maxValue}
        min={minValue}
        step={isContinuousSlider ? 0.01 : 1}
      />

      <XStack jc="space-between" mt={9}>
        {items.map(value => {
          return (
            <Box key={`tick-${value}`} w={THUMB_SIZE} ai="center">
              {showTickMarks && <Box w={1} bg="$black" h={8} />}
              {showTickLabels && <Text mt="$1">{value}</Text>}
            </Box>
          );
        })}
      </XStack>

      <XStack mt="$2" jc="space-between">
        <YStack maxWidth="30%" ai="center">
          {leftImageUrl && (
            <Image
              width={45}
              height={45}
              resizeMode="contain"
              src={leftImageUrl}
            />
          )}

          {leftTitle ? <Text textAlign="center">{leftTitle}</Text> : null}
        </YStack>

        <YStack maxWidth="30%" ml="auto" ai="center">
          {rightImageUrl && (
            <XStack jc="center">
              <Image
                width={45}
                height={45}
                resizeMode="contain"
                src={rightImageUrl}
              />
            </XStack>
          )}

          {rightTitle ? <Text textAlign="center">{rightTitle}</Text> : null}
        </YStack>
      </XStack>
    </YStack>
  );
};

export default SurveySlider;
