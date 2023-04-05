import React, { FC, useMemo, useState } from 'react';
import { FlatList } from 'react-native';

import { shuffle } from '@shared/lib';
import { YStack, RadioGroup, ListSeparator, Box } from '@shared/ui';

import RadioItem from './RadioItem';
import RadioOption from './types';

type RadioActivityItemProps = {
  config: {
    options: Array<RadioOption>;
    setPalette: boolean;
    addTooltip: boolean;
    randomizeOptions: boolean;
  };
  onChange: (value: string) => void;
  initialValue: string | null;
};

const RadioActivityItem: FC<RadioActivityItemProps> = ({
  config,
  onChange,
  initialValue,
}) => {
  const { options, randomizeOptions, addTooltip, setPalette } = config;
  const [radioGroupValue, setRadioGroupValue] = useState(initialValue || '');

  const optionsList = useMemo(() => {
    if (randomizeOptions) {
      return shuffle(options);
    }

    return options;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizeOptions]);

  const onValueChange = (value: string) => {
    setRadioGroupValue(value);
    onChange(value);
  };

  return (
    <YStack>
      <RadioGroup
        value={radioGroupValue}
        onValueChange={onValueChange}
        name="radio"
      >
        <FlatList
          data={optionsList}
          bounces={false}
          ItemSeparatorComponent={() => <ListSeparator />}
          renderItem={({ item }) => (
            <Box paddingVertical={5}>
              <RadioItem
                option={item}
                addTooltip={addTooltip}
                setPalette={setPalette}
              />
            </Box>
          )}
        />
      </RadioGroup>
    </YStack>
  );
};

export default RadioActivityItem;
