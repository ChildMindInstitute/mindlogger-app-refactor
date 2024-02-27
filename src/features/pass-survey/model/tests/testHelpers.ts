import { CheckboxPipelineItem, RadioPipelineItem } from '../../lib';

export const getEmptyRadioItem = (name: string): RadioPipelineItem => {
  const result: RadioPipelineItem = {
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
