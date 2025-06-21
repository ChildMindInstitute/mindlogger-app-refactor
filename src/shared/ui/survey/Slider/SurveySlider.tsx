import { FC } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

import { SliderProps } from './types';
import { Box, XStack, YStack } from '../../base';
import { Slider } from '../../Slider';
import { Text } from '../../Text';

const THUMB_SIZE = 22;

export const SurveySlider: FC<SliderProps & AccessibilityProps> = ({
  config,
  accessibilityLabel,
  sliderLabel,
  ...props
}) => {
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

  const hasAtLeastOneImage = Boolean(leftImageUrl || rightImageUrl);

  const addRightPartTo = (accessibilityValue?: string) => {
    if (!accessibilityValue) {
      return undefined;
    }
    return accessibilityValue + (sliderLabel ? `-${sliderLabel}` : '');
  };

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
      <Box px={10}>
        <Slider
          animationType="spring"
          accessibilityLabel={addRightPartTo(accessibilityLabel)}
          initialValue={initialValue}
          onSlidingComplete={onRelease}
          onSlidingStart={onPress}
          onValueChange={onValueChange}
          maximumValue={maxValue}
          minimumValue={minValue}
          step={isContinuousSlider ? 0.01 : 1}
          size={THUMB_SIZE}
        />
      </Box>

      <XStack px={11} jc="space-between">
        {items.map(value => {
          return (
            <Box key={`tick-${value}`} w={THUMB_SIZE} ai="center">
              {showTickMarks && <Box w={1} bg="$primary" h={8} />}

              {showTickLabels && (
                <Text accessibilityLabel="slide-tick-label" mt="$1">
                  {value}
                </Text>
              )}
            </Box>
          );
        })}
      </XStack>

      <XStack mt="$2" jc="space-between">
        <YStack maxWidth="30%" ai="center">
          <Box h={hasAtLeastOneImage ? 44 : 0} w={hasAtLeastOneImage ? 44 : 0}>
            {leftImageUrl ? (
              <Box borderRadius={4} overflow="hidden">
                <CachedImage
                  data-test="slide-left-image"
                  accessibilityLabel={addRightPartTo('slider-left-image')}
                  style={styles.image}
                  resizeMode="contain"
                  source={leftImageUrl}
                />
              </Box>
            ) : null}
          </Box>

          {leftTitle ? (
            <Text
              accessibilityLabel={addRightPartTo('min-label')}
              textAlign="center"
              data-test="slide-left-title"
            >
              {leftTitle}
            </Text>
          ) : null}
        </YStack>

        <YStack maxWidth="30%" ml="auto" ai="center">
          <Box h={hasAtLeastOneImage ? 44 : 0} w={hasAtLeastOneImage ? 44 : 0}>
            {rightImageUrl && (
              <XStack jc="center">
                <CachedImage
                  data-test="slide-right-image"
                  accessibilityLabel={addRightPartTo('slider-right-image')}
                  style={styles.image}
                  resizeMode="contain"
                  source={rightImageUrl}
                />
              </XStack>
            )}
          </Box>

          {rightTitle ? (
            <Text
              accessibilityLabel={addRightPartTo('max-label')}
              data-test="slide-right-title"
              textAlign="center"
            >
              {rightTitle}
            </Text>
          ) : null}
        </YStack>
      </XStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 44,
    height: 44,
  },
});
