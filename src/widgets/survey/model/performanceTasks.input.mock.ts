import { Answer, PipelineItem } from '@features/pass-survey';

export const drawingInput: PipelineItem = {
  type: 'DrawingTest',
  timer: 100,
  payload: {
    imageUrl: 'url',
    backgroundImageUrl: null,
    proportionEnabled: false,
  },
};

export const CSTInput: PipelineItem = {
  type: 'StabilityTracker',
  timer: 100,
  payload: {
    phase: 'test',
    lambdaSlope: 1,
    durationMinutes: 1,
    trialsNumber: 1,
    userInputType: 'touch',
  },
};

export const ABTrailsInput: PipelineItem = {
  type: 'AbTest',
  timer: 100,
  payload: {
    config: {
      radius: 1,
      fontSize: 10,
    },
    nodes: [],
    isLast: false,
    deviceType: 'mobile',
  },
};

export const FlankerInput: PipelineItem = {
  type: 'Flanker',
  timer: 100,
  payload: {
    stimulusTrials: [
      {
        id: '1',
        image: null,
        text: '',
        value: 1,
      },
    ],
    blocks: [
      {
        name: 'block',
        order: ['1'],
      },
    ],
    buttons: [
      {
        text: '',
        image: null,
        value: 0,
      },
    ],
    nextButton: '',
    fixationDuration: 10,
    fixationScreen: {
      value: 'screen',
      image: 'url',
    },
    sampleSize: 10,
    samplingMethod: 'randomize-order',
    trialDuration: 1,
    showFeedback: true,
    showFixation: true,
    showResults: true,
    isLastPractice: true,
    isFirstPractice: true,
    isLastTest: true,
    blockType: 'test',
  },
};

const mediaFile = {
  fileName: 'test.svg',
  type: 'image/svg',
  uri: 'file://test.svg',
};

export const drawingAnswer: Answer = {
  answer: {
    lines: [
      {
        startTime: 1110,
        points: [
          { x: 75, y: 89.1, time: 1111 },
          { x: 77, y: 99.1, time: 1113 },
        ],
      },
    ],
    svgString: '<svg></svg>',
    width: 100,
    ...mediaFile,
  },
};

export const CSTAnswer: Answer = {
  answer: {
    phaseType: 'test',
    maxLambda: 0.1,
    value: [
      {
        timestamp: 111,
        circlePosition: [0],
        userPosition: [0],
        targetPosition: [0],
        lambda: 0.111,
        score: 0.111,
        lambdaSlope: 70,
      },
    ],
  },
};

export const ABTrailsAnswer: Answer = {
  answer: {
    lines: [
      {
        points: [
          {
            x: 179.3,
            y: 117.4,
            time: 111,
            valid: true,
            start: '1',
            end: 'A',
            actual: null,
          },
          {
            x: 172.2,
            y: 115.2,
            time: 111,
            valid: true,
            start: '1',
            end: 'A',
            actual: null,
          },
        ],
      },
    ],
    currentIndex: 11,
    maximumIndex: 11,
    width: 100,
    startTime: 112,
    updated: true,
  },
};
