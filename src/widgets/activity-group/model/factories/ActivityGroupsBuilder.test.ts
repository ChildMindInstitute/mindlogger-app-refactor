import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  startOfDay,
  subDays,
  subHours,
  subMinutes,
  subMonths,
} from 'date-fns';

import {
  ActivityPipelineType,
  AvailabilityType,
  FlowProgress,
  PeriodicityType,
  Progress,
} from '@app/abstract/lib';
import {
  ActivityListItem,
  ActivityStatus,
  ActivityType,
} from '@app/entities/activity/lib';
import { EventAvailability } from '@app/entities/event';
import { MIDNIGHT_DATE } from '@app/shared/lib';

import {
  ActivityGroupsBuilder,
  createActivityGroupsBuilder,
} from './ActivityGroupsBuilder';
import {
  ActivityListGroup,
  EventEntity,
  Entity,
  GroupsBuildContext,
} from '../../lib';

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

const getAlwaysAvailableSection = (): EventAvailability => {
  const result = {
    availabilityType: AvailabilityType.AlwaysAvailable,
    oneTimeCompletion: false,
    periodicityType: PeriodicityType.Always,
    allowAccessBeforeFromTime: false,
    endDate: null,
    startDate: null,
    timeFrom: null,
    timeTo: null,
  };
  return result;
};

const getScheduledSection = (): EventAvailability => {
  const result: EventAvailability = {
    availabilityType: AvailabilityType.ScheduledAccess,
    oneTimeCompletion: false,
    periodicityType: PeriodicityType.Daily,
    allowAccessBeforeFromTime: false,
    endDate: null,
    startDate: null,
    timeFrom: null,
    timeTo: null,
  };
  return result;
};

const getExpectedItem = (): ActivityListItem => {
  const expectedItem: ActivityListItem = {
    activityId: 'test-entity-id-1',
    flowId: null,
    eventId: 'test-event-id-1',
    name: 'test-entity-name-1',
    description: 'test-description-1',
    type: ActivityType.NotDefined,
    status: ActivityStatus.InProgress,
    isTimerSet: false,
    isExpired: false,
    timeLeftToComplete: null,
    isInActivityFlow: false,
    image: undefined,
    availableTo: null,
  };
  return expectedItem;
};

const getExpectedInProgressItem = (): ActivityListItem => {
  return {
    ...getExpectedItem(),
    status: ActivityStatus.InProgress,
  };
};

const getExpectedAvailableItem = (): ActivityListItem => {
  return {
    ...getExpectedItem(),
    status: ActivityStatus.Available,
  };
};

const getExpectedScheduledItem = (): ActivityListItem => {
  return {
    ...getExpectedItem(),
    status: ActivityStatus.Scheduled,
  };
};

