import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import { TouchableOpacity } from '@app/shared/ui/TouchableOpacity';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function TabBarButton({
  children,
  style,
  ...props
}: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[style, styles.button]}
      // react-navigation types its handlers with react-native event types,
      // while our TouchableOpacity is built on react-native-gesture-handler,
      // which uses its own event types. The events are compatible at runtime
      // (the tab press handlers do not read event fields), so cast the spread.
      {...(props as unknown as ComponentProps<typeof TouchableOpacity>)}
    >
      {children}
    </TouchableOpacity>
  );
}
