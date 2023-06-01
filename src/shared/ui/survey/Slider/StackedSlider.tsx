import { FC } from 'react';

import { YStack, Text, SurveySlider } from '@shared/ui';

import { StackedSliderProps } from './types';

const StackedSlider: FC<StackedSliderProps> = ({ config, ...props }) => {
  const { rows } = config;
  const { onChange, onRelease, onPress, values } = props;

  const onSliderValueChange = (value: number, rowId: string) => {
    const clonedValues = values?.filter(row => row.rowId !== rowId) ?? [];
    clonedValues.push({
      rowId,
      value,
    });

    console.log(clonedValues);

    onChange(clonedValues);
  };

  const onSliderPress = () => {
    const userInteractedWithAllSliders = values?.length === rows.length;

    if (userInteractedWithAllSliders && onPress) {
      onPress();
    }
  };

  return (
    <YStack>
      {rows.map(sliderConfig => {
        const { id: currentRowId, label, ...singleSliderProps } = sliderConfig;
        const rowValue = values?.find(
          ({ rowId }) => currentRowId === rowId,
        )?.value;

        return (
          <YStack key={`slider-${currentRowId}`}>
            <Text fontSize={12} my="$3">
              {label}
            </Text>

            <SurveySlider
              config={singleSliderProps}
              onChange={value => onSliderValueChange(value, currentRowId)}
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