const getScheduledEventEntity = (settings: {
  startDate: Date;
  endDate: Date;
  scheduledAt: Date;
}): EventEntity => {
  const { startDate, endDate, scheduledAt } = settings;

  const result: EventEntity = {
    entity: getActivity(),
    event: {
      availability: {
        ...getScheduledSection(),
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

const getAlwaysAvailableEventEntity = (settings: {
  scheduledAt: Date;
}): EventEntity => {
  const { scheduledAt } = settings;

  const result: EventEntity = {
    entity: getActivity(),
    event: {
      availability: getAlwaysAvailableSection(),
      entityId: 'test-entity-id-1',
      id: 'test-event-id-1',
      notificationSettings: {
        notifications: [],
      },
      scheduledAt: scheduledAt,
      selectedDate: null,
      timers: {
        idleTimer: null,
        timer: null,
      },
    },
  };

  return result;
};

const mockGetNow = (builder: ActivityGroupsBuilder, mockedNowDate: Date) => {
  //@ts-ignore
  builder.utility.getNow = jest.fn(() => new Date(mockedNowDate));
  //@ts-ignore
  builder.itemsFactory.utility.getNow = jest.fn(() => new Date(mockedNowDate));
  //@ts-ignore
  builder.itemsFactory.availableToEvaluator.getNow = jest.fn(
    () => new Date(mockedNowDate),
  );

  //@ts-ignore
  builder.scheduledEvaluator.utility.getNow = jest.fn(
    () => new Date(mockedNowDate),
  );
  //@ts-ignore
  builder.availableEvaluator.utility.getNow = jest.fn(
    () => new Date(mockedNowDate),
  );
};

describe('ActivityGroupsBuilder', () => {
  describe('Test In-progress group', () => {
    it('Should return group item when event is always-available and startAt is set in progress record', () => {
      const startAt = new Date(2023, 8, 1);

      const progress: Progress = getProgress(startAt, null);

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getAlwaysAvailableEventEntity({
        scheduledAt: startAt,
      });

      const result = builder.buildInProgress([eventEntity]);

      const expectedItem: ActivityListItem = getExpectedInProgressItem();
      expectedItem.availableTo = undefined;

      const expectedResult: ActivityListGroup = {
        name: 'additional:in_progress',
        type: 1,
        activities: [expectedItem],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should not return group item when event is always-available and both startAt and endAt are set', () => {
      const startAt = new Date(2023, 8, 1, 0, 0, 0);
      const endAt = new Date(2023, 8, 1, 15, 30, 0);

      const progress: Progress = getProgress(startAt, endAt);

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getAlwaysAvailableEventEntity({
        scheduledAt: startAt,
      });

      const result = builder.buildInProgress([eventEntity]);

      const expectedResult: ActivityListGroup = {
        name: 'additional:in_progress',
        type: 1,
        activities: [],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should not return group item when event is always-available and no any progress record', () => {
      const startAt = new Date(2023, 8, 1, 0, 0, 0);

      const progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getAlwaysAvailableEventEntity({
        scheduledAt: startAt,
      });

      const result = builder.buildInProgress([eventEntity]);

      const expectedResult: ActivityListGroup = {
        name: 'additional:in_progress',
        type: 1,
        activities: [],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should return group-item when event is scheduled and getNow is out of start-end dates', () => {
      const date = new Date(2023, 8, 1);

      const progress: Progress = getProgress(date, null);

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        startDate: subDays(startOfDay(date), 2),
        endDate: addDays(startOfDay(date), 2),
        scheduledAt: startOfDay(date),
      });

      mockGetNow(builder, addDays(date, 10));

      const result = builder.buildInProgress([eventEntity]);

      const expectedItem: ActivityListItem = getExpectedInProgressItem();

      const expectedResult: ActivityListGroup = {
        name: 'additional:in_progress',
        type: 1,
        activities: [expectedItem],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should return filled timeLeftToComplete and isTimerElapsed = false when event contains timer settings and timer is not yet elapsed and now is ~2h before elapsed time', () => {
      const date = new Date(2023, 8, 1, 15, 30, 0);
      const day = startOfDay(date);

      const progress: Progress = getProgress(date, null);

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        startDate: subDays(day, 2),
        endDate: addDays(day, 2),
        scheduledAt: day,
      });
      eventEntity.event.timers.timer = { hours: 5, minutes: 20 };

      const mockedNowDate = new Date(date);
      mockedNowDate.setHours(date.getHours() + 3);
      mockedNowDate.setMinutes(date.getMinutes() + 12);

      mockGetNow(builder, mockedNowDate);

      const result = builder.buildInProgress([eventEntity]);

      const expectedItem: ActivityListItem = getExpectedInProgressItem();
      expectedItem.isTimerSet = true;
      expectedItem.isExpired = false;
      expectedItem.timeLeftToComplete = { hours: 2, minutes: 8 };

      const expectedResult: ActivityListGroup = {
        name: 'additional:in_progress',
        type: 1,
        activities: [expectedItem],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should return filled timeLeftToComplete and isTimerElapsed = false when event contains timer settings and timer is not yet elapsed and now is 1 minute before elapsed time', () => {
      const date = new Date(2023, 8, 1, 15, 30, 0);
      const day = startOfDay(date);

      const progress: Progress = getProgress(date, null);

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        startDate: subDays(day, 2),
        endDate: addDays(day, 2),
        scheduledAt: day,
      });
      eventEntity.event.timers.timer = { hours: 5, minutes: 20 };

      const mockedNowDate = new Date(date);
      mockedNowDate.setHours(date.getHours() + 5);
      mockedNowDate.setMinutes(date.getMinutes() + 19);

      mockGetNow(builder, mockedNowDate);

      const result = builder.buildInProgress([eventEntity]);

      const expectedItem: ActivityListItem = getExpectedInProgressItem();
      expectedItem.isTimerSet = true;
      expectedItem.isExpired = false;
      expectedItem.timeLeftToComplete = { hours: 0, minutes: 1 };

      const expectedResult: ActivityListGroup = {
        name: 'additional:in_progress',
        type: 1,
        activities: [expectedItem],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should return timeLeftToComplete set to null and isTimerElapsed = true when event contains timer settings and timer elapsed', () => {
      const date = new Date(2023, 8, 1, 15, 30, 0);
      const day = startOfDay(date);

      const progress: Progress = getProgress(date, null);

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        startDate: subDays(day, 2),
        endDate: addDays(day, 2),
        scheduledAt: day,
      });
      eventEntity.event.timers.timer = { hours: 5, minutes: 20 };

      const mockedNowDate = new Date(date);
      mockedNowDate.setHours(date.getHours() + 5);
      mockedNowDate.setMinutes(date.getMinutes() + 20);

      mockGetNow(builder, mockedNowDate);

      const result = builder.buildInProgress([eventEntity]);

      const expectedItem: ActivityListItem = getExpectedInProgressItem();
      expectedItem.isTimerSet = true;
      expectedItem.isExpired = true;
      expectedItem.timeLeftToComplete = null;

      const expectedResult: ActivityListGroup = {
        name: 'additional:in_progress',
        type: 1,
        activities: [expectedItem],
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Test Available group', () => {
    it('Should return group-item for always-available event when oneTimeCompletion is false and startAt/endAt set in a progress record', () => {
      const startAt = new Date(2023, 8, 1, 15, 0, 0);
      const endAt = addHours(startAt, 1);

      const progress: Progress = getProgress(startAt, endAt);

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getAlwaysAvailableEventEntity({
        scheduledAt: startAt,
      });

      eventEntity.event.availability.oneTimeCompletion = false;

      const now = addMonths(endAt, 1);

      mockGetNow(builder, now);

      const result = builder.buildAvailable([eventEntity]);

      const expectedItem: ActivityListItem = getExpectedAvailableItem();
      expectedItem.availableTo = MIDNIGHT_DATE;

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [expectedItem],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should return group-item for always-available event when oneTimeCompletion is false and no any progress record', () => {
      const startAt = new Date(2023, 8, 1, 15, 0, 0);
      const endAt = addHours(startAt, 1);

      const progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getAlwaysAvailableEventEntity({
        scheduledAt: startAt,
      });

      eventEntity.event.availability.oneTimeCompletion = false;

      const now = addMonths(endAt, 1);

      mockGetNow(builder, now);

      const result = builder.buildAvailable([eventEntity]);

      const expectedItem: ActivityListItem = getExpectedAvailableItem();
      expectedItem.availableTo = MIDNIGHT_DATE;

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [expectedItem],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should not return group-item for always-available event when oneTimeCompletion is true and startAt/endAt set in a progress record', () => {
      const startAt = new Date(2023, 8, 1, 15, 0, 0);
      const endAt = addHours(startAt, 1);

      const progress: Progress = getProgress(startAt, endAt);

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getAlwaysAvailableEventEntity({
        scheduledAt: startAt,
      });

      eventEntity.event.availability.oneTimeCompletion = true;

      const now = subMinutes(endAt, 10);

      mockGetNow(builder, now);

      const result = builder.buildAvailable([eventEntity]);

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      expect(result).toEqual(expectedResult);
    });

    [
      PeriodicityType.Once,
      PeriodicityType.Daily,
      PeriodicityType.Weekly,
      PeriodicityType.Weekdays,
      PeriodicityType.Monthly,
    ].forEach(periodicity => {
      it(`Should return group-item for scheduled event when periodicity is ${periodicity} and allowAccessBeforeFromTime is false and current time is is allowed time window`, () => {
        const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

        const progress: Progress = getEmptyProgress();

        const input: GroupsBuildContext = {
          allAppletActivities: [],
          progress,
          appletId: 'test-applet-id-1',
        };

        const builder = createActivityGroupsBuilder(input);

        const eventEntity: EventEntity = getScheduledEventEntity({
          scheduledAt,
          startDate: subDays(startOfDay(scheduledAt), 1),
          endDate: addDays(startOfDay(scheduledAt), 1),
        });

        eventEntity.event.availability.allowAccessBeforeFromTime = false;
        eventEntity.event.availability.periodicityType = periodicity;
        eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
        eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

        const now = addMinutes(scheduledAt, 1);

        mockGetNow(builder, new Date(now));

        const result = builder.buildAvailable([eventEntity]);

        const expectedItem = getExpectedAvailableItem();
        expectedItem.availableTo = new Date(startOfDay(scheduledAt));
        expectedItem.availableTo.setHours(16);
        expectedItem.availableTo.setMinutes(30);

        const expectedResult: ActivityListGroup = {
          name: 'additional:available',
          type: 3,
          activities: [expectedItem],
        };

        expect(result).toEqual(expectedResult);
      });
    });

    it('Should return empty for scheduled event when periodicity is Daily and allowAccessBeforeFromTime is false and current time is is allowed time window and start/end dates are in the future in 2-3 months', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 1),
        endDate: addDays(startOfDay(scheduledAt), 1),
      });

      const now = addMinutes(scheduledAt, 1);

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };
      eventEntity.event.availability.startDate = addMonths(now, 2);
      eventEntity.event.availability.endDate = addMonths(now, 3);

      mockGetNow(builder, new Date(now));

      let result = builder.buildAvailable([eventEntity]);

      const expectedItem = getExpectedAvailableItem();
      expectedItem.availableTo = new Date(startOfDay(scheduledAt));
      expectedItem.availableTo.setHours(16);
      expectedItem.availableTo.setMinutes(30);

      const expectedEmptyResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      result = builder.buildAvailable([eventEntity]);

      expect(result).toEqual(expectedEmptyResult);
    });

    it('Should return empty for scheduled event when periodicity is Daily and allowAccessBeforeFromTime is false and current time is is allowed time window and start/end dates are in the past 2-3 months', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 1),
        endDate: addDays(startOfDay(scheduledAt), 1),
      });

      const now = addMinutes(scheduledAt, 1);

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };
      eventEntity.event.availability.startDate = subMonths(now, 3);
      eventEntity.event.availability.endDate = subMonths(now, 2);

      mockGetNow(builder, new Date(now));

      const result = builder.buildAvailable([eventEntity]);

      const expectedItem = getExpectedAvailableItem();
      expectedItem.availableTo = new Date(startOfDay(scheduledAt));
      expectedItem.availableTo.setHours(16);
      expectedItem.availableTo.setMinutes(30);

      const expectedEmptyResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      expect(result).toEqual(expectedEmptyResult);
    });

    it('Should return item for scheduled event when periodicity is Daily and allowAccessBeforeFromTime is false and current time is is allowed time window and start/end dates cover now (-/+ 2 months)', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress = getProgress(
        subDays(scheduledAt, 1),
        addMinutes(subDays(scheduledAt, 1), 5),
      );

      const input = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 1),
        endDate: addDays(startOfDay(scheduledAt), 1),
      });

      const now = addMinutes(scheduledAt, 1);

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };
      eventEntity.event.availability.startDate = subMonths(now, 2);
      eventEntity.event.availability.endDate = addMonths(now, 2);

      mockGetNow(builder, new Date(now));

      const result = builder.buildAvailable([eventEntity]);

      const expectedItem = getExpectedAvailableItem();
      expectedItem.availableTo = new Date(startOfDay(scheduledAt));
      expectedItem.availableTo.setHours(16);
      expectedItem.availableTo.setMinutes(30);

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [expectedItem],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should not return group-item for scheduled event and periodicity is Weekly and allowAccessBeforeFromTime is false when scheduledToday is false', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      const now = subDays(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      const result = builder.buildAvailable([eventEntity]);

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should not return group-item for scheduled event and periodicity is Weekly and allowAccessBeforeFromTime is false when now time is less than timeFrom', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      const now = subMinutes(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      const result = builder.buildAvailable([eventEntity]);
      expect(result).toEqual(expectedResult);
    });

    it('Should not return group-item for scheduled event and periodicity is Weekly and allowAccessBeforeFromTime is false when now time is more than timeTo', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      let now = startOfDay(scheduledAt);
      now.setHours(16);
      now.setMinutes(30);
      now = addMinutes(now, 1);

      mockGetNow(builder, new Date(now));

      const result = builder.buildAvailable([eventEntity]);
      expect(result).toEqual(expectedResult);
    });

    it('Should not return group-item for scheduled event and periodicity is Weekly and allowAccessBeforeFromTime is false when completed today is true', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      let progress: Progress = getEmptyProgress();

      let input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      let builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      progress = getProgress(new Date(scheduledAt), addMinutes(scheduledAt, 5));

      input = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      builder = createActivityGroupsBuilder(input);

      const now = addMinutes(scheduledAt, 10);

      mockGetNow(builder, new Date(now));

      const result = builder.buildAvailable([eventEntity]);
      expect(result).toEqual(expectedResult);
    });

    it('5Should not return group-item for scheduled event and periodicity is Weekly and allowAccessBeforeFromTime is false when started yesterday, but not completed yet', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      let progress: Progress = getEmptyProgress();

      let input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      let builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      progress = getProgress(subDays(scheduledAt, 1), null);

      input = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      builder = createActivityGroupsBuilder(input);

      const now = addMinutes(scheduledAt, 10);

      mockGetNow(builder, new Date(now));

      const result = builder.buildAvailable([eventEntity]);
      expect(result).toEqual(expectedResult);
    });

    [
      PeriodicityType.Once,
      PeriodicityType.Daily,
      PeriodicityType.Weekly,
      PeriodicityType.Weekdays,
      PeriodicityType.Monthly,
    ].forEach(periodicity => {
      it(`Should return group-item for scheduled event when periodicity is ${periodicity} and allowAccessBeforeFromTime is true and current time is less than startTime`, () => {
        const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

        const progress: Progress = getEmptyProgress();

        const input: GroupsBuildContext = {
          allAppletActivities: [],
          progress,
          appletId: 'test-applet-id-1',
        };

        const builder = createActivityGroupsBuilder(input);

        const eventEntity: EventEntity = getScheduledEventEntity({
          scheduledAt,
          startDate: subDays(startOfDay(scheduledAt), 1),
          endDate: addDays(startOfDay(scheduledAt), 1),
        });

        eventEntity.event.availability.allowAccessBeforeFromTime = true;
        eventEntity.event.availability.periodicityType = periodicity;
        eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
        eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

        const now = subHours(scheduledAt, 1);

        mockGetNow(builder, new Date(now));

        const result = builder.buildAvailable([eventEntity]);

        const expectedItem = getExpectedAvailableItem();
        expectedItem.availableTo = new Date(startOfDay(scheduledAt));
        expectedItem.availableTo.setHours(16);
        expectedItem.availableTo.setMinutes(30);

        const expectedResult: ActivityListGroup = {
          name: 'additional:available',
          type: 3,
          activities: [expectedItem],
        };

        expect(result).toEqual(expectedResult);
      });
    });

    it('Should return group-item for scheduled event when periodicity is Daily and allowAccessBeforeFromTime is true and current time is less than startTime and start/end dates are in the future in 2/3 months', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 1),
        endDate: addDays(startOfDay(scheduledAt), 1),
      });

      const now = subHours(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      eventEntity.event.availability.allowAccessBeforeFromTime = true;
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };
      eventEntity.event.availability.startDate = addMonths(now, 2);
      eventEntity.event.availability.endDate = addMonths(now, 3);

      let result = builder.buildAvailable([eventEntity]);

      const expectedEmptyResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      result = builder.buildAvailable([eventEntity]);
      expect(result).toEqual(expectedEmptyResult);
    });

    it('Should return group-item for scheduled event when periodicity is Daily and allowAccessBeforeFromTime is true and current time is less than startTime when start/end dates are in the past 3/2 months', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 1),
        endDate: addDays(startOfDay(scheduledAt), 1),
      });

      const now = subHours(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      eventEntity.event.availability.allowAccessBeforeFromTime = true;
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };
      eventEntity.event.availability.startDate = subMonths(now, 3);
      eventEntity.event.availability.endDate = subMonths(now, 2);

      let result = builder.buildAvailable([eventEntity]);

      const expectedItem = getExpectedAvailableItem();
      expectedItem.availableTo = new Date(startOfDay(scheduledAt));
      expectedItem.availableTo.setHours(16);
      expectedItem.availableTo.setMinutes(30);

      const expectedEmptyResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      result = builder.buildAvailable([eventEntity]);
      expect(result).toEqual(expectedEmptyResult);
    });

    it('Should return group-item for scheduled event when periodicity is Daily and allowAccessBeforeFromTime is true and current time is less than startTime and progress record exist and completed yesterday', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress = getProgress(
        subDays(scheduledAt, 1),
        addMinutes(subDays(scheduledAt, 1), 5),
      );

      const input = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 1),
        endDate: addDays(startOfDay(scheduledAt), 1),
      });

      const now = subHours(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      eventEntity.event.availability.allowAccessBeforeFromTime = true;
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };
      eventEntity.event.availability.startDate = subMonths(now, 2);
      eventEntity.event.availability.endDate = addMonths(now, 2);

      let result = builder.buildAvailable([eventEntity]);

      const expectedItem = getExpectedAvailableItem();
      expectedItem.availableTo = new Date(startOfDay(scheduledAt));
      expectedItem.availableTo.setHours(16);
      expectedItem.availableTo.setMinutes(30);

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [expectedItem],
      };

      result = builder.buildAvailable([eventEntity]);

      expect(result).toEqual(expectedResult);
    });

    it('Should not return group-item for scheduled event when periodicity is Weekly and allowAccessBeforeFromTime is true and scheduledToday is false', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = true;
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      const now = subDays(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      const result = builder.buildAvailable([eventEntity]);

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should not return group-item for scheduled event when periodicity is Weekly and allowAccessBeforeFromTime is true and completed today is true', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress = getProgress(
        new Date(scheduledAt),
        addMinutes(scheduledAt, 5),
      );

      const input = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const now = subHours(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = true;
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      const result = builder.buildAvailable([eventEntity]);

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      expect(result).toEqual(expectedResult);
    });

    it('Should not return group-item for scheduled event when periodicity is Weekly and allowAccessBeforeFromTime is true and started yesterday, but not completed yet', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 0, 0);

      const progress = getProgress(subDays(scheduledAt, 1), null);

      const input = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const now = subHours(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = true;
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      const expectedResult: ActivityListGroup = {
        name: 'additional:available',
        type: 3,
        activities: [],
      };

      const result = builder.buildAvailable([eventEntity]);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Test Scheduled group', () => {
    [
      PeriodicityType.Once,
      PeriodicityType.Daily,
      PeriodicityType.Weekly,
      PeriodicityType.Weekdays,
      PeriodicityType.Monthly,
    ].forEach(periodicity => {
      it(`Should return group item when event is scheduled of ${periodicity} periodicity and now is less than scheduledAt and accessBeforeTimeFrom is false and not completed today`, () => {
        const scheduledAt = new Date(2023, 8, 1, 15, 30, 0);

        const progress: Progress = getEmptyProgress();

        const input: GroupsBuildContext = {
          allAppletActivities: [],
          progress,
          appletId: 'test-applet-id-1',
        };

        const builder = createActivityGroupsBuilder(input);

        const eventEntity: EventEntity = getScheduledEventEntity({
          scheduledAt,
          startDate: subDays(startOfDay(scheduledAt), 2),
          endDate: addDays(startOfDay(scheduledAt), 2),
        });

        eventEntity.event.availability.allowAccessBeforeFromTime = false;
        eventEntity.event.availability.periodicityType = PeriodicityType.Once;
        eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
        eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

        const now = subHours(scheduledAt, 1);

        mockGetNow(builder, new Date(now));

        const result = builder.buildScheduled([eventEntity]);

        const expectedItem: ActivityListItem = getExpectedScheduledItem();
        expectedItem.availableFrom = startOfDay(scheduledAt);
        expectedItem.availableFrom.setHours(15);
        expectedItem.availableTo = startOfDay(scheduledAt);
        expectedItem.availableTo.setHours(16);
        expectedItem.availableTo.setMinutes(30);

        const expectedResult: ActivityListGroup = {
          name: 'additional:scheduled',
          type: 2,
          activities: [expectedItem],
        };

        expect(result).toEqual(expectedResult);
      });
    });

    it('Should return group item when event is scheduled of Daily periodicity and now is less than scheduledAt and accessBeforeTimeFrom is false and not completed today and start/end dates in the future in 2/3 months', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 30, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const now = subHours(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };
      eventEntity.event.availability.startDate = addMonths(now, 2);
      eventEntity.event.availability.endDate = addMonths(now, 3);

      let result = builder.buildScheduled([eventEntity]);

      const expectedItem: ActivityListItem = getExpectedScheduledItem();
      expectedItem.availableFrom = startOfDay(scheduledAt);
      expectedItem.availableFrom.setHours(15);
      expectedItem.availableTo = startOfDay(scheduledAt);
      expectedItem.availableTo.setHours(16);
      expectedItem.availableTo.setMinutes(30);

      const expectedEmptyResult: ActivityListGroup = {
        name: 'additional:scheduled',
        type: 2,
        activities: [],
      };

      result = builder.buildScheduled([eventEntity]);

      expect(result).toEqual(expectedEmptyResult);
    });

    it('Should return group item when event is scheduled of Daily periodicity and now is less than scheduledAt and accessBeforeTimeFrom is false and not completed today and start/end dates are in the past: 3/2 months ago', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 30, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const now = subHours(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };
      eventEntity.event.availability.startDate = subMonths(now, 3);
      eventEntity.event.availability.endDate = subMonths(now, 2);

      let result = builder.buildScheduled([eventEntity]);

      const expectedItem: ActivityListItem = getExpectedScheduledItem();
      expectedItem.availableFrom = startOfDay(scheduledAt);
      expectedItem.availableFrom.setHours(15);
      expectedItem.availableTo = startOfDay(scheduledAt);
      expectedItem.availableTo.setHours(16);
      expectedItem.availableTo.setMinutes(30);

      const expectedEmptyResult: ActivityListGroup = {
        name: 'additional:scheduled',
        type: 2,
        activities: [],
      };

      result = builder.buildScheduled([eventEntity]);

      expect(result).toEqual(expectedEmptyResult);
    });

    it('Should return group item when event is scheduled of Daily type and now is less than scheduledAt and accessBeforeTimeFrom is false and not completed today and progress record exist and completed yesterday', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 30, 0);

      let progress: Progress = getEmptyProgress();

      let input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      let builder = createActivityGroupsBuilder(input);

      const now = subHours(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = false;
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      let result = builder.buildScheduled([eventEntity]);

      const expectedItem: ActivityListItem = getExpectedScheduledItem();
      expectedItem.availableFrom = startOfDay(scheduledAt);
      expectedItem.availableFrom.setHours(15);
      expectedItem.availableTo = startOfDay(scheduledAt);
      expectedItem.availableTo.setHours(16);
      expectedItem.availableTo.setMinutes(30);

      const expectedResult: ActivityListGroup = {
        name: 'additional:scheduled',
        type: 2,
        activities: [expectedItem],
      };

      progress = getProgress(
        subDays(scheduledAt, 1),
        addMinutes(subDays(scheduledAt, 1), 5),
      );

      input = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      builder = createActivityGroupsBuilder(input);

      mockGetNow(builder, new Date(now));

      eventEntity.event.availability.startDate = subMonths(now, 2);
      eventEntity.event.availability.endDate = addMonths(now, 2);

      result = builder.buildScheduled([eventEntity]);
      expect(result).toEqual(expectedResult);
    });

    it('Should not return group item when event is scheduled and now is less than scheduledAt and no progress record and accessBeforeTimeFrom is true', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 30, 0);

      const progress: Progress = getEmptyProgress();

      const input: GroupsBuildContext = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const now = subHours(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = true;
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      const result = builder.buildScheduled([eventEntity]);

      const expectedResult: ActivityListGroup = {
        name: 'additional:scheduled',
        type: 2,
        activities: [],
      };

      expect(result).toEqual(expectedResult);
    });

    it('2-Should not return group item when event is scheduled and now is less than scheduledAt and completed today and accessBeforeTimeFrom is true', () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 30, 0);

      const progress = getProgress(
        subHours(scheduledAt, 1),
        subMinutes(scheduledAt, 30),
      );

      const input = {
        allAppletActivities: [],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const now = subHours(scheduledAt, 1);

      mockGetNow(builder, new Date(now));

      const eventEntity: EventEntity = getScheduledEventEntity({
        scheduledAt,
        startDate: subDays(startOfDay(scheduledAt), 2),
        endDate: addDays(startOfDay(scheduledAt), 2),
      });

      eventEntity.event.availability.allowAccessBeforeFromTime = true;
      eventEntity.event.availability.periodicityType = PeriodicityType.Once;
      eventEntity.event.availability.timeFrom = { hours: 15, minutes: 0 };
      eventEntity.event.availability.timeTo = { hours: 16, minutes: 30 };

      const expectedResult: ActivityListGroup = {
        name: 'additional:scheduled',
        type: 2,
        activities: [],
      };

      const result = builder.buildScheduled([eventEntity]);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Test Activity flow fields population', () => {
    it("Should return group item with populated activity flow fields when when flow's progress record is set to the 1st and then to the 2nd activity", () => {
      const scheduledAt = new Date(2023, 8, 1, 15, 30, 0);

      const progress: Progress = {
        'test-applet-id-1': {
          'test-flow-id-1': {
            'test-event-id-1': {
              type: ActivityPipelineType.Flow,
              startAt: addMinutes(scheduledAt, 5),
              endAt: null,
              currentActivityId: 'test-id-1',
              currentActivityStartAt: addMinutes(scheduledAt, 5).getTime(),
              executionGroupKey: 'group-key-1',
              pipelineActivityOrder: 0,
              totalActivitiesInPipeline: 2,
              currentActivityName: 'test-activity-name-1',
              currentActivityDescription: 'test-description-1',
              currentActivityImage: null,
              availableTo: null,
            },
          },
        },
      };

      const input: GroupsBuildContext = {
        allAppletActivities: [
          {
            description: 'test-description-1',
            id: 'test-id-1',
            isHidden: false,
            name: 'test-activity-name-1',
            pipelineType: ActivityPipelineType.Regular,
            type: ActivityType.NotDefined,
            order: 0,
          },
          {
            description: 'test-description-2',
            id: 'test-id-2',
            isHidden: false,
            name: 'test-activity-name-2',
            pipelineType: ActivityPipelineType.Regular,
            type: ActivityType.NotDefined,
            order: 1,
          },
        ],
        progress,
        appletId: 'test-applet-id-1',
      };

      const builder = createActivityGroupsBuilder(input);

      const activityFlow: Entity = {
        description: 'test-flow-description-1',
        id: 'test-flow-id-1',
        name: 'test-flow-name-1',
        pipelineType: ActivityPipelineType.Flow,
        activityIds: ['test-activity-id-1', 'test-activity-id-2'],
        hideBadge: false,
        isHidden: false,
        order: 0,
      };

      const eventEntity: EventEntity = {
        entity: activityFlow,
        event: {
          availability: getAlwaysAvailableSection(),
          entityId: 'test-flow-id-1',
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

      let result = builder.buildInProgress([eventEntity]);

      let expectedResult: ActivityListGroup = {
        activities: [
          {
            activityId: 'test-id-1',
            flowId: 'test-flow-id-1',
            eventId: 'test-event-id-1',
            name: 'test-activity-name-1',
            description: 'test-description-1',
            image: null,
            type: ActivityType.NotDefined,
            status: ActivityStatus.InProgress,
            isTimerSet: false,
            isExpired: false,
            timeLeftToComplete: null,
            isInActivityFlow: true,
            activityFlowDetails: {
              showActivityFlowBadge: true,
              activityFlowName: 'test-flow-name-1',
              numberOfActivitiesInFlow: 2,
              activityPositionInFlow: 1,
            },
          },
        ],
        name: 'additional:in_progress',
        type: 1,
      };

      expect(result).toEqual(expectedResult);

      //switch to 2nd activity

      const progressRecord = progress['test-applet-id-1']['test-flow-id-1'][
        'test-event-id-1'
      ] as FlowProgress;
      progressRecord.currentActivityId = 'test-id-2';
      progressRecord.currentActivityName = 'test-activity-name-2';
      progressRecord.currentActivityDescription = 'test-description-2';
      progressRecord.pipelineActivityOrder = 1;
      activityFlow.hideBadge = true;

      result = builder.buildInProgress([eventEntity]);

      expectedResult = {
        activities: [
          {
            activityId: 'test-id-2',
            flowId: 'test-flow-id-1',
            eventId: 'test-event-id-1',
            name: 'test-activity-name-2',
            description: 'test-description-2',
            image: null,
            type: ActivityType.NotDefined,
            status: ActivityStatus.InProgress,
            isTimerSet: false,
            isExpired: false,
            timeLeftToComplete: null,
            isInActivityFlow: true,
            activityFlowDetails: {
              showActivityFlowBadge: false,
              activityFlowName: 'test-flow-name-1',
              numberOfActivitiesInFlow: 2,
              activityPositionInFlow: 2,
            },
          },
        ],
        name: 'additional:in_progress',
        type: 1,
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
