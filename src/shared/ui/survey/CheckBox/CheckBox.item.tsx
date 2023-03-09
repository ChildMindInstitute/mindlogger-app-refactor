import { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { colors } from '@shared/lib';
import { invertColor, replaceTextWithScreenVariables } from '@shared/lib/utils';
import {
  Image,
  Text,
  XStack,
  QuestionTooltipIcon,
  Tooltip,
  CheckBox,
} from '@shared/ui';

import { Item } from './types';

type Props = {
  colorPalette: boolean;
  onChange: () => void;
  value: boolean;
} & Omit<Item, 'value'>;

const CheckBoxItem: FC<Props> = ({
  value,
  colorPalette,
  onChange,
  description,
  image,
  color,
  name,
}) => {
  const invertedColor =
    colorPalette && color ? invertColor(color) : colors.primary;

  const tooltipText = useMemo(
    () => replaceTextWithScreenVariables(description),
    [description],
  );

  const memoizedName = useMemo(
    () => replaceTextWithScreenVariables(name),
    [name],
  );

  return (
    <XStack
      minHeight="$7"
      py="$3"
      px="$5"
      my="$1"
      ai="center"
      jc="space-between"
      bg={colorPalette ? color : 'none'}
      br={7}
      bbw={colorPalette ? 0 : 1}
      bbc={colors.lighterGrey}
      onPress={onChange}
    >
      <XStack flex={1} ai="center">
        {!!description && (
          <Tooltip tooltipText={tooltipText}>
            <QuestionTooltipIcon color={colors.grey} size={25} />
          </Tooltip>
        )}

        {image ? (
          <Image
            width="15%"
            height={64}
            ml={description ? 5 : 0}
            src={image}
            resizeMode="contain"
          />
        ) : null}

        <Text
          maxWidth="70%"
          ml="$4"
          color={colorPalette && color ? invertedColor : colors.darkerGrey}
          fontSize={17}
        >
          {memoizedName}
        </Text>
      </XStack>

      <CheckBox
        style={styles.checkbox}
        lineWidth={2}
        animationDuration={0.2}
        boxType="square"
        tintColors={{
          true: colors.grey,
          false: colors.grey,
        }}
        onCheckColor={color || colors.white}
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
