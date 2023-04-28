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
  value: Record<string, string> | null;
  onChange: (value: Record<string, string> | string) => unknown;
  config: StackedRadioConfig;
};

const StackedRadios: FC<Props> = ({ value, onChange, config }) => {
  const onRowValueChange = (option: StackedRowItemValue, itemIndex: number) => {
    const newValue = { ...value };
    const rowId = config.rows[itemIndex].id;
    newValue[rowId] = option.id;

    onChange(newValue);
  };

  return (
    <StackedItemsGrid
      items={config.rows}
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
