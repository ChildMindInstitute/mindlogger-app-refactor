import { ActivityType } from '@app/entities/activity';
import { ActivityPipelineType, EntitiesInProgress } from '@app/entities/applet';
import { AvailabilityType, PeriodicityType } from '@app/entities/event';

import { Activity, ActivityFlow, EventEntity } from '../../lib';

export const progress: EntitiesInProgress = {
  apid1: {
    aid1: {
      eid1: {
        type: ActivityPipelineType.Regular,
        startAt: new Date(2023, 1, 12, 14, 16, 17),
        endAt: new Date(2023, 1, 12, 15, 26, 17),
      },
    },
    afid1: {
      eid2: {
        currentActivityId: 'aid2',
        startAt: new Date(2023, 1, 12, 14, 16, 17),
        type: ActivityPipelineType.Flow,
        endAt: null,
      },
    },
  },
};

const activity1: Activity = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  pipelineType: ActivityPipelineType.Regular,
  type: ActivityType.NotDefined,
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
};

const activity2: Activity = {
  id: 'aid2',
  name: 'Activity number 2',
  description:
    'Activity description number 2 Activity description 1 number 1 Activity description number 1',
  pipelineType: ActivityPipelineType.Regular,
  type: ActivityType.NotDefined,
  image: null,
};

const activityFlow1: ActivityFlow = {
  id: 'afid1',
  name: 'Activity Flow number 1',
  description:
    'Activity Flow description number 1 Activity description 1 number 1 Activity description number 1',
  pipelineType: ActivityPipelineType.Flow,
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  hideBadge: false,
  items: [{ activityId: 'aid1' }, { activityId: 'aid2' }],
};

export const allAppletActivities: Activity[] = [activity1, activity2];

export const eventActivities: EventEntity[] = [
  {
    entity: activity1,
    event: {
      activityId: 'aid1',
      availability: {
        allowAccessBeforeFromTime: false,
        availabilityType: AvailabilityType.ScheduledAccess,
        endDate: new Date(2023, 3, 16, 0, 0, 0),
        oneTimeCompletion: true,
        periodicityType: PeriodicityType.Daily,
        startDate: new Date(2023, 1, 14, 0, 0, 0),
        timeFrom: { hours: 8, minutes: 0 },
        timeTo: { hours: 22, minutes: 59 },
      },
      id: 'eid1',
      scheduledAt: null,
      selectedDate: new Date(2023, 2, 16, 0, 0, 0),
      timers: {
        timer: {
          hours: 11,
          minutes: 10,
        },
        idleTimer: null,
      },
    },
  },
  {
    entity: activityFlow1,
    event: {
      activityId: 'afid1',
      availability: {
        allowAccessBeforeFromTime: false,
        availabilityType: AvailabilityType.ScheduledAccess,
        endDate: new Date(2023, 3, 16, 0, 0, 0),
        oneTimeCompletion: true,
        periodicityType: PeriodicityType.Monthly,
        startDate: new Date(2023, 1, 14, 0, 0, 0),
        timeFrom: { hours: 8, minutes: 0 },
        timeTo: { hours: 21, minutes: 59 },
      },
      id: 'eid2',
      scheduledAt: null,
      selectedDate: new Date(2023, 2, 16, 0, 0, 0),
      timers: null,
      // timers: {
      //   timer: {
      //     hours: 11,
      //     minutes: 10,
      //   },
      //   idleTimer: null,
      // },
    },
  },
];
