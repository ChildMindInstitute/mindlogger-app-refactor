import { FC, useState } from 'react';

import { StackedSliderProps } from '@shared/lib';
import { YStack, Text, SurveySlider } from '@shared/ui';

const StackedSlider: FC<StackedSliderProps> = ({ config, ...props }) => {
  const { onChange, onRelease, onPress, initialValues } = props;

  const [arrayOfStackedValues, setArrayOfStackedValues] = useState(
    initialValues || new Array(config.length).fill(null),
  );

  const onSliderValueChange = (value: number, index: number) => {
    const clonedValues = [...arrayOfStackedValues];
    clonedValues[index] = value;
    setArrayOfStackedValues(clonedValues);
    onChange(clonedValues);
  };

  const onSliderPress = () => {
    if (!arrayOfStackedValues.some(value => value === null) && onPress) {
      onPress();
    }
  };

  return (
    <YStack>
      {config.map((sliderConfig, index) => {
        const { sliderLabel } = sliderConfig;
        return (
          <YStack key={`slider-${index}`}>
            <Text fontSize={12} my="$3">
              {sliderLabel}
            </Text>

            <SurveySlider
              config={sliderConfig}
              onChange={value => onSliderValueChange(value, index)}
              onRelease={onRelease}
              initialValue={arrayOfStackedValues[index]}
              onPress={onSliderPress}
            />
          </YStack>
        );
      })}
    </YStack>
  );
};

export default StackedSlider;
