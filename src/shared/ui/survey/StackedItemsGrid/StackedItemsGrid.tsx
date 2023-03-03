import { FC, ReactElement } from 'react';
import { FlatList } from 'react-native';

import { styled } from '@tamagui/core';

import { StackedRowItemValue } from './types';
import {
  ListSeparator,
  YStack,
  XStack,
  Center,
  Text,
  Image,
  Tooltip,
  RadioGroup,
} from '../..';

const AxisListItemContainer = styled(Center, {
  minHeight: 80,
  flexGrow: 1,
  padding: 5,
});

const AxisListItemText = styled(Text, {
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

const AxisListItem: FC<{
  option?: StackedRowItemValue;
  maxWidth?: string | number;
}> = ({ option, maxWidth }) => {
  return (
    <AxisListItemContainer maxWidth={maxWidth}>
      {option && (
        <Tooltip tooltipText={option.description}>
          <Center>
            <AxisListItemText
              textDecorationLine={option.description ? 'underline' : 'none'}
              hasTooltip={!!option.description}
            >
              {option.name.en}
            </AxisListItemText>

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
    </AxisListItemContainer>
  );
};

type RowHeaderProps = {
  options: StackedRowItemValue[];
};

const RowHeader: FC<RowHeaderProps> = ({ options }) => {
  return (
    <YStack>
      <XStack>
        <AxisListItem maxWidth="25%" />

        {options.map((option, optionIndex) => (
          <AxisListItem key={optionIndex + optionIndex} option={option} />
        ))}
      </XStack>

      <ListSeparator />
    </YStack>
  );
};

type RowListItemProps = {
  options: StackedRowItemValue[];
  item: StackedRowItemValue;
  index: number;
  onValueChange: (option: string, itemIndex: number) => void;
  renderCell: (
    option: StackedRowItemValue,
    optionIndex: number,
  ) => ReactElement;
};

const RowListItem: FC<RowListItemProps> = ({
  item,
  index,
  options,
  onValueChange,
  renderCell,
}) => {
  const onSelectionChange = (value: string) => {
    onValueChange(value, index);
  };

  return (
    <RadioGroup onValueChange={onSelectionChange}>
      <XStack>
        <AxisListItem maxWidth="25%" option={item} />

        {options.map((option, optionIndex) => (
          <AxisListItemContainer key={option.name.en + optionIndex}>
            {renderCell(option, index)}
          </AxisListItemContainer>
        ))}
      </XStack>
    </RadioGroup>
  );
};

type StackedItemsGridProps = {
  items: any[];
  options: any[];
  renderCell: (
    option: StackedRowItemValue,
    optionIndex: number,
  ) => ReactElement;
  onRowValueChange?: (option: string, itemIndex: number) => void;
};

const StackedItemsGrid: FC<StackedItemsGridProps> = ({
  items = [],
  renderCell,
  options,
  onRowValueChange,
}) => {
  const onValueChange = (option: string, itemIndex: number) => {
    if (onRowValueChange) {
      onRowValueChange(option, itemIndex);
    }
  };

  return (
    <FlatList
      data={items}
      ItemSeparatorComponent={ListSeparator}
      renderItem={({ item, index }) => (
        <RowListItem
          options={options}
          item={item}
          index={index}
          onValueChange={onValueChange}
          renderCell={renderCell}
        />
      )}
      ListHeaderComponent={() => <RowHeader options={options} />}
    />
  );
};

export default StackedItemsGrid;
