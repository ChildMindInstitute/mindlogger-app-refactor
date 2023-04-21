import { FC } from 'react';
import { StyleSheet } from 'react-native';

import {
  Slider as SliderBase,
  SliderProps,
} from '@miblanchard/react-native-slider';
import { useDebouncedCallback } from 'use-debounce';

import { colors } from '@shared/lib/constants';

type Props = SliderProps & { size: number; initialValue?: number };

const CHANGE_VALUE_DELAY = 100;

const Slider: FC<Props> = props => {
  const { size, initialValue = undefined } = props;
  const opacity = initialValue !== undefined ? 1 : 0;

  const debouncedOnValueChange = useDebouncedCallback(value => {
    props.onValueChange?.(value);
  }, CHANGE_VALUE_DELAY);

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
      value={initialValue}
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
