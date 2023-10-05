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
      py="$3"
      px="$5"
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
          <CachedImage
            style={{
              width: '15%',
              height: 64,
              marginLeft: tooltip ? 12 : 0,
            }}
            source={image}
            resizeMode="contain"
          />
        ) : null}

        <Text
          maxWidth="70%"
          ml="$4"
          color={setPalette && color ? invertedColor : colors.darkerGrey}
          fontSize={17}
        >
          {name}
        </Text>
      </XStack>

      <CheckBox
        style={styles.checkbox}
        data-test="checkbox"
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
});

export default CheckBoxItem;
