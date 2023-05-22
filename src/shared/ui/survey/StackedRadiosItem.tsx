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
  value: Array<{ rowId: string; optionId: string }> | null;
  onChange: (value: Array<{ rowId: string; optionId: string }>) => unknown;
  config: StackedRadioConfig;
};

const StackedRadios: FC<Props> = ({ value, onChange, config }) => {
  const onRowValueChange = (option: StackedRowItemValue, itemIndex: number) => {
    const newValue = value ? [...value] : [];
    const { id: rowId } = config.rows[itemIndex];
    newValue.push({
      rowId,
      optionId: option.id,
    });

    onChange(newValue);
  };

  return (
    <StackedItemsGrid
      items={config.rows}
      values={value}
      renderCell={(index, option) => (
        <RadioGroup.Item
          onPress={() => onRowValueChange(option, index)}
          borderColor={colors.blue}
          value={option.id}
        >
          <RadioGroup.Indicator backgroundColor={colors.blue} />
        </RadioGroup.Item>
      )}
      options={config.options}
    />
  );
};

export default StackedRadios;
