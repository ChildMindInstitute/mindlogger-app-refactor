import { FC, useState } from 'react';
import { FlatList } from 'react-native';

import { styled } from '@tamagui/core';

import { colors } from '@app/shared/lib';

import { StackedRadioListItemValue } from './types';
import {
  Center,
  XStack,
  YStack,
  Text,
  Tooltip,
  RadioGroup,
  ListSeparator,
} from '../..';

const mock = {
  isOptionalText: true,
  itemList: [
    {
      description: '',
      image: '',
      name: {
        en: 'Item 1',
      },
    },
    {
      description: 'Tooltip',
      image: '',
      name: {
        en: 'Item 2',
      },
    },
    {
      description: 'Tooltip',
      image: '',
      name: {
        en: 'Item 3',
      },
    },
    {
      description: 'Tooltip',
      image: '',
      name: {
        en: 'Item 4',
      },
    },
    {
      description: 'Tooltip',
      image: '',
      name: {
        en: 'Item 5',
      },
    },
    {
      description: 'Tooltip',
      image: '',
      name: {
        en: 'Item 6',
      },
    },
  ],
  multipleChoice: false,
  options: [
    {
      description: 'Hello',
      image: '',
      name: {
        en: 'Option 1',
      },
    },
    {
      description: '',
      image: '',
      name: {
        en: 'Option 2',
      },
    },
    {
      description: '',
      image: '',
      name: {
        en: 'Option 3',
      },
    },
  ],
};

type StackedRadioHeaderProps = {
  options: StackedRadioListItemValue[];
};

const StackedRadioAxisListItemContainer = styled(Center, {
  width: '25%',
  height: 90,
});

const StackedRadioAxisListItemText = styled(Text, {
  fontSize: 16,

  variants: {
    hasToolTip: {
      true: {
        color: colors.blue,
        textDecoration: 'underline',
      },
    },
  },
});

const StackedRadioAxisListItem: FC<{ option?: StackedRadioListItemValue }> = ({
  option,
}) => {
  return (
    <StackedRadioAxisListItemContainer>
      {option && (
        <Tooltip tooltipText={option.description}>
          <StackedRadioAxisListItemText hasToolTip={!!option?.description}>
            {option.name.en}
          </StackedRadioAxisListItemText>
        </Tooltip>
      )}
    </StackedRadioAxisListItemContainer>
  );
};

const StackedRadioHeader: FC<StackedRadioHeaderProps> = ({ options }) => {
  return (
    <YStack>
      <XStack>
        <StackedRadioAxisListItem />

        {options.map(option => (
          <StackedRadioAxisListItem option={option} />
        ))}
      </XStack>

      <ListSeparator />
    </YStack>
  );
};

type StackedRadioListItemProps = {
  options: StackedRadioListItemValue[];
  item: StackedRadioListItemValue;
  index: number;
  onValueChange: (option: string, itemIndex: number) => void;
};

const StackedRadioListItem: FC<StackedRadioListItemProps> = ({
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
        <StackedRadioAxisListItem option={item} />

        {options.map(option => (
          <StackedRadioAxisListItemContainer>
            <RadioGroup.Item borderColor={colors.blue} value={option.name.en}>
              <RadioGroup.Indicator backgroundColor={colors.blue} />
            </RadioGroup.Item>
          </StackedRadioAxisListItemContainer>
        ))}
      </XStack>
    </RadioGroup>
  );
};

const StackedRadioActivityItem = () => {
  const [response, setResponse] = useState<string[]>([]);
  const onRowValueChange = (option: string, itemIndex: number) => {
    const updatedResponse: string[] = [...response];
    updatedResponse[itemIndex] = option;

    setResponse(updatedResponse);
  };
  return (
    <FlatList
      data={mock.itemList}
      ItemSeparatorComponent={ListSeparator}
      ListHeaderComponent={() => <StackedRadioHeader options={mock.options} />}
      renderItem={({ item, index }) => (
        <StackedRadioListItem
          item={item}
          index={index}
          onValueChange={onRowValueChange}
          options={mock.options}
        />
      )}
    />
  );
};

export default StackedRadioActivityItem;
