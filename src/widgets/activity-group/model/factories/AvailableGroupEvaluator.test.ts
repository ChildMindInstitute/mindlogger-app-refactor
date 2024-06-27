import {
  addDays,
  addHours,
  addMinutes,
  subDays,
  subHours,
  subMinutes,
} from 'date-fns';

import {
  ActivityPipelineType,
  AvailabilityType,
  PeriodicityType,
  Progress,
} from '@app/abstract/lib';
import { ActivityType } from '@app/entities/activity/lib';
import { EventAvailability } from '@app/entities/event';
import { HourMinute } from '@app/shared/lib';

import { AvailableGroupEvaluator } from './AvailableGroupEvaluator';
import { EventEntity, Entity, GroupsBuildContext } from '../../lib';

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual('@app/shared/lib/constants'),
  STORE_ENCRYPTION_KEY: '12345',
}));

const getProgress = (startAt: Date, endAt: Date | null) => {
  const result: Progress = {
    'test-applet-id-1': {
      'test-entity-id-1': {
        'test-event-id-1': {
          type: ActivityPipelineType.Regular,
          startAt,
          endAt,
          availableTo: null,
        },
      },
    },
  };
  return result;
};

const getEmptyProgress = () => {
  const result: Progress = {
    'test-applet-id-1': {
      'test-entity-id-1': {},
    },
  };
  return result;
};

const getActivity = (): Entity => {
  const result: Entity = {
    description: 'test-description-1',
    id: 'test-entity-id-1',
    name: 'test-entity-name-1',
    pipelineType: ActivityPipelineType.Regular,
    isHidden: false,
    order: 0,
    type: ActivityType.NotDefined,
  };
  return result;
};

const TimeFrom = { hours: 12, minutes: 30 };

const TimeTo: HourMinute = { hours: 10, minutes: 15 };

const getScheduledSection = (): EventAvailability => {
  const result: EventAvailability = {
    availabilityType: AvailabilityType.ScheduledAccess,
    oneTimeCompletion: false,
    periodicityType: PeriodicityType.Daily,
    allowAccessBeforeFromTime: false,
    endDate: null,
    startDate: null,
    timeFrom: TimeFrom,
    timeTo: TimeTo,
  };
  return result;
};

const getScheduledEventEntity = (settings: {
  startDate: Date;
  endDate: Date;
  scheduledAtDay: Date;
}): EventEntity => {
  const { startDate, endDate, scheduledAtDay } = settings;

  const section = getScheduledSection();

  const scheduledAt = new Date(scheduledAtDay);
  scheduledAt.setHours(section.timeFrom!.hours);
  scheduledAt.setMinutes(section.timeFrom!.minutes);

  const result: EventEntity = {
    entity: getActivity(),
    event: {
      availability: {
        ...section,
        startDate,
        endDate,
      },
      entityId: 'test-entity-id-1',
      id: 'test-event-id-1',
      notificationSettings: {
        notifications: [],
      },
      scheduledAt,
      selectedDate: null,
      timers: {
        idleTimer: null,
        timer: null,
      },
    },
  };

  return result;
};

const mockGetNow = (
  evaluator: AvailableGroupEvaluator,
  mockedNowDate: Date,
) => {
  //@ts-ignore
  evaluator.utility.getNow = jest.fn(() => new Date(mockedNowDate));
};

const buildDateTime = (startAt: Date, time: HourMinute): Date => {
  const result = new Date(startAt);
  result.setHours(time.hours);
  result.setMinutes(time.minutes);
  return result;
};

const getFridayInSeptember = () => new Date(2023, 8, 1);

