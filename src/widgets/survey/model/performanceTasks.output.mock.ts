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
