import { FC, useMemo } from 'react';

import { shuffle } from '@app/shared/lib';
import { YStack, RadioGroup, Input } from '@shared/ui';

import RadioItem from './RadioItem';
import RadioOption from './types';

type RadioActivityItemProps = {
  config: {
    isOptionOrderRandomized: boolean;
    options: Array<RadioOption>;
  };

  onResponseSet: (...args: any[]) => unknown;
};

const RadioActivityItem: FC<RadioActivityItemProps> = ({
  config,
  onResponseSet,
}) => {
  const { options, isOptionOrderRandomized } = config;

  const optionsList = useMemo(() => {
    if (isOptionOrderRandomized) {
      return shuffle(options);
    }

    return options;
  }, [isOptionOrderRandomized, options]);

  return (
    <YStack>
      <RadioGroup name="form">
        <YStack w={300} ai="center" space="$2">
          {optionsList.map(option => (
            <RadioItem option={option} />
          ))}
        </YStack>
      </RadioGroup>

      <Input onSubmitEditing={onResponseSet} />
    </YStack>
  );
};

export default RadioActivityItem;
