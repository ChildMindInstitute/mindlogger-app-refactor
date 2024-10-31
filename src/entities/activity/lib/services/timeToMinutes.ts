export const timeToMinutes = (time: { hours: number; minutes: number }): number => {
    return time.hours * 60 + time.minutes;
  };