import { EntityPath } from '@app/abstract/lib';
import * as survey from '@app/shared/lib/utils/survey/survey';

import {
  deleteLogAvailableTo,
  getFlowProgressRecord,
  getMultipleActivityFlowState,
  getRegularProgressRecord,
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
    };
  });

  it('Should return empty array when no entity progress record', () => {
    const service = new CollectCompletionsService([]);

    const result = service.collectForEntity(pathOne);

    expect(result).toEqual([]);
  });

  it('Should return empty array when entity progress exist, but availableTo is null', () => {
    let progress = getRegularProgressRecord(pathOne);
    progress.payload.availableTo = null;

    const service = new CollectCompletionsService([progress]);

    const result = service.collectForEntity(pathOne);

    expect(result).toEqual([]);
  });

  it('Should return empty array when entity progress exist, but availableTo is undefined', () => {
    let progress = getRegularProgressRecord(pathOne);
    progress.payload.availableTo = null;

    const service = new CollectCompletionsService([progress]);

    const result = service.collectForEntity(pathOne);

    expect(result).toEqual([]);
  });

  it('Should return empty array when isEntityExpired returns false', () => {
    const isEntityExpiredMock = jest
      .spyOn(survey, 'isEntityExpired')
      .mockReturnValue(false);

    let progress = getRegularProgressRecord(pathOne);
    progress.payload.availableTo = new Date(2023, 2, 5).getTime();

    const service = new CollectCompletionsService([progress]);

    const result = service.collectForEntity(pathOne);

    expect(isEntityExpiredMock).toBeCalledTimes(1);

    expect(result).toEqual([]);
  });

  it('Should return empty array when isEntityExpired returns true and getFlowRecord returns null', () => {
    jest.spyOn(survey, 'isEntityExpired').mockReturnValue(true);
    const getFlowRecordMock = jest
      .spyOn(storageHelpers, 'getFlowRecord')
      .mockReturnValue(null);

    const progress = getRegularProgressRecord(pathOne);
    progress.payload.availableTo = new Date(2023, 2, 5).getTime();

    const service = new CollectCompletionsService([progress]);

    const result = service.collectForEntity(pathOne);

    expect(getFlowRecordMock).toBeCalledTimes(1);

    expect(result).toEqual([]);
  });

  it('Should return one collect item when getFlowRecord returns single activity pipeline', () => {
    jest.spyOn(survey, 'isEntityExpired').mockReturnValue(true);
    jest
      .spyOn(storageHelpers, 'getFlowRecord')
      .mockReturnValue(getSingleActivityFlowState(pathOne));

    const progress = getRegularProgressRecord(pathOne);

    progress.payload.availableTo = new Date(2023, 2, 5).getTime();

    const service = new CollectCompletionsService([progress]);

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

    const progress = getFlowProgressRecord(path);

    progress.payload = {
      availableTo: new Date(2023, 2, 5).getTime(),
      pipelineActivityOrder: 0,
      totalActivitiesInPipeline: 2,
      currentActivityId: 'mock-activity-id-1',
      currentActivityName: 'mock-activity-name-1',
      currentActivityDescription: 'mock-activity-description-1',
      currentActivityImage: null,
    } as any;

    const service = new CollectCompletionsService([progress]);

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

    const progress = getFlowProgressRecord(path);

    progress.payload = {
      availableTo: new Date(2023, 2, 5).getTime(),
      pipelineActivityOrder: 1,
      totalActivitiesInPipeline: 2,
      currentActivityId: 'mock-activity-id-2',
      currentActivityName: 'mock-activity-name-2',
      currentActivityDescription: 'mock-activity-description-2',
      currentActivityImage: null,
    } as any;

    const service = new CollectCompletionsService([progress]);

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
