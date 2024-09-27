import { buildSingleActivityPipeline } from '../pipelineBuilder';

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

describe('Test pipelineBuilder for single activity', () => {
  it("Should build pipeline when summary doesn't exist", () => {
    const result = buildSingleActivityPipeline({
      appletId: 'mock-applet-id-1',
      eventId: 'mock-event-id-1',
      targetSubjectId: null,
      hasSummary: () => false,
      activity: { ...mockForActivity1 },
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
          targetSubjectId: null,
          order: 0,
        },
        type: 'Finish',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should build pipeline for single activity when summary exists', () => {
    const result = buildSingleActivityPipeline({
      appletId: 'mock-applet-id-2',
      eventId: 'mock-event-id-2',
      targetSubjectId: null,
      hasSummary: () => true,
      activity: { ...mockForActivity2 },
    });

    const expected = [
      {
        payload: {
          activityDescription: 'mock-activity-description-2',
          activityId: 'mock-activity-id-2',
          activityImage: null,
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-2',
          eventId: 'mock-event-id-2',
          targetSubjectId: null,
          order: 0,
        },
        type: 'Stepper',
      },
      {
        payload: {
          activityId: 'mock-activity-id-2',
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-2',
          eventId: 'mock-event-id-2',
          targetSubjectId: null,
          order: 0,
        },
        type: 'Summary',
      },
      {
        payload: {
          activityId: 'mock-activity-id-2',
          activityName: 'mock-activity-name-2',
          appletId: 'mock-applet-id-2',
          eventId: 'mock-event-id-2',
          targetSubjectId: null,
          order: 0,
        },
        type: 'Finish',
      },
    ];

    expect(result).toEqual(expected);
  });
});
