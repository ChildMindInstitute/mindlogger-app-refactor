import { FC } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import {
  Slider as SliderBase,
  SliderProps,
} from '@miblanchard/react-native-slider';
import { useDebouncedCallback } from 'use-debounce';

import { palette } from '../lib/constants/palette';

type Props = SliderProps & { size: number; initialValue: number | null } & {
  onValueChange: NonNullable<SliderProps['onValueChange']>;
};

const CHANGE_VALUE_DELAY = 100;

export const Slider: FC<Props & AccessibilityProps> = props => {
  const { size, initialValue = null } = props;
  const opacity = initialValue !== null ? 1 : 0;

  const debouncedOnValueChange = useDebouncedCallback(
    props.onValueChange,
    CHANGE_VALUE_DELAY,
  );

  return (
    <SliderBase
      thumbTintColor={palette.primary}
      thumbStyle={{
        height: size,
        width: size,
        borderRadius: size,
        opacity: opacity,
      }}
      minimumTrackStyle={styles.minimumTrackStyle}
      maximumTrackTintColor={palette.surface_variant}
      minimumTrackTintColor={palette.surface_variant}
      thumbTouchSize={{
        width: size,
        height: size,
      }}
      {...props}
      value={initialValue || undefined}
      onValueChange={debouncedOnValueChange}
    />
  );
};

const styles = StyleSheet.create({
  minimumTrackStyle: {
    opacity: 0,
  },
});
