import React, { FC, useMemo, useState } from 'react';
import { AccessibilityProps } from 'react-native';

import { shuffle } from '@shared/lib';
import { useOnUndo } from '@shared/ui';

import RadioGrid from './RadioGrid';
import RadioList from './RadioList';
import RadioOption from './types';

type RadioActivityItemProps = {
  config: {
    options: Array<RadioOption>;
    setPalette: boolean;
    addTooltip: boolean;
    randomizeOptions: boolean;
    isGridView: boolean;
  };
  onChange: (value: RadioOption) => void;
  initialValue?: RadioOption;
  textReplacer: (markdown: string) => string;
};

const RadioActivityItem: FC<RadioActivityItemProps & AccessibilityProps> = ({
  config,
  onChange,
  initialValue,
  textReplacer,
}) => {
  const { options, randomizeOptions, addTooltip, setPalette, isGridView } =
    config;
  const [radioValueId, setRadioValueId] = useState(initialValue?.id ?? null);

  const selectedOptionIndex: number | null = useMemo(() => {
    const index = options.findIndex(o => o.id === radioValueId);
    return index === -1 ? null : index;
  }, [radioValueId, options]);

  useOnUndo(() => setRadioValueId(null));

  const hasImage = useMemo(
    () => options.some(option => !!option.image),
    [options],
  );

  const hasTooltip = useMemo(
    () => options.some(option => !!option.tooltip),
    [options],
  );

  const optionsList = useMemo(() => {
    if (randomizeOptions) {
      return shuffle(options);
    }

    return options;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizeOptions]);

  const onValueChange = (value: string) => {
    const selectedOption = options.find(option => option.id === value);

    setRadioValueId(selectedOption?.id ?? null);

    onChange(selectedOption!);
  };

  const RadiosView = isGridView ? RadioGrid : RadioList;

  return (
    <RadiosView
      value={radioValueId}
      onChange={onValueChange}
      options={optionsList}
      addTooltip={addTooltip}
      setPalette={setPalette}
      hasImage={hasImage}
      hasTooltip={hasTooltip}
      textReplacer={textReplacer}
      accessibilityLabel={`radios-group_value-${String(selectedOptionIndex)}`}
      mb={16}
    />
  );
};

export default RadioActivityItem;
