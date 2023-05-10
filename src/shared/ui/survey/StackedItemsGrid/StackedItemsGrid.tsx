import { FC, ReactElement } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { styled, TextProps } from '@tamagui/core';

import { type StackedRowItemValue } from './types';
import {
  ListSeparator,
  YStack,
  XStack,
  Center,
  Text,
  Tooltip,
  RadioGroup,
} from '../..';

const AxisListItemContainer = styled(Center, {
  minHeight: 80,
  flexGrow: 1,
  padding: 5,
});

const AxisListItemText: FC<TextProps & { hasTooltip?: boolean }> = styled(
  Text,
  {
    name: 'SingleSelectionPerRowAxisListItemText',
    fontSize: 12,
    variants: {
      hasTooltip: {
        true: { color: '$blue', textDecorationLine: 'underline' },
        false: { color: '$black' },
      },
    },
    defaultVariants: { hasTooltip: false },
  },
);

const AxisListItem: FC<{
  option?: StackedRowItemValue;
  maxWidth?: string | number;
}> = ({ option, maxWidth }) => {
  const title = option?.text || option?.rowName;
  const imageUrl = option?.image || option?.rowImage;

  return (
    <AxisListItemContainer maxWidth={maxWidth}>
      {option && (
        <Center>
          {option.tooltip ? (
            <Tooltip markdown={option.tooltip}>
              <AxisListItemText hasTooltip>{title}</AxisListItemText>
            </Tooltip>
          ) : (
            <AxisListItemText>{title}</AxisListItemText>
          )}

          {imageUrl && (
            <CachedImage
              style={styles.image}
              resizeMode="contain"
              source={imageUrl}
            />
          )}
        </Center>
      )}
    </AxisListItemContainer>
  );
};

type RowHeaderProps = { options: StackedRowItemValue[] };

const RowHeader: FC<RowHeaderProps> = ({ options }) => {
  return (
    <YStack>
      <XStack>
        <AxisListItem maxWidth="25%" />

        {options.map((option, optionIndex) => (
          <YStack flex={1}>
            <AxisListItem key={optionIndex + optionIndex} option={option} />
          </YStack>
        ))}
      </XStack>

      <ListSeparator />
    </YStack>
  );
};

type RowListItemProps = {
  options: StackedRowItemValue[];
  item: StackedRowItemValue;
  renderCell: (option: StackedRowItemValue) => ReactElement;
};

const RowListItem: FC<RowListItemProps> = ({ item, options, renderCell }) => {
  return (
    <RadioGroup>
      <YStack>
        <XStack>
          <AxisListItem maxWidth="25%" option={item} />

          {options.map(option => (
            <AxisListItemContainer key={option.id}>
              {renderCell(option)}
            </AxisListItemContainer>
          ))}
        </XStack>

        <ListSeparator />
      </YStack>
    </RadioGroup>
  );
};

type StackedItemsGridProps = {
  items: StackedRowItemValue[];
  options: StackedRowItemValue[];
  renderCell: (
    optionIndex: number,
    option: StackedRowItemValue,
  ) => ReactElement;
};

const StackedItemsGrid: FC<StackedItemsGridProps> = ({
  items = [],
  renderCell,
  options,
}) => {
  return (
    <YStack>
      <RowHeader options={options} />

      {items.map((item, index) => (
        <RowListItem
          key={item.id}
          options={options}
          item={item}
          renderCell={renderCell.bind(null, index)}
        />
      ))}
    </YStack>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 32,
    width: 32,
    marginTop: 2,
  },
});

export default StackedItemsGrid;
