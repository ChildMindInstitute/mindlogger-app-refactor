import { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { colors } from '@shared/lib';

import { CheckBox, YStack } from '../..';
import {
  StackedItemsGrid,
  type StackedRowItemValue,
  type StackedItem,
} from '../StackedItemsGrid';

type StackedCheckboxConfig = {
  rows: Array<StackedItem>;
  options: Array<StackedItem>;
};

type Values = Array<Array<StackedItem>>;

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

  const isValueSelected = (value: StackedItem, rowIndex: number) => {
    if (!values || !values[rowIndex]?.length) {
      return false;
    }

    const selectedValue = values[rowIndex].find(item => item.id === value.id);

    return !!selectedValue;
  };

  const onValueChange = (option: StackedRowItemValue, rowIndex: number) => {
    let newValues: Values = [];
    if (!values) {
      newValues.length = config.rows.length;
      newValues[rowIndex] = [option];
    } else {
      newValues = [...values];

      newValues[rowIndex] = isValueSelected(option, rowIndex)
        ? newValues[rowIndex].filter(value => value.id !== option.id)
        : [...(newValues[rowIndex] ? newValues[rowIndex] : []), option];
    }

    onChange(newValues);
  };

  return (
    <>
      <StackedItemsGrid
        items={memoizedRows}
        options={memoizedOptions}
        accessibilityLabel="stacked-checkbox-container"
        renderCell={(index, option) => {
          return (
            <YStack hitSlop={15} onPress={() => onValueChange(option, index)}>
              <CheckBox
                style={styles.checkbox}
                accessibilityLabel={`stacked-checkbox-option-${option.id}`}
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
                value={isValueSelected(option, index)}
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
