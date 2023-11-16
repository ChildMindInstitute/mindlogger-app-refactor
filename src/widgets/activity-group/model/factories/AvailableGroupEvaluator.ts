import { AvailabilityType } from '@app/abstract/lib';
import { getHourMinute, isTimeInInterval } from '@shared/lib';

import { GroupsBuildContext, GroupBuildMethods } from './GroupBuildMethods';
import { EventEntity } from '../../lib';

export class AvailableGroupEvaluator extends GroupBuildMethods {
  constructor(inputParams: GroupsBuildContext) {
    super(inputParams);
  }

  private isValidForAlwaysAvailable(eventEntity: EventEntity): boolean {
    const { event } = eventEntity;

    const isOneTimeCompletion = event.availability.oneTimeCompletion;

    const progressRecord = this.getProgressRecord(eventEntity);

    const isNeverCompleted = !progressRecord;

    return (isOneTimeCompletion && isNeverCompleted) || !isOneTimeCompletion;
  }

  private isValidWhenNoSpreadAndNoAccessBeforeStartTime(
    eventEntity: EventEntity,
  ): boolean {
    const { event } = eventEntity;

    const isScheduledToday = this.isToday(event.scheduledAt!);

    const now = this.getNow();

    const isCurrentTimeInTimeWindow = isTimeInInterval({
      timeToCheck: getHourMinute(now),
      intervalFrom: event.availability.timeFrom!,
      intervalTo: event.availability.timeTo!,
      including: 'from',
    });

    const progressRecord = this.getProgressRecord(eventEntity);

    const endAt = progressRecord?.endAt;

    const isCompletedToday = !!endAt && this.isToday(endAt);

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

    const isScheduledToday = this.isToday(event.scheduledAt!);

    const isScheduledYesterday = this.isScheduledYesterday(event);

    if (isScheduledToday) {
      const valid = !this.isCompletedToday(eventEntity);

      if (valid) {
        return true;
      }
    }

    if (isScheduledYesterday) {
      return (
        this.isInAllowedTimeInterval(eventEntity, 'yesterday', true) &&
        !this.isCompletedInAllowedTimeInterval(eventEntity, 'yesterday', true)
      );
    }

    return false;
  }

  private isValidWhenIsSpreadAndNoAccessBeforeStartTime(
    eventEntity: EventEntity,
  ): boolean {
    const { event } = eventEntity;

    const isScheduledToday = this.isToday(event.scheduledAt!);

    const isScheduledYesterday = this.isScheduledYesterday(event);

    if (isScheduledToday) {
      const isValid =
        this.isInAllowedTimeInterval(eventEntity, 'today') &&
        !this.isCompletedInAllowedTimeInterval(eventEntity, 'today');

      if (isValid) {
        return true;
      }
    }

    if (isScheduledYesterday) {
      return (
        this.isInAllowedTimeInterval(eventEntity, 'yesterday') &&
        !this.isCompletedInAllowedTimeInterval(eventEntity, 'yesterday')
      );
    }

    return false;
  }

  public evaluate(eventsEntities: Array<EventEntity>): Array<EventEntity> {
    const notInProgress = eventsEntities.filter(x => !this.isInProgress(x));

    const result: Array<EventEntity> = [];

    for (let eventEntity of notInProgress) {
      const { event } = eventEntity;

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

      const isSpreadToNextDay = this.isSpreadToNextDay(event);

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
