import { FC, useMemo } from 'react';

import { shuffle } from '@shared/lib';
import { Box, ScrollView } from '@shared/ui';

import CheckBoxItem from './CheckBox.item';
import { Item } from './types';

type CheckBoxProps = {
  // @todo make sure backend will update config to new keys described below (type RefactoredConfig in ./types)
  config: {
    itemList: Item[];
    minValue: number;
    maxValue: number;
    colorPalette: boolean;
    randomizeOptions: boolean;
  };
  onChange: (arrayOfValues: number[]) => void;
  values: number[];
};

const CheckBoxActivityItem: FC<CheckBoxProps> = ({
  config,
  onChange,
  values = [],
}) => {
  const { minValue, maxValue } = config;
  const hasSingleItem = maxValue === 1 && minValue === 1;

  const { itemList, randomizeOptions } = config;

  const items = useMemo(() => {
    const filteredItems = itemList.filter(({ isVis }) => !isVis);
    if (randomizeOptions) {
      return shuffle(filteredItems);
    }

    return filteredItems;
  }, [randomizeOptions, itemList]);

  const onItemValueChanged = (checkedItemValue: number) => {
    if (hasSingleItem) {
      onChange([checkedItemValue]);
    } else if (values.includes(checkedItemValue)) {
      const filteredValues = values.filter(val => val !== checkedItemValue);
      onChange(filteredValues);
    } else {
      onChange([...values, checkedItemValue]);
    }
  };

  return (
    <ScrollView>
      {items.map((item, index) => {
        return (
          <Box key={`checkbox-${index}`}>
            <CheckBoxItem
              {...item}
              colorPalette={config.colorPalette}
              onChange={onItemValueChanged}
              checked={values.includes(item.value)}
            />
          </Box>
        );
      })}
    </ScrollView>
  );
};

export default CheckBoxActivityItem;
