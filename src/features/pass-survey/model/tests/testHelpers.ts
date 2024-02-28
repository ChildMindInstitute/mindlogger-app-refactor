import {
  AudioPipelineItem,
  CheckboxPipelineItem,
  RadioPipelineItem,
  SliderPipelineItem,
} from '../../lib';

export const getEmptyRadioItem = (name: string): RadioPipelineItem => {
  const result: RadioPipelineItem = {
    id: 'mock-radio-id',
    name,
    timer: null,
    payload: {
      addTooltip: false,
      randomizeOptions: false,
      setAlerts: false,
      setPalette: false,
      options: [],
      autoAdvance: false,
    },
    type: 'Radio',
  };
  return result;
};

export const fillOptionsForRadio = (
  item: RadioPipelineItem,
  from = 1,
  setAlert = true,
) => {
  for (let i = from; i <= 5; i++) {
    item.payload.options.push({
      id: `mock-id-${i}`,
      alert: setAlert ? { message: `mock-alert-${i}` } : null,
      text: `mock-text-${i}`,
      score: i * 10,
      value: i,
      color: null,
      image: null,
      isHidden: false,
      tooltip: null,
    });
  }
};

export const getEmptyCheckboxesItem = (name: string): CheckboxPipelineItem => {
  const result: CheckboxPipelineItem = {
    id: 'mock-checkbox-id',
    name,
    timer: null,
    payload: {
      addTooltip: false,
      randomizeOptions: false,
      setAlerts: false,
      setPalette: false,
      options: [],
    },
    type: 'Checkbox',
  };
  return result;
};

export const fillOptionsForCheckboxes = (
  item: CheckboxPipelineItem,
  from = 1,
  setAlert = true,
) => {
  for (let i = from; i <= 5; i++) {
    item.payload.options.push({
      alert: setAlert ? { message: `mock-alert-${i}` } : null,
      color: null,
      id: 'mock-id-' + i,
      image: null,
      isHidden: false,
      text: 'mock-text-' + i,
      tooltip: null,
      score: i * 10,
      value: i,
      isNoneOption: false,
    });
  }
};

export const getEmptySliderItem = (name: string): SliderPipelineItem => {
  const result: SliderPipelineItem = {
    id: 'mock-slider-id',
    name,
    timer: null,
    payload: {
      isContinuousSlider: false,
      leftImageUrl: null,
      rightImageUrl: null,
      leftTitle: 'left-title',
      rightTitle: 'right-title',
      showTickLabels: false,
      showTickMarks: false,
      alerts: [],
      scores: [],
      minValue: 2,
      maxValue: 9,
    },
    type: 'Slider',
  };
  return result;
};

export const fillScoresForSlider = (
  item: SliderPipelineItem,
  count: number,
) => {
  for (let i = 0; i < count; i++) {
    item.payload.scores.push(i * 10);
  }
};

export const fillAlertsForSlider = (item: SliderPipelineItem) => {
  item.payload.alerts?.push({
    value: 2,
    message: 'alert-2',
    minValue: null,
    maxValue: null,
  });
  item.payload.alerts?.push({
    value: 3,
    message: 'alert-3',
    minValue: null,
    maxValue: null,
  });
  item.payload.alerts?.push({
    value: 9,
    message: 'alert-9',
    minValue: null,
    maxValue: null,
  });

  item.payload.alerts?.push({
    value: NaN,
    message: 'alert-7-8',
    minValue: 7,
    maxValue: 8,
  });
};

export const getEmptyAudioItem = (name: string): AudioPipelineItem => {
  const result: AudioPipelineItem = {
    id: 'mock-audio-id',
    name,
    timer: null,
    payload: {} as any,
    type: 'Audio',
  };
  return result;
};
