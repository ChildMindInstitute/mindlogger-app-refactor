import React, { FC, useMemo, useState } from 'react';

import { shuffle } from '@shared/lib';
import { YStack, RadioGroup, Box } from '@shared/ui';

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

const RadioActivityItem: FC<RadioActivityItemProps> = ({
  config,
  onChange,
  initialValue,
  textReplacer,
}) => {
  const { options, randomizeOptions, addTooltip, setPalette } = config;
  const [radioValue, setValue] = useState(initialValue);

  const optionsList = useMemo(() => {
    if (randomizeOptions) {
      return shuffle(options);
    }

    return options;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizeOptions]);

  const onValueChange = (value: string) => {
    const selectedOption = options.find(option => option.id === value);

    setValue(selectedOption);

    onChange(selectedOption!);
  };

  return (
    <YStack>
      <RadioGroup
        value={radioValue?.id ?? ''}
        onValueChange={onValueChange}
        name="radio"
        data-test="radio-item-group"
      >
        {optionsList.map(option => (
          <Box my="$1" key={option.id} onPress={() => onValueChange(option.id)}>
            <RadioItem
              data-test="radio-item-option"
              option={option}
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
