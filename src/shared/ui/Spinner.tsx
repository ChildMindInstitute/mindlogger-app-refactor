import { AccessibilityProps, StyleSheet, ViewStyle } from 'react-native';

import { MotiView } from 'moti';
import { Circle } from 'react-native-progress';

import { palette } from '../lib/constants/palette';

type Props = AccessibilityProps & {
  size?: number;
  color?: string;
  isVisible?: boolean;
  overlayColor?: string;
  withOverlay?: boolean;
};

/**
 * An indeterminate spinner component
 * @param size - The size of the spinner, defaults to 36
 * @param color - The color of the spinner, defaults to primary
 * @param isVisible - Use this to control whether to show the spinner using opacity transition
 * @param withOverlay - Whether to show the spinner with a full-screen overlay, defaults to false
 * @param overlayColor - The color of the overlay, defaults to spinner_container
 * @see https://github.com/oblador/react-native-progress?tab=readme-ov-file#progresscircle
 */
export function Spinner({
  size = 36,
  color = palette.primary,
  isVisible = true,
  withOverlay = false,
  overlayColor = palette.spinner_container,
  ...props
}: Props) {
  const spinner = (
    <Circle
      size={size}
      color={color}
      borderWidth={size * (4 / 36)}
      indeterminate
      endAngle={0.75}
      pointerEvents="none"
    />
  );

  return (
    <MotiView
      testID="loader"
      animate={{ opacity: isVisible ? 1 : 0 }}
      pointerEvents={isVisible ? 'auto' : 'none'}
      style={
        withOverlay
          ? {
              ...overlayStyle,
              paddingBottom: 20,
              backgroundColor: overlayColor,
            }
          : undefined
      }
      {...props}
    >
      {spinner}
    </MotiView>
  );
}

const overlayStyle: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  alignItems: 'center',
  justifyContent: 'center',
};
