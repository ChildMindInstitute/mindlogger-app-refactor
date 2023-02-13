import { ActivityType } from '@app/entities/activity';
import { AvailabilityType, PeriodicityType } from '@app/entities/event';

import {
  Activity,
  ActivityPipelineType,
  EntityProgress,
  EventActivity,
} from '../../lib';

export const progress: EntityProgress = {
  apid1: {
    aid1: {
      eid1: {
        type: ActivityPipelineType.Regular,
        startAt: new Date(2023, 1, 12, 14, 16, 17),
        endAt: new Date(2023, 1, 12, 15, 26, 17),
      },
    },
  },
};

export const allAppletActivities: Activity[] = [];

const activity1: Activity = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  pipelineType: ActivityPipelineType.Regular,
  type: ActivityType.NotDefined,
  image: null,
  //'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
};

export const eventActivities: EventActivity[] = [
  {
    activity: activity1,
    event: {
      activityId: 'aid1',
      availability: {
        allowAccessBeforeFromTime: false,
        availabilityType: AvailabilityType.ScheduledAccess,
        endDate: new Date(2023, 1, 11, 23, 59, 0),
        oneTimeCompletion: true,
        periodicityType: PeriodicityType.Monthly,
        startDate: new Date(2023, 1, 11, 0, 0, 0),
        timeFrom: { hours: 8, minutes: 0 },
        timeTo: { hours: 23, minutes: 59 },
      },
      id: 'eid1',
      scheduledAt: null,
      selectedDate: new Date(2023, 0, 14, 0, 0, 0),
      timers: {
        timer: {
          hours: 11,
          minutes: 10,
        },
        idleTimer: null,
      },
    },
  },
];
