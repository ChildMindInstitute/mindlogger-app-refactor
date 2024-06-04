import React, { FC, useMemo, useState } from 'react';
import { AccessibilityProps } from 'react-native';

import { shuffle, colors } from '@shared/lib';
import { YStack, RadioGroup, Box, useOnUndo } from '@shared/ui';

import RadioItem from './RadioItem';
import RadioOption from './types';

type RadioActivityItemProps = {
  config: {
    options: Array<RadioOption>;
    setPalette: boolean;
    addTooltip: boolean;
    randomizeOptions: boolean;
  };
  onChange: (value: RadioOption) => void;
  initialValue?: RadioOption;
  textReplacer: (markdown: string) => string;
};

const RadioActivityItem: FC<RadioActivityItemProps & AccessibilityProps> = ({
  config,
  onChange,
  initialValue,
  textReplacer,
}) => {
  const { options, randomizeOptions, addTooltip, setPalette } = config;
  const [radioValueId, setRadioValueId] = useState(initialValue?.id ?? null);

  const selectedOptionIndex: number | null = useMemo(() => {
    const index = options.findIndex(o => o.id === radioValueId);
    return index === -1 ? null : index;
  }, [radioValueId, options]);

  useOnUndo(() => setRadioValueId(null));

  const hasImage = useMemo(
    () => options.some(option => !!option.image),
    [options],
  );

  const hasTooltip = useMemo(
    () => options.some(option => !!option.tooltip),
    [options],
  );

  const optionsList = useMemo(() => {
    if (randomizeOptions) {
      return shuffle(options);
    }

    return options;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizeOptions]);

  const onValueChange = (value: string) => {
    const selectedOption = options.find(option => option.id === value);

    setRadioValueId(selectedOption?.id ?? null);

    onChange(selectedOption!);
  };

  return (
    <YStack>
      <RadioGroup
        value={radioValueId ?? ''}
        onValueChange={onValueChange}
        name="radio"
        accessibilityLabel={`radios-group_value-${String(selectedOptionIndex)}`}
      >
        {optionsList.map(option => (
          <Box
            key={option.id}
            bbc={colors.lighterGrey}
            bbw={setPalette ? 0 : 1}
            onPress={() => onValueChange(option.id)}
          >
            <RadioItem
              accessibilityLabel="radio-item-option"
              option={option}
              imageContainerVisible={hasImage}
              tooltipContainerVisible={hasTooltip}
              addTooltip={addTooltip}
              setPalette={setPalette}
              textReplacer={textReplacer}
            />
          </Box>
        ))}
      </RadioGroup>
    </YStack>
  );
};

export default RadioActivityItem;
