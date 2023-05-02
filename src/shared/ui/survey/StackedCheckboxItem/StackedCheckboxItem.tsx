import { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { colors } from '@shared/lib';

import { CheckBox, YStack } from '../..';
import {
  StackedItemsGrid,
  type StackedRowItemValue,
  type Item,
} from '../StackedItemsGrid';

type StackedCheckboxConfig = {
  rows: Array<Item>;
  options: Array<Item>;
};

type Values = {
  rowId: string;
  optionIds: string[];
}[];

type Props = {
  values: Values | null;
  onChange: (value: Values | null) => void;
  config: StackedCheckboxConfig;
  textReplacer: (markdown: string) => string;
};

const StackedCheckboxItem: FC<Props> = ({
  values,
  onChange,
  config,
  textReplacer,
}) => {
  const { options, rows } = config;

  const memoizedOptions = useMemo(() => {
    return options.map(option => {
      return {
        ...option,
        tooltip: textReplacer(option.tooltip || ''),
      };
    });
  }, [options, textReplacer]);

  const memoizedRows = useMemo(() => {
    return rows.map(row => {
      return {
        ...row,
        tooltip: textReplacer(row.tooltip || ''),
      };
    });
  }, [rows, textReplacer]);

  const onValueChange = (option: StackedRowItemValue, row: Item) => {
    const rowId = row.id;
    const optionId = option.id;
    const rowInitialValue = {
      rowId,
      optionIds: [optionId],
    };

    if (!values) {
      const value = [rowInitialValue];

      onChange(value);
    } else {
      const clonedValues = [...values];
      let foundRow = false;

      for (let key in clonedValues) {
        const currentRow = clonedValues[key];
        if (currentRow.rowId === rowId) {
          foundRow = true;
          if (currentRow.optionIds.includes(optionId)) {
            currentRow.optionIds = currentRow.optionIds.filter(
              id => id !== optionId,
            );
          } else {
            currentRow.optionIds.push(optionId);
          }
        }
      }
      if (!foundRow) {
        clonedValues.push(rowInitialValue);
      }

      const isEmpty = !clonedValues.some(
        ({ optionIds }) => optionIds.length > 0,
      );

      onChange(isEmpty ? null : clonedValues);
    }
  };

  return (
    <>
      <StackedItemsGrid
        items={memoizedRows}
        options={memoizedOptions}
        renderCell={(index, option) => {
          const row = memoizedRows[index];
          const isChecked = values?.some(
            ({ optionIds, rowId }) =>
              optionIds?.includes(option.id) && rowId === row.id,
          );

          return (
            <YStack onPress={() => onValueChange(option, row)}>
              <CheckBox
                style={styles.checkbox}
                lineWidth={2}
                animationDuration={0.2}
                boxType="square"
                tintColors={{ true: colors.primary, false: colors.primary }}
                onCheckColor={colors.white}
                onFillColor={colors.primary}
                onTintColor={colors.primary}
                tintColor={colors.primary}
                onAnimationType="bounce"
                offAnimationType="bounce"
                value={isChecked}
                disabled
              />
            </YStack>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    height: 20,
    width: 20,
  },
});
export default StackedCheckboxItem;
