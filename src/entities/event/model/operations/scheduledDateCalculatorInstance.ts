import { ScheduledDateCalculator } from './ScheduledDateCalculator';

let instance: ScheduledDateCalculator;
export const getDefaultScheduledDateCalculator = () => {
  if (!instance) {
    instance = new ScheduledDateCalculator();
  }
  return instance;
};
