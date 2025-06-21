import { FC } from 'react';

import { SurveySlider } from './SurveySlider';
import { StackedSliderProps } from './types';
import { YStack } from '../../base';
import { Text } from '../../Text';

export const StackedSlider: FC<StackedSliderProps> = ({ config, ...props }) => {
  const { rows } = config;
  const { onChange, onRelease, onPress, values } = props;

  const onSliderValueChange = (value: number, rowIndex: number) => {
    let answers: number[] = [];

    if (!values) {
      answers.length = rows.length;
    } else {
      answers = [...values];
    }

    answers[rowIndex] = value;

    onChange(answers);
  };

  const onSliderPress = () => {
    const userInteractedWithAllSliders = values?.length === rows.length;

    if (userInteractedWithAllSliders && onPress) {
      onPress();
    }
  };

  return (
    <YStack>
      {rows.map((sliderConfig, rowIndex) => {
        const { id: currentRowId, label, ...singleSliderProps } = sliderConfig;
        const rowValue = values ? values[rowIndex] : null;

        return (
          <YStack
            key={`slider-${currentRowId}`}
            bg={rowIndex % 2 === 0 ? '$surface1' : '$surface'}
            p={16}
            mx={-16}
          >
            <Text
              aria-label={`stacked-slider-label-${label}`}
              my="$3"
              fontSize={18}
              lineHeight={28}
              textAlign="center"
            >
              {label}
            </Text>

            <SurveySlider
              config={singleSliderProps}
              accessibilityLabel={'stacked-slider-view'}
              sliderLabel={label}
              onChange={value => onSliderValueChange(value, rowIndex)}
              onRelease={onRelease}
              initialValue={rowValue}
              onPress={onSliderPress}
            />
          </YStack>
        );
      })}
    </YStack>
  );
};
