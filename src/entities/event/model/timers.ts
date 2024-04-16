import {
  getMsFromHours,
  getMsFromMinutes,
  getNow,
  HourMinute,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
} from '@app/shared/lib';

export const getTimeToComplete = (
  timer: HourMinute,
  startedAt: Date,
  now: Date = getNow(),
): HourMinute | null => {
  const activityDuration: number =
    getMsFromHours(timer.hours) + getMsFromMinutes(timer.minutes);

  const alreadyElapsed: number = now.getTime() - startedAt.getTime();

  if (alreadyElapsed < activityDuration) {
    const left: number = activityDuration - alreadyElapsed;

    const hours = Math.floor(left / MS_IN_MINUTE / MINUTES_IN_HOUR);
    const minutes = Math.floor((left - getMsFromHours(hours)) / MS_IN_MINUTE);

    return { hours, minutes };
  } else {
    return null;
  }
};
