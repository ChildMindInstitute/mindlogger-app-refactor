import { PropsWithChildren, useCallback } from 'react';
import {
  TouchableOpacityProps,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import { Pressable, type PressableProps } from 'react-native-gesture-handler';

type Props = PressableProps & PropsWithChildren<TouchableOpacityProps>;

export function TouchableOpacity({
  children,
  style,
  activeOpacity = 0.2,
  ...props
}: Props) {
  const styles: (state: PressableStateCallbackType) => StyleProp<ViewStyle> =
    useCallback(
      ({ pressed }) =>
        StyleSheet.flatten([{ opacity: pressed ? activeOpacity : 1 }, style]),
      [style, activeOpacity],
    );

  return (
    <Pressable style={styles} {...props}>
      {children}
    </Pressable>
  );
}
