import React, { FC, useMemo, useState } from 'react';
import { FlatList } from 'react-native';

import { useTranslation } from 'react-i18next';

import { shuffle } from '@shared/lib';
import { YStack, RadioGroup, Input, ListSparator } from '@shared/ui';

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
  const [optionalValue, setOoptionalValue] = useState('');
  const { t } = useTranslation();

  const optionsList = useMemo(() => {
    if (isOptionOrderRandomized) {
      return shuffle(options);
    }

    return options;
  }, [isOptionOrderRandomized, options]);

  const handleRadioGroupValueChange = (value: string) => {
    setRadioGroupValue(value);
    onResponseSet(value);
  };

  const handleOptionalInputChange = (text: string) => setOoptionalValue(text);

  const onSubmitEditing = () => onResponseSet(optionalValue);

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
          ItemSeparatorComponent={() => <ListSparator />}
          renderItem={({ item }) => <RadioItem option={item} />}
        />
      </RadioGroup>

      {config.isOptionalText && (
        <Input
          value={optionalValue}
          placeholder={t('optional_text:enter_text')}
          onChangeText={handleOptionalInputChange}
          onSubmitEditing={onSubmitEditing}
        />
      )}
    </YStack>
  );
};

export default RadioActivityItem;
