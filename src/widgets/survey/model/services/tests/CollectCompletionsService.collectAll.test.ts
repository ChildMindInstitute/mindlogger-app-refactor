import { EntityPath } from '@app/abstract/lib/types/entity';
import { getLoggerMock } from '@app/entities/notification/model/factory/tests/testHelpers';
import * as survey from '@app/shared/lib/utils/survey/survey';

import {
  getActivityIncompleteEntity,
  getActivityFlowIncompleteEntity,
} from './testHelpers';
import * as storageHelpers from '../../../lib/storageHelpers';
import { CollectCompletionsService } from '../CollectCompletionsService';

describe('Test CollectCompletionsService: collectAll', () => {
  let pathOne: EntityPath;
  let pathTwo: EntityPath;

  beforeEach(() => {
    jest.clearAllMocks();

    pathOne = {
      appletId: 'mock-applet-id-1',
      entityId: 'mock-entity-id-1',
      eventId: 'mock-event-id-1',
      entityType: 'regular',
      targetSubjectId: null,
    };

    pathTwo = {
      appletId: 'mock-applet-id-1',
      entityId: 'mock-entity-id-2',
      eventId: 'mock-event-id-2',
      entityType: 'regular',
      targetSubjectId: null,
    };
  });

  it('Should return empty array when "exclude" is set to the same path as progress record', () => {
    const getFlowMock = jest
      .spyOn(storageHelpers, 'getFlowRecord')
      .mockReturnValue(null);

    const progression = getActivityIncompleteEntity(pathOne);

    const service = new CollectCompletionsService(getLoggerMock(), [
      progression,
    ]);

    expect(getFlowMock).toBeCalledTimes(0);

    const result = service.collectAll(pathOne);

    expect(result).toEqual([]);
  });

  const excludedVariants = [
    { entityId: 'other-entity-id-1' },
    { appletId: 'other-applet-id-1' },
    { eventId: 'other-event-id-1' },
    {
      entityId: 'other-entity-id-1',
      appletId: 'other-applet-id-1',
      eventId: 'other-event-id-1',
    },
  ];

  excludedVariants.forEach(excluded => {
    it('Should return empty array when "exclude" is set to the other path and flow record is null', () => {
      const getFlowMock = jest
        .spyOn(storageHelpers, 'getFlowRecord')
        .mockReturnValue(null);

      const progression = getActivityIncompleteEntity(pathOne);
      progression.progression.availableUntilTimestamp = new Date(
        2023,
        3,
        7,
      ).getTime();

      const service = new CollectCompletionsService(getLoggerMock(), [
        progression,
      ]);

      const result = service.collectAll({
        ...pathOne,
        ...excluded,
      });

      expect(getFlowMock).toBeCalledTimes(1);

      expect(result).toEqual([]);
    });
  });

  it('Should return empty array when "exclude" is not set and availableTo is not set', () => {
    const progression = getActivityIncompleteEntity(pathOne);
    progression.progression.availableUntilTimestamp = null;

    const service = new CollectCompletionsService(getLoggerMock(), [
      progression,
    ]);

    const result = service.collectAll(pathOne);

    expect(result).toEqual([]);
  });

  it('Should return empty array when availableTo is set and flow record is null', () => {
    const getFlowMock = jest
      .spyOn(storageHelpers, 'getFlowRecord')
      .mockReturnValue(null);

    const progression = getActivityIncompleteEntity(pathOne);
    progression.progression.availableUntilTimestamp = new Date(
      2023,
      3,
      7,
    ).getTime();

    const service = new CollectCompletionsService(getLoggerMock(), [
      progression,
    ]);

    const result = service.collectAll();

    expect(getFlowMock).toBeCalledTimes(1);

    expect(result).toEqual([]);
  });

  it('Should return empty array when isEntityExpired is false', () => {
    jest.spyOn(storageHelpers, 'getFlowRecord').mockReturnValue({} as any);

    const isEntityExpiredMock = jest
      .spyOn(survey, 'isEntityExpired')
      .mockReturnValue(false);

    const firstProgression = getActivityIncompleteEntity(pathOne);
    const secondProgression = getActivityIncompleteEntity(pathTwo);

    firstProgression.progression.availableUntilTimestamp = new Date(
      2023,
      3,
      7,
    ).getTime();
    secondProgression.progression.availableUntilTimestamp = new Date(
      2023,
      3,
      7,
    ).getTime();

    const service = new CollectCompletionsService(getLoggerMock(), [
      firstProgression,
      secondProgression,
    ]);

    const result = service.collectAll();

    expect(isEntityExpiredMock).toBeCalledTimes(2);

    expect(result).toEqual([]);
  });

  it('Should return two collect items when isEntityExpired is true', () => {
    jest.spyOn(storageHelpers, 'getFlowRecord').mockReturnValue({} as any);

    jest
      .spyOn(storageHelpers, 'isCurrentActivityRecordExist')
      .mockReturnValue(true);

    jest.spyOn(survey, 'isEntityExpired').mockReturnValue(true);

    const firstProgression = getActivityIncompleteEntity(pathOne);
    const secondProgression = getActivityIncompleteEntity(pathTwo);

    firstProgression.progression.availableUntilTimestamp = new Date(
      2023,
      3,
      7,
    ).getTime();
    secondProgression.progression.availableUntilTimestamp = new Date(
      2023,
      3,
      7,
    ).getTime();

    const service = new CollectCompletionsService(getLoggerMock(), [
      firstProgression,
      secondProgression,
    ]);

    //@ts-expect-error
    service.collect = jest
      .fn()
      .mockImplementation((_: any, __: any, path: EntityPath) => [
        {
          appletId: path.appletId,
          activityId: path.entityId,
          flowId: undefined,
          eventId: path.eventId,
          order: 0,
          activityName: 'mock-activity-name',
          completionType: 'finish',
          logAvailableTo: undefined,
        },
      ]);

    const result = service.collectAll();

    const expected = [
      {
        activityId: 'mock-entity-id-1',
        activityName: 'mock-activity-name',
        appletId: 'mock-applet-id-1',
        completionType: 'finish',
        eventId: 'mock-event-id-1',
        flowId: undefined,
        logAvailableTo: undefined,
        order: 0,
      },
      {
        activityId: 'mock-entity-id-2',
        activityName: 'mock-activity-name',
        appletId: 'mock-applet-id-1',
        completionType: 'finish',
        eventId: 'mock-event-id-2',
        flowId: undefined,
        logAvailableTo: undefined,
        order: 0,
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should return three collect items when progress record types differ', () => {
    jest.spyOn(storageHelpers, 'getFlowRecord').mockReturnValue({} as any);

    jest.spyOn(survey, 'isEntityExpired').mockReturnValue(true);

    const firstProgression = getActivityFlowIncompleteEntity(pathOne);
    const secondProgression = getActivityFlowIncompleteEntity(pathTwo);

    firstProgression.progression.availableUntilTimestamp = new Date(
      2023,
      3,
      7,
    ).getTime();
    secondProgression.progression.availableUntilTimestamp = new Date(
      2023,
      3,
      7,
    ).getTime();

    const service = new CollectCompletionsService(getLoggerMock(), [
      firstProgression,
      secondProgression,
    ]);

    //@ts-expect-error
    service.collect = jest
      .fn()
      .mockImplementation((_: any, __: any, path: EntityPath) =>
        path.entityType === 'regular'
          ? [
              {
                appletId: path.appletId,
                activityId: path.entityId,
                flowId: undefined,
                eventId: path.eventId,
                order: 0,
                activityName: 'mock-activity-name-1',
                completionType: 'finish',
                logAvailableTo: undefined,
              },
            ]
          : [
              {
                appletId: path.appletId,
                activityId: 'mock-activity-id-1',
                flowId: path.entityId,
                eventId: path.eventId,
                order: 0,
                activityName: 'mock-activity-name-1',
                completionType: 'intermediate',
                logAvailableTo: undefined,
              },
              {
                appletId: path.appletId,
                activityId: 'mock-activity-id-2',
                flowId: path.entityId,
                eventId: path.eventId,
                order: 1,
                activityName: 'mock-activity-name-2',
                completionType: 'finish',
                logAvailableTo: undefined,
              },
            ],
      );

    const result = service.collectAll();

    const expected = [
      {
        activityId: 'mock-activity-id-1',
        activityName: 'mock-activity-name-1',
        appletId: 'mock-applet-id-1',
        completionType: 'intermediate',
        eventId: 'mock-event-id-1',
        flowId: 'mock-entity-id-1',
        logAvailableTo: undefined,
        order: 0,
      },
      {
        activityId: 'mock-activity-id-2',
        activityName: 'mock-activity-name-2',
        appletId: 'mock-applet-id-1',
        completionType: 'finish',
        eventId: 'mock-event-id-1',
        flowId: 'mock-entity-id-1',
        logAvailableTo: undefined,
        order: 1,
      },
      {
        activityId: 'mock-activity-id-1',
        activityName: 'mock-activity-name-1',
        appletId: 'mock-applet-id-1',
        completionType: 'intermediate',
        eventId: 'mock-event-id-2',
        flowId: 'mock-entity-id-2',
        logAvailableTo: undefined,
        order: 0,
      },
      {
        activityId: 'mock-activity-id-2',
        activityName: 'mock-activity-name-2',
        appletId: 'mock-applet-id-1',
        completionType: 'finish',
        eventId: 'mock-event-id-2',
        flowId: 'mock-entity-id-2',
        logAvailableTo: undefined,
        order: 1,
      },
    ];

    expect(result).toEqual(expected);
  });
});
