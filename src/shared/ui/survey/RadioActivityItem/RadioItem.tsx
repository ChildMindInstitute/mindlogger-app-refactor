import { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';

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
  textReplacer: (markdown: string) => string;
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
  textReplacer,
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
    : colors.black;

  return (
    <XStack
      minHeight="$7"
      bg={setPalette ? color : 'none'}
      px="$3"
      py="$3"
      jc="center"
      ai="center"
      ac="center"
      borderRadius={7}
    >
      {addTooltip && tooltip && (
        <RadioTooltipContainer>
          <Tooltip markdown={tooltipText}>
            <QuestionTooltipIcon
              color={hasColor ? invertedColor : colors.grey}
              size={22}
            />
          </Tooltip>
        </RadioTooltipContainer>
      )}

      {image && (
        <Box height={64} width="20%">
          <CachedImage
            source={image}
            style={styles.image}
            resizeMode="contain"
          />
        </Box>
      )}

      {image && (
        <Box width="10%">
          <CachedImage
            resizeMode="contain"
            style={styles.image}
            source={image}
          />
        </Box>
      )}

      <RadioTextContainer w="50%" px="2%">
        <Text fontSize={18} color={invertedTextColor}>
          {name}
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

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 40,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});
