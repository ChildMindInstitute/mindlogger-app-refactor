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
    const currentRowId = row.id;
    const optionId = option.id;

    if (!values) {
      const newValues = [
        {
          rowId: currentRowId,
          optionIds: [optionId],
        },
      ];

      onChange(newValues);
    } else {
      const currentRow = values.find(({ rowId }) => rowId === currentRowId);
      const currentOptionIds = currentRow?.optionIds ?? [];
      let newOptionIds = [...currentOptionIds];

      if (currentOptionIds.includes(optionId)) {
        newOptionIds = currentOptionIds.filter(id => id !== optionId);
      } else {
        newOptionIds = [...newOptionIds, optionId];
      }

      const newValues = [
        ...values.filter(({ rowId }) => rowId !== currentRowId),
        {
          rowId: currentRowId,
          optionIds: newOptionIds,
        },
      ];
      const isEmpty = !newValues.some(({ optionIds }) => optionIds.length > 0);

      onChange(isEmpty ? null : newValues);
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
