import { FC } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bannersHiddenSelector } from '@app/entities/banner/model/selectors';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

// Android edge-to-edge makes the bottom nav bar see-through, so the app shows
// behind it. This strip gives it a solid background again, except during
// full-screen (Unity) steps which stay full-bleed.
export const NavigationBarScrim: FC = () => {
  const { bottom } = useSafeAreaInsets();
  const isFullScreenStep = useAppSelector(bannersHiddenSelector);

  if (Platform.OS !== 'android' || bottom === 0 || isFullScreenStep) {
    return null;
  }

  return (
    <View pointerEvents="none" style={[styles.scrim, { height: bottom }]} />
  );
};

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: palette.surface,
  },
});
