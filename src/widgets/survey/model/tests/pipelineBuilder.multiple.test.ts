import { buildActivityFlowPipeline } from '../pipelineBuilder';

const mockForActivity1 = {
  description: 'mock-activity-description-1',
  id: 'mock-activity-id-1',
  image: 'https://www.images.com/1.jpeg',
  name: 'mock-activity-name-1',
};

const mockForActivity2 = {
  description: 'mock-activity-description-2',
  id: 'mock-activity-id-2',
  image: null,
  name: 'mock-activity-name-2',
};

describe('Test pipelineBuilder for multiple activities', () => {
  it('Should build pipeline when hasSummary is not set', () => {
    const result = buildActivityFlowPipeline({
      appletId: 'mock-applet-id-1',
      eventId: 'mock-event-id-1',
      targetSubjectId: null,
      hasSummary: () => false,
      startFrom: 0,
      flowId: 'mock-flow-id-1',
      activities: [mockForActivity1, mockForActivity2],
    });

    const expected = [
      {
        payload: {
          activityDescription: 'mock-activity-description-1',
          activityId: 'mock-activity-id-1',
          activityImage: 'https://www.images.com/1.jpeg',
          activityName: 'mock-activity-name-1',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 0,
        },
        type: 'Stepper',
      },
      {
        payload: {
          activityId: 'mock-activity-id-1',
          activityName: 'mock-activity-name-1',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 0,
        },
        type: 'Intermediate',
      },
      {
        payload: {
          activityDescription: 'mock-activity-description-2',
          activityId: 'mock-activity-id-2',
          activityImage: null,
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 1,
        },
        type: 'Stepper',
      },
      {
        payload: {
          activityId: 'mock-activity-id-2',
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 1,
        },
        type: 'Finish',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should build pipeline when hasSummary is set', () => {
    const result = buildActivityFlowPipeline({
      appletId: 'mock-applet-id-1',
      eventId: 'mock-event-id-1',
      targetSubjectId: null,
      hasSummary: () => true,
      startFrom: 0,
      flowId: 'mock-flow-id-1',
      activities: [mockForActivity1, mockForActivity2],
    });

    const expected = [
      {
        payload: {
          activityDescription: 'mock-activity-description-1',
          activityId: 'mock-activity-id-1',
          activityImage: 'https://www.images.com/1.jpeg',
          activityName: 'mock-activity-name-1',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 0,
        },
        type: 'Stepper',
      },
      {
        payload: {
          activityId: 'mock-activity-id-1',
          activityName: 'mock-activity-name-1',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 0,
        },
        type: 'Intermediate',
      },
      {
        payload: {
          activityDescription: 'mock-activity-description-2',
          activityId: 'mock-activity-id-2',
          activityImage: null,
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 1,
        },
        type: 'Stepper',
      },
      {
        payload: {
          activityId: 'mock-activity-id-2',
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 1,
        },
        type: 'Summary',
      },
      {
        payload: {
          activityId: 'mock-activity-id-2',
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 1,
        },
        type: 'Finish',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should build pipeline when hasSummary is not set and startFrom = 3', () => {
    const result = buildActivityFlowPipeline({
      appletId: 'mock-applet-id-1',
      eventId: 'mock-event-id-1',
      targetSubjectId: null,
      hasSummary: () => false,
      startFrom: 3,
      flowId: 'mock-flow-id-1',
      activities: [mockForActivity1, mockForActivity2],
    });

    const expected = [
      {
        payload: {
          activityId: 'mock-activity-id-2',
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 1,
        },
        type: 'Finish',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should build pipeline when hasSummary is set and startFrom = 3', () => {
    const result = buildActivityFlowPipeline({
      appletId: 'mock-applet-id-1',
      eventId: 'mock-event-id-1',
      targetSubjectId: null,
      hasSummary: () => true,
      startFrom: 3,
      flowId: 'mock-flow-id-1',
      activities: [mockForActivity1, mockForActivity2],
    });

    const expected = [
      {
        payload: {
          activityId: 'mock-activity-id-2',
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 1,
        },
        type: 'Summary',
      },
      {
        payload: {
          activityId: 'mock-activity-id-2',
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 1,
        },
        type: 'Finish',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should build pipeline when number of activities is 1 and hasSummary is not set and startFrom = 0', () => {
    const result = buildActivityFlowPipeline({
      appletId: 'mock-applet-id-1',
      eventId: 'mock-event-id-1',
      targetSubjectId: null,
      hasSummary: () => false,
      startFrom: 0,
      flowId: 'mock-flow-id-1',
      activities: [mockForActivity1],
    });

    const expected = [
      {
        payload: {
          activityDescription: 'mock-activity-description-1',
          activityId: 'mock-activity-id-1',
          activityImage: 'https://www.images.com/1.jpeg',
          activityName: 'mock-activity-name-1',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 0,
        },
        type: 'Stepper',
      },
      {
        payload: {
          activityId: 'mock-activity-id-1',
          activityName: 'mock-activity-name-1',
          appletId: 'mock-applet-id-1',
          eventId: 'mock-event-id-1',
          flowId: 'mock-flow-id-1',
          targetSubjectId: null,
          order: 0,
        },
        type: 'Finish',
      },
    ];

    expect(result).toEqual(expected);
  });
});
