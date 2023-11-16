import { AvailabilityType, PeriodicityType } from '@app/abstract/lib';
import { DatesFromTo } from '@shared/lib';

import { GroupsBuildContext, GroupBuildMethods } from './GroupBuildMethods';
import { EventEntity } from '../../lib';

export class ScheduledGroupEvaluator extends GroupBuildMethods {
  constructor(inputParams: GroupsBuildContext) {
    super(inputParams);
  }

  public evaluate(eventsEntities: Array<EventEntity>): Array<EventEntity> {
    const notInProgress = eventsEntities.filter(x => !this.isInProgress(x));

    const result: Array<EventEntity> = [];

    const now = this.getNow();

    for (let eventEntity of notInProgress) {
      const { event } = eventEntity;

      const isTypeScheduled =
        event.availability.availabilityType ===
        AvailabilityType.ScheduledAccess;

      const isAccessBeforeTimeFrom =
        event.availability.allowAccessBeforeFromTime;

      const isCompletedToday = this.isCompletedToday(eventEntity);

      const isScheduledToday = this.isToday(event.scheduledAt!);

      const isSpreadToNextDay = this.isSpreadToNextDay(event);

      const isCandidateForBeingScheduled: boolean =
        isTypeScheduled &&
        isScheduledToday &&
        now < event.scheduledAt! &&
        !isAccessBeforeTimeFrom;

      if (!isCandidateForBeingScheduled) {
        continue;
      }

      if (!isSpreadToNextDay) {
        !isCompletedToday && result.push(eventEntity);
        continue;
      }

      const periodicity = event.availability.periodicityType;

      const isMonday = now.getDay() === 1;

      let doSimpleSpreadCheck: boolean =
        periodicity === PeriodicityType.Weekly ||
        periodicity === PeriodicityType.Monthly ||
        periodicity === PeriodicityType.Once ||
        (periodicity === PeriodicityType.Weekdays && isMonday);

      if (doSimpleSpreadCheck) {
        !isCompletedToday && result.push(eventEntity);
        continue;
      }

      const isFromTueToFri = now.getDay() >= 2 && now.getDay() <= 5;

      const doAdvancedSpreadCheck =
        periodicity === PeriodicityType.Daily ||
        (periodicity === PeriodicityType.Weekdays && isFromTueToFri);

      const considerSpread = doAdvancedSpreadCheck;

      const voidInterval: DatesFromTo = this.getVoidTimeInterval(
        eventEntity.event,
        considerSpread,
      );

      const isInVoidInterval = this.isInTimeInterval(voidInterval, now, 'from');

      const isCompletedInVoidInterval = this.isInTimeInterval(
        voidInterval,
        this.getCompletedAt(eventEntity),
        'from',
      );

      if (
        doAdvancedSpreadCheck &&
        isInVoidInterval &&
        !isCompletedInVoidInterval
      ) {
        result.push(eventEntity);
      }
    }

    return result;
  }
}
