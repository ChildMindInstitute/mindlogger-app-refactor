import { Answer, PipelineItem } from '@features/pass-survey';

export const textInput: PipelineItem = {
  type: 'TextInput',
  timer: 100,
  payload: {
    maxLength: 20,
    isNumeric: true,
    shouldIdentifyResponse: true,
  },
};

export const splashItem: PipelineItem = {
  type: 'Splash',
  timer: 100,
  payload: {
    imageUrl: 'url',
  },
};

export const videoInput: PipelineItem = {
  type: 'Video',
  timer: 100,
  payload: null,
};

export const photoInput: PipelineItem = {
  type: 'Photo',
  timer: 100,
  payload: null,
};

export const audioInput: PipelineItem = {
  type: 'Audio',
  timer: 100,
  payload: {
    maxDuration: 1000,
  },
};

export const audioPlayerInput: PipelineItem = {
  type: 'AudioPlayer',
  timer: 100,
  payload: {
    playOnce: true,
    file: 'url',
  },
};

export const radioInput: PipelineItem = {
  type: 'Radio',
  timer: 100,
  payload: {
    addTooltip: false,
    randomizeOptions: false,
    setAlerts: false,
    setPalette: false,
    autoAdvance: true,
    options: [
      {
        alert: null,
        color: null,
        id: 'string',
        image: null,
        isHidden: false,
        score: null,
        text: 'string',
        tooltip: 'string',
        value: 1,
      },
    ],
  },
};

export const stackedRadioInput: PipelineItem = {
  type: 'StackedRadio',
  timer: 100,
  payload: {
    randomizeOptions: true,
    addScores: false,
    setAlerts: false,
    addTooltip: false,
    rows: [
      {
        id: '1',
        rowName: 'one',
        rowImage: null,
        tooltip: 'tooltip',
      },
      {
        id: '2',
        rowName: 'two',
        rowImage: 'url',
        tooltip: null,
      },
    ],
    options: [
      {
        id: '1',
        text: 'one',
        image: null,
        tooltip: 'tooltip',
      },
      {
        id: '2',
        text: 'two',
        image: 'url',
        tooltip: null,
      },
    ],
    dataMatrix: [
      {
        rowId: '1',
        options: [
          {
            optionId: '1',
            score: 1,
            alert: null,
          },
        ],
      },
    ],
  },
};

export const stackedCheckboxInput: PipelineItem = {
  type: 'StackedCheckbox',
  timer: 100,
  payload: {
    randomizeOptions: true,
    addScores: false,
    setAlerts: false,
    addTooltip: false,
    rows: [
      {
        id: '1',
        rowName: 'one',
        rowImage: null,
        tooltip: 'tooltip',
      },
      {
        id: '2',
        rowName: 'two',
        rowImage: 'url',
        tooltip: null,
      },
    ],
    options: [
      {
        id: '1',
        text: 'one',
        image: null,
        tooltip: 'tooltip',
      },
      {
        id: '2',
        text: 'two',
        image: 'url',
        tooltip: null,
      },
    ],
    dataMatrix: [
      {
        rowId: '1',
        options: [
          {
            optionId: '1',
            score: 1,
            alert: null,
          },
        ],
      },
    ],
  },
};

export const checkboxInput: PipelineItem = {
  type: 'Checkbox',
  timer: null,
  payload: {
    randomizeOptions: false,
    setAlerts: false,
    addTooltip: false,
    setPalette: false,
    options: [
      {
        id: '1dd850ae-03f8-48c2-ba16-996b92d33475',
        text: 'aa',
        image: null,
        score: null,
        tooltip: null,
        color: null,
        isHidden: false,
        value: 0,
        alert: null,
        isNoneOption: false,
      },
      {
        id: '93a18325-d6e3-4aea-b8c9-ff71e5f1d6c9',
        text: 'bb',
        image: null,
        score: null,
        tooltip: null,
        color: null,
        isHidden: false,
        value: 1,
        alert: null,
        isNoneOption: false,
      },
      {
        id: 'deff828c-eb2e-47dd-a7ce-86392ffa1829',
        text: 'cc',
        image: null,
        score: null,
        tooltip: null,
        color: null,
        isHidden: false,
        value: 2,
        alert: null,
        isNoneOption: false,
      },
    ],
  },
};

