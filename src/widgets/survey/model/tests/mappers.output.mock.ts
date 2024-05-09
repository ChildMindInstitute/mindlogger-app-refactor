export const textOutput = ['kkkkk'];
export const checkboxOutput = [
  {
    value: [1, 2],
  },
];

export const radioOutput = [
  {
    value: 2,
  },
];

export const numberSelectOutput = [{ value: '2' }];

export const sliderOutput = [
  {
    value: 4,
  },
];

export const additionalAnswerOutput = [
  {
    text: 'Additional',
    value: 2,
  },
];

export const answersWithEmptyEntries = ['kkkkk', null, null, null, null];

export const dateOutput = [
  {
    value: {
      day: 12,
      month: 12,
      year: 2020,
    },
  },
];

export const timeOutput = [
  {
    value: {
      hours: 22,
      minutes: 22,
    },
  },
];

export const timeRangeOutput = [
  {
    value: {
      from: {
        hour: 22,
        minute: 22,
      },
      to: {
        hour: 23,
        minute: 23,
      },
    },
  },
];

export const geoOutput = [
  {
    value: {
      latitude: 1,
      longitude: 2,
    },
  },
];

export const stackedRadioOutput = [
  {
    value: ['One'],
  },
];

export const stackedCheckboxOutput = [
  {
    value: [['opt1'], null],
  },
];
export const stackedSliderOutput = [
  {
    value: [1, 9],
  },
];

export const mediaOutput = [
  {
    value: {
      fileName: 'some-name.mp4',
      fromLibrary: true,
      size: 100,
      type: 'mp4',
      uri: 'some://uri',
    },
  },
];

export const audioPlayerOutput = [
  {
    value: true,
  },
];

export const userActionsOutput = [
  {
    response: 'textAnswer',
    screen: '1/1',
    time: 100,
    type: 'SET_ANSWER',
  },
  {
    screen: '1/1',
    time: 100,
    type: 'PREV',
  },
  {
    screen: '1/1',
    time: 100,
    type: 'NEXT',
  },
  {
    screen: '1/1',
    time: 100,
    type: 'SKIP_POPUP_CONFIRM',
  },
  {
    screen: '1/1',
    time: 100,
    type: 'SKIP_POPUP_CANCEL',
  },
  {
    screen: '1/1',
    time: 100,
    type: 'SKIP',
  },
  {
    screen: '1/1',
    time: 100,
    type: 'UNDO',
  },
  {
    screen: '1/1',
    time: 100,
    type: 'DONE',
  },
];
