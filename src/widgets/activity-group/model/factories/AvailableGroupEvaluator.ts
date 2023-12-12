import { AvailabilityType, IEvaluator } from '@app/abstract/lib';
import { ScheduleEvent } from '@app/entities/event';
import { getHourMinute, isTimeInInterval } from '@shared/lib';

import { GroupUtility, GroupsBuildContext } from './GroupUtility';
import { EventEntity } from '../../lib';

export class AvailableGroupEvaluator implements IEvaluator<EventEntity> {
  private utility: GroupUtility;

  constructor(inputParams: GroupsBuildContext) {
    this.utility = new GroupUtility(inputParams);
  }

  private isValidForAlwaysAvailable(eventEntity: EventEntity): boolean {
    const { event } = eventEntity;

    const isOneTimeCompletion = event.availability.oneTimeCompletion;

    const progressRecord = this.utility.getProgressRecord(eventEntity);

    const isNeverCompleted = !progressRecord;

    return (isOneTimeCompletion && isNeverCompleted) || !isOneTimeCompletion;
  }

  private isValidWhenNoSpreadAndNoAccessBeforeStartTime(
    eventEntity: EventEntity,
  ): boolean {
    const { event } = eventEntity;

    const isScheduledToday = this.utility.isToday(event.scheduledAt!);

    const now = this.utility.getNow();

    const isCurrentTimeInTimeWindow = isTimeInInterval({
      timeToCheck: getHourMinute(now),
      intervalFrom: event.availability.timeFrom!,
      intervalTo: event.availability.timeTo!,
      including: 'from',
    });

    const progressRecord = this.utility.getProgressRecord(eventEntity);

    const endAt = progressRecord?.endAt;

    const isCompletedToday = !!endAt && this.utility.isToday(endAt);

    return (
      isScheduledToday &&
      now > event.scheduledAt! &&
      isCurrentTimeInTimeWindow &&
      !isCompletedToday
    );
  }

  private isValidWhenIsAccessBeforeStartTime(
    eventEntity: EventEntity,
  ): boolean {
    const { event } = eventEntity;

    const isScheduledToday = this.utility.isToday(event.scheduledAt!);

    const isScheduledYesterday = this.utility.isScheduledYesterday(event);

    if (isScheduledToday) {
      const valid = !this.utility.isCompletedToday(eventEntity);

      if (valid) {
        return true;
      }
    }

    if (isScheduledYesterday) {
      return (
        this.utility.isInAllowedTimeInterval(eventEntity, 'yesterday', true) &&
        !this.utility.isCompletedInAllowedTimeInterval(
          eventEntity,
          'yesterday',
          true,
        )
      );
    }

    return false;
  }

  private isValidWhenIsSpreadAndNoAccessBeforeStartTime(
    eventEntity: EventEntity,
  ): boolean {
    const { event } = eventEntity;

    const isScheduledToday = this.utility.isToday(event.scheduledAt!);

    const isScheduledYesterday = this.utility.isScheduledYesterday(event);

    if (isScheduledToday) {
      const isValid =
        this.utility.isInAllowedTimeInterval(eventEntity, 'today') &&
        !this.utility.isCompletedInAllowedTimeInterval(eventEntity, 'today');

      if (isValid) {
        return true;
      }
    }

    if (isScheduledYesterday) {
      return (
        this.utility.isInAllowedTimeInterval(eventEntity, 'yesterday') &&
        !this.utility.isCompletedInAllowedTimeInterval(eventEntity, 'yesterday')
      );
    }

    return false;
  }

  private isEventInsideValidTimeInterval(event: ScheduleEvent) {
    const { startDate, endDate } = event.availability;

    if (!startDate || !endDate) {
      return true;
    }

    const dateFrom = startDate;
    const dateTo = this.utility.getEndOfDay(endDate);

    const now = this.utility.getNow();

    return this.utility.isInTimeInterval(
      {
        from: dateFrom,
        to: dateTo,
      },
      now,
      'none',
    );
  }

  public evaluate(eventsEntities: Array<EventEntity>): Array<EventEntity> {
    const notInProgress = eventsEntities.filter(
      x => !this.utility.isInProgress(x),
    );

    const result: Array<EventEntity> = [];

    for (let eventEntity of notInProgress) {
      const { event } = eventEntity;

      if (!this.isEventInsideValidTimeInterval(event)) {
        continue;
      }

      const isAlwaysAvailable =
        event.availability.availabilityType ===
        AvailabilityType.AlwaysAvailable;

      const isScheduled =
        event.availability.availabilityType ===
        AvailabilityType.ScheduledAccess;

      if (isAlwaysAvailable && this.isValidForAlwaysAvailable(eventEntity)) {
        result.push(eventEntity);
      }

      if (!isScheduled) {
        continue;
      }

      const isSpreadToNextDay = this.utility.isSpreadToNextDay(event);

      const isAccessBeforeTimeFrom =
        event.availability.allowAccessBeforeFromTime;

      if (
        !isSpreadToNextDay &&
        !isAccessBeforeTimeFrom &&
        this.isValidWhenNoSpreadAndNoAccessBeforeStartTime(eventEntity)
      ) {
        result.push(eventEntity);
      }

      if (
        isSpreadToNextDay &&
        !isAccessBeforeTimeFrom &&
        this.isValidWhenIsSpreadAndNoAccessBeforeStartTime(eventEntity)
      ) {
        result.push(eventEntity);
      }

      if (
        isAccessBeforeTimeFrom &&
        this.isValidWhenIsAccessBeforeStartTime(eventEntity)
      ) {
        result.push(eventEntity);
      }
    }

    return result;
  }
}
