import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

import { Box, XStack, YStack, Text, Slider } from '@shared/ui';

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
  const { onChange, onRelease, onPress, initialValue } = props;

  const onValueChange = (arrayOfValues: number[]) => {
    const [value] = arrayOfValues;
    const roundedValue = Math.round(value * 100) / 100;
    onChange(roundedValue);
  };

  const items = Array.from(
    { length: maxValue - minValue + 1 },
    (_, index) => index + minValue,
  );

  return (
    <YStack>
      <Slider
        animationType="spring"
        data-test="slider"
        initialValue={initialValue}
        onSlidingComplete={onRelease}
        onSlidingStart={onPress}
        onValueChange={onValueChange}
        maximumValue={maxValue}
        minimumValue={minValue}
        step={isContinuousSlider ? 0.01 : 1}
        size={THUMB_SIZE}
      />

      <XStack jc="space-between" mt={9}>
        {items.map(value => {
          return (
            <Box key={`tick-${value}`} w={THUMB_SIZE} ai="center">
              {showTickMarks && <Box w={1} bg="$black" h={8} />}

              {showTickLabels && (
                <Text data-test="slide-tick-label" mt="$1">
                  {value}
                </Text>
              )}
            </Box>
          );
        })}
      </XStack>

      <XStack mt="$2" jc="space-between">
        <YStack maxWidth="30%" ai="center">
          {leftImageUrl && (
            <CachedImage
              data-test="slide-image"
              style={styles.imageLeft}
              resizeMode="contain"
              source={leftImageUrl}
            />
          )}

          {leftTitle ? (
            <Text data-test="slide-left-title" textAlign="center">
              {leftTitle}
            </Text>
          ) : null}
        </YStack>

        <YStack maxWidth="30%" ml="auto" ai="center">
          {rightImageUrl && (
            <XStack jc="center">
              <CachedImage
                data-test="slide-right-image"
                style={styles.imageRight}
                resizeMode="contain"
                source={rightImageUrl}
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

const styles = StyleSheet.create({
  imageLeft: {
    width: 45,
    height: 45,
  },
  imageRight: {
    width: 45,
    height: 45,
  },
});
