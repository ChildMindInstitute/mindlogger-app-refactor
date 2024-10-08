import { addDays, startOfDay } from 'date-fns';

import { AvailabilityType } from '@app/abstract/lib/types/event';
import { isSourceLessOrEqual } from '@app/shared/lib/utils/dateTime';

import { ScheduleEvent } from '../lib/types/event';

interface IDayOverlapDetector {
  isSpreadToNextDay(event: ScheduleEvent): boolean;
}

export class AvailableToEvaluator {
  private dayOverlapDetector: IDayOverlapDetector;

  constructor(dayOverlapDetector: IDayOverlapDetector) {
    this.dayOverlapDetector = dayOverlapDetector;
  }

  private getNow = () => new Date();

  private getToday = () => startOfDay(this.getNow());

  private getTomorrow = () => addDays(this.getToday(), 1);

  public evaluate(event: ScheduleEvent): Date | null {
    if (
      event.availability.availabilityType !== AvailabilityType.ScheduledAccess
    ) {
      return null;
    }

    const isSpread = this.dayOverlapDetector.isSpreadToNextDay(event);

    const { hours, minutes } = event.availability.timeTo!;

    if (!isSpread) {
      const to = this.getToday();
      to.setHours(hours);
      to.setMinutes(minutes);
      return to;
    }

    const now = this.getNow();

    const isNextDayOfAvailabilityPeriod = isSourceLessOrEqual({
      timeSource: {
        hours: now.getHours(),
        minutes: now.getMinutes(),
      },
      timeTarget: { hours, minutes },
    });

    const to = !isNextDayOfAvailabilityPeriod
      ? this.getTomorrow()
      : this.getToday();

    to.setHours(hours);
    to.setMinutes(minutes);

    return to;
  }
}
