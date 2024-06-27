import { AvailabilityType, IEvaluator, Progress } from '@app/abstract/lib';
import { ScheduleEvent } from '@app/entities/event';
import { getHourMinute, isTimeInInterval } from '@shared/lib';

import { GroupUtility } from './GroupUtility';
import { EventEntity } from '../../lib';

export class AvailableGroupEvaluator
  implements IEvaluator<EventEntity, ScheduleEvent>
{
  private utility: GroupUtility;

  constructor(progress: Progress, appletId: string) {
    this.utility = new GroupUtility(progress, appletId);
  }

  private isValidForAlwaysAvailable(event: ScheduleEvent): boolean {
    const isOneTimeCompletion = event.availability.oneTimeCompletion;

    const progressRecord = this.utility.getProgressRecord(event);

    const isNeverCompleted = !progressRecord;

    return (isOneTimeCompletion && isNeverCompleted) || !isOneTimeCompletion;
  }

  private isValidWhenNoSpreadAndNoAccessBeforeStartTime(
    event: ScheduleEvent,
  ): boolean {
    const isScheduledToday = this.utility.isToday(event.scheduledAt);

    const now = this.utility.getNow();

    const isCurrentTimeInTimeWindow = isTimeInInterval({
      timeToCheck: getHourMinute(now),
      intervalFrom: event.availability.timeFrom!,
      intervalTo: event.availability.timeTo!,
      including: 'from',
    });

    const progressRecord = this.utility.getProgressRecord(event);

    const endAt = progressRecord?.endAt;

    const isCompletedToday = !!endAt && this.utility.isToday(endAt);

    return (
      isScheduledToday &&
      now > event.scheduledAt! &&
      isCurrentTimeInTimeWindow &&
      !isCompletedToday
    );
  }

  private isValidWhenIsAccessBeforeStartTime(event: ScheduleEvent): boolean {
    const isScheduledToday = this.utility.isToday(event.scheduledAt);

    const isScheduledYesterday = this.utility.isScheduledYesterday(event);

    if (isScheduledToday) {
      const valid = !this.utility.isCompletedToday(event);

      if (valid) {
        return true;
      }
    }

    if (isScheduledYesterday) {
      return (
        this.utility.isInAllowedTimeInterval(event, 'yesterday', true) &&
        !this.utility.isCompletedInAllowedTimeInterval(event, 'yesterday', true)
      );
    }

    return false;
  }

  private isValidWhenIsSpreadAndNoAccessBeforeStartTime(
    event: ScheduleEvent,
  ): boolean {
    const isScheduledToday = this.utility.isToday(event.scheduledAt);

    const isScheduledYesterday = this.utility.isScheduledYesterday(event);

    if (isScheduledToday) {
      const isValid =
        this.utility.isInAllowedTimeInterval(event, 'today') &&
        !this.utility.isCompletedInAllowedTimeInterval(event, 'today');

      if (isValid) {
        return true;
      }
    }

    if (isScheduledYesterday) {
      return (
        this.utility.isInAllowedTimeInterval(event, 'yesterday') &&
        !this.utility.isCompletedInAllowedTimeInterval(event, 'yesterday')
      );
    }

    return false;
  }

  public isInGroup(event: ScheduleEvent): boolean {
    if (!this.utility.isInsideValidDatesInterval(event)) {
      return false;
    }

    const isAlwaysAvailable =
      event.availability.availabilityType === AvailabilityType.AlwaysAvailable;

    const isScheduled =
      event.availability.availabilityType === AvailabilityType.ScheduledAccess;

    if (isAlwaysAvailable && this.isValidForAlwaysAvailable(event)) {
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
      this.isValidWhenNoSpreadAndNoAccessBeforeStartTime(event)
    ) {
      return true;
    }

    if (
      isSpreadToNextDay &&
      !isAccessBeforeTimeFrom &&
      this.isValidWhenIsSpreadAndNoAccessBeforeStartTime(event)
    ) {
      return true;
    }

    if (
      isAccessBeforeTimeFrom &&
      this.isValidWhenIsAccessBeforeStartTime(event)
    ) {
      return true;
    }

    return false;
  }

  public evaluate(eventsEntities: Array<EventEntity>): Array<EventEntity> {
    const result: Array<EventEntity> = [];

    for (const eventEntity of eventsEntities) {
      if (this.isInGroup(eventEntity.event)) {
        result.push(eventEntity);
      }
    }

    return result;
  }
}
