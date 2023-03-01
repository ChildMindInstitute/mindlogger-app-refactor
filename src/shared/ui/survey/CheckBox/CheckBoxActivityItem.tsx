import { FC, useEffect, useState } from 'react';

import { shuffle } from '@shared/lib';
import { Box, ScrollView } from '@shared/ui';

import CheckBoxItem from './CheckBoxItem';
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
  initialValues?: number[];
};

const CheckBoxActivityItem: FC<CheckBoxProps> = ({
  config,
  onChange,
  initialValues = [],
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [answer, setAnswer] = useState<number[]>(initialValues);
  const { minValue, maxValue } = config;
  const hasSingleItem = maxValue === 1 && minValue === 1;

  useEffect(() => {
    const { itemList, randomizeOptions } = config;
    const filteredItems = itemList.filter(({ isVis }) => !isVis);
    if (randomizeOptions) {
      setItems(shuffle(filteredItems));
    } else {
      setItems(filteredItems);
    }
  }, [config]);

  useEffect(() => {
    onChange(answer);
  }, [answer, onChange]);

  const onItemValueChanged = (checkedItemValue: number) => {
    if (hasSingleItem) {
      setAnswer([checkedItemValue]);
    } else if (answer.includes(checkedItemValue)) {
      const answerFiltered = answer.filter(val => val !== checkedItemValue);
      setAnswer(answerFiltered);
    } else {
      setAnswer([...answer, checkedItemValue]);
    }
  };

  return (
    <ScrollView my={20}>
      {items.map((item, index) => {
        return (
          <Box key={`checkbox-${index}`}>
            <CheckBoxItem
              item={item}
              colorPalette={config.colorPalette}
              onChange={onItemValueChanged}
              isSingleItem={hasSingleItem}
              initialValue={answer.includes(index)}
            />
          </Box>
        );
      })}
    </ScrollView>
  );
};

export default CheckBoxActivityItem;
