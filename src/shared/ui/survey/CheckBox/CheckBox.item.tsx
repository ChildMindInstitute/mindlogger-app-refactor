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
  onChange: (itemValue: number) => void;
  checked: boolean;
} & Item;

const CheckBoxItem: FC<Props> = ({
  colorPalette,
  onChange,
  checked,
  description,
  image,
  color,
  value,
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
      onPress={() => onChange(value)}
    >
      <XStack flex={1} ai="center">
        {!!description && (
          <Tooltip tooltipText={tooltipText}>
            <QuestionTooltipIcon color={colors.grey} size={25} />
          </Tooltip>
        )}

        {image ? (
          <Image
            ml={description ? 5 : 0}
            src={image}
            resizeMode="contain"
            width="15%"
            height={64}
          />
        ) : null}

        <Text
          ml="$4"
          maxWidth="70%"
          color={colorPalette && color ? invertedColor : colors.darkerGrey}
          fontSize={17}
        >
          {memoizedName}
        </Text>
      </XStack>

      <CheckBox
        style={styles.checkbox}
        tintColors={{
          true: colors.grey,
          false: colors.grey,
        }}
        onCheckColor={color || colors.white}
        onFillColor={invertedColor}
        onTintColor={invertedColor}
        tintColor={invertedColor}
        boxType="square"
        lineWidth={2}
        onAnimationType="fade"
        offAnimationType="fade"
        animationDuration={0.2}
        value={checked}
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
