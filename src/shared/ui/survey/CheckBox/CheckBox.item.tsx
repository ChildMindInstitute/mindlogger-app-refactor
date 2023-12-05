/* eslint-disable react-native/no-inline-styles */
import { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

import { colors } from '@shared/lib';
import { invertColor } from '@shared/lib/utils';
import {
  Text,
  XStack,
  QuestionTooltipIcon,
  Tooltip,
  CheckBox,
  Box,
} from '@shared/ui';

import { Item } from './types';

type Props = {
  setPalette: boolean;
  tooltipAvailable: boolean;
  onChange: () => void;
  value: boolean;
  textReplacer: (markdown: string) => string;
} & Omit<Item, 'value'>;

const CheckBoxItem: FC<Props> = ({
  value,
  setPalette,
  tooltipAvailable,
  onChange,
  tooltip,
  image,
  color,
  text,
  textReplacer,
}) => {
  const invertedColor =
    setPalette && color ? invertColor(color) : colors.primary;

  const tooltipText = useMemo(
    () => textReplacer(tooltip || ''),
    [textReplacer, tooltip],
  );

  const name = useMemo(() => textReplacer(text), [textReplacer, text]);

  return (
    <XStack
      minHeight="$7"
      py="$4"
      px={10}
      my="$1"
      ai="center"
      jc="space-between"
      bg={setPalette ? color : 'none'}
      br={7}
      bbw={setPalette ? 0 : 1}
      bbc={colors.lighterGrey}
      onPress={onChange}
    >
      <XStack flex={1} ai="center">
        {!!tooltip && tooltipAvailable && (
          <Tooltip markdown={tooltipText}>
            <QuestionTooltipIcon color={invertedColor} size={25} />
          </Tooltip>
        )}

        {image ? (
          <Box borderRadius={4} ml={4} overflow="hidden">
            <CachedImage
              style={styles.image}
              source={image}
              resizeMode="contain"
            />
          </Box>
        ) : null}

        <Text
          maxWidth="70%"
          accessibilityLabel="option_text"
          ml="$4"
          color={setPalette && color ? invertedColor : colors.darkerGrey}
          fontSize={17}
        >
          {name}
        </Text>
      </XStack>

      <CheckBox
        style={styles.checkbox}
        accessibilityLabel="option_checkbox"
        lineWidth={2}
        animationDuration={0.2}
        boxType="square"
        tintColors={{
          true: invertedColor,
          false: invertedColor,
        }}
        onCheckColor={setPalette && color ? color : colors.white}
        onFillColor={invertedColor}
        onTintColor={invertedColor}
        tintColor={invertedColor}
        onAnimationType="fade"
        offAnimationType="fade"
        value={value}
        disabled={true}
      />
    </XStack>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
  },
  image: {
    width: 54,
    height: 54,
  },
});

export default CheckBoxItem;
