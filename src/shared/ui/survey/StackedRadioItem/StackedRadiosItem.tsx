import { FC, useMemo } from 'react';

import { palette } from '@app/shared/lib/constants/palette';
import { getSelectorColors } from '@app/shared/lib/utils/survey/survey';

import { RadioGroup } from '../../base';
import { StackedItemsGrid } from '../StackedItemsGrid/StackedItemsGrid';
import { StackedItem, StackedRowItemValue } from '../StackedItemsGrid/types';

type StackedRadioConfig = {
  rows: Array<StackedItem>;
  options: Array<StackedItem>;
};

type StackedRadioAnswerValue = StackedRowItemValue & {
  rowId: string;
};

type Props = {
  values: Array<StackedRadioAnswerValue>;
  onChange: (value: Array<StackedRadioAnswerValue>) => unknown;
  config: StackedRadioConfig;
  tooltipsShown: boolean;
  textReplacer: (markdown: string) => string;
};

export const StackedRadios: FC<Props> = ({
  values,
  onChange,
  config,
  textReplacer,
  tooltipsShown,
}) => {
  const { options, rows } = config;

  const onRowValueChange = (option: StackedRowItemValue, itemIndex: number) => {
    const { id: currentRowId } = config.rows[itemIndex];
    const newValue = [...values];

    newValue.length = config.rows.length;
    newValue[itemIndex] = { rowId: currentRowId, ...option };

    onChange(newValue);
  };

  const memoizedOptions: StackedRowItemValue[] = useMemo(() => {
    return options.map(option => {
      return {
        ...option,
        tooltip: tooltipsShown ? textReplacer(option.tooltip || '') : '',
      };
    });
  }, [tooltipsShown, options, textReplacer]);

  const memoizedRows = useMemo(() => {
    return rows.map(row => {
      return {
        ...row,
        tooltip: tooltipsShown ? textReplacer(row.tooltip || '') : '',
      };
    });
  }, [tooltipsShown, rows, textReplacer]);

  return (
    <StackedItemsGrid
      items={memoizedRows}
      options={memoizedOptions}
      accessibilityLabel="stack-radio-container"
      renderCell={(rowIndex, option) => {
        const { id: currentRowId } = config.rows[rowIndex];
        const currentValue = values.find(value => {
          return value?.rowId === currentRowId;
        });

        const optionIndex = config.options.findIndex(o => o.id === option.id);

        const selected = currentValue?.id === option.id;
        const { bgColor, widgetColor } = getSelectorColors({
          setPalette: false,
          color: null,
          selected,
        });

        return (
          <RadioGroup
            key={option.id + currentRowId}
            value={currentValue?.id ?? ''}
            accessibilityLabel="stack-radio-group"
          >
            <RadioGroup.Item
              accessibilityLabel={`stacked-radio-item-${optionIndex}-${rowIndex}`}
              data-test={`stack-radio-item-${option.id}-${currentRowId}`}
              onPress={() => onRowValueChange(option, rowIndex)}
              value={option.id}
              borderColor={widgetColor}
              borderWidth={selected ? 0 : 3}
              bg={selected ? widgetColor : bgColor}
            >
              <RadioGroup.Indicator
                accessibilityLabel="stack-radio-indicator"
                bg={selected ? palette.surface : widgetColor}
              />
            </RadioGroup.Item>
          </RadioGroup>
        );
      }}
    />
  );
};
