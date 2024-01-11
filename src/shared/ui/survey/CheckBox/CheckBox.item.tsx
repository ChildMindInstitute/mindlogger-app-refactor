import { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { styled } from '@tamagui/core';
import { XStack } from '@tamagui/stacks';

import { colors } from '@shared/lib';
import { invertColor } from '@shared/lib/utils';
import { Text, Tooltip, CheckBox, QuestionTooltipIcon } from '@shared/ui';

import { Item } from './types';

const CheckboxTooltipContainer = styled(XStack, {
  marginRight: 10,
  width: '8%',
});

type Props = {
  setPalette: boolean;
  imageContainerVisible: boolean;
  tooltipContainerVisible: boolean;
  tooltipAvailable: boolean;
  onChange: () => void;
  value: boolean;
  textReplacer: (markdown: string) => string;
} & Omit<Item, 'value'>;

const CheckBoxItem: FC<Props> = ({
  value,
  setPalette,
  imageContainerVisible,
  tooltipContainerVisible,
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
        {tooltipAvailable && tooltipContainerVisible && (
          <CheckboxTooltipContainer>
            {!!tooltip && (
              <Tooltip
                markdown={tooltipText}
                accessibilityLabel="checkbox-tooltip-view"
              >
                <QuestionTooltipIcon color={invertedColor} size={25} />
              </Tooltip>
            )}
          </CheckboxTooltipContainer>
        )}

        {imageContainerVisible ? (
          <XStack style={styles.imageContainer}>
            {image && (
              <CachedImage
                style={styles.image}
                source={image}
                resizeMode="contain"
              />
            )}
          </XStack>
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
  imageContainer: {
    width: 56,
    height: 56,
    overflow: 'hidden',
    borderRadius: 4,
    marginLeft: 4,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});

export default CheckBoxItem;
