import React, { FC, useMemo, useState } from 'react';
import { FlatList } from 'react-native';

import { useTranslation } from 'react-i18next';

import { shuffle } from '@shared/lib';
import { YStack, RadioGroup, Input, ListSeparator, Box } from '@shared/ui';

import RadioItem from './RadioItem';
import RadioOption from './types';

type RadioActivityItemProps = {
  config: {
    isOptionOrderRandomized: boolean;
    options: Array<RadioOption>;
    isOptionalText: boolean;
  };

  onChange: (value: string) => void;
};

const RadioActivityItem: FC<RadioActivityItemProps> = ({
  config,
  onChange,
}) => {
  const { options, isOptionOrderRandomized } = config;
  const [radioGroupValue, setRadioGroupValue] = useState('');
  const [optionalValue, setOptionalValue] = useState('');
  const { t } = useTranslation();

  const optionsList = useMemo(() => {
    if (isOptionOrderRandomized) {
      return shuffle(options);
    }

    return options;
  }, [isOptionOrderRandomized, options]);

  const handleRadioGroupValueChange = (value: string) => {
    setRadioGroupValue(value);
    onChange(value);
  };

  const onSubmitEditing = () => onChange(optionalValue);

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
          ItemSeparatorComponent={() => <ListSeparator />}
          renderItem={({ item }) => (
            <Box paddingVertical={5}>
              <RadioItem option={item} />
            </Box>
          )}
        />
      </RadioGroup>

      {config.isOptionalText && (
        <Input
          value={optionalValue}
          placeholder={t('optional_text:enter_text')}
          onChangeText={setOptionalValue}
          onSubmitEditing={onSubmitEditing}
        />
      )}
    </YStack>
  );
};

export default RadioActivityItem;
