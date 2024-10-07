import React, { FC, ReactElement } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { styled, TextProps } from '@tamagui/core';

import { AxisItem, type StackedRowItemValue } from './types';
import { RadioGroup, XStack, YStack } from '../../base';
import { Center } from '../../Center';
import { ListSeparator } from '../../ListSeparator';
import { Text } from '../../Text';
import { Tooltip } from '../../Tooltip';

const AxisListItemContainer = styled(Center, {
  minHeight: 80,
  flexGrow: 1,
  padding: 5,
});

const AxisListItemText = styled(Text, {
  name: 'SingleSelectionPerRowAxisListItemText',
  fontSize: 12,
  variants: {
    hasTooltip: {
      true: { color: '$blue', textDecorationLine: 'underline' },
      false: { color: '$black' },
    },
  } as const,
  defaultVariants: { hasTooltip: false },
}) as FC<TextProps & { hasTooltip?: boolean }>;

const AxisListItem: FC<{
  item: AxisItem | null;
  maxWidth?: string | number;
  accessibilityLabel: string | null;
  axisHeaderFor: 'column' | 'row';
}> = ({ maxWidth, accessibilityLabel, item, axisHeaderFor }) => {
  const { title, imageUrl, tooltip } = item || {};

  return (
    <AxisListItemContainer maxWidth={maxWidth}>
      {item && (
        <Center>
          {tooltip ? (
            <Tooltip
              accessibilityLabel={'tooltip_view-' + tooltip}
              triggerAccessibilityLabel={`tooltip_trigger_${axisHeaderFor}-${title}`}
              markdown={tooltip}
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
              accessibilityLabel={`${axisHeaderFor}_header_image-${title}`}
              data-test="row-list-item-image"
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

type ColumnHeadersProps = { options: StackedRowItemValue[] };

const ColumnHeaders: FC<ColumnHeadersProps> = ({ options }) => {
  return (
    <YStack>
      <XStack>
        <AxisListItem
          accessibilityLabel={null}
          item={null}
          axisHeaderFor="column"
          maxWidth="25%"
        />

        {options.map((option, optionIndex) => (
          <YStack key={option.id} flex={1}>
            <AxisListItem
              accessibilityLabel="option_text"
              axisHeaderFor="column"
              key={optionIndex + optionIndex}
              item={{
                id: option.id,
                tooltip: option.tooltip,
                title: option.text!,
                imageUrl: option.image ?? null,
              }}
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
          axisHeaderFor="row"
          maxWidth="25%"
          item={{
            id: item.id,
            tooltip: item.tooltip,
            title: item.rowName!,
            imageUrl: item.rowImage ?? null,
          }}
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

export const StackedItemsGrid: FC<StackedItemsGridProps> = ({
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
      <ColumnHeaders options={options} />

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
