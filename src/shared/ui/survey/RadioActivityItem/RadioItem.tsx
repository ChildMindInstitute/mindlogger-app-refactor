import { FC } from 'react';

import { styled } from '@tamagui/core';

import { colors, invertColor } from '@shared/lib';
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
  addTooltip: boolean;
  setPalette: boolean;
};

const RadioTooltipContainer = styled(Box, {
  marginRight: 10,
  width: '8%',
});

const RadioTextContainer = styled(Box, {
  marginLeft: 10,
  flexGrow: 1,
});

const RadioItem: FC<RadioLabelProps> = ({
  option: { isHidden, id, text, color, image, tooltip },
  addTooltip,
  setPalette,
}) => {
  if (isHidden) {
    return null;
  }

  const hasColor = color && setPalette;
  const invertedColor = hasColor
    ? invertColor(color as string)
    : colors.primary;
  const invertedTextColor = hasColor
    ? invertColor(color as string)
    : colors.black;

  return (
    <XStack
      minHeight={64}
      bg={setPalette ? color : 'none'}
      px="$3"
      py="$3"
      jc="center"
      ai="center"
      ac="center"
      borderRadius={7}
    >
      <RadioTooltipContainer>
        {addTooltip && tooltip && (
          <Tooltip tooltipText={tooltip}>
            <QuestionTooltipIcon
              color={hasColor ? invertedColor : colors.grey}
              size={22}
            />
          </Tooltip>
        )}
      </RadioTooltipContainer>

      {image && (
        <Box width="10%">
          <Image
            width="100%"
            height={40}
            resizeMode="contain"
            my="auto"
            src={image}
          />
        </Box>
      )}

      <RadioTextContainer w="50%" px="2%">
        <Text fontSize={18} color={invertedTextColor}>
          {text}
        </Text>
      </RadioTextContainer>

      <Box>
        <RadioGroup.Item
          borderColor={invertedColor}
          borderWidth={3}
          bg={setPalette && color ? color : '#fff'}
          id={text}
          value={id}
        >
          <RadioGroup.Indicator bg={invertedColor} />
        </RadioGroup.Item>
      </Box>
    </XStack>
  );
};

export default RadioItem;
