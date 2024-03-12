import { addDays, startOfDay } from 'date-fns';

import { AvailabilityType } from '@app/abstract/lib';
import { ScheduleEvent } from '@app/entities/event';

import { GroupUtility } from './GroupUtility';

export class AvailableToEvaluator {
  constructor() {}

  public getNow = () => new Date();

  public getToday = () => startOfDay(this.getNow());

  public getTomorrow = () => addDays(this.getToday(), 1);

  public evaluate(event: ScheduleEvent): Date | null {
    if (
      event.availability.availabilityType !== AvailabilityType.ScheduledAccess
    ) {
      return null;
    }

    const isSpread = GroupUtility.isSpreadToNextDay(event);

    const to = isSpread ? this.getTomorrow() : this.getToday();
    to.setHours(event.availability.timeTo!.hours);
    to.setMinutes(event.availability.timeTo!.minutes);

    return to;
  }
}
