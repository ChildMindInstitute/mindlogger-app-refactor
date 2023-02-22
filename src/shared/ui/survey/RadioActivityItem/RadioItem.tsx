import { FC } from 'react';

import { styled } from '@tamagui/core';

import { colors } from '@shared/lib';
import {
  XStack,
  RadioGroup,
  Text,
  Box,
  Image,
  QuestionTooltipIcon,
  Tooltip,
} from '@shared/ui';

import RadioOption from './types';

type RadioLabelProps = {
  option: RadioOption;
};

const RadioTooltipContainer = styled(Box, {
  marginRight: 10,
  width: 36,
});

const RadioTextContainer = styled(Box, {
  marginLeft: 10,
  flexGrow: 1,
});

const RadioItem: FC<RadioLabelProps> = ({
  option: { isVisible, name, value, image, description },
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <XStack alignItems="center">
      <RadioTooltipContainer>
        {description && (
          <Tooltip tooltipText={description}>
            <QuestionTooltipIcon color={colors.grey} size={36} />
          </Tooltip>
        )}
      </RadioTooltipContainer>

      <Box height={64} width="20%">
        {image && (
          <Image src={image} width="100%" height="100%" resizeMode="contain" />
        )}
      </Box>

      <RadioTextContainer>
        <Text fontSize={18}>{name.en}</Text>
      </RadioTextContainer>

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
