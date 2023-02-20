import { FC } from 'react';

import { styled } from '@tamagui/core';
import { Slider as SliderBase, SliderProps } from '@tamagui/slider';

const CustomSliderTrack = styled(SliderBase.Track, {
  height: 4,
  backgroundColor: '$lightGrey',
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  borderRadius: 2,
});

const Slider: FC<SliderProps> = props => {
  return (
    <SliderBase {...props}>
      <CustomSliderTrack />

      <SliderBase.Thumb
        index={0}
        bg="$primary"
        borderColor="$primary"
        circular
      />
    </SliderBase>
  );
};

export default Slider;
