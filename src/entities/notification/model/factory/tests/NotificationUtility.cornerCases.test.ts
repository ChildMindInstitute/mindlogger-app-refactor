import { v4 as uuidv4 } from 'uuid';

import { NotificationSetting, ScheduleEvent } from '@app/entities/notification';
import * as dateTimeUtils from '@shared/lib/utils/dateTime';

import { NotificationUtility } from '../NotificationUtility';

const AppletId = 'e31c7468-4197-4ed1-a908-72af80d7765f';

describe('NotificationUtility: test corner cases, rest of small functions', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('getRandomInt should return different values and they`re less than 1000 when the function called several times', () => {
    const utility = new NotificationUtility(AppletId, []);

    //@ts-expect-error
    const value1 = utility.getRandomInt(1000);
    //@ts-expect-error
    const value2 = utility.getRandomInt(1000);
    //@ts-expect-error
    const value3 = utility.getRandomInt(1000);
    //@ts-expect-error
    const value4 = utility.getRandomInt(1000);
    //@ts-expect-error
    const value5 = utility.getRandomInt(1000);

    expect(
      value1 === value2 &&
        value1 === value3 &&
        value1 === value4 &&
        value1 === value5,
    ).toEqual(false);

    [value1, value2, value3, value4, value5].forEach(v =>
      expect(v).toBeLessThan(1000),
    );
  });

  it('getRandomBorderType should return null when every condition returns false', () => {
    const utility = new NotificationUtility(AppletId, []);

    jest.spyOn(dateTimeUtils, 'isSourceLess').mockReturnValue(false);
    jest.spyOn(dateTimeUtils, 'isSourceBigger').mockReturnValue(false);
    jest.spyOn(dateTimeUtils, 'isSourceBiggerOrEqual').mockReturnValue(false);

    const result = utility.getRandomBorderType(
      { availability: {} } as ScheduleEvent,
      {} as NotificationSetting,
    );

    expect(result).toEqual(null);
  });

  it('getNotificationIds should return id and shortId which is related to id', () => {
    const utility = new NotificationUtility(AppletId, []);

    //@ts-expect-error
    const result = utility.getNotificationIds();

    const { id, shortId } = result;

    const parts = shortId.split('_');

    expect(id.length).toEqual(uuidv4().length);

    expect(parts.length).toEqual(2);

    expect(id.startsWith(parts[0])).toBe(true);
    expect(id.endsWith(parts[1])).toBe(true);
  });

  it('getNotificationIds should return different ids when call it several times', () => {
    const utility = new NotificationUtility(AppletId, []);

    //@ts-expect-error
    const { id: id1 } = utility.getNotificationIds();

    //@ts-expect-error
    const { id: id2 } = utility.getNotificationIds();

    expect(id1 === id2).toBeFalsy();
  });

  it('isCompleted should call getProgressionCompletedAt', () => {
    const utility = new NotificationUtility(AppletId, []);

    const getProgressionCompletedAtMock = jest.fn();
    //@ts-expect-error
    utility.getProgressionCompletedAt = getProgressionCompletedAtMock;

    utility.isCompleted(
      'mock-entity-id-1',
      'mock-event-id-1',
      'mock-target-subject-1',
    );

    expect(getProgressionCompletedAtMock).toHaveBeenCalledTimes(1);
  });
});
