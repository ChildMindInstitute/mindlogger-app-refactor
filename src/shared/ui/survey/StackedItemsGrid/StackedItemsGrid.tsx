import React, { FC, ReactElement } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { styled, TextProps } from '@tamagui/core';

import { ListSeparator, YStack, XStack, Tooltip, RadioGroup } from '@shared/ui';

import { type StackedRowItemValue } from './types';
import Center from '../../Center';
import Text from '../../Text';

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
    } as const,
    defaultVariants: { hasTooltip: false },
  },
);

const AxisListItem: FC<{
  option?: StackedRowItemValue;
  maxWidth?: string | number;
  accessibilityLabel: string | null;
}> = ({ option, maxWidth, accessibilityLabel }) => {
  const title = option?.text || option?.rowName;
  const imageUrl = option?.image || option?.rowImage;

  return (
    <AxisListItemContainer maxWidth={maxWidth}>
      {option && (
        <Center>
          {option.tooltip ? (
            <Tooltip
              accessibilityLabel={`row-list-item-tooltip-${option.id}`}
              markdown={option.tooltip}
            >
              <AxisListItemText hasTooltip>{title}</AxisListItemText>
            </Tooltip>
          ) : (
            <AxisListItemText accessibilityLabel={accessibilityLabel ?? ''}>
              {title}
            </AxisListItemText>
          )}

          {imageUrl && (
            <CachedImage
              accessibilityLabel={`row-list-item-image-${option.id}`}
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
        <AxisListItem accessibilityLabel={null} maxWidth="25%" />

        {options.map((option, optionIndex) => (
          <YStack key={option.id} flex={1}>
            <AxisListItem
              accessibilityLabel="option_text"
              key={optionIndex + optionIndex}
              option={option}
            />
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

const RowListItem: FC<RowListItemProps & AccessibilityProps> = ({
  item,
  options,
  renderCell,
}) => {
  return (
    <YStack>
      <XStack>
        <AxisListItem
          accessibilityLabel="row_text"
          maxWidth="25%"
          option={item}
        />

        {options.map(option => (
          <AxisListItemContainer key={option.id}>
            {renderCell(option)}
          </AxisListItemContainer>
        ))}
      </XStack>

      <ListSeparator />
    </YStack>
  );
};

type StackedItemsGridProps = {
  items: StackedRowItemValue[];
  options: StackedRowItemValue[];
  values?: Array<{ rowId: string; optionId: string }> | null;
  renderCell: (
    optionIndex: number,
    option: StackedRowItemValue,
  ) => ReactElement;
} & AccessibilityProps;

const StackedItemsGrid: FC<StackedItemsGridProps> = ({
  items = [],
  renderCell,
  options,
  values,
  accessibilityLabel,
}) => {
  const getRadioValue = (stackedItem: StackedRowItemValue) => {
    if (!values) {
      return '';
    }

    const rowSelection = values?.find(v => v.rowId === stackedItem.id);

    return rowSelection?.optionId || '';
  };

  return (
    <YStack accessibilityLabel={accessibilityLabel}>
      <RowHeader options={options} />

      {items.map((item, index) => (
        <RadioGroup key={`StackGrid_${item.id}`} value={getRadioValue(item)}>
          <RowListItem
            accessibilityLabel={`row-list-item-${item.id}`}
            options={options}
            item={item}
            renderCell={renderCell.bind(null, index)}
          />
        </RadioGroup>
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
