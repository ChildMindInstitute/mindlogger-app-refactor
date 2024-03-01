import {
  AudioPipelineItem,
  CheckboxPipelineItem,
  RadioPipelineItem,
  SliderPipelineItem,
  StackedRadioPipelineItem,
  StackedRadioResponse,
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

export const getStackedRadioItem = () => {
  const result: StackedRadioPipelineItem = {
    timer: null,
    type: 'StackedRadio',
    id: 'item-stacked-radio',
    payload: {
      addScores: false,
      setAlerts: true,
      addTooltip: false,
      options: [], // no need for alerts test
      rows: [], // - / -
      randomizeOptions: false,
      dataMatrix: [
        {
          rowId: 'mock-row-id-1',
          options: [
            {
              alert: { message: 'mock-alert-r1-o1' },
              optionId: 'mock-opt-id-1',
              score: 0,
            },
            {
              alert: { message: 'mock-alert-r1-o2' },
              optionId: 'mock-opt-id-2',
              score: 0,
            },
            {
              alert: { message: 'mock-alert-r1-o3' },
              optionId: 'mock-opt-id-3',
              score: 0,
            },
          ],
        },
        {
          rowId: 'mock-row-id-2',
          options: [
            {
              alert: { message: 'mock-alert-r2-o1' },
              optionId: 'mock-opt-id-10',
              score: 0,
            },
            {
              alert: { message: 'mock-alert-r2-o2' },
              optionId: 'mock-opt-id-20',
              score: 0,
            },
            {
              alert: null,
              optionId: 'mock-opt-id-30',
              score: 0,
            },
          ],
        },
      ],
    },
  };
  return result;
};

export const getStackedRadioResponse = (test: '1' | '2') => {
  const result: StackedRadioResponse = [];

  if (test === '1') {
    result.push({ id: 'mock-opt-id-1', rowId: 'mock-row-id-1', tooltip: null });
    result.push({
      id: 'mock-opt-id-20',
      rowId: 'mock-row-id-2',
      tooltip: null,
    });
  }

  if (test === '2') {
    result.push({ id: 'mock-opt-id-1', rowId: 'mock-row-id-1', tooltip: null });
    result.push({
      id: 'mock-opt-id-30',
      rowId: 'mock-row-id-2',
      tooltip: null,
    });
  }

  return result;
};
