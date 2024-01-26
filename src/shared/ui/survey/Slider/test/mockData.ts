import { StackedSliderConfig } from '../types';

const sliderConfig: StackedSliderConfig = {
  rows: [
    {
      label: 'test 1',
      id: '1',
      leftTitle: 'Left',
      rightTitle: 'Right',
      minValue: 0,
      maxValue: 10,
      leftImageUrl: null,
      rightImageUrl: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg',
    },
    {
      label: 'test 2',
      id: '2',
      leftTitle: 'Left',
      rightTitle: 'Right',
      minValue: 0,
      maxValue: 10,
      leftImageUrl: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg',
      rightImageUrl: null,
    },
  ],
  addScores: false,
  setAlerts: false,
};

const sliderValues = [2, 1];

export default { sliderConfig, sliderValues };
