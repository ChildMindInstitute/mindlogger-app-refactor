import { StyleSheet } from 'react-native';

import { BoxProps, XStack } from '@app/shared/ui/base';
import { CheckBox } from '@app/shared/ui/CheckBox';

type Props = {
  value: boolean;
  label: JSX.Element;
  onChange: (value: boolean) => void;
} & BoxProps;

export function ConsentCheckBox({
  value,
  label,
  onChange,
  ...boxProps
}: Props) {
  const changeValue = () => onChange(!value);

  return (
    <XStack {...boxProps} onPress={changeValue} hitSlop={4}>
      <CheckBox
        lineWidth={2}
        animationDuration={0.1}
        boxType="square"
        onCheckColor="black"
        onTintColor="black"
        tintColor="black"
        style={styles.checkbox}
        disabled
        onAnimationType="fade"
        offAnimationType="fade"
        value={value}
      />

      {label}
    </XStack>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
  },
});