export const sliderInput: PipelineItem = {
  type: 'Slider',
  payload: {
    leftTitle: '',
    rightTitle: '',
    leftImageUrl: null,
    rightImageUrl: null,
    minValue: 0,
    maxValue: 5,
    showTickMarks: false,
    showTickLabels: false,
    isContinuousSlider: false,
    alerts: null,
    scores: [1, 2],
  },
  timer: null,
};

export const stackedSliderInput: PipelineItem = {
  type: 'StackedSlider',
  // @ts-expect-error
  payload: {
    addScores: true,
    rows: [
      {
        id: '1',
        label: 'one',
        leftTitle: '',
        rightTitle: '',
        leftImageUrl: null,
        rightImageUrl: null,
        minValue: 0,
        maxValue: 5,
        alerts: null,
      },
      {
        id: '2',
        label: 'two',
        leftTitle: '',
        rightTitle: '',
        leftImageUrl: null,
        rightImageUrl: null,
        minValue: 0,
        maxValue: 10,
        alerts: null,
      },
    ],
  },
  timer: null,
};

export const dateInput: PipelineItem = {
  type: 'Date',
  timer: 100,
  payload: null,
};

export const timeInput: PipelineItem = {
  type: 'Time',
  timer: 100,
  payload: null,
};

export const timeRangeInput: PipelineItem = {
  type: 'TimeRange',
  timer: 100,
  payload: null,
};

export const geoInput: PipelineItem = {
  type: 'Geolocation',
  timer: 100,
  payload: null,
};

export const numberSelectInput: PipelineItem = {
  type: 'NumberSelect',
  payload: { min: 0, max: 10 },
  question: 'number select',
  timer: null,
};

export const textAnswer: Answer = { answer: 'kkkkk' };

export const radioAnswer: Answer = {
  answer: {
    id: 'df524cf6-4e5e-4218-ab2b-af8fd60c6cfa',
    text: 'three',
    image: null,
    score: null,
    tooltip: null,
    color: null,
    isHidden: false,
    value: 2,
  },
};

export const additionalAnswer: Answer = {
  ...radioAnswer,
  additionalAnswer: 'Additional',
};

export const checkboxAnswer: Answer = {
  answer: [
    {
      id: '93a18325-d6e3-4aea-b8c9-ff71e5f1d6c9',
      text: 'bb',
      image: null,
      score: null,
      tooltip: null,
      color: null,
      isHidden: false,
      value: 1,
      isNoneOption: false,
    },
    {
      id: 'deff828c-eb2e-47dd-a7ce-86392ffa1829',
      text: 'cc',
      image: null,
      score: null,
      tooltip: null,
      color: null,
      isHidden: false,
      value: 2,
      isNoneOption: false,
    },
  ],
};

export const numberSelectAnswer: Answer = { answer: '2' };

export const sliderAnswer: Answer = { answer: 4 };

export const dateAnswer: Answer = { answer: '2020-12-12' };

export const timeAnswer: Answer = { answer: { hours: 22, minutes: 22 } };

export const timeRangeAnswer: Answer = {
  answer: {
    startTime: {
      hours: 22,
      minutes: 22,
    },
    endTime: {
      hours: 23,
      minutes: 23,
    },
  },
};

export const geoAnswer: Answer = {
  answer: {
    latitude: 1,
    longitude: 2,
  },
};

export const stackedRadioAnswer: Answer = {
  answer: [
    {
      id: '1',
      text: 'One',
      color: null,
      isHidden: false,
      tooltip: null,
      image: null,
      score: null,
      value: 1,
    },
  ],
};

export const stackedCheckboxAnswer: Answer = {
  answer: [
    [
      {
        id: '1',
        text: 'opt1',
        image: null,
        tooltip: '',
      },
    ],
    [
      {
        id: '2',
        text: 'opt2',
        image: null,
        tooltip: '',
      },
    ],
  ],
};

export const stackedSliderAnswer: Answer = {
  answer: [1, 9],
};

const mediaFile = {
  uri: 'some://uri',
  type: 'mp4',
  fileName: 'some-name.mp4',
};

export const mediaAnswer: Answer = {
  answer: {
    size: 100,
    fromLibrary: true,
    ...mediaFile,
  },
};

export const audioPlayerAnswer = {
  answer: true,
};
