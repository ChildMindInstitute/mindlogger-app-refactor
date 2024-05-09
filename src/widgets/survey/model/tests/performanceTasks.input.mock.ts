import { Answer, Answers, PipelineItem } from '@features/pass-survey';

export const drawingInput: PipelineItem = {
  type: 'DrawingTest',
  timer: 100,
  payload: {
    imageUrl: 'url',
    backgroundImageUrl: null,
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

const mediaFile = {
  fileName: 'test.svg',
  type: 'image/svg',
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

export const FlankerAnswers: Answers = {
  '0': {
    answer: {
      records: [
        {
          trialIndex: 1,
          duration: 1112.5,
          question: '<img src="">',
          buttonPressed: '1',
          startTime: 171,
          correct: false,
          startTimestamp: 171,
          offset: 1714,
          tag: 'trial',
          responseTouchTimestamp: 1714,
        },
      ],
      gameType: 'practice',
    },
  },
  '3': {
    answer: {
      records: [
        {
          trialIndex: 1,
          duration: 950,
          question: '<img src="">',
          buttonPressed: '0',
          startTime: 132,
          correct: true,
          startTimestamp: 444,
          offset: 17,
          tag: 'trial',
          responseTouchTimestamp: 1714,
        },
      ],
      gameType: 'test',
    },
  },
  '4': {
    answer: {
      records: [
        {
          trialIndex: 1,
          duration: 737,
          question: '<img src="">',
          buttonPressed: '1',
          startTime: 156,
          correct: false,
          startTimestamp: 17142,
          offset: 171402,
          tag: 'trial',
          responseTouchTimestamp: 17142,
        },
      ],
      gameType: 'test',
    },
  },
  '5': {
    answer: {
      records: [
        {
          trialIndex: 4,
          duration: 190,
          question: '<img src="">',
          buttonPressed: '0',
          startTime: 124,
          correct: true,
          startTimestamp: 171,
          offset: 17140,
          tag: 'trial',
          responseTouchTimestamp: 1714,
        },
      ],
      gameType: 'test',
    },
  },
  '6': {
    answer: {
      records: [
        {
          trialIndex: 1,
          duration: 1112.5,
          question: '<img src="">',
          buttonPressed: '1',
          startTime: 171,
          correct: false,
          startTimestamp: 171,
          offset: 1714,
          tag: 'trial',
          responseTouchTimestamp: 1714,
        },
      ],
      gameType: 'practice',
    },
  },
};

export const FlankerInput: PipelineItem[] = [
  {
    id: '3',
    type: 'Flanker',
    payload: {
      blocks: [
        {
          name: 'Block 1',
          order: ['1'],
        },
        {
          name: 'Block 2',
          order: ['2'],
        },
        {
          name: 'Block 3',
          order: ['3'],
        },
        {
          name: 'Block 4',
          order: ['4'],
        },
      ],
      buttons: [
        {
          text: 'left ',
          image: '',
          value: 0,
        },
        {
          text: 'rig',
          image: '',
          value: 1,
        },
      ],
      stimulusTrials: [
        {
          id: '1',
          image: 'httos://',
          text: 'some.png',
          value: 0,
          weight: null,
        },
      ],
      blockType: 'practice',
      fixationDuration: 0,
      fixationScreen: {
        image: '',
        value: '',
      },
      isFirstPractice: true,
      isLastPractice: false,
      isLastTest: false,
      nextButton: 'OK',
      sampleSize: 1,
      samplingMethod: 'randomize-order',
      showFeedback: true,
      showFixation: false,
      showResults: true,
      trialDuration: 3000,
      minimumAccuracy: 75,
    },
    timer: null,
    isAbleToMoveBack: false,
  },
  {
    id: '0',
    type: 'Flanker',
    payload: {
      blocks: [
        {
          name: 'Block 1',
          order: ['11'],
        },
        {
          name: 'Block 2',
          order: ['11'],
        },
        {
          name: 'Block 3',
          order: ['11'],
        },
        {
          name: 'Block 4',
          order: ['11'],
        },
      ],
      buttons: [
        {
          text: 'left ',
          image: '',
          value: 0,
        },
        {
          text: 'rig',
          image: '',
          value: 1,
        },
      ],
      stimulusTrials: [
        {
          id: '11',
          image: 'httos://',
          text: 'some.png',
          value: 0,
          weight: null,
        },
      ],
      blockType: 'practice',
      fixationDuration: 0,
      fixationScreen: {
        image: '',
        value: '',
      },
      isFirstPractice: false,
      isLastPractice: false,
      isLastTest: false,
      nextButton: 'OK',
      sampleSize: 1,
      samplingMethod: 'randomize-order',
      showFeedback: true,
      showFixation: false,
      showResults: true,
      trialDuration: 3000,
      minimumAccuracy: 75,
    },
    timer: null,
    isAbleToMoveBack: false,
  },
  {
    id: '9',
    type: 'Flanker',
    payload: {
      blocks: [
        {
          name: 'Block 1',
          order: ['11'],
        },
        {
          name: 'Block 2',
          order: ['11'],
        },
        {
          name: 'Block 3',
          order: ['11'],
        },
        {
          name: 'Block 4',
          order: ['11'],
        },
      ],
      buttons: [
        {
          text: 'left ',
          image: '',
          value: 0,
        },
        {
          text: 'rig',
          image: '',
          value: 1,
        },
      ],
      stimulusTrials: [
        {
          id: '11',
          image: 'httos://',
          text: 'some.png',
          value: 0,
          weight: null,
        },
      ],
      blockType: 'practice',
      fixationDuration: 0,
      fixationScreen: {
        image: '',
        value: '',
      },
      isFirstPractice: false,
      isLastPractice: true,
      isLastTest: false,
      nextButton: 'OK',
      sampleSize: 1,
      samplingMethod: 'randomize-order',
      showFeedback: true,
      showFixation: false,
      showResults: true,
      trialDuration: 3000,
      minimumAccuracy: 75,
    },
    timer: null,
    isAbleToMoveBack: false,
  },
  {
    id: '7',
    type: 'Flanker',
    payload: {
      blocks: [
        {
          name: 'Block 1',
          order: ['11'],
        },
        {
          name: 'Block 2',
          order: ['11'],
        },
        {
          name: 'Block 3',
          order: ['11'],
        },
        {
          name: 'Block 4',
          order: ['11'],
        },
      ],
      buttons: [
        {
          text: 'left ',
          image: '',
          value: 0,
        },
        {
          text: 'rig',
          image: '',
          value: 1,
        },
      ],
      stimulusTrials: [
        {
          id: '11',
          image: 'httos://',
          text: 'some.png',
          value: 0,
          weight: null,
        },
      ],
      blockType: 'test',
      fixationDuration: 0,
      fixationScreen: {
        image: '',
        value: '',
      },
      isFirstPractice: false,
      isLastPractice: false,
      isLastTest: false,
      nextButton: 'Continue',
      sampleSize: 1,
      samplingMethod: 'randomize-order',
      showFeedback: false,
      showFixation: false,
      showResults: true,
      trialDuration: 3000,
      minimumAccuracy: 1,
    },
    timer: null,
    isAbleToMoveBack: false,
  },
  {
    id: '5',
    type: 'Flanker',
    payload: {
      blocks: [
        {
          name: 'Block 1',
          order: ['11'],
        },
        {
          name: 'Block 2',
          order: ['11'],
        },
        {
          name: 'Block 3',
          order: ['11'],
        },
        {
          name: 'Block 4',
          order: ['11'],
        },
      ],
      buttons: [
        {
          text: 'left ',
          image: '',
          value: 0,
        },
        {
          text: 'rig',
          image: '',
          value: 1,
        },
      ],
      stimulusTrials: [
        {
          id: '11',
          image: 'httos://',
          text: 'some.png',
          value: 0,
          weight: null,
        },
      ],
      blockType: 'test',
      fixationDuration: 0,
      fixationScreen: {
        image: '',
        value: '',
      },
      isFirstPractice: false,
      isLastPractice: false,
      isLastTest: false,
      nextButton: 'Continue',
      sampleSize: 1,
      samplingMethod: 'randomize-order',
      showFeedback: false,
      showFixation: false,
      showResults: true,
      trialDuration: 3000,
      minimumAccuracy: 1,
    },
    timer: null,
    isAbleToMoveBack: false,
  },
  {
    id: '3',
    type: 'Flanker',
    payload: {
      blocks: [
        {
          name: 'Block 1',
          order: ['11'],
        },
        {
          name: 'Block 2',
          order: ['11'],
        },
        {
          name: 'Block 3',
          order: ['11'],
        },
        {
          name: 'Block 4',
          order: ['11'],
        },
      ],
      buttons: [
        {
          text: 'left ',
          image: '',
          value: 0,
        },
        {
          text: 'rig',
          image: '',
          value: 1,
        },
      ],
      stimulusTrials: [
        {
          id: '11',
          image: 'httos://',
          text: 'some.png',
          value: 0,
          weight: null,
        },
      ],
      blockType: 'test',
      fixationDuration: 0,
      fixationScreen: {
        image: '',
        value: '',
      },
      isFirstPractice: false,
      isLastPractice: false,
      isLastTest: true,
      nextButton: 'Finish',
      sampleSize: 1,
      samplingMethod: 'randomize-order',
      showFeedback: false,
      showFixation: false,
      showResults: true,
      trialDuration: 3000,
      minimumAccuracy: 1,
    },
    timer: null,
    isAbleToMoveBack: false,
  },
  {
    id: '3',
    type: 'Flanker',
    payload: {
      blocks: [
        {
          name: 'Block 1',
          order: ['1'],
        },
        {
          name: 'Block 2',
          order: ['2'],
        },
        {
          name: 'Block 3',
          order: ['3'],
        },
        {
          name: 'Block 4',
          order: ['4'],
        },
      ],
      buttons: [
        {
          text: 'left ',
          image: '',
          value: 0,
        },
        {
          text: 'rig',
          image: '',
          value: 1,
        },
      ],
      stimulusTrials: [
        {
          id: '1',
          image: 'httos://',
          text: 'some.png',
          value: 0,
          weight: null,
        },
      ],
      blockType: 'practice',
      fixationDuration: 0,
      fixationScreen: {
        image: '',
        value: '',
      },
      isFirstPractice: true,
      isLastPractice: false,
      isLastTest: false,
      nextButton: 'OK',
      sampleSize: 1,
      samplingMethod: 'randomize-order',
      showFeedback: true,
      showFixation: false,
      showResults: true,
      trialDuration: 3000,
      minimumAccuracy: 75,
    },
    timer: null,
    isAbleToMoveBack: false,
  },
];
