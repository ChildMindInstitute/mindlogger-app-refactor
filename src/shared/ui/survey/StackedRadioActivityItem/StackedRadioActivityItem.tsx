import { FC } from 'react';
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
      description: 'Tooltip',
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
      description: '',
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
          <StackedRadioAxisListItemText>
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
  value?: string;
  item: StackedRadioListItemValue;
};

const StackedRadioListItem: FC<StackedRadioListItemProps> = ({
  item,
  options,
  value,
}) => {
  return (
    <RadioGroup value={value}>
      <XStack>
        <StackedRadioAxisListItem option={item} />

        {options.map(option => (
          <StackedRadioAxisListItemContainer>
            <RadioGroup.Item value={option.name.en} />
          </StackedRadioAxisListItemContainer>
        ))}
      </XStack>
    </RadioGroup>
  );
};

const StackedRadioActivityItem = () => {
  return (
    <FlatList
      data={mock.itemList}
      ItemSeparatorComponent={ListSeparator}
      ListHeaderComponent={() => <StackedRadioHeader options={mock.options} />}
      renderItem={({ item }) => (
        <StackedRadioListItem item={item} options={mock.options} />
      )}
    />
  );
};

export default StackedRadioActivityItem;
