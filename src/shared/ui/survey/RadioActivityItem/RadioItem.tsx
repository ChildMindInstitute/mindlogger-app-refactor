import { FC } from 'react';

import { XStack, RadioGroup, Text } from '@shared/ui';

import RadioOption from './types';

type RadioLabelProps = {
  option: RadioOption;
};

const RadioItem: FC<RadioLabelProps> = ({
  option: { isVisible, name, value },
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <XStack>
      <RadioGroup.Item id={name.en} value={String(value)}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Text>{name.en}</Text>
    </XStack>
  );
};

export default RadioItem;
