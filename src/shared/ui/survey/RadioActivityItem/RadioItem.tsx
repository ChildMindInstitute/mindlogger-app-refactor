import { FC } from 'react';

import { colors } from '@shared/lib';
import {
  XStack,
  RadioGroup,
  Text,
  Box,
  Image,
  QuestionTooltipIcon,
} from '@shared/ui';

import RadioOption from './types';

type RadioLabelProps = {
  option: RadioOption;
};

const RadioItem: FC<RadioLabelProps> = ({
  option: { isVisible, name, value, image, description },
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <XStack width="100%" paddingVertical={5} alignItems="center">
      <Box style={{ marginRight: 10, width: 36 }}>
        {description && <QuestionTooltipIcon color={colors.grey} size={36} />}
      </Box>

      <Box height={64} width="20%">
        {image && (
          <Image
            style={{ marginRight: 10 }}
            src={image}
            width="100%"
            height="100%"
            resizeMode="contain"
          />
        )}
      </Box>

      <Box style={{ flexGrow: 10 }}>
        <Text fontSize={18}>{name.en}</Text>
      </Box>

      <Box>
        <RadioGroup.Item
          borderColor={colors.blue}
          borderWidth={3}
          id={name.en}
          value={String(value)}
        >
          <RadioGroup.Indicator backgroundColor={colors.blue} />
        </RadioGroup.Item>
      </Box>
    </XStack>
  );
};

export default RadioItem;
