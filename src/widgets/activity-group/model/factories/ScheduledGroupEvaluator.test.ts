import { addDays, addMinutes, subDays, subMinutes } from 'date-fns';

import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import {
  EntityProgression,
  EntityProgressionCompleted,
} from '@app/abstract/lib/types/entityProgress';
import {
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { ActivityType } from '@app/entities/activity/lib/types/activityListItem';
import { EventAvailability } from '@app/entities/event/lib/types/event';
import { HourMinute } from '@app/shared/lib/types/dateTime';

import { ScheduledGroupEvaluator } from './ScheduledGroupEvaluator';
import {
  Entity,
  EventEntity,
  GroupsBuildContext,
} from '../../lib/types/activityGroupsBuilder';

const getProgressions = (startAt: Date, endAt: Date | null) => {
  const result: EntityProgression = {
    status: 'in-progress',
    appletId: 'test-applet-id-1',
    entityType: 'activity',
    entityId: 'test-entity-id-1',
    eventId: 'test-event-id-1',
    targetSubjectId: null,
    startedAtTimestamp: startAt.getTime(),
    availableUntilTimestamp: null,
    submitId: 'test-submit-id',
  };

  if (endAt) {
    (result as never as EntityProgressionCompleted).endedAtTimestamp =
      endAt.getTime();
  }

  return [result];
};

const getEmptyProgressions = () => {
  return [] as EntityProgression[];
};

const getActivity = (): Entity => {
  const result: Entity = {
    description: 'test-description-1',
    id: 'test-entity-id-1',
    name: 'test-entity-name-1',
    pipelineType: ActivityPipelineType.Regular,
    isHidden: false,
    autoAssign: false,
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
    assignment: null,
  };

  return result;
};

const mockGetNow = (
  evaluator: ScheduledGroupEvaluator,
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

describe('ScheduledGroupEvaluator cross-day tests', () => {
  describe('Should return item when now is 1 minute earlier than TimeFrom', () => {
    const startAt = getFridayInSeptember();

    const entityProgressions = getEmptyProgressions();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      entityProgressions,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new ScheduledGroupEvaluator(
      input.appletId,
      input.entityProgressions,
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

  describe('Should not return item when now is 1 minute earlier than TimeFrom and is completed 5 minutes earlier', () => {
    const startAt = getFridayInSeptember();

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    let now = buildDateTime(startAt, TimeFrom);

    const entityProgressions = getProgressions(
      subMinutes(now, 10),
      subMinutes(now, 5),
    );

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      entityProgressions,
      appletId: 'test-applet-id-1',
    };

    const evaluator = new ScheduledGroupEvaluator(
      input.appletId,
      input.entityProgressions,
    );

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

  describe('Should not return item when now is 1 minute later than TimeFrom', () => {
    const startAt = getFridayInSeptember();

    const entityProgressions = getEmptyProgressions();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      entityProgressions,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new ScheduledGroupEvaluator(
      input.appletId,
      input.entityProgressions,
    );

    let now = buildDateTime(startAt, TimeFrom);
    now = addMinutes(now, 1);
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

  describe('Should return item when Daily and now is 1 minute later than TimeTo', () => {
    const startAt = getFridayInSeptember();

    const entityProgressions = getEmptyProgressions();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      entityProgressions,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new ScheduledGroupEvaluator(
      input.appletId,
      input.entityProgressions,
    );

    let now = buildDateTime(startAt, TimeTo);
    now = addMinutes(now, 1);
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

  describe('Should return item when Weekly, Monthly, Once and now is 1 minute earlier than TimeTo and today is Fri', () => {
    const startAt = getFridayInSeptember();

    const entityProgressions = getEmptyProgressions();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      entityProgressions,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new ScheduledGroupEvaluator(
      input.appletId,
      input.entityProgressions,
    );

    let now = buildDateTime(startAt, TimeTo);
    now = subMinutes(now, 1);
    mockGetNow(evaluator, now);

    it('Test todays is Friday', () => {
      expect(startAt.getDay()).toEqual(5);
    });

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
  });

  describe('Should not return item when Daily, Weekdays and now is 1 minute earlier than TimeTo and today is Fri', () => {
    const startAt = getFridayInSeptember();

    const entityProgressions = getEmptyProgressions();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      entityProgressions,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new ScheduledGroupEvaluator(
      input.appletId,
      input.entityProgressions,
    );

    let now = buildDateTime(startAt, TimeTo);
    now = subMinutes(now, 1);
    mockGetNow(evaluator, now);

    it('Test todays is Friday', () => {
      expect(startAt.getDay()).toEqual(5);
    });

    it('Test Daily', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([]);
    });
  });

  describe('Should return item when Weekdays and now is 1 minute earlier than TimeTo and today is Mon', () => {
    let startAt = getFridayInSeptember();
    startAt = subDays(startAt, 4);

    const entityProgressions = getEmptyProgressions();

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      entityProgressions,
      appletId: 'test-applet-id-1',
    };

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    });

    const evaluator = new ScheduledGroupEvaluator(
      input.appletId,
      input.entityProgressions,
    );

    let now = buildDateTime(startAt, TimeTo);
    now = subMinutes(now, 1);
    mockGetNow(evaluator, now);

    it('Test todays is Monday', () => {
      expect(startAt.getDay()).toEqual(1);
    });

    it('Test Weekdays', () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays;
      const result = evaluator.evaluate([eventEntity]);
      expect(result).toEqual([eventEntity]);
    });
  });
});
