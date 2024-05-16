export const drawingOutput = [
  {
    value: {
      fileName: 'test.svg',
      lines: [
        {
          points: [
            {
              time: 1111,
              x: 75,
              y: 89.1,
            },
            {
              time: 1113,
              x: 77,
              y: 99.1,
            },
          ],
          startTime: 1110,
        },
      ],
      svgString: '<svg></svg>',
      type: 'image/svg',
      uri: 'file://test.svg',
      width: 100,
    },
  },
];

export const CSTOutput = [
  {
    maxLambda: 0.1,
    phaseType: 'focus-phase',
    value: [
      {
        lambda: 0.111,
        lambdaSlope: 70,
        score: 0.111,
        stimPos: [0],
        targetPos: [0],
        timestamp: 111,
        userPos: [0],
      },
    ],
  },
];

export const ABTrailsOutput = [
  {
    value: {
      currentIndex: 11,
      maximumIndex: 11,
      lines: [
        {
          points: [
            {
              actual: undefined,
              end: 'A',
              start: '1',
              time: 111,
              valid: true,
              x: 179.3,
              y: 117.4,
            },
            {
              actual: undefined,
              end: 'A',
              start: '1',
              time: 111,
              valid: true,
              x: 172.2,
              y: 115.2,
            },
          ],
        },
      ],
      startTime: 112,
      updated: true,
      width: 100,
    },
  },
];

export const FlankerOutput = [
  {
    value: [
      {
        button_pressed: '1',
        correct: false,
        duration: 1112.5,
        offset: 1714,
        question: '<img src="">',
        response_touch_timestamp: 1714,
        start_time: 171,
        start_timestamp: 171,
        tag: 'trial',
        trial_index: 1,
      },
      {
        button_pressed: '1',
        correct: false,
        duration: 1112.5,
        offset: 1714,
        question: '<img src="">',
        response_touch_timestamp: 1714,
        start_time: 171,
        start_timestamp: 171,
        tag: 'trial',
        trial_index: 1,
      },
    ],
  },
  null,
  null,
  {
    value: [
      {
        button_pressed: '0',
        correct: true,
        duration: 950,
        offset: 17,
        question: '<img src="">',
        response_touch_timestamp: 1714,
        start_time: 132,
        start_timestamp: 444,
        tag: 'trial',
        trial_index: 1,
      },
    ],
  },
  {
    value: [
      {
        button_pressed: '1',
        correct: false,
        duration: 737,
        offset: 171402,
        question: '<img src="">',
        response_touch_timestamp: 17142,
        start_time: 156,
        start_timestamp: 17142,
        tag: 'trial',
        trial_index: 1,
      },
    ],
  },
  {
    value: [
      {
        button_pressed: '0',
        correct: true,
        duration: 190,
        offset: 17140,
        question: '<img src="">',
        response_touch_timestamp: 1714,
        start_time: 124,
        start_timestamp: 171,
        tag: 'trial',
        trial_index: 4,
      },
    ],
  },
  null,
];
