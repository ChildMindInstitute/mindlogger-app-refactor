import { FC, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { colors, shuffle } from '@shared/lib';
import { YStack, RadioGroup, Input } from '@shared/ui';

import RadioItem from './RadioItem';
import RadioOption from './types';

type RadioActivityItemProps = {
  config: {
    isOptionOrderRandomized: boolean;
    options: Array<RadioOption>;
    isOptionalText: boolean;
  };

  onResponseSet: (...args: any[]) => unknown;
};

const RadioActivityItem: FC<RadioActivityItemProps> = ({
  config,
  onResponseSet,
}) => {
  const { options, isOptionOrderRandomized } = config;
  const [radioGroupValue, setRadioGroupValue] = useState('');

  const optionsList = useMemo(() => {
    if (isOptionOrderRandomized) {
      return shuffle(options);
    }

    return options;
  }, [isOptionOrderRandomized, options]);

  const handleRadioGroupValueChange = (value: string) => {
    console.log(value);

    setRadioGroupValue(value);
  };

  return (
    <YStack>
      <RadioGroup
        value={radioGroupValue}
        onValueChange={handleRadioGroupValueChange}
        name="radio"
      >
        <FlatList
          data={optionsList}
          bounces={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: colors.lightGrey,
              }}
            />
          )}
          renderItem={({ item }) => <RadioItem option={item} />}
        />
      </RadioGroup>

      {config.isOptionalText && <Input onSubmitEditing={onResponseSet} />}
    </YStack>
  );
};

export default RadioActivityItem;
