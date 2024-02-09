import { PropsWithChildren, useCallback } from 'react';
import {
  Pressable,
  TouchableOpacityProps,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

type Props = PropsWithChildren<TouchableOpacityProps>;

function TouchableOpacity({ children, style, activeOpacity = 0.2, ...props }: Props) {
  const styles: (state: PressableStateCallbackType) => StyleProp<ViewStyle> = useCallback(
    ({ pressed }) => StyleSheet.flatten([{ opacity: pressed ? activeOpacity : 1 }, style]),
    [style, activeOpacity],
  );

  return (
    <Pressable style={styles} {...props}>
      {children}
    </Pressable>
  );
}

export default TouchableOpacity;
