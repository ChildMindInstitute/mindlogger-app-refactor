import { ScheduleEvent } from '../../lib/types/scheduledDateCalculator';

export interface IScheduledDateCalculator {
  calculate(event: ScheduleEvent, useCache?: boolean): Date | null;
}
