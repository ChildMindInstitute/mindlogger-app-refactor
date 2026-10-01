import { FC, PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

import Animated, { LinearTransition } from 'react-native-reanimated';

// Animated.View for smooth banner transitions
export const NavigatorContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Animated.View layout={LinearTransition} style={styles.container}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
