import { StyleSheet } from 'react-native';

import { LinearGradient } from 'react-native-linear-gradient';

import { palette } from '@app/shared/lib/constants/palette';
import { hexToRgba } from '@app/shared/lib/utils/theme.utils';

type Props = {
  position?: 'top' | 'bottom';
  color?: string;
};

export const GradientOverlay = ({
  position = 'top',
  color = palette.surface1,
}: Props) => {
  return (
    <LinearGradient
      colors={[color, hexToRgba(color, 0)]}
      start={position === 'top' ? { x: 0, y: 0 } : { x: 0, y: 1 }}
      end={position === 'top' ? { x: 0, y: 1 } : { x: 0, y: 0 }}
      style={[
        styles.gradientOverlay,
        position === 'top'
          ? styles.gradientOverlayTop
          : styles.gradientOverlayBottom,
      ]}
      pointerEvents="none"
    />
  );
};

const styles = StyleSheet.create({
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 16,
    zIndex: 1,
  },
  gradientOverlayTop: {
    top: 0,
  },
  gradientOverlayBottom: {
    bottom: 0,
  },
});
