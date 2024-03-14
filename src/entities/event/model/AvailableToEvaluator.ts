import { addDays, startOfDay } from 'date-fns';

import { AvailabilityType } from '@app/abstract/lib';
import { ScheduleEvent } from '@app/entities/event';

interface IDayOverlapDetector {
  isSpreadToNextDay(event: ScheduleEvent): boolean;
}

export class AvailableToEvaluator {
  private dayOverlapDetector: IDayOverlapDetector;

  constructor(dayOverlapDetector: IDayOverlapDetector) {
    this.dayOverlapDetector = dayOverlapDetector;
  }

  public getNow = () => new Date();

  public getToday = () => startOfDay(this.getNow());

  public getTomorrow = () => addDays(this.getToday(), 1);

  public evaluate(event: ScheduleEvent): Date | null {
    if (
      event.availability.availabilityType !== AvailabilityType.ScheduledAccess
    ) {
      return null;
    }

    const isSpread = this.dayOverlapDetector.isSpreadToNextDay(event);

    const to = isSpread ? this.getTomorrow() : this.getToday();
    to.setHours(event.availability.timeTo!.hours);
    to.setMinutes(event.availability.timeTo!.minutes);

    return to;
  }
}
