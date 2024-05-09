import { getAbTrailsPipeline } from '../precompiled-pipelines';

describe('Test getAbTrailsPipeline', () => {
  it('Should build pipeline', () => {
    const result = getAbTrailsPipeline(
      'mock-id',
      {
        deviceType: 'mobile',
        config: {
          fontSize: 17,
          radius: 10,
        },
        nodes: [
          {
            cx: 10,
            cy: 20,
            orderIndex: 0,
            label: 'mock-label-0',
          },
          {
            cx: 30,
            cy: 50,
            orderIndex: 1,
            label: 'mock-label-1',
          },
        ],
        tutorials: [
          {
            text: 'mock-tutorial-text-1',
          },
        ],
      },
      false,
    );

    const expected = [
      {
        canBeReset: false,
        id: 'mock-id',
        isAbleToMoveBack: false,
        isSkippable: false,
        payload: {
          test: {
            config: { fontSize: 17, radius: 10 },
            deviceType: 'mobile',
            isLast: false,
            nodes: [
              { cx: 10, cy: 20, label: 'mock-label-0', orderIndex: 0 },
              { cx: 30, cy: 50, label: 'mock-label-1', orderIndex: 1 },
            ],
          },
          tutorials: [{ text: 'mock-tutorial-text-1' }],
          type: 'AbTutorial',
        },
        timer: null,
        type: 'Tutorial',
      },
      {
        canBeReset: false,
        id: 'mock-id',
        isAbleToMoveBack: false,
        isSkippable: false,
        payload: {
          config: { fontSize: 17, radius: 10 },
          deviceType: 'mobile',
          isLast: false,
          nodes: [
            { cx: 10, cy: 20, label: 'mock-label-0', orderIndex: 0 },
            { cx: 30, cy: 50, label: 'mock-label-1', orderIndex: 1 },
          ],
        },
        timer: null,
        type: 'AbTest',
      },
    ];

    expect(result).toEqual(expected);
  });
});
