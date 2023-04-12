import { getMsFromSeconds } from '@app/shared/lib';

const mapTimerValue = (dtoTimer: number | null) => {
  if (dtoTimer) {
    return getMsFromSeconds(dtoTimer);
  }

  return dtoTimer;
};

export default mapTimerValue;
