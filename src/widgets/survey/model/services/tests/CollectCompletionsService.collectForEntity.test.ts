import { EntityPath } from '@app/abstract/lib';
import * as survey from '@app/shared/lib/utils/survey/survey';

import {
  deleteLogAvailableTo,
  getActivityIncompleteEntity,
  getActivityFlowIncompleteEntity,
  getMultipleActivityFlowState,
  getSingleActivityFlowState,
} from './testHelpers';
import * as storageHelpers from '../../../lib/storageHelpers';
import { CollectCompletionsService } from '../CollectCompletionsService';

describe('Test CollectCompletionsService: collectForEntity', () => {
  let pathOne: EntityPath;

  beforeEach(() => {
    jest.clearAllMocks();

    pathOne = {
      appletId: 'mock-applet-id-1',
      entityId: 'mock-entity-id-1',
      eventId: 'mock-event-id-1',
      entityType: 'regular',
      targetSubjectId: null,
    };
  });

  it('Should return empty array when no entity progress record', () => {
    const service = new CollectCompletionsService([]);

    const result = service.collectForEntity(pathOne);

    expect(result).toEqual([]);
  });

  it('Should return empty array when entity progress exist, but availableTo is null', () => {
    const progression = getActivityIncompleteEntity(pathOne);
    progression.progression.availableUntilTimestamp = null;

    const service = new CollectCompletionsService([progression]);

    const result = service.collectForEntity(pathOne);

    expect(result).toEqual([]);
  });

  it('Should return empty array when entity progress exist, but availableTo is undefined', () => {
    const progression = getActivityIncompleteEntity(pathOne);
    progression.progression.availableUntilTimestamp = null;

    const service = new CollectCompletionsService([progression]);

    const result = service.collectForEntity(pathOne);

    expect(result).toEqual([]);
  });

  it('Should return empty array when isEntityExpired returns false', () => {
    const isEntityExpiredMock = jest
      .spyOn(survey, 'isEntityExpired')
      .mockReturnValue(false);

    const progression = getActivityIncompleteEntity(pathOne);
    progression.progression.availableUntilTimestamp = new Date(
      2023,
      2,
      5,
    ).getTime();

    const service = new CollectCompletionsService([progression]);

    const result = service.collectForEntity(pathOne);

    expect(isEntityExpiredMock).toBeCalledTimes(1);

    expect(result).toEqual([]);
  });

  it('Should return empty array when isEntityExpired returns true and getFlowRecord returns null', () => {
    jest.spyOn(survey, 'isEntityExpired').mockReturnValue(true);
    const getFlowRecordMock = jest
      .spyOn(storageHelpers, 'getFlowRecord')
      .mockReturnValue(null);

    const progression = getActivityIncompleteEntity(pathOne);
    progression.progression.availableUntilTimestamp = new Date(
      2023,
      2,
      5,
    ).getTime();

    const service = new CollectCompletionsService([progression]);

    const result = service.collectForEntity(pathOne);

    expect(getFlowRecordMock).toBeCalledTimes(1);

    expect(result).toEqual([]);
  });

  it('Should return one collect item when getFlowRecord returns single activity pipeline', () => {
    jest.spyOn(survey, 'isEntityExpired').mockReturnValue(true);
    jest
      .spyOn(storageHelpers, 'getFlowRecord')
      .mockReturnValue(getSingleActivityFlowState(pathOne));

    jest
      .spyOn(storageHelpers, 'isCurrentActivityRecordExist')
      .mockReturnValue(true);

    const progression = getActivityIncompleteEntity(pathOne);
    progression.progression.availableUntilTimestamp = new Date(
      2023,
      2,
      5,
    ).getTime();

    const service = new CollectCompletionsService([progression]);

    const result = service.collectForEntity(pathOne);

    expect(deleteLogAvailableTo(result)).toEqual([
      {
        activityId: 'mock-entity-id-1',
        activityName: 'mock-activity-name',
        appletId: 'mock-applet-id-1',
        completionType: 'finish',
        eventId: 'mock-event-id-1',
        flowId: undefined,
        order: 0,
      },
    ]);
  });

  it('Should return 2 collect items when getFlowRecord returns multiple activity pipeline', () => {
    const path: EntityPath = { ...pathOne, entityType: 'flow' };

    jest.spyOn(survey, 'isEntityExpired').mockReturnValue(true);
    jest
      .spyOn(storageHelpers, 'getFlowRecord')
      .mockReturnValue(getMultipleActivityFlowState(path));

    const progression = getActivityFlowIncompleteEntity(pathOne);
    progression.progression.availableUntilTimestamp = new Date(
      2023,
      2,
      5,
    ).getTime();
    progression.progression.pipelineActivityOrder = 0;
    progression.progression.totalActivitiesInPipeline = 2;
    progression.progression.currentActivityId = 'mock-activity-id-1';
    progression.progression.currentActivityName = 'mock-activity-name-1';
    progression.progression.currentActivityDescription =
      'mock-activity-description-1';
    progression.progression.currentActivityImage = null;

    const service = new CollectCompletionsService([progression]);

    const result = service.collectForEntity(path);

    expect(deleteLogAvailableTo(result)).toEqual([
      {
        activityId: 'mock-activity-id-1',
        activityName: 'mock-activity-name-1',
        appletId: 'mock-applet-id-1',
        completionType: 'intermediate',
        eventId: 'mock-event-id-1',
        flowId: 'mock-entity-id-1',
        order: 0,
      },
      {
        activityId: 'mock-activity-id-2',
        activityName: 'mock-activity-name-2',
        appletId: 'mock-applet-id-1',
        completionType: 'finish',
        eventId: 'mock-event-id-1',
        flowId: 'mock-entity-id-1',
        order: 1,
      },
    ]);
  });

  it('Should return 1 collect item associated with finish when getFlowRecord returns multiple activity pipeline and order is 1', () => {
    const path: EntityPath = { ...pathOne, entityType: 'flow' };

    jest.spyOn(survey, 'isEntityExpired').mockReturnValue(true);
    jest
      .spyOn(storageHelpers, 'getFlowRecord')
      .mockReturnValue(getMultipleActivityFlowState(path));

    const progression = getActivityFlowIncompleteEntity(pathOne);
    progression.progression.availableUntilTimestamp = new Date(
      2023,
      2,
      5,
    ).getTime();
    progression.progression.pipelineActivityOrder = 1;
    progression.progression.totalActivitiesInPipeline = 2;
    progression.progression.currentActivityId = 'mock-activity-id-2';
    progression.progression.currentActivityName = 'mock-activity-name-2';
    progression.progression.currentActivityDescription =
      'mock-activity-description-2';
    progression.progression.currentActivityImage = null;

    const service = new CollectCompletionsService([progression]);

    const result = service.collectForEntity(path);

    expect(deleteLogAvailableTo(result)).toEqual([
      {
        activityId: 'mock-activity-id-2',
        activityName: 'mock-activity-name-2',
        appletId: 'mock-applet-id-1',
        completionType: 'finish',
        eventId: 'mock-event-id-1',
        flowId: 'mock-entity-id-1',
        order: 1,
      },
    ]);
  });
});