describe('AvailableGroupEvaluator cross-day tests when access before start time is OFF', () => {
  describe('Should not return item when now is 1 minute earlier than TimeFrom', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(startAt, TimeFrom);
    now = subMinutes(now, 1);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should return item when now is equal to TimeFrom', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    const now = buildDateTime(startAt, TimeFrom);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should return item when now is 10 minute later than TimeFrom', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(startAt, TimeFrom);
    now = addMinutes(now, 10);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should not return item when now is 10 minute later than TimeFrom and entity is completed after TimeFrom', () => {
    const startAt = getFridayInSeptember();

    let now = buildDateTime(startAt, TimeFrom);

    const progress: Progress = getProgress(
      addMinutes(now, 5),
      addMinutes(now, 6),
    );

    now = addMinutes(now, 10);

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should return item when now is 10 minute later than TimeFrom and entity is completed before TimeFrom', () => {
    const startAt = getFridayInSeptember();

    let now = buildDateTime(startAt, TimeFrom);

    const progress: Progress = getProgress(
      subMinutes(now, 6),
      subMinutes(now, 5),
    );

    now = addMinutes(now, 10);

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should return item when now is 1 minute earlier than TimeTo in next day (Sat)', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(addDays(startAt, 1), TimeTo);
    now = subMinutes(now, 1);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should not return item when now is 1 minute earlier than TimeTo in next day (Sat) and entity completed in Sat interval', () => {
    const startAt = getFridayInSeptember();

    let now = buildDateTime(addDays(startAt, 1), TimeTo);

    const progress: Progress = getProgress(
      subMinutes(now, 10),
      subMinutes(now, 5),
    );

    now = subMinutes(now, 1);

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should not return item when now is 1 minute earlier than TimeTo in next day (Sat) and entity completed in Fri interval', () => {
    const startAt = getFridayInSeptember();

    let now = buildDateTime(addDays(startAt, 1), TimeTo);

    const progressAnchorDate = buildDateTime(startAt, TimeFrom);

    const progress: Progress = getProgress(
      addMinutes(progressAnchorDate, 10),
      addMinutes(progressAnchorDate, 15),
    );

    now = subMinutes(now, 1);

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should not return item when now is equal to TimeTo in next day', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    const now = buildDateTime(addDays(startAt, 1), TimeTo);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should not return item when now is 10 minutes later than TimeTo today (Fri)', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(startAt, TimeTo);
    now = addMinutes(now, 10);
    mockGetNow(evaluator, now);

    it('Test is today Friday', () => {
      expect(now.getDay()).toEqual(5);
    });

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should return item when now is 10 minutes later or earlier than TimeTo today (Mon) and type is Weekdays', () => {
    let startAt = getFridayInSeptember();
    startAt = subDays(startAt, 4); // Mon

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    it('Test Weekdays when now is later', () => {
      let now = buildDateTime(startAt, TimeTo);
      now = addMinutes(now, 10);
      mockGetNow(evaluator, now);

      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays when now is earlier', () => {
      let now = buildDateTime(startAt, TimeTo);
      now = subMinutes(now, 10);
      mockGetNow(evaluator, now);

      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe("Should or shouldn't return item when now is 1 minute earlier than TimeTo today (Fri)", () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(startAt, TimeTo);
    now = subMinutes(now, 1);
    mockGetNow(evaluator, now);

    it('Test is today Friday', () => {
      expect(now.getDay()).toEqual(5);
    });

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should not return item when now is equal to TimeTo today (Fri)', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(startAt, TimeTo);
    now = addMinutes(now, 10);
    mockGetNow(evaluator, now);

    it('Test is today Friday', () => {
      expect(now.getDay()).toEqual(5);
    });

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should not return item when now is 10 minutes later than TimeTo in next day', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(addDays(startAt, 1), TimeTo);
    now = addMinutes(now, 10);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });
});

describe('AvailableGroupEvaluator cross-day tests when access before start time is ON', () => {
  describe('Should return item when now is start of day', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    const now = buildDateTime(startAt, { hours: 0, minutes: 0 });
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should return item when now is 1 minute earlier than TimeFrom', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(startAt, TimeFrom);
    now = subMinutes(now, 1);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should return item when now is equal to TimeFrom', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    const now = buildDateTime(startAt, TimeFrom);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should return item when now is 10 minute later than TimeFrom', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(startAt, TimeFrom);
    now = addMinutes(now, 10);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should not return item when now is 10 minute later than TimeFrom and entity is completed in interval later than TimeFrom', () => {
    const startAt = getFridayInSeptember();

    let now = buildDateTime(startAt, TimeFrom);

    const progress: Progress = getProgress(
      addMinutes(now, 5),
      addMinutes(now, 6),
    );

    now = addMinutes(now, 10);

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should not return item when now is 10 minute later than TimeFrom and entity is completed in interval earlier than TimeFrom', () => {
    const startAt = getFridayInSeptember();

    let now = buildDateTime(startAt, TimeFrom);

    const progress: Progress = getProgress(subHours(now, 6), subHours(now, 5));

    now = addMinutes(now, 10);

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should return item when now is 1 minute earlier than TimeTo in next day (Sat)', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(addDays(startAt, 1), TimeTo);
    now = subMinutes(now, 1);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should not return item when now is 1 minute earlier than TimeTo in next day (Sat) and entity completed in Sat interval', () => {
    const startAt = getFridayInSeptember();

    let now = buildDateTime(addDays(startAt, 1), TimeTo);

    const progress: Progress = getProgress(
      subMinutes(now, 10),
      subMinutes(now, 5),
    );

    now = subMinutes(now, 1);

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should not return item when now is 1 minute earlier than TimeTo in next day (Sat) and entity completed in Fri interval after TimeFrom', () => {
    const startAt = getFridayInSeptember();

    const progressAnchorDate = buildDateTime(startAt, TimeFrom);

    const progress: Progress = getProgress(
      addMinutes(progressAnchorDate, 10),
      addMinutes(progressAnchorDate, 15),
    );

    let now = buildDateTime(addDays(startAt, 1), TimeTo);
    now = subMinutes(now, 1);

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should not return item when now is 1 minute earlier than TimeTo in next day (Sat) and entity completed in Fri interval before TimeFrom', () => {
    const startAt = getFridayInSeptember();

    let now = buildDateTime(addDays(startAt, 1), TimeTo);

    const progress: Progress = getProgress(
      addHours(startAt, 1),
      addHours(startAt, 2),
    );

    now = subMinutes(now, 1);

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should not return item when now is equal to TimeTo in next day', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    const now = buildDateTime(addDays(startAt, 1), TimeTo);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should return item when now is 10 minutes later than TimeTo today (Fri)', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(startAt, TimeTo);
    now = addMinutes(now, 10);
    mockGetNow(evaluator, now);

    it('Test is today Friday', () => {
      expect(now.getDay()).toEqual(5);
    });

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should return item when now is 1 minute earlier than TimeTo today (Fri)', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(startAt, TimeTo);
    now = subMinutes(now, 1);
    mockGetNow(evaluator, now);

    it('Test is today Friday', () => {
      expect(now.getDay()).toEqual(5);
    });

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should return item when now is equal to TimeTo today (Fri)', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(startAt, TimeTo);
    now = addMinutes(now, 10);
    mockGetNow(evaluator, now);

    it('Test is today Friday', () => {
      expect(now.getDay()).toEqual(5);
    });

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });

  describe('Should not return item when now is 10 minutes later than TimeTo in next day', () => {
    const startAt = getFridayInSeptember();

    const progress: Progress = getEmptyProgress();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });
    eventEntity.event.availability.allowAccessBeforeFromTime = true;

    const evaluator = new AvailableGroupEvaluator(
      input.progress,
      input.appletId,
    );

    let now = buildDateTime(addDays(startAt, 1), TimeTo);
    now = addMinutes(now, 10);
    mockGetNow(evaluator, now);

    it('Test Once', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Monthly', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });
});
