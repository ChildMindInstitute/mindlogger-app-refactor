import { FC, useMemo } from 'react';

import { shuffle } from '@shared/lib';
import { Box, ScrollView } from '@shared/ui';

import CheckBoxItem from './CheckBox.item';
import { Item } from './types';

type Props = {
  config: {
    options: Item[];
    randomizeOptions: boolean;
    addTooltip: boolean;
    setPalette: boolean;
    setAlerts: boolean;
  };
  onChange: (values: Item[] | null) => void;
  values: Item[];
  textReplacer: (markdown: string) => string;
};

const findById = (items: Item[], id: string): Item | undefined => {
  return items.find(val => val.id === id);
};

const CheckBoxActivityItem: FC<Props> = ({
  config,
  onChange,
  values,
  textReplacer,
}) => {
  const { options, randomizeOptions, addTooltip, setPalette } = config;

  const hasImage = useMemo(
    () => options.some(option => !!option.image),
    [options],
  );

  const hasTooltip = useMemo(
    () => options.some(option => !!option.tooltip),
    [options],
  );

  const removeItem = (item: Item) => {
    const filteredValues = values.filter(val => val.id !== item.id);
    const value = filteredValues.length ? filteredValues : null;

    onChange(value);
  };

  const addItem = (selectedItem: Item) => {
    let itemList: Item[];

    if (selectedItem.isNoneOption) {
      itemList = [];
    } else {
      itemList = values.filter(val => !val.isNoneOption);
    }

    const value = [...itemList, selectedItem];

    onChange(value);
  };

  const onItemValueChanged = (item: Item) => {
    const alreadySelected = values.find(o => o.id === item.id);

    if (alreadySelected) {
      removeItem(item);
    } else {
      addItem(item);
    }
  };

  const mutatedItems = useMemo(() => {
    const filteredItems = options.filter(({ isHidden }) => !isHidden);
    if (randomizeOptions) {
      return shuffle(filteredItems);
    }

    return filteredItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizeOptions]);

  return (
    <ScrollView>
      {mutatedItems.map((item, index) => {
        return (
          <Box
            accessibilityLabel="checkbox-container"
            key={`checkbox-${item.id}`}
          >
            <CheckBoxItem
              {...item}
              tooltipAvailable={addTooltip}
              setPalette={setPalette}
              imageContainerVisible={hasImage}
              tooltipContainerVisible={hasTooltip}
              onChange={() => onItemValueChanged(item)}
              value={!!findById(values, item.id)}
              textReplacer={textReplacer}
              position={index}
            />
          </Box>
        );
      })}
    </ScrollView>
  );
};

export default CheckBoxActivityItem;
