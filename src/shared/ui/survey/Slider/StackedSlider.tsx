import { FC } from 'react';

import { YStack, Text, SurveySlider } from '@shared/ui';

import { StackedSliderProps } from './types';

const StackedSlider: FC<StackedSliderProps> = ({ config, ...props }) => {
  const { sliderRowItems } = config;
  const { onChange, onRelease, onPress, values } = props;
  const userInteractedWithAllSliders = values.length === sliderRowItems.length;

  const onSliderValueChange = (value: number, index: number) => {
    const clonedValues = [...values];
    clonedValues[index] = value;
    onChange(clonedValues);
  };

  const onSliderPress = () => {
    if (userInteractedWithAllSliders && onPress) {
      onPress();
    }
  };

  return (
    <YStack>
      {sliderRowItems.map((sliderConfig, index) => {
        const { id, label, ...singleSliderProps } = sliderConfig;

        return (
          <YStack key={`slider-${id}`}>
            <Text fontSize={12} my="$3">
              {label}
            </Text>

            <SurveySlider
              config={singleSliderProps}
              onChange={value => onSliderValueChange(value, index)}
              onRelease={onRelease}
              initialValue={values[index] || undefined}
              onPress={onSliderPress}
            />
          </YStack>
        );
      })}
    </YStack>
  );
};

export default StackedSlider;
