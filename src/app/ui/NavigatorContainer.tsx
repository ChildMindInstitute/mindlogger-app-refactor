import { FC, PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

import Animated, { LinearTransition } from 'react-native-reanimated';

import {
  bannersExpandingSelector,
  bannersHiddenSelector,
} from '@app/entities/banner/model/selectors';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

// Animated.View for smooth banner transitions
export const NavigatorContainer: FC<PropsWithChildren> = ({ children }) => {
  const isHidden = useAppSelector(bannersHiddenSelector);
  const isExpanding = useAppSelector(bannersExpandingSelector);

  // Disable transition when banners strip is hidden or expanding
  // Avoids iOS header keeping a stale top inset (M2-11138)
  return (
    <Animated.View
      layout={isHidden || isExpanding ? undefined : LinearTransition}
      style={styles.container}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
