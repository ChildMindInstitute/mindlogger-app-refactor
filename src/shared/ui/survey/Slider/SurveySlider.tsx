import { FC } from 'react';

import { Box, XStack, YStack, Text, Image, Slider } from '@shared/ui';

import { SliderProps } from './types';

const THUMB_SIZE = 22;

const SurveySlider: FC<SliderProps> = ({ config, ...props }) => {
  const {
    leftTitle,
    rightTitle,
    items,
    showTitles = true,
    showTickMarks = true,
    showTickLabels = true,
    isContinuousSlider = false,
    leftImageUrl,
    rightImageUrl,
  } = config;

  const { onChange, onRelease, onPress, initialValue = 0 } = props;

  const onValueChange = (arrayOfValues: number[]) => {
    const [firstElement] = items;
    const [value] = arrayOfValues;
    const numericValue = value + Number(firstElement.value);
    const roundedValue = Math.round(numericValue * 100) / 100;
    onChange(roundedValue);
  };

  const initialIndex = items.findIndex(({ value }) => value === initialValue);

  return (
    <YStack>
      <Slider
        defaultValue={[initialIndex !== -1 ? initialIndex : -100]}
        onResponderRelease={onRelease}
        onResponderStart={onPress}
        onValueChange={onValueChange}
        size={THUMB_SIZE}
        max={items.length - 1}
        step={isContinuousSlider ? 0.01 : 1}
      />

      <XStack jc="space-between" mt={9}>
        {items.map(({ value }) => {
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

          {showTitles && leftTitle ? (
            <Text textAlign="center">{leftTitle}</Text>
          ) : null}
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

          {showTitles && rightTitle ? (
            <Text textAlign="center">{rightTitle}</Text>
          ) : null}
        </YStack>
      </XStack>
    </YStack>
  );
};

export default SurveySlider;
