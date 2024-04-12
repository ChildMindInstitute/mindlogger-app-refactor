import {
  AudioPipelineItem,
  CheckboxPipelineItem,
  CheckboxResponse,
  RadioPipelineItem,
  RadioResponse,
  SliderPipelineItem,
  StackedCheckboxPipelineItem,
  StackedCheckboxResponse,
  StackedRadioPipelineItem,
  StackedRadioResponse,
  StackedSliderPipelineItem,
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
  return item;
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
  return item;
};

export const getEmptySliderItem = (
  name: string,
  id: string = 'mock-slider-id',
): SliderPipelineItem => {
  const result: SliderPipelineItem = {
    id,
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
    message: 'mock-alert-2',
    minValue: null,
    maxValue: null,
  });
  item.payload.alerts?.push({
    value: 3,
    message: 'mock-alert-3',
    minValue: null,
    maxValue: null,
  });
  item.payload.alerts?.push({
    value: 9,
    message: 'mock-alert-9',
    minValue: null,
    maxValue: null,
  });

  item.payload.alerts?.push({
    value: NaN,
    message: 'mock-alert-7-8',
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
    id: 'mock-item-stacked-radio-id',
    payload: {
      addScores: false,
      setAlerts: true,
      addTooltip: false,
      options: [],
      rows: [],
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

export const getStackedRadioResponse = (
  test: '1-no-empty-alerts' | '2-is-empty-alert',
) => {
  const result: StackedRadioResponse = [];

  if (test === '1-no-empty-alerts') {
    result.push({ id: 'mock-opt-id-1', rowId: 'mock-row-id-1', tooltip: null });
    result.push({
      id: 'mock-opt-id-20',
      rowId: 'mock-row-id-2',
      tooltip: null,
    });
  }

  if (test === '2-is-empty-alert') {
    result.push({ id: 'mock-opt-id-1', rowId: 'mock-row-id-1', tooltip: null });
    result.push({
      id: 'mock-opt-id-30',
      rowId: 'mock-row-id-2',
      tooltip: null,
    });
  }

  return result;
};

export const getStackedCheckboxItem = () => {
  const result: StackedCheckboxPipelineItem = {
    timer: null,
    type: 'StackedCheckbox',
    id: 'mock-item-stacked-checkbox-id',
    payload: {
      addScores: false,
      setAlerts: true,
      addTooltip: false,
      options: [],
      rows: [],
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

export const getStackedCheckboxResponse = (
  test: '1-partially-selected' | '2-all-selected' | '3-no-selection',
) => {
  const result: StackedCheckboxResponse = [];

  if (test === '1-partially-selected') {
    result.push([
      { id: 'mock-opt-id-1', tooltip: null },
      { id: 'mock-opt-id-2', tooltip: null },
    ]);
    result.push([
      { id: 'mock-opt-id-20', tooltip: null },
      { id: 'mock-opt-id-30', tooltip: null },
    ]);
  }

  if (test === '2-all-selected') {
    result.push([
      { id: 'mock-opt-id-1', tooltip: null },
      { id: 'mock-opt-id-2', tooltip: null },
      { id: 'mock-opt-id-3', tooltip: null },
    ]);
    result.push([
      { id: 'mock-opt-id-10', tooltip: null },
      { id: 'mock-opt-id-20', tooltip: null },
      { id: 'mock-opt-id-30', tooltip: null },
    ]);
  }

  if (test === '3-no-selection') {
  }

  return result;
};

export const getStackedSliderItem = (): StackedSliderPipelineItem => {
  const result: StackedSliderPipelineItem = {
    id: 'mock-stacked-slider-id',
    name: 'mock-stacked-slider-name',
    timer: null,
    payload: {
      addScores: false,
      setAlerts: true,
      rows: [
        {
          id: 'mock-row1-id',
          label: 'mock-row1-label',
          leftImageUrl: null,
          rightImageUrl: null,
          leftTitle: 'left-title',
          rightTitle: 'right-title',
          alerts: [
            {
              message: 'mock-row1-2-alert',
              value: 2,
            },
            {
              message: 'mock-row1-5-alert',
              value: 5,
            },
            {
              message: 'mock-row1-6-alert',
              value: 6,
            },
            {
              message: 'mock-row1-9-alert',
              value: 9,
            },
          ],
          minValue: 2,
          maxValue: 9,
        },
        {
          id: 'mock-row1-id',
          label: 'mock-row1-label',
          leftImageUrl: null,
          rightImageUrl: null,
          leftTitle: 'left-title',
          rightTitle: 'right-title',
          alerts: [
            {
              message: 'mock-row2-3-alert',
              value: 3,
            },
          ],
          minValue: 1,
          maxValue: 5,
        },
      ],
    },
    type: 'StackedSlider',
  };
  return result;
};

export const getRadioResponse = (value: number): RadioResponse => {
  return {
    color: null,
    id: 'mock-response-id',
    image: null,
    isHidden: false,
    score: null,
    text: 'mock-text',
    tooltip: null,
    value: value,
  };
};

export const getCheckboxResponse = (values: number[]): CheckboxResponse => {
  const result: CheckboxResponse = values.map(v => ({
    color: null,
    id: 'mock-id-' + v,
    image: null,
    isHidden: false,
    score: null,
    text: 'mock-text-' + v,
    tooltip: null,
    value: v,
  }));
  return result;
};
