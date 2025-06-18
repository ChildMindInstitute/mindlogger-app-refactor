import { StyleSheet } from 'react-native';

import { LinearGradient } from 'react-native-linear-gradient';

import { palette } from '@app/shared/lib/constants/palette';
import { hexToRgba } from '@app/shared/lib/utils/theme.utils';

type Props = {
  color?: string;
};

export const GradientOverlay = ({ color = palette.surface1 }: Props) => {
  return (
    <LinearGradient
      colors={[color, hexToRgba(color, 0)]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientOverlay}
      pointerEvents="none"
    />
  );
};

const styles = StyleSheet.create({
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 16,
    zIndex: 1,
  },
});
