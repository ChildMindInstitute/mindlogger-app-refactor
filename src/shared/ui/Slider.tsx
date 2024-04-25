import { FC } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import {
  Slider as SliderBase,
  SliderProps,
} from '@miblanchard/react-native-slider';
import { useDebouncedCallback } from 'use-debounce';

import { colors } from '@shared/lib/constants';

type Props = SliderProps & { size: number; initialValue: number | null } & {
  onValueChange: NonNullable<SliderProps['onValueChange']>;
};

const CHANGE_VALUE_DELAY = 100;

const Slider: FC<Props & AccessibilityProps> = props => {
  const { size, initialValue = null } = props;
  const opacity = initialValue !== null ? 1 : 0;

  const debouncedOnValueChange = useDebouncedCallback(
    props.onValueChange,
    CHANGE_VALUE_DELAY,
  );

  return (
    <SliderBase
      thumbTintColor={colors.primary}
      thumbStyle={{
        height: size,
        width: size,
        borderRadius: size,
        opacity: opacity,
      }}
      minimumTrackStyle={styles.minimumTrackStyle}
      maximumTrackTintColor={colors.lightGrey}
      minimumTrackTintColor={colors.lightGrey}
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

export default Slider;
