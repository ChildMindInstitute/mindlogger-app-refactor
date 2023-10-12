import { FC } from 'react';

import { YStack, Text, SurveySlider } from '@shared/ui';

import { StackedSliderProps } from './types';

const StackedSlider: FC<StackedSliderProps> = ({ config, ...props }) => {
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
          <YStack key={`slider-${currentRowId}`}>
            <Text
              data-test={`stacked-slider-label-${currentRowId}`}
              fontSize={12}
              my="$3"
            >
              {label}
            </Text>

            <SurveySlider
              config={singleSliderProps}
              data-test={`stacked-slider-${currentRowId}`}
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

export default StackedSlider;
