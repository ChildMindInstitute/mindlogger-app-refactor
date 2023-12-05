import { FC, useMemo } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { styled } from '@tamagui/core';

import { colors, invertColor } from '@shared/lib';
import {
  XStack,
  RadioGroup,
  Text,
  Box,
  QuestionTooltipIcon,
  Tooltip,
} from '@shared/ui';

import RadioOption from './types';

type RadioLabelProps = {
  option: RadioOption;
  addTooltip: boolean;
  setPalette: boolean;
  setImageContainer: boolean;
  textReplacer: (markdown: string) => string;
};

const RadioTooltipContainer = styled(Box, {
  marginRight: 10,
  width: '8%',
});

const RadioTextContainer = styled(Box, {
  flexGrow: 1,
});

const RadioItem: FC<RadioLabelProps & AccessibilityProps> = ({
  option: { isHidden, id, text, color, image, tooltip, value },
  addTooltip,
  setImageContainer,
  setPalette,
  textReplacer,
  accessibilityLabel,
}) => {
  const name = useMemo(() => textReplacer(text), [textReplacer, text]);
  const tooltipText = useMemo(
    () => textReplacer(tooltip ?? ''),
    [textReplacer, tooltip],
  );

  if (isHidden) {
    return null;
  }

  const hasColor = color && setPalette;
  const invertedColor = hasColor
    ? invertColor(color as string)
    : colors.primary;
  const invertedTextColor = hasColor
    ? invertColor(color as string)
    : colors.darkerGrey;

  return (
    <XStack
      minHeight="$7"
      bg={setPalette ? color : 'none'}
      py="$4"
      px={10}
      my="$1"
      jc="center"
      ai="center"
      ac="center"
      borderRadius={7}
      accessibilityLabel={accessibilityLabel}
    >
      {addTooltip && tooltip && (
        <RadioTooltipContainer>
          <Tooltip
            accessibilityLabel={`radio-option-tooltip-${value}`}
            markdown={tooltipText}
          >
            <QuestionTooltipIcon
              color={hasColor ? invertedColor : colors.grey}
              size={22}
            />
          </Tooltip>
        </RadioTooltipContainer>
      )}

      {setImageContainer && (
        <Box style={styles.imageContainer}>
          {image && (
            <CachedImage
              resizeMode="contain"
              accessibilityLabel={`radio-option-image-${value}`}
              style={styles.image}
              source={image}
            />
          )}
        </Box>
      )}

      <RadioTextContainer w="50%">
        <Text
          accessibilityLabel={`radio-option-text${value}`}
          fontSize={17}
          ml="$4"
          color={invertedTextColor}
        >
          {name}
        </Text>
      </RadioTextContainer>

      <Box>
        <RadioGroup.Item
          accessibilityLabel={`radio-option-${value}`}
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

const styles = StyleSheet.create({
  imageContainer: {
    width: 56,
    height: 56,
    overflow: 'hidden',
    borderRadius: 4,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
