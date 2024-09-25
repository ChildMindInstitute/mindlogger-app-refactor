import { IEvaluator } from '@app/abstract/lib/interfaces/evaluator';
import { EntityProgression } from '@app/abstract/lib/types/entityProgress';
import {
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { ScheduleEvent } from '@app/entities/event/lib/types/event';
import { DatesFromTo } from '@app/shared/lib/types/dateTime';

import { GroupUtility } from './GroupUtility';
import { EventEntity } from '../../lib/types/activityGroupsBuilder';

export class ScheduledGroupEvaluator
  implements IEvaluator<EventEntity, ScheduleEvent>
{
  private utility: GroupUtility;

  constructor(appletId: string, entityProgressions: EntityProgression[]) {
    this.utility = new GroupUtility(appletId, entityProgressions);
  }

  public isEventInGroup(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): boolean {
    const now = this.utility.getNow();

    if (!this.utility.isInsideValidDatesInterval(event)) {
      return false;
    }

    const isTypeScheduled =
      event.availability.availabilityType === AvailabilityType.ScheduledAccess;

    const isAccessBeforeTimeFrom = event.availability.allowAccessBeforeFromTime;

    const isCompletedToday = this.utility.isEventCompletedToday(
      event,
      targetSubjectId,
    );

    const isScheduledToday = this.utility.isToday(event.scheduledAt);

    const isSpreadToNextDay = this.utility.isSpreadToNextDay(event);

    const isCandidateForBeingScheduled: boolean =
      isTypeScheduled &&
      isScheduledToday &&
      now < event.scheduledAt! &&
      !isAccessBeforeTimeFrom;

    if (!isCandidateForBeingScheduled) {
      return false;
    }

    if (!isSpreadToNextDay) {
      return !isCompletedToday;
    }

    const periodicity = event.availability.periodicityType;

    const isMonday = now.getDay() === 1;

    const doSimpleSpreadCheck: boolean =
      periodicity === PeriodicityType.Weekly ||
      periodicity === PeriodicityType.Monthly ||
      periodicity === PeriodicityType.Once ||
      (periodicity === PeriodicityType.Weekdays && isMonday);

    if (doSimpleSpreadCheck) {
      return !isCompletedToday;
    }

    const isFromTueToFri = now.getDay() >= 2 && now.getDay() <= 5;

    const doAdvancedSpreadCheck =
      periodicity === PeriodicityType.Daily ||
      (periodicity === PeriodicityType.Weekdays && isFromTueToFri);

    const considerSpread = doAdvancedSpreadCheck;

    const voidInterval: DatesFromTo = this.utility.getVoidInterval(
      event,
      considerSpread,
    );

    const isInVoidInterval = this.utility.isInInterval(
      voidInterval,
      now,
      'from',
    );

    const isCompletedInVoidInterval = this.utility.isInInterval(
      voidInterval,
      this.utility.getEventCompletedAt(event, targetSubjectId),
      'from',
    );

    if (
      doAdvancedSpreadCheck &&
      isInVoidInterval &&
      !isCompletedInVoidInterval
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
