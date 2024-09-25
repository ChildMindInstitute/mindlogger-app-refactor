import { IEvaluator } from '@app/abstract/lib/interfaces/evaluator';
import { EntityProgressionCompleted } from '@app/abstract/lib/types/entityProgress';
import { AvailabilityType } from '@app/abstract/lib/types/event';
import { ScheduleEvent } from '@app/entities/event/lib/types/event';
import {
  isTimeInInterval,
  getHourMinute,
} from '@app/shared/lib/utils/dateTime';

import { GroupUtility } from './GroupUtility';
import { EventEntity } from '../../lib/types/activityGroupsBuilder';

export class AvailableGroupEvaluator
  implements IEvaluator<EventEntity, ScheduleEvent>
{
  private utility: GroupUtility;

  constructor(appletId: string) {
    this.utility = new GroupUtility(appletId, []);
  }

  private isEventValidForAlwaysAvailable(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): boolean {
    const isOneTimeCompletion = event.availability.oneTimeCompletion;

    const progressionRecord = this.utility.getProgressionRecord(
      event,
      targetSubjectId,
    );

    const isNeverCompleted = !progressionRecord;

    return (isOneTimeCompletion && isNeverCompleted) || !isOneTimeCompletion;
  }

  private isEventValidWhenNoSpreadAndNoAccessBeforeStartTime(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): boolean {
    const isScheduledToday = this.utility.isToday(event.scheduledAt);

    const now = this.utility.getNow();

    const isCurrentTimeInTimeWindow = isTimeInInterval({
      timeToCheck: getHourMinute(now),
      intervalFrom: event.availability.timeFrom!,
      intervalTo: event.availability.timeTo!,
      including: 'from',
    });

    const progressionRecord = this.utility.getProgressionRecord(
      event,
      targetSubjectId,
    ) as EntityProgressionCompleted | null;

    const endAt =
      progressionRecord?.endedAtTimestamp &&
      progressionRecord.endedAtTimestamp > 0
        ? new Date(progressionRecord.endedAtTimestamp)
        : null;

    const isCompletedToday = !!endAt && this.utility.isToday(endAt);

    return (
      isScheduledToday &&
      now > event.scheduledAt! &&
      isCurrentTimeInTimeWindow &&
      !isCompletedToday
    );
  }

  private isEventValidWhenIsAccessBeforeStartTime(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): boolean {
    const isScheduledToday = this.utility.isToday(event.scheduledAt);

    const isScheduledYesterday = this.utility.isScheduledYesterday(event);

    if (isScheduledToday) {
      const valid = !this.utility.isEventCompletedToday(event, targetSubjectId);

      if (valid) {
        return true;
      }
    }

    if (isScheduledYesterday) {
      return (
        this.utility.isInAllowedTimeInterval(event, 'yesterday', true) &&
        !this.utility.isEventCompletedInAllowedTimeInterval(
          event,
          'yesterday',
          true,
          targetSubjectId,
        )
      );
    }

    return false;
  }

  private isEventValidWhenIsSpreadAndNoAccessBeforeStartTime(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): boolean {
    const isScheduledToday = this.utility.isToday(event.scheduledAt);

    const isScheduledYesterday = this.utility.isScheduledYesterday(event);

    if (isScheduledToday) {
      const isValid =
        this.utility.isInAllowedTimeInterval(event, 'today') &&
        !this.utility.isEventCompletedInAllowedTimeInterval(
          event,
          'today',
          false,
          targetSubjectId,
        );

      if (isValid) {
        return true;
      }
    }

    if (isScheduledYesterday) {
      return (
        this.utility.isInAllowedTimeInterval(event, 'yesterday') &&
        !this.utility.isEventCompletedInAllowedTimeInterval(
          event,
          'yesterday',
          false,
          targetSubjectId,
        )
      );
    }

    return false;
  }

  public isEventInGroup(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): boolean {
    if (!this.utility.isInsideValidDatesInterval(event)) {
      return false;
    }

    const isAlwaysAvailable =
      event.availability.availabilityType === AvailabilityType.AlwaysAvailable;

    const isScheduled =
      event.availability.availabilityType === AvailabilityType.ScheduledAccess;

    if (
      isAlwaysAvailable &&
      this.isEventValidForAlwaysAvailable(event, targetSubjectId)
    ) {
      return true;
    }

    if (!isScheduled) {
      return false;
    }

    const isSpreadToNextDay = this.utility.isSpreadToNextDay(event);

    const isAccessBeforeTimeFrom = event.availability.allowAccessBeforeFromTime;

    if (
      !isSpreadToNextDay &&
      !isAccessBeforeTimeFrom &&
      this.isEventValidWhenNoSpreadAndNoAccessBeforeStartTime(
        event,
        targetSubjectId,
      )
    ) {
      return true;
    }

    if (
      isSpreadToNextDay &&
      !isAccessBeforeTimeFrom &&
      this.isEventValidWhenIsSpreadAndNoAccessBeforeStartTime(
        event,
        targetSubjectId,
      )
    ) {
      return true;
    }

    if (
      isAccessBeforeTimeFrom &&
      this.isEventValidWhenIsAccessBeforeStartTime(event, targetSubjectId)
    ) {
      return true;
    }

    return false;
  }

  public evaluate(eventsEntities: Array<EventEntity>): Array<EventEntity> {
    const result: Array<EventEntity> = [];

    for (const eventEntity of eventsEntities) {
      if (
        this.isEventInGroup(
          eventEntity.event,
          eventEntity.assignment?.target.id || null,
        )
      ) {
        result.push(eventEntity);
      }
    }

    return result;
  }
}
