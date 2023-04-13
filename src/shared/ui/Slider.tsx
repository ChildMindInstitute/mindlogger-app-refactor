import { FC } from 'react';
import { StyleSheet } from 'react-native';

import {
  Slider as SliderBase,
  SliderProps,
} from '@miblanchard/react-native-slider';

import { colors } from '@shared/lib/constants';

type Props = SliderProps & { size: number; initialValue?: number };

const Slider: FC<Props> = props => {
  const { size, initialValue } = props;
  const opacity = initialValue ? 1 : 0;

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
    />
  );
};

const styles = StyleSheet.create({
  minimumTrackStyle: {
    opacity: 0,
  },
});

export default Slider;
