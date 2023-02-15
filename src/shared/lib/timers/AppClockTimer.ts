import TimerBase from './TimerBase';
import { ONE_MINUTE } from '../constants';

class AppClockTimer extends TimerBase {
  onMinutePass: () => void;

  constructor(onMinutePass: () => void, startImmediately: boolean) {
    super(startImmediately);
    this.onMinutePass = onMinutePass;
  }

  private getTimeToNextFullMinute(date: number): number {
    return ONE_MINUTE - (date % ONE_MINUTE);
  }

  start(): void {
    this.setTimer();
  }

  setTimer() {
    this.timerId = setTimeout(() => {
      this.onMinutePass();
      this.setTimer();
    }, this.getTimeToNextFullMinute(Date.now()));
  }

  stop() {
    super.stop();
    clearTimeout(this.timerId);
  }

  protected onForeground(): void {
    if (this.hasStarted) {
      this.setTimer();
    }
  }
}

export default AppClockTimer;
