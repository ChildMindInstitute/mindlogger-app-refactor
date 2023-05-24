import { FC } from 'react';

import { colors } from '@app/shared/lib';

import {
  Item,
  StackedItemsGrid,
  StackedRowItemValue,
} from './StackedItemsGrid';
import { RadioGroup } from '../';

type StackedRadioConfig = {
  rows: Array<Item>;
  options: Array<Item>;
};

type Props = {
  values: Array<{ rowId: string; optionId: string }>;
  onChange: (value: Array<{ rowId: string; optionId: string }>) => unknown;
  config: StackedRadioConfig;
};

const StackedRadios: FC<Props> = ({ values, onChange, config }) => {
  const onRowValueChange = (option: StackedRowItemValue, itemIndex: number) => {
    const { id: currentRowId } = config.rows[itemIndex];
    const newValues = values.filter(({ rowId }) => rowId !== currentRowId);

    newValues.push({
      rowId: currentRowId,
      optionId: option.id,
    });

    onChange(newValues);
  };

  return (
    <StackedItemsGrid
      items={config.rows}
      renderCell={(index, option) => {
        const { id: currentRowId } = config.rows[index];
        const currentValue = values.find(({ rowId }) => {
          return rowId === currentRowId;
        });

        return (
          <RadioGroup value={currentValue?.optionId ?? ''}>
            <RadioGroup.Item
              onPress={() => onRowValueChange(option, index)}
              borderColor={colors.blue}
              value={option.id}
            >
              <RadioGroup.Indicator backgroundColor={colors.blue} />
            </RadioGroup.Item>
          </RadioGroup>
        );
      }}
      options={config.options}
    />
  );
};

export default StackedRadios;
