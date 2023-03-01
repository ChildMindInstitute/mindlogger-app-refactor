import { FC, useState } from 'react';
import { FlatList } from 'react-native';

import { styled, Text } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { colors } from '@app/shared/lib';

import {
  SingleSelectionPerRowConfigType,
  SingleSelectionPerRowItemValue,
} from './types';
import {
  Center,
  XStack,
  YStack,
  Image,
  Input,
  Tooltip,
  RadioGroup,
  ListSeparator,
} from '../..';

const SingleSelectionPerRowAxisListItemContainer = styled(Center, {
  width: '25%',
  height: 90,
});

const SingleSelectionPerRowAxisListItemText = styled(Text, {
  name: 'SingleSelectionPerRowAxisListItemText',
  fontSize: 16,

  variants: {
    hasTooltip: {
      true: {
        color: '$blue',
      },
    },
  },

  defaultVariants: {
    hasTooltip: false,
  },
});

const SingleSelectionPerRowAxisListItem: FC<{
  option?: SingleSelectionPerRowItemValue;
}> = ({ option }) => {
  return (
    <SingleSelectionPerRowAxisListItemContainer>
      {option && (
        <Tooltip tooltipText={option.description}>
          <Center>
            <SingleSelectionPerRowAxisListItemText
              textDecorationLine={option.description ? 'underline' : 'none'}
              hasTooltip={!!option.description}
            >
              {option.name.en}
            </SingleSelectionPerRowAxisListItemText>

            {option.image && (
              <Image
                height={32}
                width={32}
                resizeMode="contain"
                src={option.image}
              />
            )}
          </Center>
        </Tooltip>
      )}
    </SingleSelectionPerRowAxisListItemContainer>
  );
};

type SingleSelectionPerRowHeaderProps = {
  options: SingleSelectionPerRowItemValue[];
};

const SingleSelectionPerRowHeader: FC<SingleSelectionPerRowHeaderProps> = ({
  options,
}) => {
  return (
    <YStack>
      <XStack>
        <SingleSelectionPerRowAxisListItem />

        {options.map((option, optionIndex) => (
          <SingleSelectionPerRowAxisListItem
            key={optionIndex + optionIndex}
            option={option}
          />
        ))}
      </XStack>

      <ListSeparator />
    </YStack>
  );
};

type SingleSelectionPerRowListItemProps = {
  options: SingleSelectionPerRowItemValue[];
  item: SingleSelectionPerRowItemValue;
  index: number;
  onValueChange: (option: string, itemIndex: number) => void;
};

const SingleSelectionPerRowListItem: FC<SingleSelectionPerRowListItemProps> = ({
  item,
  index,
  options,
  onValueChange,
}) => {
  const onSelectionChange = (value: string) => {
    onValueChange(value, index);
  };

  return (
    <RadioGroup onValueChange={onSelectionChange}>
      <XStack>
        <SingleSelectionPerRowAxisListItem option={item} />

        {options.map((option, optionIndex) => (
          <SingleSelectionPerRowAxisListItemContainer
            key={optionIndex + optionIndex}
          >
            <RadioGroup.Item borderColor={colors.blue} value={option.name.en}>
              <RadioGroup.Indicator backgroundColor={colors.blue} />
            </RadioGroup.Item>
          </SingleSelectionPerRowAxisListItemContainer>
        ))}
      </XStack>
    </RadioGroup>
  );
};

type SingleSelectionPerRowItemProps = {
  value: string[];
  onChange: (value: string[] | string) => unknown;
  config: SingleSelectionPerRowConfigType;
};

const SingleSelectionPerRowItem: FC<SingleSelectionPerRowItemProps> = ({
  value = [],
  onChange,
  config,
}) => {
  const [response, setResponse] = useState<string[]>(value);
  const { t } = useTranslation();
  const [optionalValue, setOptionalValue] = useState('');
  const onRowValueChange = (option: string, itemIndex: number) => {
    const updatedResponse: string[] = [...response];
    updatedResponse[itemIndex] = option;

    onChange(updatedResponse);
    setResponse(updatedResponse);
  };

  const onSubmitEditing = () => onChange(optionalValue);

  return (
    <YStack>
      <FlatList
        data={config.itemList}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={() => (
          <SingleSelectionPerRowHeader options={config.options} />
        )}
        renderItem={({ item, index }) => (
          <SingleSelectionPerRowListItem
            item={item}
            index={index}
            onValueChange={onRowValueChange}
            options={config.options}
          />
        )}
      />

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

export default SingleSelectionPerRowItem;
