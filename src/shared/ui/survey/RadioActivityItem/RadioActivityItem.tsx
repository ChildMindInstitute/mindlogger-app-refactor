import { FC } from 'react';

import { YStack, RadioGroup, Input } from '@shared/ui';

import RadioItem from './RadioItem';
import RadioOption from './types';

type RadioActivityItemProps = {
  options: Array<RadioOption>;
  onResponseSet: (...args: any[]) => unknown;
  isOptionOrderRandomized: boolean;
};

const RadioActivityItem: FC<RadioActivityItemProps> = ({
  options,
  onResponseSet,
}) => {
  return (
    <YStack>
      <RadioGroup name="form">
        <YStack w={300} ai="center" space="$2">
          {options.map(option => (
            <RadioItem option={option} />
          ))}
        </YStack>
      </RadioGroup>

      <Input onSubmitEditing={onResponseSet} />
    </YStack>
  );
};

export default RadioActivityItem;
